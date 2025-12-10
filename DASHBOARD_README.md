# 🚀 Copilot-Jira Productivity Dashboard

An interactive dashboard that demonstrates developer productivity improvements by combining **GitHub Copilot metrics** with **Jira story point data**. This application visualizes the correlation between Copilot adoption and increased developer velocity.

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## 📊 Features

- **Productivity Metrics**: Track story point completion before and after Copilot adoption
- **Developer Comparison**: Individual developer performance analysis with improvement percentages
- **Velocity Trends**: Visualize team velocity changes over multiple sprints
- **Copilot Engagement**: Monitor suggestion acceptance rates and active usage
- **Adoption Tracking**: See how Copilot adoption grows across the team
- **Detailed Analytics**: Comprehensive data tables with individual developer metrics

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **date-fns** - Date handling

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd copilot-jira-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🚀 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
copilot-jira-dashboard/
├── src/
│   ├── components/           # React components
│   │   ├── SummaryCard.tsx          # Metric summary cards
│   │   ├── VelocityTrendChart.tsx   # Velocity over time
│   │   ├── DeveloperComparisonChart.tsx  # Before/after comparison
│   │   ├── CopilotAdoptionChart.tsx      # Adoption tracking
│   │   ├── CopilotMetricsChart.tsx       # Engagement metrics
│   │   └── DeveloperTable.tsx            # Detailed metrics table
│   ├── data/                 # Mock data
│   │   ├── mockCopilotData.ts       # GitHub Copilot metrics
│   │   └── mockJiraData.ts          # Jira sprint & story data
│   ├── types/                # TypeScript definitions
│   │   └── index.ts
│   ├── utils/                # Helper functions
│   │   └── analytics.ts     # Data processing & calculations
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## 📊 Mock Data Overview

The dashboard uses realistic mock data that simulates:

### GitHub Copilot Metrics
Based on the [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics):
- Suggestion counts and acceptance rates
- Lines suggested vs. accepted
- Chat interactions
- Active user counts
- Individual developer metrics

### Jira Data
Based on Jira REST API v3:
- Sprint information (5 sprints)
- Story points assigned and completed
- Developer assignments
- Completion rates
- Individual issue details

### Data Highlights
- **6 developers** tracked across **5 sprints**
- Progressive Copilot rollout (2 → 4 → 6 developers)
- **Productivity increase**: ~24% average improvement
- **Acceptance rate**: 52% → 80% as developers become proficient
- **Velocity improvement**: 10.3 → 16.2 story points per sprint

## 🎯 Key Metrics Shown

1. **Productivity Increase** - Overall team improvement percentage
2. **Team Adoption** - Number of developers using Copilot
3. **Acceptance Rate** - How often developers accept Copilot suggestions
4. **Average Velocity** - Story points completed per sprint with Copilot

## 🔄 Adapting to Real Data

To connect this dashboard to real APIs:

### For GitHub Copilot Metrics:
1. Replace `src/data/mockCopilotData.ts` with API calls to:
   ```
   GET https://api.github.com/orgs/{org}/copilot/metrics
   ```
2. Use GitHub's official [Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)

### For Jira Data:
1. Replace `src/data/mockJiraData.ts` with API calls to:
   ```
   GET https://your-domain.atlassian.net/rest/api/3/search
   ```
2. Use [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
3. Query for issues with story points and sprint data

### Authentication
Add environment variables for API keys:
```bash
VITE_GITHUB_TOKEN=your_github_token
VITE_JIRA_TOKEN=your_jira_token
```

## 🎨 Customization

### Changing Colors
Edit the color schemes in component files:
- Primary color: `#8b5cf6` (purple)
- Success color: `#10b981` (green)
- Secondary color: `#3b82f6` (blue)

### Adding More Metrics
1. Add new types to `src/types/index.ts`
2. Create mock data or API calls in `src/data/`
3. Add processing logic to `src/utils/analytics.ts`
4. Create new components in `src/components/`
5. Import and use in `src/App.tsx`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demonstration project showing how to combine GitHub Copilot metrics with Jira data. Feel free to:
- Fork the repository
- Add new visualizations
- Integrate with real APIs
- Improve the UI/UX
- Add additional metrics

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Charts by [Recharts](https://recharts.org/)
- Data sources: [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics) & [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

---

**Note**: This dashboard uses mock data for demonstration purposes. For production use, integrate with actual GitHub Copilot Metrics API and Jira REST API endpoints.
