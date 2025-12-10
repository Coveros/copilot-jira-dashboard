import SummaryCard from './components/SummaryCard';
import VelocityTrendChart from './components/VelocityTrendChart';
import DeveloperComparisonChart from './components/DeveloperComparisonChart';
import CopilotAdoptionChart from './components/CopilotAdoptionChart';
import CopilotMetricsChart from './components/CopilotMetricsChart';
import DeveloperTable from './components/DeveloperTable';
import { getDashboardSummary } from './utils/analytics';
import './App.css';

function App() {
  const summary = getDashboardSummary();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '32px 24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700 }}>
            🚀 Developer Productivity Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
            GitHub Copilot Impact Analysis & Jira Sprint Metrics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <SummaryCard
            title="Productivity Increase"
            value={`${summary.productivityIncrease.toFixed(1)}%`}
            subtitle="Average improvement with Copilot"
            trend="up"
            icon="📈"
          />
          <SummaryCard
            title="Team Adoption"
            value={`${summary.developersWithCopilot}/${summary.totalDevelopers}`}
            subtitle="Developers using Copilot"
            trend="up"
            icon="👥"
          />
          <SummaryCard
            title="Acceptance Rate"
            value={`${summary.averageAcceptanceRate.toFixed(0)}%`}
            subtitle="Copilot suggestions accepted"
            trend="up"
            icon="✅"
          />
          <SummaryCard
            title="Average Velocity"
            value={`${summary.averageVelocityWithCopilot.toFixed(1)}`}
            subtitle="Story points per sprint (with Copilot)"
            trend="up"
            icon="⚡"
          />
        </div>

        {/* Charts Row 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <VelocityTrendChart />
          <CopilotAdoptionChart />
        </div>

        {/* Charts Row 2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <DeveloperComparisonChart />
          <CopilotMetricsChart />
        </div>

        {/* Detailed Table */}
        <DeveloperTable />

        {/* Insights Section */}
        <div
          style={{
            marginTop: '32px',
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            📊 Key Insights
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#4b5563' }}>
            <li>
              <strong>Significant productivity gains:</strong> Developers show an average{' '}
              {summary.productivityIncrease.toFixed(1)}% increase in story points completed after
              adopting Copilot.
            </li>
            <li>
              <strong>High engagement:</strong> With an average acceptance rate of{' '}
              {summary.averageAcceptanceRate.toFixed(0)}%, developers are actively leveraging
              Copilot's suggestions.
            </li>
            <li>
              <strong>Consistent improvement:</strong> Velocity trends show sustained productivity
              gains across all team members post-adoption.
            </li>
            <li>
              <strong>Full team adoption:</strong> All {summary.totalDevelopers} developers are now
              using Copilot, with improving proficiency over time.
            </li>
            <li>
              <strong>ROI validation:</strong> The correlation between Copilot usage and increased
              story point completion demonstrates clear business value.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          <p>
            Data sources: GitHub Copilot Metrics API & Jira REST API v3 | Mock data for
            demonstration purposes
          </p>
          <p style={{ marginTop: '8px' }}>
            Built with React, TypeScript, Vite & Recharts
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
