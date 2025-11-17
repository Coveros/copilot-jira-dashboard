"""
Productivity analyzer that combines Copilot and Jira metrics
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class ProductivityAnalyzer:
    """Analyzes productivity by combining Copilot engagement with Jira velocity"""
    
    def __init__(self, copilot_collector, jira_collector, config: Dict):
        """
        Initialize productivity analyzer
        
        Args:
            copilot_collector: CopilotCollector instance
            jira_collector: JiraCollector instance
            config: Configuration dictionary
        """
        self.copilot = copilot_collector
        self.jira = jira_collector
        self.config = config
    
    def analyze_user_productivity(self, username: str, 
                                  jira_username: Optional[str] = None) -> Dict:
        """
        Analyze productivity for a single user by combining Copilot and Jira metrics
        
        Args:
            username: GitHub username
            jira_username: Jira username (defaults to GitHub username if not provided)
            
        Returns:
            Combined productivity analysis
        """
        if jira_username is None:
            jira_username = username
        
        # Get analysis parameters from config
        rollout_date = datetime.strptime(
            self.config.get("copilot_rollout_date", "2024-01-01"),
            "%Y-%m-%d"
        )
        pre_days = self.config.get("pre_period_days", 90)
        post_days = self.config.get("post_period_days", 90)
        
        # Calculate periods
        pre_start = rollout_date - timedelta(days=pre_days)
        pre_end = rollout_date - timedelta(days=1)
        post_start = rollout_date
        post_end = rollout_date + timedelta(days=post_days)
        
        # Get Copilot engagement metrics (post-rollout)
        copilot_metrics = self.copilot.get_user_engagement_metrics(
            username, post_start, post_end
        )
        
        # Get Jira productivity metrics (before and after)
        jira_metrics = self.jira.get_user_productivity_metrics(
            jira_username,
            self.config.get("projects", []),
            pre_start, pre_end,
            post_start, post_end
        )
        
        # Combine metrics
        analysis = {
            "username": username,
            "jira_username": jira_username,
            "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "copilot_rollout_date": rollout_date.strftime("%Y-%m-%d"),
            "copilot_engagement": copilot_metrics,
            "jira_productivity": jira_metrics,
            "correlation": self._calculate_correlation(copilot_metrics, jira_metrics),
            "insights": self._generate_insights(copilot_metrics, jira_metrics)
        }
        
        logger.info(f"Completed productivity analysis for {username}")
        return analysis
    
    def _calculate_correlation(self, copilot_metrics: Dict, 
                              jira_metrics: Dict) -> Dict:
        """
        Calculate correlation between Copilot engagement and productivity improvement
        
        Args:
            copilot_metrics: Copilot engagement metrics
            jira_metrics: Jira productivity metrics
            
        Returns:
            Correlation analysis
        """
        # Extract key metrics
        acceptance_rate = copilot_metrics.get("acceptance_rate", 0)
        active_days = copilot_metrics.get("active_days", 0)
        story_point_improvement = jira_metrics.get("improvement", {}).get(
            "story_points_percent", 0
        )
        
        # Calculate engagement score (0-100)
        engagement_score = min(100, (
            (acceptance_rate * 0.4) +  # 40% weight on acceptance
            (active_days * 2) +         # 2 points per active day (max 50 for 25 days)
            (min(10, copilot_metrics.get("total_acceptances", 0) / 100) * 10)  # 10% weight
        ))
        
        return {
            "engagement_score": round(engagement_score, 2),
            "productivity_improvement_percent": round(story_point_improvement, 2),
            "high_engagement": engagement_score >= 60,
            "significant_improvement": abs(story_point_improvement) >= 10,
            "positive_correlation": (
                engagement_score >= 60 and story_point_improvement >= 10
            )
        }
    
    def _generate_insights(self, copilot_metrics: Dict, 
                          jira_metrics: Dict) -> List[str]:
        """
        Generate human-readable insights from the analysis
        
        Args:
            copilot_metrics: Copilot engagement metrics
            jira_metrics: Jira productivity metrics
            
        Returns:
            List of insight strings
        """
        insights = []
        
        # Copilot engagement insights
        acceptance_rate = copilot_metrics.get("acceptance_rate", 0)
        active_days = copilot_metrics.get("active_days", 0)
        
        if acceptance_rate >= 70:
            insights.append(
                f"High Copilot acceptance rate ({acceptance_rate:.1f}%) indicates "
                "strong tool adoption and relevant suggestions."
            )
        elif acceptance_rate >= 40:
            insights.append(
                f"Moderate Copilot acceptance rate ({acceptance_rate:.1f}%). "
                "There may be opportunities to improve suggestion quality."
            )
        else:
            insights.append(
                f"Low Copilot acceptance rate ({acceptance_rate:.1f}%) suggests "
                "limited tool usage or suggestions may not be relevant."
            )
        
        if active_days >= 20:
            insights.append(
                f"Consistent Copilot usage ({active_days} active days) shows "
                "regular integration into workflow."
            )
        elif active_days >= 10:
            insights.append(
                f"Moderate Copilot usage ({active_days} active days)."
            )
        
        # Jira productivity insights
        improvement = jira_metrics.get("improvement", {})
        points_improvement = improvement.get("story_points_percent", 0)
        
        pre_avg = jira_metrics.get("pre_period", {}).get(
            "avg_story_points_per_sprint", 0
        )
        post_avg = jira_metrics.get("post_period", {}).get(
            "avg_story_points_per_sprint", 0
        )
        
        if points_improvement >= 20:
            insights.append(
                f"Significant productivity increase: {points_improvement:.1f}% improvement "
                f"in story points per sprint (from {pre_avg:.1f} to {post_avg:.1f})."
            )
        elif points_improvement >= 10:
            insights.append(
                f"Moderate productivity increase: {points_improvement:.1f}% improvement "
                f"in story points per sprint (from {pre_avg:.1f} to {post_avg:.1f})."
            )
        elif points_improvement >= 0:
            insights.append(
                f"Slight productivity increase: {points_improvement:.1f}% improvement "
                f"in story points per sprint (from {pre_avg:.1f} to {post_avg:.1f})."
            )
        else:
            insights.append(
                f"Productivity decreased by {abs(points_improvement):.1f}% "
                f"(from {pre_avg:.1f} to {post_avg:.1f} story points per sprint). "
                "This may be due to other factors or adjustment period."
            )
        
        # Combined insights
        if acceptance_rate >= 60 and points_improvement >= 15:
            insights.append(
                "Strong correlation observed: High Copilot engagement corresponds "
                "with significant productivity improvement."
            )
        
        return insights
    
    def analyze_team_productivity(self, user_mappings: List[Dict]) -> Dict:
        """
        Analyze productivity for a team of users
        
        Args:
            user_mappings: List of dicts with 'github_username' and 'jira_username'
            
        Returns:
            Team-level productivity analysis
        """
        individual_analyses = []
        
        for mapping in user_mappings:
            github_user = mapping.get("github_username")
            jira_user = mapping.get("jira_username", github_user)
            
            try:
                analysis = self.analyze_user_productivity(github_user, jira_user)
                individual_analyses.append(analysis)
            except Exception as e:
                logger.error(f"Error analyzing {github_user}: {e}")
                continue
        
        # Calculate team aggregates
        team_analysis = self._aggregate_team_metrics(individual_analyses)
        team_analysis["individual_analyses"] = individual_analyses
        
        logger.info(f"Completed team productivity analysis for {len(individual_analyses)} users")
        return team_analysis
    
    def _aggregate_team_metrics(self, analyses: List[Dict]) -> Dict:
        """
        Aggregate individual analyses into team-level metrics
        
        Args:
            analyses: List of individual user analyses
            
        Returns:
            Team-level aggregated metrics
        """
        if not analyses:
            return {
                "team_size": 0,
                "error": "No valid analyses"
            }
        
        # Aggregate Copilot metrics
        total_active_days = sum(
            a.get("copilot_engagement", {}).get("active_days", 0)
            for a in analyses
        )
        total_acceptance_rate = sum(
            a.get("copilot_engagement", {}).get("acceptance_rate", 0)
            for a in analyses
        )
        
        # Aggregate Jira metrics
        total_improvement = sum(
            a.get("jira_productivity", {}).get("improvement", {}).get(
                "story_points_percent", 0
            )
            for a in analyses
        )
        
        users_with_improvement = sum(
            1 for a in analyses
            if a.get("jira_productivity", {}).get("improvement", {}).get(
                "story_points_percent", 0
            ) > 0
        )
        
        users_with_high_engagement = sum(
            1 for a in analyses
            if a.get("correlation", {}).get("high_engagement", False)
        )
        
        users_with_positive_correlation = sum(
            1 for a in analyses
            if a.get("correlation", {}).get("positive_correlation", False)
        )
        
        team_size = len(analyses)
        
        return {
            "team_size": team_size,
            "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "copilot_adoption": {
                "avg_active_days": round(total_active_days / team_size, 2),
                "avg_acceptance_rate": round(total_acceptance_rate / team_size, 2),
                "high_engagement_count": users_with_high_engagement,
                "high_engagement_percent": round(
                    users_with_high_engagement / team_size * 100, 2
                )
            },
            "productivity_impact": {
                "avg_improvement_percent": round(total_improvement / team_size, 2),
                "users_with_improvement": users_with_improvement,
                "improvement_rate_percent": round(
                    users_with_improvement / team_size * 100, 2
                )
            },
            "correlation_analysis": {
                "positive_correlation_count": users_with_positive_correlation,
                "positive_correlation_percent": round(
                    users_with_positive_correlation / team_size * 100, 2
                )
            }
        }
