"""Tests for CopilotCollector"""

import pytest
import responses
from datetime import datetime, timedelta
from copilot_jira_dashboard.collectors.copilot_collector import CopilotCollector


@pytest.fixture
def collector():
    """Create a CopilotCollector instance for testing"""
    return CopilotCollector(token="test_token", organization="test_org")


class TestCopilotCollector:
    """Test CopilotCollector class"""
    
    @responses.activate
    def test_get_copilot_seats(self, collector):
        """Test fetching Copilot seats"""
        # Mock API response
        responses.add(
            responses.GET,
            "https://api.github.com/orgs/test_org/copilot/billing/seats",
            json={
                "seats": [
                    {
                        "assignee": {"login": "user1"},
                        "created_at": "2024-01-01T00:00:00Z",
                        "last_activity_at": "2024-01-15T00:00:00Z"
                    },
                    {
                        "assignee": {"login": "user2"},
                        "created_at": "2024-01-01T00:00:00Z",
                        "last_activity_at": "2024-01-16T00:00:00Z"
                    }
                ]
            },
            status=200
        )
        
        seats = collector.get_copilot_seats()
        
        assert len(seats) == 2
        assert seats[0]["assignee"]["login"] == "user1"
        assert seats[1]["assignee"]["login"] == "user2"
    
    @responses.activate
    def test_get_copilot_usage(self, collector):
        """Test fetching Copilot usage data"""
        # Mock API response
        responses.add(
            responses.GET,
            "https://api.github.com/orgs/test_org/copilot/usage",
            json=[
                {
                    "day": "2024-01-01",
                    "editor": [
                        {
                            "name": "vscode",
                            "models": [
                                {
                                    "username": "user1",
                                    "suggestions_count": 100,
                                    "acceptances_count": 75,
                                    "lines_suggested": 500,
                                    "lines_accepted": 400
                                }
                            ]
                        }
                    ]
                }
            ],
            status=200
        )
        
        since = datetime(2024, 1, 1)
        until = datetime(2024, 1, 31)
        usage = collector.get_copilot_usage(since, until)
        
        assert len(usage) == 1
        assert usage[0]["day"] == "2024-01-01"
    
    def test_get_user_engagement_metrics(self, collector):
        """Test calculating user engagement metrics"""
        # Mock usage data - the filter checks for username in editor array items directly
        # But then looks for username in models under each editor
        usage_data = [
            {
                "day": "2024-01-01",
                "editor": [
                    {
                        "name": "vscode",
                        "username": "user1",  # Added for filtering
                        "models": [
                            {
                                "username": "user1",
                                "suggestions_count": 100,
                                "acceptances_count": 75,
                                "lines_suggested": 500,
                                "lines_accepted": 400,
                                "languages": [{"name": "Python"}]
                            }
                        ]
                    }
                ]
            },
            {
                "day": "2024-01-02",
                "editor": [
                    {
                        "name": "vscode",
                        "username": "user1",  # Added for filtering
                        "models": [
                            {
                                "username": "user1",
                                "suggestions_count": 50,
                                "acceptances_count": 40,
                                "lines_suggested": 250,
                                "lines_accepted": 200,
                                "languages": [{"name": "JavaScript"}]
                            }
                        ]
                    }
                ]
            }
        ]
        
        # Mock the get_copilot_usage method
        collector.get_copilot_usage = lambda since, until: usage_data
        
        since = datetime(2024, 1, 1)
        until = datetime(2024, 1, 2)
        metrics = collector.get_user_engagement_metrics("user1", since, until)
        
        assert metrics["username"] == "user1"
        assert metrics["active_days"] == 2
        assert metrics["total_suggestions"] == 150
        assert metrics["total_acceptances"] == 115
        assert metrics["total_lines_suggested"] == 750
        assert metrics["total_lines_accepted"] == 600
        assert metrics["acceptance_rate"] == pytest.approx(76.67, rel=0.1)
        assert "Python" in metrics["languages_used"]
        assert "JavaScript" in metrics["languages_used"]
    
    def test_engagement_metrics_empty_data(self, collector):
        """Test engagement metrics with no data"""
        collector.get_copilot_usage = lambda since, until: []
        
        since = datetime(2024, 1, 1)
        until = datetime(2024, 1, 2)
        metrics = collector.get_user_engagement_metrics("user1", since, until)
        
        assert metrics["active_days"] == 0
        assert metrics["total_suggestions"] == 0
        assert metrics["acceptance_rate"] == 0.0
