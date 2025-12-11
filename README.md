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

### 🌐 GitHub Codespaces (Recommended)

The fastest way to get started is with GitHub Codespaces:

1. Click the **Code** button above
2. Select **Codespaces** tab
3. Click **Create codespace**

The devcontainer will automatically set up everything you need, including Node.js, dependencies, and VS Code extensions. See [QUICKSTART.md](./QUICKSTART.md) for details on using VS Code tasks.

### 💻 Local Development

#### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

#### Installation

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

### Using Real Jira Data

The dashboard now supports fetching live data from the Jira REST API! Follow these steps to configure it:

#### 1. Generate a Jira API Token

1. Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a descriptive name (e.g., "Copilot Dashboard")
4. Copy the generated token (you won't be able to see it again)

#### 2. Find Your Board ID

1. Navigate to your Jira board
2. Look at the URL: `https://your-domain.atlassian.net/secure/RapidBoard.jspa?rapidView=123`
3. The number after `rapidView=` is your board ID (e.g., `123`)

#### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your details:
   ```env
   VITE_USE_LIVE_DATA=true
   VITE_JIRA_BASE_URL=https://your-domain.atlassian.net
   VITE_JIRA_EMAIL=your-email@company.com
   VITE_JIRA_API_TOKEN=your-api-token-here
   VITE_JIRA_BOARD_ID=123
   ```

3. (Optional) Set your story points custom field ID:
   ```env
   VITE_JIRA_STORY_POINTS_FIELD=customfield_10016
   ```
   If not provided, the app will auto-detect it from your board configuration.

#### 4. Restart the Development Server

```bash
npm run dev
```

The dashboard will now fetch live data from your Jira instance!

#### Switching Between Mock and Live Data

To switch back to mock data, simply set:
```env
VITE_USE_LIVE_DATA=false
```

#### CORS Handling

The Vite development server is configured with a proxy to handle CORS issues automatically. In production, you may need to:
- Set up a backend proxy server
- Use serverless functions (Vercel/Netlify)
- Configure your Jira instance to allow CORS from your domain

#### Troubleshooting

**"Could not determine story points field"**
- Manually set `VITE_JIRA_STORY_POINTS_FIELD` in your `.env` file
- Find the field ID by going to Jira Settings → Issues → Custom fields

**"Jira configuration is incomplete"**
- Ensure all required environment variables are set
- Check that your API token is valid
- Verify your base URL format (should start with `https://`)

**"Failed to fetch live data, falling back to mock data"**
- Check browser console for detailed error messages
- Verify your API token has not expired
- Ensure the board ID is correct

### GitHub Copilot Integration

To also integrate GitHub Copilot metrics:

1. **GitHub Copilot Metrics API**
   - Endpoint: `https://api.github.com/orgs/{org}/copilot/metrics`
   - Documentation: [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)
   - Note: Currently not implemented in the data provider, uses mock data

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
- [Jira Software (Agile) REST API](https://developer.atlassian.com/cloud/jira/software/rest/intro/)
- [Jira API Token Authentication](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

## 🏗️ Architecture

### Service Layer

The application includes a service layer for live Jira integration:

- **`src/types/jiraApi.ts`** - TypeScript types for Jira API responses
- **`src/services/jiraClient.ts`** - HTTP client with authentication and caching
- **`src/services/jiraTransformers.ts`** - Transforms Jira data to app types
- **`src/services/dataProvider.ts`** - Abstraction layer for mock/live data switching

### Caching Strategy

To optimize API usage and improve performance:
- Sprint data cached for **5 minutes**
- Board configuration cached for **1 hour**
- Field metadata cached for **1 hour**
- Cache can be cleared manually via `clearCache()` function
