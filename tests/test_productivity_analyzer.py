"""Tests for ProductivityAnalyzer"""

import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, MagicMock
from copilot_jira_dashboard.analyzers.productivity_analyzer import ProductivityAnalyzer


@pytest.fixture
def mock_collectors():
    """Create mock collectors"""
    copilot = Mock()
    jira = Mock()
    return copilot, jira


@pytest.fixture
def config():
    """Create test configuration"""
    return {
        "copilot_rollout_date": "2024-01-01",
        "pre_period_days": 90,
        "post_period_days": 90,
        "projects": ["TEST"]
    }


@pytest.fixture
def analyzer(mock_collectors, config):
    """Create ProductivityAnalyzer instance"""
    copilot, jira = mock_collectors
    return ProductivityAnalyzer(copilot, jira, config)


class TestProductivityAnalyzer:
    """Test ProductivityAnalyzer class"""
    
    def test_calculate_correlation_high_engagement(self, analyzer):
        """Test correlation calculation with high engagement"""
        copilot_metrics = {
            "acceptance_rate": 80.0,
            "active_days": 25,
            "total_acceptances": 500
        }
        jira_metrics = {
            "improvement": {
                "story_points_percent": 25.0
            }
        }
        
        correlation = analyzer._calculate_correlation(copilot_metrics, jira_metrics)
        
        assert correlation["engagement_score"] > 60
        assert correlation["productivity_improvement_percent"] == 25.0
        assert correlation["high_engagement"] is True
        assert correlation["significant_improvement"] is True
        assert correlation["positive_correlation"] is True
    
    def test_calculate_correlation_low_engagement(self, analyzer):
        """Test correlation calculation with low engagement"""
        copilot_metrics = {
            "acceptance_rate": 20.0,
            "active_days": 5,
            "total_acceptances": 50
        }
        jira_metrics = {
            "improvement": {
                "story_points_percent": 5.0
            }
        }
        
        correlation = analyzer._calculate_correlation(copilot_metrics, jira_metrics)
        
        assert correlation["engagement_score"] < 60
        assert correlation["high_engagement"] is False
        assert correlation["significant_improvement"] is False
        assert correlation["positive_correlation"] is False
    
    def test_generate_insights_positive(self, analyzer):
        """Test insight generation for positive results"""
        copilot_metrics = {
            "acceptance_rate": 75.0,
            "active_days": 22
        }
        jira_metrics = {
            "improvement": {
                "story_points_percent": 30.0
            },
            "pre_period": {
                "avg_story_points_per_sprint": 20.0
            },
            "post_period": {
                "avg_story_points_per_sprint": 26.0
            }
        }
        
        insights = analyzer._generate_insights(copilot_metrics, jira_metrics)
        
        assert len(insights) > 0
        assert any("High Copilot acceptance rate" in i for i in insights)
        assert any("Significant productivity increase" in i for i in insights)
    
    def test_generate_insights_negative(self, analyzer):
        """Test insight generation for negative results"""
        copilot_metrics = {
            "acceptance_rate": 25.0,
            "active_days": 8
        }
        jira_metrics = {
            "improvement": {
                "story_points_percent": -10.0
            },
            "pre_period": {
                "avg_story_points_per_sprint": 20.0
            },
            "post_period": {
                "avg_story_points_per_sprint": 18.0
            }
        }
        
        insights = analyzer._generate_insights(copilot_metrics, jira_metrics)
        
        assert len(insights) > 0
        assert any("Low Copilot acceptance rate" in i for i in insights)
        assert any("decreased" in i for i in insights)
    
    def test_aggregate_team_metrics(self, analyzer):
        """Test team metrics aggregation"""
        analyses = [
            {
                "username": "user1",
                "copilot_engagement": {
                    "active_days": 20,
                    "acceptance_rate": 70.0
                },
                "jira_productivity": {
                    "improvement": {
                        "story_points_percent": 25.0
                    }
                },
                "correlation": {
                    "high_engagement": True,
                    "positive_correlation": True
                }
            },
            {
                "username": "user2",
                "copilot_engagement": {
                    "active_days": 15,
                    "acceptance_rate": 50.0
                },
                "jira_productivity": {
                    "improvement": {
                        "story_points_percent": 10.0
                    }
                },
                "correlation": {
                    "high_engagement": False,
                    "positive_correlation": False
                }
            }
        ]
        
        team_metrics = analyzer._aggregate_team_metrics(analyses)
        
        assert team_metrics["team_size"] == 2
        assert team_metrics["copilot_adoption"]["avg_active_days"] == 17.5
        assert team_metrics["copilot_adoption"]["avg_acceptance_rate"] == 60.0
        assert team_metrics["copilot_adoption"]["high_engagement_count"] == 1
        assert team_metrics["productivity_impact"]["avg_improvement_percent"] == 17.5
        assert team_metrics["productivity_impact"]["users_with_improvement"] == 2
        assert team_metrics["correlation_analysis"]["positive_correlation_count"] == 1
    
    def test_aggregate_team_metrics_empty(self, analyzer):
        """Test team metrics aggregation with empty data"""
        team_metrics = analyzer._aggregate_team_metrics([])
        
        assert team_metrics["team_size"] == 0
        assert "error" in team_metrics
