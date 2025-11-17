# Architecture Overview

## Design Philosophy

This dashboard was built with the principle that **developer productivity measurement must go beyond simple metrics** like "lines of code accepted." Instead, it combines multiple data sources to show meaningful, business-relevant improvements.

## Core Components

### 1. Data Collection Layer

#### CopilotCollector (`src/copilot_jira_dashboard/collectors/copilot_collector.py`)

Interfaces with the GitHub Copilot API to gather comprehensive engagement metrics:

- **Seat Information**: Who has Copilot access and when they received it
- **Usage Data**: Daily usage patterns across the organization
- **Engagement Metrics**: 
  - Active days (not just lines)
  - Acceptance rates
  - Suggestion counts
  - Languages used
  - Composite engagement score (0-100)

**Key Methods:**
- `get_copilot_seats()`: Lists all users with Copilot licenses
- `get_copilot_usage()`: Fetches daily usage data
- `get_user_engagement_metrics()`: Calculates comprehensive engagement for a user
- `get_all_users_engagement()`: Batch processing for entire team

#### JiraCollector (`src/copilot_jira_dashboard/collectors/jira_collector.py`)

Interfaces with Jira API to gather productivity metrics:

- **Issue Completion**: Stories resolved by each developer
- **Story Points**: Extracted from custom fields
- **Sprint Velocity**: Calculated using 2-week periods
- **Before/After Analysis**: Compares pre and post Copilot rollout

**Key Methods:**
- `get_user_issues()`: Fetches completed issues for a user
- `get_sprint_velocity()`: Groups issues into sprints and calculates velocity
- `get_user_productivity_metrics()`: Compares before/after periods

**Note**: Story point custom fields vary by Jira instance. The collector checks common field IDs but may need customization.

### 2. Analysis Layer

#### ProductivityAnalyzer (`src/copilot_jira_dashboard/analyzers/productivity_analyzer.py`)

The intelligence layer that combines data from both sources:

- **Correlation Analysis**: Links Copilot engagement to productivity changes
- **Engagement Scoring**: Composite score based on:
  - Acceptance rate (40% weight)
  - Active days (up to 50 points for 25+ days)
  - Total acceptances (10% weight)
- **Insight Generation**: Automated, context-aware insights

**Key Methods:**
- `analyze_user_productivity()`: Full analysis for one user
- `analyze_team_productivity()`: Batch analysis with aggregation
- `_calculate_correlation()`: Determines if engagement correlates with improvement
- `_generate_insights()`: Creates human-readable observations

### 3. Visualization Layer

#### DashboardVisualizer (`src/copilot_jira_dashboard/visualizers/dashboard.py`)

Generates reports and visualizations:

- **HTML Reports**: Self-contained with embedded charts
- **Charts**: 
  - Engagement metrics (acceptance rate, active days)
  - Productivity comparison (before/after)
  - Correlation scatter plots
  - Team overview dashboards
- **Export Formats**: HTML, PNG charts, JSON data

**Key Methods:**
- `create_user_dashboard()`: Individual reports
- `create_team_dashboard()`: Aggregated team reports
- Various `_create_*_chart()` methods for specific visualizations

### 4. CLI Interface

#### CLI (`src/copilot_jira_dashboard/cli.py`)

Command-line tool providing easy access:

```bash
copilot-jira-dashboard analyze-user <username>
copilot-jira-dashboard analyze-team --users-file users.yml
copilot-jira-dashboard test
```

## Data Flow

```
┌─────────────┐         ┌──────────────┐
│   GitHub    │         │     Jira     │
│  Copilot API│         │     API      │
└──────┬──────┘         └──────┬───────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────┐         ┌──────────────┐
│  Copilot    │         │    Jira      │
│  Collector  │         │  Collector   │
└──────┬──────┘         └──────┬───────┘
       │                       │
       └───────┬───────────────┘
               │
               ▼
       ┌───────────────┐
       │ Productivity  │
       │   Analyzer    │
       └───────┬───────┘
               │
               ▼
       ┌───────────────┐
       │  Dashboard    │
       │  Visualizer   │
       └───────┬───────┘
               │
               ▼
    ┌──────────────────┐
    │  HTML Reports +  │
    │  Charts + JSON   │
    └──────────────────┘
```

## Configuration

The system uses a YAML configuration file with three main sections:

### GitHub Configuration
- **token**: Personal Access Token with `copilot:read` scope
- **organization**: GitHub org/enterprise name

### Jira Configuration
- **url**: Jira instance URL
- **email**: User email
- **token**: API token
- **projects**: Project keys to analyze

### Analysis Configuration
- **copilot_rollout_date**: When Copilot was introduced
- **pre_period_days**: How far back to look before rollout (default: 90)
- **post_period_days**: How far forward after rollout (default: 90)

## Key Algorithms

### Engagement Score Calculation

```python
engagement_score = min(100, (
    (acceptance_rate * 0.4) +           # 40% weight
    (active_days * 2) +                 # 2 points per day, max 50
    (min(10, acceptances / 100) * 10)   # 10% weight
))
```

### Sprint Period Calculation

Uses 2-week intervals starting from a fixed epoch (2020-01-06):

```python
days_since_epoch = (date - epoch).days
sprint_number = days_since_epoch // 14
sprint_start = epoch + timedelta(days=sprint_number * 14)
```

This ensures consistent sprint boundaries across all users.

### Correlation Detection

A positive correlation is identified when:
1. Engagement score ≥ 60 (high engagement)
2. Productivity improvement ≥ 10% (significant improvement)

## Extensibility

The modular design allows for easy extensions:

### Adding New Data Sources
1. Create a new collector in `src/copilot_jira_dashboard/collectors/`
2. Implement data fetching methods
3. Update `ProductivityAnalyzer` to incorporate new data

### Adding New Visualizations
1. Add methods to `DashboardVisualizer`
2. Update HTML templates
3. Generate new chart types

### Adding New Analysis
1. Extend `ProductivityAnalyzer`
2. Add new correlation algorithms
3. Generate additional insights

## Testing Strategy

### Unit Tests
- Mock API responses
- Test data transformations
- Verify calculations

### Integration Tests
- Test with example data
- Verify end-to-end flow
- Check output formats

### Manual Testing
- Use `test` command to verify API connections
- Analyze sample users
- Review generated reports

## Performance Considerations

- **API Rate Limits**: Collectors handle pagination and rate limiting
- **Batch Processing**: Team analysis processes users sequentially
- **Caching**: Consider adding caching for repeated queries
- **Memory**: Holds all user data in memory; suitable for teams up to 100-200 users

## Security Considerations

- **Credentials**: Stored in config.yml (not committed to git)
- **API Tokens**: Use minimal required scopes
- **Data Storage**: Reports are local files; consider access controls
- **Sensitive Data**: User performance data should be treated confidentially

## Future Enhancements

Potential improvements:
1. **Database Backend**: Store historical data for trend analysis
2. **Web Dashboard**: Interactive web UI instead of static HTML
3. **Real-time Updates**: Webhook integration for live updates
4. **Additional Data Sources**: Git commits, PR reviews, code quality metrics
5. **Machine Learning**: Predict productivity improvements from engagement patterns
6. **Slack/Teams Integration**: Automated report distribution
7. **Custom Fields**: UI for mapping Jira custom fields
8. **Time Series Analysis**: More sophisticated trend detection
