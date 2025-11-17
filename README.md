# GitHub Copilot & Jira Productivity Dashboard

A comprehensive tool that demonstrates **real developer productivity improvements** by combining GitHub Copilot engagement metrics with Jira story point completion data.

## Overview

This project goes beyond simple "lines accepted" metrics to provide meaningful insights into how GitHub Copilot impacts developer productivity. It correlates:

- **Copilot Engagement Metrics**: Active days, acceptance rates, suggestion counts, languages used
- **Jira Productivity Metrics**: Story points completed, issue velocity, sprint-over-sprint improvements

The tool provides before/after analysis, showing productivity changes after Copilot adoption with rich visualizations and detailed reports.

## Key Features

- 📊 **Comprehensive Engagement Tracking**: Not just line counts - tracks active days, acceptance rates, and usage patterns
- 📈 **Before/After Analysis**: Compares productivity metrics pre and post Copilot rollout
- 🔗 **Correlation Analysis**: Links Copilot usage to actual productivity improvements
- 👥 **Team & Individual Reports**: Generate reports for individuals or entire teams
- 📉 **Rich Visualizations**: Interactive charts showing trends and correlations
- 🎯 **Sprint-Based Metrics**: Analyzes productivity using 2-week sprint intervals
- 💡 **Automated Insights**: Generates human-readable insights from data

## Architecture

```
src/copilot_jira_dashboard/
├── collectors/           # Data collection from APIs
│   ├── copilot_collector.py  # GitHub Copilot API client
│   └── jira_collector.py      # Jira API client
├── analyzers/           # Data analysis and correlation
│   └── productivity_analyzer.py
└── visualizers/         # Report and chart generation
    └── dashboard.py
```

## Installation

### Prerequisites

- Python 3.8 or higher
- GitHub Personal Access Token with `copilot:read` scope
- Jira API token

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Coveros/copilot-jira-dashboard.git
cd copilot-jira-dashboard
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install the package:
```bash
pip install -e .
```

5. Configure the tool:
```bash
cp config.example.yml config.yml
# Edit config.yml with your API credentials and settings
```

## Configuration

Edit `config.yml` with your settings:

```yaml
github:
  token: "ghp_your_token_here"
  organization: "your-org-name"

jira:
  url: "https://your-instance.atlassian.net"
  email: "your-email@example.com"
  token: "your_jira_token"
  projects:
    - "PROJ"

analysis:
  copilot_rollout_date: "2024-01-01"  # When Copilot was rolled out
  pre_period_days: 90   # Days before rollout to analyze
  post_period_days: 90  # Days after rollout to analyze

output:
  reports_dir: "./reports"
  charts_dir: "./reports/charts"
```

### Getting API Tokens

**GitHub Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `copilot:read` scope
4. Copy the token to your config

**Jira Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Copy to your config along with your email

## Usage

### Test API Connections

```bash
copilot-jira-dashboard test --config config.yml
```

### Analyze a Single User

```bash
copilot-jira-dashboard analyze-user johndoe --config config.yml
```

If GitHub and Jira usernames differ:
```bash
copilot-jira-dashboard analyze-user johndoe --jira-username john.doe@example.com
```

### Analyze a Team

Using a users file:
```bash
cp users.example.yml users.yml
# Edit users.yml with your team members
copilot-jira-dashboard analyze-team --users-file users.yml --config config.yml
```

Using command-line arguments:
```bash
copilot-jira-dashboard analyze-team \
  --users johndoe janedoe:jane.doe bobsmith \
  --config config.yml
```

### Output

Reports are generated in the `reports/` directory:
- `{username}_report.html` - Individual user reports with charts
- `{username}_analysis.json` - Raw analysis data
- `team_report.html` - Team-level summary
- `charts/` - All generated visualizations

## What Gets Analyzed

### GitHub Copilot Metrics

- **Active Days**: Days with Copilot usage
- **Acceptance Rate**: Percentage of suggestions accepted
- **Suggestion Counts**: Total suggestions and acceptances
- **Lines of Code**: Lines suggested vs accepted
- **Languages**: Programming languages used with Copilot
- **Engagement Score**: Composite score (0-100) based on usage patterns

### Jira Productivity Metrics

- **Story Points per Sprint**: Average and total
- **Issues Completed**: Count per sprint
- **Velocity Trends**: Sprint-over-sprint changes
- **Before/After Comparison**: Pre and post Copilot rollout
- **Improvement Percentage**: Quantified productivity change

### Correlation Analysis

- Links high Copilot engagement to productivity improvements
- Identifies users with positive correlation
- Generates insights about adoption and impact
- Team-level aggregation and trends

## Example Output

The tool generates:

1. **Individual Reports**: Detailed HTML reports with:
   - Executive summary with key metrics
   - Copilot engagement charts
   - Before/after productivity comparison
   - Correlation visualization
   - Automated insights

2. **Team Reports**: Aggregated team analysis with:
   - Team-level metrics and averages
   - Scatter plots showing individual positions
   - Adoption and improvement rates
   - Links to individual reports

3. **Charts**: PNG visualizations for:
   - Acceptance rates
   - Active days
   - Productivity comparisons
   - Correlation scatter plots
   - Team overviews

## Understanding the Results

### Engagement Score (0-100)

- **0-40**: Low engagement - user may need training or tool isn't fitting workflow
- **40-60**: Moderate engagement - decent adoption
- **60-100**: High engagement - strong tool adoption and usage

### Productivity Improvement

- **> +20%**: Significant improvement
- **+10% to +20%**: Moderate improvement
- **0% to +10%**: Slight improvement
- **< 0%**: Decrease (may indicate adjustment period or other factors)

### Positive Correlation

Users with both:
- High engagement score (≥60)
- Significant improvement (≥10%)

This indicates Copilot is contributing to measurable productivity gains.

## Development

### Running Tests

```bash
pytest tests/
```

### Project Structure

```
copilot-jira-dashboard/
├── src/copilot_jira_dashboard/   # Main package
│   ├── collectors/                # API collectors
│   ├── analyzers/                 # Analysis logic
│   ├── visualizers/               # Report generation
│   └── cli.py                     # Command-line interface
├── tests/                         # Test suite
├── reports/                       # Generated reports
├── config.example.yml             # Example configuration
├── users.example.yml              # Example user mappings
├── requirements.txt               # Dependencies
└── setup.py                       # Package setup

```

## Troubleshooting

### Common Issues

1. **"Not Found" error from GitHub API**
   - Verify organization name is correct
   - Ensure token has `copilot:read` scope
   - Check that organization has Copilot seats

2. **Jira authentication failed**
   - Confirm API token is valid
   - Verify email matches Jira account
   - Check Jira URL format

3. **No data in reports**
   - Verify date ranges in config
   - Check that users have completed issues in Jira
   - Ensure users have Copilot seats assigned

4. **Story points not showing**
   - Jira custom field IDs vary by instance
   - May need to update field IDs in `jira_collector.py`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review example configurations

## Acknowledgments

This project demonstrates the value of combining multiple data sources to understand developer productivity holistically, going beyond simple metrics to show real business impact.
