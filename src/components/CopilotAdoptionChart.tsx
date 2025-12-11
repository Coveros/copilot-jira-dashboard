import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getCopilotAdoption } from '../utils/analytics';
import { useSprintData } from '../contexts/DataContext';

const CopilotAdoptionChart = () => {
  const { sprintData } = useSprintData();
  const data = getCopilotAdoption(sprintData);

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
        Copilot Adoption Over Time
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Team adoption rate and active users
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="sprint" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'adoptionRate') return [`${value.toFixed(0)}%`, 'Adoption Rate'];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar
            yAxisId="left"
            dataKey="developersWithCopilot"
            fill="#8b5cf6"
            name="Developers with Copilot"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="adoptionRate"
            stroke="#10b981"
            strokeWidth={2}
            name="Adoption Rate (%)"
            dot={{ fill: '#10b981', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CopilotAdoptionChart;
