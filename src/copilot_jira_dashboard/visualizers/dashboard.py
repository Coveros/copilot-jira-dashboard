"""
Dashboard visualizer for creating charts and reports
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional
import json
import logging

logger = logging.getLogger(__name__)

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)


class DashboardVisualizer:
    """Creates visualizations and reports from productivity analysis"""
    
    def __init__(self, output_dir: str = "./reports"):
        """
        Initialize dashboard visualizer
        
        Args:
            output_dir: Directory for output files
        """
        self.output_dir = Path(output_dir)
        self.charts_dir = self.output_dir / "charts"
        
        # Create directories
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.charts_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Dashboard visualizer initialized with output dir: {output_dir}")
    
    def create_user_dashboard(self, analysis: Dict, username: str) -> str:
        """
        Create a comprehensive dashboard for a single user
        
        Args:
            analysis: User productivity analysis
            username: GitHub username
            
        Returns:
            Path to generated report
        """
        logger.info(f"Creating dashboard for {username}")
        
        # Create visualizations
        self._create_engagement_chart(analysis, username)
        self._create_productivity_comparison_chart(analysis, username)
        self._create_correlation_chart(analysis, username)
        
        # Create HTML report
        report_path = self._create_html_report(analysis, username)
        
        # Save JSON data
        json_path = self.output_dir / f"{username}_analysis.json"
        with open(json_path, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        logger.info(f"Dashboard created: {report_path}")
        return str(report_path)
    
    def _create_engagement_chart(self, analysis: Dict, username: str):
        """Create Copilot engagement metrics chart"""
        copilot_data = analysis.get("copilot_engagement", {})
        
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        
        # Acceptance rate
        acceptance_rate = copilot_data.get("acceptance_rate", 0)
        axes[0].bar(
            ["Acceptance Rate"],
            [acceptance_rate],
            color='steelblue',
            width=0.4
        )
        axes[0].set_ylim(0, 100)
        axes[0].set_ylabel("Percentage (%)")
        axes[0].set_title("Copilot Suggestion Acceptance Rate")
        axes[0].axhline(y=50, color='r', linestyle='--', label='50% threshold')
        axes[0].legend()
        
        # Active days and suggestions
        active_days = copilot_data.get("active_days", 0)
        total_suggestions = copilot_data.get("total_suggestions", 0)
        
        axes[1].bar(
            ["Active Days", "Suggestions (÷100)"],
            [active_days, total_suggestions / 100],
            color=['green', 'orange']
        )
        axes[1].set_ylabel("Count")
        axes[1].set_title("Copilot Usage Activity")
        
        plt.tight_layout()
        plt.savefig(self.charts_dir / f"{username}_engagement.png", dpi=100)
        plt.close()
    
    def _create_productivity_comparison_chart(self, analysis: Dict, username: str):
        """Create before/after productivity comparison chart"""
        jira_data = analysis.get("jira_productivity", {})
        pre = jira_data.get("pre_period", {})
        post = jira_data.get("post_period", {})
        
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        
        # Story points comparison
        periods = ["Before\nCopilot", "After\nCopilot"]
        story_points = [
            pre.get("avg_story_points_per_sprint", 0),
            post.get("avg_story_points_per_sprint", 0)
        ]
        
        bars1 = axes[0].bar(periods, story_points, color=['lightcoral', 'lightgreen'])
        axes[0].set_ylabel("Story Points")
        axes[0].set_title("Average Story Points per Sprint")
        axes[0].set_ylim(0, max(story_points) * 1.2 if story_points else 10)
        
        # Add value labels on bars
        for bar in bars1:
            height = bar.get_height()
            axes[0].text(
                bar.get_x() + bar.get_width() / 2., height,
                f'{height:.1f}',
                ha='center', va='bottom'
            )
        
        # Issues comparison
        issues = [
            pre.get("avg_issues_per_sprint", 0),
            post.get("avg_issues_per_sprint", 0)
        ]
        
        bars2 = axes[1].bar(periods, issues, color=['lightcoral', 'lightgreen'])
        axes[1].set_ylabel("Issues")
        axes[1].set_title("Average Issues Completed per Sprint")
        axes[1].set_ylim(0, max(issues) * 1.2 if issues else 10)
        
        for bar in bars2:
            height = bar.get_height()
            axes[1].text(
                bar.get_x() + bar.get_width() / 2., height,
                f'{height:.1f}',
                ha='center', va='bottom'
            )
        
        plt.tight_layout()
        plt.savefig(self.charts_dir / f"{username}_productivity.png", dpi=100)
        plt.close()
    
    def _create_correlation_chart(self, analysis: Dict, username: str):
        """Create correlation visualization"""
        correlation = analysis.get("correlation", {})
        
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Create a scatter plot
        engagement = correlation.get("engagement_score", 0)
        improvement = correlation.get("productivity_improvement_percent", 0)
        
        ax.scatter([engagement], [improvement], s=500, alpha=0.6, color='blue')
        
        # Add quadrant lines
        ax.axhline(y=0, color='gray', linestyle='-', linewidth=0.5)
        ax.axvline(x=50, color='gray', linestyle='-', linewidth=0.5)
        
        # Add labels
        ax.text(engagement, improvement + 2, username, ha='center', fontsize=10)
        
        # Quadrant labels
        ax.text(75, max(improvement, 10) * 0.9, "High Engagement\nHigh Improvement", 
                ha='center', fontsize=9, alpha=0.5)
        ax.text(25, max(improvement, 10) * 0.9, "Low Engagement\nHigh Improvement",
                ha='center', fontsize=9, alpha=0.5)
        
        ax.set_xlabel("Copilot Engagement Score (0-100)")
        ax.set_ylabel("Productivity Improvement (%)")
        ax.set_title("Copilot Engagement vs Productivity Improvement")
        ax.set_xlim(0, 100)
        ax.set_ylim(min(improvement, 0) - 10, max(improvement, 20) + 10)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(self.charts_dir / f"{username}_correlation.png", dpi=100)
        plt.close()
    
    def _create_html_report(self, analysis: Dict, username: str) -> Path:
        """Create HTML report for user analysis"""
        copilot_data = analysis.get("copilot_engagement", {})
        jira_data = analysis.get("jira_productivity", {})
        correlation = analysis.get("correlation", {})
        insights = analysis.get("insights", [])
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Productivity Analysis - {username}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .section {{
            background-color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .metric {{
            display: inline-block;
            margin: 10px 20px 10px 0;
        }}
        .metric-label {{
            font-size: 14px;
            color: #666;
        }}
        .metric-value {{
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }}
        .insight {{
            background-color: #e8f4f8;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
            border-radius: 3px;
        }}
        .chart {{
            text-align: center;
            margin: 20px 0;
        }}
        .chart img {{
            max-width: 100%;
            height: auto;
        }}
        .positive {{
            color: #27ae60;
        }}
        .negative {{
            color: #e74c3c;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #34495e;
            color: white;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Productivity Analysis Report</h1>
        <h2>{username}</h2>
        <p>Analysis Date: {analysis.get("analysis_date", "N/A")}</p>
        <p>Copilot Rollout Date: {analysis.get("copilot_rollout_date", "N/A")}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metric">
            <div class="metric-label">Engagement Score</div>
            <div class="metric-value">{correlation.get("engagement_score", 0):.1f}/100</div>
        </div>
        <div class="metric">
            <div class="metric-label">Productivity Change</div>
            <div class="metric-value {'positive' if correlation.get('productivity_improvement_percent', 0) > 0 else 'negative'}">
                {correlation.get("productivity_improvement_percent", 0):+.1f}%
            </div>
        </div>
        <div class="metric">
            <div class="metric-label">Positive Correlation</div>
            <div class="metric-value">{"✓ Yes" if correlation.get("positive_correlation") else "✗ No"}</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Key Insights</h2>
        {''.join(f'<div class="insight">{insight}</div>' for insight in insights)}
    </div>
    
    <div class="section">
        <h2>GitHub Copilot Engagement</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Active Days</td>
                <td>{copilot_data.get("active_days", 0)}</td>
            </tr>
            <tr>
                <td>Acceptance Rate</td>
                <td>{copilot_data.get("acceptance_rate", 0):.1f}%</td>
            </tr>
            <tr>
                <td>Total Suggestions</td>
                <td>{copilot_data.get("total_suggestions", 0):,}</td>
            </tr>
            <tr>
                <td>Total Acceptances</td>
                <td>{copilot_data.get("total_acceptances", 0):,}</td>
            </tr>
            <tr>
                <td>Lines Accepted</td>
                <td>{copilot_data.get("total_lines_accepted", 0):,}</td>
            </tr>
            <tr>
                <td>Languages Used</td>
                <td>{', '.join(copilot_data.get("languages_used", []))}</td>
            </tr>
        </table>
        <div class="chart">
            <img src="charts/{username}_engagement.png" alt="Engagement Chart">
        </div>
    </div>
    
    <div class="section">
        <h2>Jira Productivity Metrics</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Before Copilot</th>
                <th>After Copilot</th>
                <th>Change</th>
            </tr>
            <tr>
                <td>Avg Story Points/Sprint</td>
                <td>{jira_data.get("pre_period", {}).get("avg_story_points_per_sprint", 0):.1f}</td>
                <td>{jira_data.get("post_period", {}).get("avg_story_points_per_sprint", 0):.1f}</td>
                <td class="{'positive' if jira_data.get('improvement', {}).get('story_points_percent', 0) > 0 else 'negative'}">
                    {jira_data.get("improvement", {}).get("story_points_percent", 0):+.1f}%
                </td>
            </tr>
            <tr>
                <td>Avg Issues/Sprint</td>
                <td>{jira_data.get("pre_period", {}).get("avg_issues_per_sprint", 0):.1f}</td>
                <td>{jira_data.get("post_period", {}).get("avg_issues_per_sprint", 0):.1f}</td>
                <td class="{'positive' if jira_data.get('improvement', {}).get('issues_percent', 0) > 0 else 'negative'}">
                    {jira_data.get("improvement", {}).get("issues_percent", 0):+.1f}%
                </td>
            </tr>
            <tr>
                <td>Total Story Points</td>
                <td>{jira_data.get("pre_period", {}).get("total_story_points", 0):.0f}</td>
                <td>{jira_data.get("post_period", {}).get("total_story_points", 0):.0f}</td>
                <td>-</td>
            </tr>
            <tr>
                <td>Number of Sprints</td>
                <td>{jira_data.get("pre_period", {}).get("sprints", 0)}</td>
                <td>{jira_data.get("post_period", {}).get("sprints", 0)}</td>
                <td>-</td>
            </tr>
        </table>
        <div class="chart">
            <img src="charts/{username}_productivity.png" alt="Productivity Chart">
        </div>
    </div>
    
    <div class="section">
        <h2>Correlation Analysis</h2>
        <p>This chart shows the relationship between Copilot engagement and productivity improvement.</p>
        <div class="chart">
            <img src="charts/{username}_correlation.png" alt="Correlation Chart">
        </div>
    </div>
</body>
</html>
"""
        
        report_path = self.output_dir / f"{username}_report.html"
        with open(report_path, 'w') as f:
            f.write(html)
        
        return report_path
    
    def create_team_dashboard(self, team_analysis: Dict) -> str:
        """
        Create a team-level dashboard
        
        Args:
            team_analysis: Team productivity analysis
            
        Returns:
            Path to generated report
        """
        logger.info("Creating team dashboard")
        
        # Create team visualizations
        self._create_team_overview_chart(team_analysis)
        self._create_team_scatter_chart(team_analysis)
        
        # Create HTML report
        report_path = self._create_team_html_report(team_analysis)
        
        # Save JSON data
        json_path = self.output_dir / "team_analysis.json"
        with open(json_path, 'w') as f:
            json.dump(team_analysis, f, indent=2)
        
        logger.info(f"Team dashboard created: {report_path}")
        return str(report_path)
    
    def _create_team_overview_chart(self, team_analysis: Dict):
        """Create team overview metrics chart"""
        adoption = team_analysis.get("copilot_adoption", {})
        impact = team_analysis.get("productivity_impact", {})
        
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        # Engagement rate
        high_engagement_pct = adoption.get("high_engagement_percent", 0)
        axes[0, 0].pie(
            [high_engagement_pct, 100 - high_engagement_pct],
            labels=['High Engagement', 'Lower Engagement'],
            autopct='%1.1f%%',
            colors=['lightgreen', 'lightcoral']
        )
        axes[0, 0].set_title("Team Copilot Engagement")
        
        # Improvement rate
        improvement_pct = impact.get("improvement_rate_percent", 0)
        axes[0, 1].pie(
            [improvement_pct, 100 - improvement_pct],
            labels=['Improved', 'Not Improved'],
            autopct='%1.1f%%',
            colors=['lightblue', 'lightgray']
        )
        axes[0, 1].set_title("Team Productivity Improvement")
        
        # Average metrics
        avg_acceptance = adoption.get("avg_acceptance_rate", 0)
        avg_improvement = impact.get("avg_improvement_percent", 0)
        
        axes[1, 0].bar(
            ["Avg Acceptance\nRate (%)"],
            [avg_acceptance],
            color='steelblue'
        )
        axes[1, 0].set_ylim(0, 100)
        axes[1, 0].set_title("Average Copilot Acceptance Rate")
        
        axes[1, 1].bar(
            ["Avg Productivity\nImprovement (%)"],
            [avg_improvement],
            color='green' if avg_improvement > 0 else 'red'
        )
        axes[1, 1].axhline(y=0, color='gray', linestyle='-', linewidth=0.5)
        axes[1, 1].set_title("Average Productivity Change")
        
        plt.tight_layout()
        plt.savefig(self.charts_dir / "team_overview.png", dpi=100)
        plt.close()
    
    def _create_team_scatter_chart(self, team_analysis: Dict):
        """Create team-level scatter plot"""
        individuals = team_analysis.get("individual_analyses", [])
        
        if not individuals:
            return
        
        # Extract data
        usernames = []
        engagement_scores = []
        improvements = []
        
        for analysis in individuals:
            usernames.append(analysis.get("username", "Unknown"))
            correlation = analysis.get("correlation", {})
            engagement_scores.append(correlation.get("engagement_score", 0))
            improvements.append(correlation.get("productivity_improvement_percent", 0))
        
        # Create scatter plot
        fig, ax = plt.subplots(figsize=(12, 8))
        
        scatter = ax.scatter(
            engagement_scores,
            improvements,
            s=300,
            alpha=0.6,
            c=improvements,
            cmap='RdYlGn',
            edgecolors='black'
        )
        
        # Add labels for each point
        for i, username in enumerate(usernames):
            ax.annotate(
                username,
                (engagement_scores[i], improvements[i]),
                xytext=(5, 5),
                textcoords='offset points',
                fontsize=8
            )
        
        # Add quadrant lines
        ax.axhline(y=0, color='gray', linestyle='-', linewidth=0.5)
        ax.axvline(x=50, color='gray', linestyle='-', linewidth=0.5)
        
        ax.set_xlabel("Copilot Engagement Score (0-100)")
        ax.set_ylabel("Productivity Improvement (%)")
        ax.set_title("Team: Copilot Engagement vs Productivity Improvement")
        ax.grid(True, alpha=0.3)
        
        # Add colorbar
        cbar = plt.colorbar(scatter)
        cbar.set_label("Productivity Improvement (%)")
        
        plt.tight_layout()
        plt.savefig(self.charts_dir / "team_correlation.png", dpi=100)
        plt.close()
    
    def _create_team_html_report(self, team_analysis: Dict) -> Path:
        """Create HTML report for team analysis"""
        adoption = team_analysis.get("copilot_adoption", {})
        impact = team_analysis.get("productivity_impact", {})
        correlation = team_analysis.get("correlation_analysis", {})
        individuals = team_analysis.get("individual_analyses", [])
        
        # Create individual rows
        individual_rows = []
        for analysis in individuals:
            username = analysis.get("username", "Unknown")
            corr = analysis.get("correlation", {})
            jira = analysis.get("jira_productivity", {}).get("improvement", {})
            
            individual_rows.append(f"""
            <tr>
                <td><a href="{username}_report.html">{username}</a></td>
                <td>{corr.get("engagement_score", 0):.1f}</td>
                <td class="{'positive' if jira.get('story_points_percent', 0) > 0 else 'negative'}">
                    {jira.get("story_points_percent", 0):+.1f}%
                </td>
                <td>{"✓" if corr.get("positive_correlation") else "✗"}</td>
            </tr>
            """)
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Team Productivity Analysis</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .section {{
            background-color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .metric {{
            display: inline-block;
            margin: 10px 20px 10px 0;
        }}
        .metric-label {{
            font-size: 14px;
            color: #666;
        }}
        .metric-value {{
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }}
        .chart {{
            text-align: center;
            margin: 20px 0;
        }}
        .chart img {{
            max-width: 100%;
            height: auto;
        }}
        .positive {{
            color: #27ae60;
        }}
        .negative {{
            color: #e74c3c;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #34495e;
            color: white;
        }}
        a {{
            color: #3498db;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Team Productivity Analysis Report</h1>
        <p>Analysis Date: {team_analysis.get("analysis_date", "N/A")}</p>
        <p>Team Size: {team_analysis.get("team_size", 0)} members</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metric">
            <div class="metric-label">Avg Engagement Score</div>
            <div class="metric-value">{adoption.get("avg_acceptance_rate", 0):.1f}/100</div>
        </div>
        <div class="metric">
            <div class="metric-label">Avg Productivity Change</div>
            <div class="metric-value {'positive' if impact.get('avg_improvement_percent', 0) > 0 else 'negative'}">
                {impact.get("avg_improvement_percent", 0):+.1f}%
            </div>
        </div>
        <div class="metric">
            <div class="metric-label">Positive Correlation Rate</div>
            <div class="metric-value">{correlation.get("positive_correlation_percent", 0):.1f}%</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Team Overview</h2>
        <div class="chart">
            <img src="charts/team_overview.png" alt="Team Overview">
        </div>
    </div>
    
    <div class="section">
        <h2>Copilot Adoption</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Average Active Days</td>
                <td>{adoption.get("avg_active_days", 0):.1f}</td>
            </tr>
            <tr>
                <td>Average Acceptance Rate</td>
                <td>{adoption.get("avg_acceptance_rate", 0):.1f}%</td>
            </tr>
            <tr>
                <td>High Engagement Members</td>
                <td>{adoption.get("high_engagement_count", 0)} ({adoption.get("high_engagement_percent", 0):.1f}%)</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Productivity Impact</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Average Improvement</td>
                <td class="{'positive' if impact.get('avg_improvement_percent', 0) > 0 else 'negative'}">
                    {impact.get("avg_improvement_percent", 0):+.1f}%
                </td>
            </tr>
            <tr>
                <td>Members with Improvement</td>
                <td>{impact.get("users_with_improvement", 0)} ({impact.get("improvement_rate_percent", 0):.1f}%)</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Team Correlation Analysis</h2>
        <div class="chart">
            <img src="charts/team_correlation.png" alt="Team Correlation">
        </div>
    </div>
    
    <div class="section">
        <h2>Individual Results</h2>
        <table>
            <tr>
                <th>Username</th>
                <th>Engagement Score</th>
                <th>Productivity Change</th>
                <th>Positive Correlation</th>
            </tr>
            {''.join(individual_rows)}
        </table>
    </div>
</body>
</html>
"""
        
        report_path = self.output_dir / "team_report.html"
        with open(report_path, 'w') as f:
            f.write(html)
        
        return report_path
