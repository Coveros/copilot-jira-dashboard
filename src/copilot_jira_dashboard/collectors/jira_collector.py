"""
Jira metrics collector
Fetches story point completion and velocity data from Jira
"""

from jira import JIRA
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class JiraCollector:
    """Collects Jira story point completion and velocity metrics"""
    
    def __init__(self, url: str, email: str, token: str):
        """
        Initialize Jira collector
        
        Args:
            url: Jira instance URL
            email: Jira user email
            token: Jira API token
        """
        self.url = url
        self.jira = JIRA(server=url, basic_auth=(email, token))
        logger.info(f"Connected to Jira at {url}")
    
    def get_user_issues(self, username: str, project_keys: List[str],
                       since: Optional[datetime] = None,
                       until: Optional[datetime] = None) -> List[Dict]:
        """
        Get issues assigned to or completed by a user
        
        Args:
            username: Jira username or email
            project_keys: List of project keys to search
            since: Start date for search
            until: End date for search
            
        Returns:
            List of issue data with story points and completion dates
        """
        if since is None:
            since = datetime.now() - timedelta(days=180)
        if until is None:
            until = datetime.now()
        
        # Format dates for JQL
        since_str = since.strftime("%Y-%m-%d")
        until_str = until.strftime("%Y-%m-%d")
        
        # Build JQL query
        project_filter = " OR ".join([f"project = {key}" for key in project_keys])
        jql = f"""
            ({project_filter}) AND 
            assignee = "{username}" AND 
            resolutiondate >= "{since_str}" AND 
            resolutiondate <= "{until_str}" AND
            status in (Done, Closed, Resolved)
        """
        
        issues_data = []
        start_at = 0
        max_results = 100
        
        while True:
            try:
                issues = self.jira.search_issues(
                    jql,
                    startAt=start_at,
                    maxResults=max_results,
                    fields="summary,assignee,created,resolutiondate,status,customfield_*"
                )
                
                if not issues:
                    break
                
                for issue in issues:
                    # Extract story points (common custom field names)
                    story_points = self._extract_story_points(issue)
                    
                    issues_data.append({
                        "key": issue.key,
                        "summary": issue.fields.summary,
                        "assignee": username,
                        "created": issue.fields.created,
                        "resolved": issue.fields.resolutiondate,
                        "status": issue.fields.status.name,
                        "story_points": story_points
                    })
                
                if len(issues) < max_results:
                    break
                    
                start_at += max_results
                
            except Exception as e:
                logger.error(f"Error fetching issues for {username}: {e}")
                break
        
        logger.info(f"Retrieved {len(issues_data)} issues for {username}")
        return issues_data
    
    def _extract_story_points(self, issue) -> Optional[float]:
        """
        Extract story points from issue custom fields
        
        Args:
            issue: Jira issue object
            
        Returns:
            Story points value or None
        """
        # Common custom field names for story points
        story_point_fields = [
            "customfield_10016",  # Common in Jira Cloud
            "customfield_10026",
            "customfield_10004",
            "customfield_10002",
        ]
        
        for field in story_point_fields:
            if hasattr(issue.fields, field):
                value = getattr(issue.fields, field)
                if value is not None:
                    try:
                        return float(value)
                    except (ValueError, TypeError):
                        continue
        
        return None
    
    def get_sprint_velocity(self, username: str, project_keys: List[str],
                           since: Optional[datetime] = None,
                           until: Optional[datetime] = None) -> List[Dict]:
        """
        Calculate sprint velocity for a user
        
        Groups completed issues by sprint/time period and calculates
        story points completed per sprint.
        
        Args:
            username: Jira username
            project_keys: List of project keys
            since: Start date
            until: End date
            
        Returns:
            List of sprint velocity data
        """
        issues = self.get_user_issues(username, project_keys, since, until)
        
        # Group issues by sprint (using 2-week periods as approximation)
        sprint_data = {}
        
        for issue in issues:
            if issue["story_points"] is None:
                continue
            
            # Parse resolution date
            resolved_date = datetime.strptime(
                issue["resolved"][:10], "%Y-%m-%d"
            )
            
            # Calculate sprint period (2-week intervals)
            sprint_key = self._get_sprint_period(resolved_date)
            
            if sprint_key not in sprint_data:
                sprint_data[sprint_key] = {
                    "period": sprint_key,
                    "issues_completed": 0,
                    "story_points": 0.0,
                    "issue_keys": []
                }
            
            sprint_data[sprint_key]["issues_completed"] += 1
            sprint_data[sprint_key]["story_points"] += issue["story_points"]
            sprint_data[sprint_key]["issue_keys"].append(issue["key"])
        
        # Convert to sorted list
        velocity_data = sorted(
            sprint_data.values(),
            key=lambda x: x["period"]
        )
        
        logger.info(f"Calculated velocity for {username} across {len(velocity_data)} sprints")
        return velocity_data
    
    def _get_sprint_period(self, date: datetime) -> str:
        """
        Get sprint period identifier for a date (2-week intervals)
        
        Args:
            date: Date to get sprint period for
            
        Returns:
            Sprint period string (YYYY-MM-DD format for sprint start)
        """
        # Calculate weeks since epoch
        epoch = datetime(2020, 1, 6)  # A Monday
        days_since_epoch = (date - epoch).days
        sprint_number = days_since_epoch // 14
        sprint_start = epoch + timedelta(days=sprint_number * 14)
        
        return sprint_start.strftime("%Y-%m-%d")
    
    def get_user_productivity_metrics(self, username: str, project_keys: List[str],
                                     pre_period_start: datetime,
                                     pre_period_end: datetime,
                                     post_period_start: datetime,
                                     post_period_end: datetime) -> Dict:
        """
        Calculate productivity metrics before and after a specific date (e.g., Copilot rollout)
        
        Args:
            username: Jira username
            project_keys: List of project keys
            pre_period_start: Start of pre-period
            pre_period_end: End of pre-period
            post_period_start: Start of post-period
            post_period_end: End of post-period
            
        Returns:
            Dictionary with before/after metrics
        """
        # Get velocity for both periods
        pre_velocity = self.get_sprint_velocity(
            username, project_keys, pre_period_start, pre_period_end
        )
        post_velocity = self.get_sprint_velocity(
            username, project_keys, post_period_start, post_period_end
        )
        
        # Calculate averages
        pre_avg_points = (
            sum(s["story_points"] for s in pre_velocity) / len(pre_velocity)
            if pre_velocity else 0.0
        )
        pre_avg_issues = (
            sum(s["issues_completed"] for s in pre_velocity) / len(pre_velocity)
            if pre_velocity else 0.0
        )
        
        post_avg_points = (
            sum(s["story_points"] for s in post_velocity) / len(post_velocity)
            if post_velocity else 0.0
        )
        post_avg_issues = (
            sum(s["issues_completed"] for s in post_velocity) / len(post_velocity)
            if post_velocity else 0.0
        )
        
        # Calculate improvement
        points_improvement = (
            ((post_avg_points - pre_avg_points) / pre_avg_points * 100)
            if pre_avg_points > 0 else 0.0
        )
        issues_improvement = (
            ((post_avg_issues - pre_avg_issues) / pre_avg_issues * 100)
            if pre_avg_issues > 0 else 0.0
        )
        
        metrics = {
            "username": username,
            "pre_period": {
                "start": pre_period_start.strftime("%Y-%m-%d"),
                "end": pre_period_end.strftime("%Y-%m-%d"),
                "sprints": len(pre_velocity),
                "avg_story_points_per_sprint": round(pre_avg_points, 2),
                "avg_issues_per_sprint": round(pre_avg_issues, 2),
                "total_story_points": sum(s["story_points"] for s in pre_velocity),
                "total_issues": sum(s["issues_completed"] for s in pre_velocity)
            },
            "post_period": {
                "start": post_period_start.strftime("%Y-%m-%d"),
                "end": post_period_end.strftime("%Y-%m-%d"),
                "sprints": len(post_velocity),
                "avg_story_points_per_sprint": round(post_avg_points, 2),
                "avg_issues_per_sprint": round(post_avg_issues, 2),
                "total_story_points": sum(s["story_points"] for s in post_velocity),
                "total_issues": sum(s["issues_completed"] for s in post_velocity)
            },
            "improvement": {
                "story_points_percent": round(points_improvement, 2),
                "issues_percent": round(issues_improvement, 2)
            }
        }
        
        logger.info(f"Calculated productivity metrics for {username}")
        return metrics
