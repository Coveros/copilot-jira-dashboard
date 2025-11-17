# Quick Start Guide

Get up and running with the Copilot-Jira Dashboard in 5 minutes!

## Prerequisites Checklist

- [ ] Python 3.8+ installed
- [ ] GitHub Personal Access Token (with `copilot:read` scope)
- [ ] Jira API token
- [ ] Access to an organization with GitHub Copilot
- [ ] Access to Jira projects

## Step 1: Get Your API Tokens

### GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Copilot Dashboard"
4. Select scope: `copilot:read`
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Jira Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label: "Copilot Dashboard"
4. Click "Create"
5. **Copy the token**

## Step 2: Install

```bash
# Clone the repository
git clone https://github.com/Coveros/copilot-jira-dashboard.git
cd copilot-jira-dashboard

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .
```

## Step 3: Configure

```bash
# Copy example config
cp config.example.yml config.yml

# Edit config.yml with your favorite editor
nano config.yml  # or vim, code, etc.
```

Fill in these values:

```yaml
github:
  token: "ghp_your_actual_github_token_here"
  organization: "your-github-org-name"

jira:
  url: "https://yourcompany.atlassian.net"
  email: "your-email@company.com"
  token: "your_actual_jira_token_here"
  projects:
    - "PROJ"  # Your Jira project key

analysis:
  copilot_rollout_date: "2024-01-01"  # When your team got Copilot
  pre_period_days: 90
  post_period_days: 90
```

## Step 4: Test Connection

```bash
copilot-jira-dashboard test --config config.yml
```

Expected output:
```
Testing API connections...

Testing GitHub API...
✓ GitHub: Connected successfully (25 Copilot seats)

Testing Jira API...
✓ Jira: Connected successfully to https://yourcompany.atlassian.net
```

## Step 5: Analyze Your First User

```bash
copilot-jira-dashboard analyze-user johndoe --config config.yml
```

This will:
1. Fetch Copilot engagement metrics for johndoe
2. Fetch Jira productivity metrics
3. Calculate correlations
4. Generate reports in `./reports/`

## Step 6: View Results

Open the generated report:

```bash
# On macOS
open reports/johndoe_report.html

# On Linux
xdg-open reports/johndoe_report.html

# On Windows
start reports/johndoe_report.html
```

## Analyze Your Team

### Option 1: Command Line

```bash
copilot-jira-dashboard analyze-team \
  --users johndoe janedoe bobsmith \
  --config config.yml
```

### Option 2: User File (Recommended)

1. Create `users.yml`:

```yaml
users:
  - github_username: "johndoe"
    jira_username: "john.doe@company.com"
  
  - github_username: "janedoe"
    jira_username: "jane.doe@company.com"
  
  - github_username: "bobsmith"
    jira_username: "bob.smith@company.com"
```

2. Run analysis:

```bash
copilot-jira-dashboard analyze-team \
  --users-file users.yml \
  --config config.yml
```

## Understanding Your Results

### Individual Reports

Each user gets:
- **Engagement Score**: 0-100, higher is better
- **Productivity Change**: Percentage improvement in story points
- **Correlation Status**: Does high engagement = high productivity?
- **Insights**: Human-readable observations

### Team Report

The team report shows:
- Average engagement and improvement
- Distribution of results
- Scatter plot of all team members
- Links to individual reports

## Common Issues & Solutions

### "Not Found" from GitHub

**Problem**: Organization name is wrong or you don't have access

**Solution**: 
- Double-check org name in config.yml
- Ensure you're a member of the organization
- Verify token has correct scope

### "Authentication Failed" from Jira

**Problem**: Credentials are incorrect

**Solution**:
- Verify email matches your Jira account
- Regenerate API token if needed
- Check Jira URL format (include https://)

### "No Story Points"

**Problem**: Jira story points not appearing

**Solution**:
- Story points must be set on completed issues
- Custom field IDs vary by instance
- May need to update `jira_collector.py` with your field ID

To find your field ID:
1. Open a Jira issue with story points
2. Add `?expand=all` to URL
3. Search for "story" or "estimate"
4. Note the `customfield_XXXXX` ID

### Empty Reports

**Problem**: No data in analysis

**Solution**:
- Verify date ranges cover when users were active
- Check that users have completed issues in Jira
- Ensure Copilot rollout date is correct

## Next Steps

1. **Share Results**: Send team report to stakeholders
2. **Regular Analysis**: Run monthly to track trends
3. **Identify Patterns**: Look for users with low engagement
4. **Take Action**: Provide training for users not seeing benefits
5. **Expand Coverage**: Add more team members over time

## Getting Help

- Read the full [README.md](README.md)
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Open an issue on GitHub
- Review example configurations

## Pro Tips

1. **Rollout Date**: Set this accurately for meaningful before/after comparison
2. **Sprint Alignment**: Results are based on 2-week sprints
3. **Team Size**: Best for teams of 5-50 people
4. **Regular Updates**: Re-run analysis every sprint
5. **Data Quality**: Ensure story points are consistently estimated
6. **Engagement**: Focus on users with high engagement for case studies

## Example Command Reference

```bash
# Single user analysis
copilot-jira-dashboard analyze-user johndoe

# Single user with different Jira username
copilot-jira-dashboard analyze-user johndoe --jira-username john.doe@company.com

# Team from file
copilot-jira-dashboard analyze-team --users-file users.yml

# Team from command line
copilot-jira-dashboard analyze-team --users alice bob charlie

# Test connections
copilot-jira-dashboard test

# Verbose output
copilot-jira-dashboard -v analyze-user johndoe

# Custom config location
copilot-jira-dashboard -c /path/to/config.yml analyze-user johndoe
```

## Success! 🎉

You should now have:
- ✓ Working installation
- ✓ Configured API access
- ✓ Generated reports
- ✓ Understanding of results

Now go demonstrate the ROI of GitHub Copilot! 🚀
