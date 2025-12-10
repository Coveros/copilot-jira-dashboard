import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getVelocityTrend } from '../utils/analytics';

const VelocityTrendChart = () => {
  const data = getVelocityTrend();

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
        Developer Velocity Trend
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Average story points completed per developer
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="sprint" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line
            type="monotone"
            dataKey="withCopilot"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="With Copilot"
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="withoutCopilot"
            stroke="#94a3b8"
            strokeWidth={2}
            name="Without Copilot"
            dot={{ fill: '#94a3b8', r: 4 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VelocityTrendChart;
