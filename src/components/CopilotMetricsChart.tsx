import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockCopilotMetrics } from '../data/mockCopilotData';

const CopilotMetricsChart = () => {
  const data = mockCopilotMetrics.map((metric) => ({
    date: new Date(metric.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    acceptanceRate: Math.round(
      (metric.total_acceptances_count / metric.total_suggestions_count) * 100
    ),
    suggestions: metric.total_suggestions_count,
    activeUsers: metric.total_active_users,
  }));

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
      }}
    >
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#111827' }}>
        Copilot Engagement Metrics
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Suggestion acceptance rates and active usage
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'acceptanceRate') return [`${value}%`, 'Acceptance Rate'];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar dataKey="acceptanceRate" fill="#8b5cf6" name="Acceptance Rate (%)" />
          <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CopilotMetricsChart;
