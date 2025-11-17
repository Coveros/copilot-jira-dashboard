"""
GitHub Copilot metrics collector
Fetches user engagement data and usage metrics from GitHub Copilot API
"""

import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class CopilotCollector:
    """Collects GitHub Copilot usage and engagement metrics"""
    
    def __init__(self, token: str, organization: str):
        """
        Initialize Copilot collector
        
        Args:
            token: GitHub Personal Access Token with copilot:read scope
            organization: GitHub organization or enterprise name
        """
        self.token = token
        self.organization = organization
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    
    def get_copilot_seats(self) -> List[Dict]:
        """
        Get list of users with Copilot seats
        
        Returns:
            List of user seat information including assignment dates
        """
        url = f"{self.base_url}/orgs/{self.organization}/copilot/billing/seats"
        all_seats = []
        page = 1
        
        while True:
            try:
                response = requests.get(
                    url,
                    headers=self.headers,
                    params={"per_page": 100, "page": page}
                )
                response.raise_for_status()
                data = response.json()
                
                seats = data.get("seats", [])
                if not seats:
                    break
                    
                all_seats.extend(seats)
                
                # Check if there are more pages
                if len(seats) < 100:
                    break
                page += 1
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Error fetching Copilot seats: {e}")
                break
        
        logger.info(f"Retrieved {len(all_seats)} Copilot seats")
        return all_seats
    
    def get_copilot_usage(self, since: Optional[datetime] = None, 
                          until: Optional[datetime] = None) -> List[Dict]:
        """
        Get Copilot usage metrics for the organization
        
        Args:
            since: Start date for metrics (default: 28 days ago)
            until: End date for metrics (default: today)
            
        Returns:
            List of daily usage metrics
        """
        if since is None:
            since = datetime.now() - timedelta(days=28)
        if until is None:
            until = datetime.now()
        
        # Format dates as YYYY-MM-DD
        since_str = since.strftime("%Y-%m-%d")
        until_str = until.strftime("%Y-%m-%d")
        
        url = f"{self.base_url}/orgs/{self.organization}/copilot/usage"
        
        try:
            response = requests.get(
                url,
                headers=self.headers,
                params={
                    "since": since_str,
                    "until": until_str,
                    "per_page": 100
                }
            )
            response.raise_for_status()
            data = response.json()
            
            logger.info(f"Retrieved Copilot usage data from {since_str} to {until_str}")
            return data if isinstance(data, list) else []
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching Copilot usage: {e}")
            return []
    
    def get_user_engagement_metrics(self, username: str, 
                                    since: Optional[datetime] = None,
                                    until: Optional[datetime] = None) -> Dict:
        """
        Calculate engagement metrics for a specific user
        
        This goes beyond simple line acceptance to include:
        - Active days using Copilot
        - Suggestion acceptance rate
        - Lines suggested vs accepted
        - Chat interactions (if available)
        - Languages used with Copilot
        
        Args:
            username: GitHub username
            since: Start date for metrics
            until: End date for metrics
            
        Returns:
            Dictionary of engagement metrics
        """
        usage_data = self.get_copilot_usage(since, until)
        
        # Filter for specific user
        user_data = [
            day for day in usage_data 
            if day.get("editor") and any(
                user.get("username") == username 
                for user in day.get("editor", [])
            )
        ]
        
        # Calculate engagement metrics
        metrics = {
            "username": username,
            "period_start": since.strftime("%Y-%m-%d") if since else None,
            "period_end": until.strftime("%Y-%m-%d") if until else None,
            "active_days": len(user_data),
            "total_suggestions": 0,
            "total_acceptances": 0,
            "total_lines_suggested": 0,
            "total_lines_accepted": 0,
            "acceptance_rate": 0.0,
            "avg_suggestions_per_day": 0.0,
            "languages_used": set()
        }
        
        for day in user_data:
            for editor in day.get("editor", []):
                for user in editor.get("models", []):
                    if user.get("username") == username:
                        metrics["total_suggestions"] += user.get("suggestions_count", 0)
                        metrics["total_acceptances"] += user.get("acceptances_count", 0)
                        metrics["total_lines_suggested"] += user.get("lines_suggested", 0)
                        metrics["total_lines_accepted"] += user.get("lines_accepted", 0)
                        
                        # Track languages
                        if "languages" in user:
                            for lang in user.get("languages", []):
                                metrics["languages_used"].add(lang.get("name"))
        
        # Calculate derived metrics
        if metrics["total_suggestions"] > 0:
            metrics["acceptance_rate"] = (
                metrics["total_acceptances"] / metrics["total_suggestions"]
            ) * 100
        
        if metrics["active_days"] > 0:
            metrics["avg_suggestions_per_day"] = (
                metrics["total_suggestions"] / metrics["active_days"]
            )
        
        # Convert set to list for JSON serialization
        metrics["languages_used"] = list(metrics["languages_used"])
        
        logger.info(f"Calculated engagement metrics for {username}")
        return metrics
    
    def get_all_users_engagement(self, since: Optional[datetime] = None,
                                 until: Optional[datetime] = None) -> List[Dict]:
        """
        Get engagement metrics for all users with Copilot seats
        
        Args:
            since: Start date for metrics
            until: End date for metrics
            
        Returns:
            List of engagement metrics for all users
        """
        seats = self.get_copilot_seats()
        all_metrics = []
        
        for seat in seats:
            assignee = seat.get("assignee", {})
            username = assignee.get("login")
            
            if username:
                metrics = self.get_user_engagement_metrics(username, since, until)
                metrics["seat_created_at"] = seat.get("created_at")
                metrics["last_activity_at"] = seat.get("last_activity_at")
                all_metrics.append(metrics)
        
        logger.info(f"Calculated engagement metrics for {len(all_metrics)} users")
        return all_metrics
