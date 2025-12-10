# 🚀 Copilot-Jira Productivity Dashboard

An interactive dashboard that demonstrates developer productivity improvements by combining **GitHub Copilot metrics** with **Jira story point data**. This application visualizes the correlation between Copilot adoption and increased developer velocity.

![React](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7.2-purple)

## 📊 Overview

This dashboard combines metrics from two key sources:
- **GitHub Copilot Metrics API** - Developer engagement, suggestion acceptance rates, and active usage
- **Jira REST API** - Story points, sprint velocity, and developer completion rates

The application uses **mock data** to demonstrate how these metrics can be combined to show measurable productivity improvements when developers adopt GitHub Copilot.

## ✨ Features

- 📈 **Productivity Metrics** - Track story point completion before and after Copilot adoption
- 👥 **Developer Comparison** - Individual performance analysis with improvement percentages
- 📊 **Velocity Trends** - Visualize team velocity changes over multiple sprints
- 🤖 **Copilot Engagement** - Monitor suggestion acceptance rates and active usage
- 📉 **Adoption Tracking** - See how Copilot adoption grows across the team
- 📋 **Detailed Analytics** - Comprehensive data tables with individual developer metrics

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **Recharts** - Data visualization
- **date-fns** - Date handling

## 📦 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Coveros/copilot-jira-dashboard.git
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
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📂 Project Structure

```
copilot-jira-dashboard/
├── src/
│   ├── components/        # React components
│   │   ├── SummaryCard.tsx
│   │   ├── VelocityTrendChart.tsx
│   │   ├── DeveloperComparisonChart.tsx
│   │   ├── CopilotAdoptionChart.tsx
│   │   ├── CopilotMetricsChart.tsx
│   │   └── DeveloperTable.tsx
│   ├── data/              # Mock data
│   │   ├── mockCopilotData.ts
│   │   └── mockJiraData.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── analytics.ts
│   ├── App.tsx            # Main application
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Customization

### Using Real Data

To integrate with real GitHub Copilot and Jira APIs:

1. **GitHub Copilot Metrics API**
   - Endpoint: `https://api.github.com/orgs/{org}/copilot/metrics`
   - Documentation: [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)

2. **Jira REST API v3**
   - Base URL: `https://your-domain.atlassian.net/rest/api/3/`
   - Documentation: [Jira Platform REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)

Replace the mock data in `src/data/` with API calls to these endpoints.

### Mock Data

The mock data represents:
- **6 developers** across 5 sprints
- **Phased Copilot rollout** (2 → 4 → 6 developers)
- **24% average productivity increase** with Copilot
- **70% average acceptance rate** for Copilot suggestions

## 📊 Key Insights from Mock Data

- Developers with Copilot complete **24% more story points** on average
- Average Copilot suggestion acceptance rate: **70%**
- Team velocity increased from **62 points** to **95 points** over 5 sprints
- 100% of the team adopted Copilot by Sprint 3

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 📚 Additional Documentation

- [DASHBOARD_README.md](./DASHBOARD_README.md) - Detailed dashboard documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## 🔗 API References

- [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28)
- [Jira Platform REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
