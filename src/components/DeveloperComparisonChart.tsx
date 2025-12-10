import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getDeveloperComparison } from '../utils/analytics';

const DeveloperComparisonChart = () => {
  const data = getDeveloperComparison();

  // Color scale based on improvement
  const getColor = (improvement: number) => {
    if (improvement >= 40) return '#10b981';
    if (improvement >= 20) return '#34d399';
    if (improvement >= 10) return '#6ee7b7';
    if (improvement >= 0) return '#a7f3d0';
    return '#94a3b8';
  };

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
        Developer Productivity Improvement
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Comparing velocity before and after Copilot adoption
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            type="category"
            dataKey="developer"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'improvement') return [`${value.toFixed(1)}%`, 'Improvement'];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar dataKey="beforeVelocity" fill="#94a3b8" name="Before Copilot" />
          <Bar dataKey="afterVelocity" name="After Copilot">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.improvement)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>
          💡 Darker green indicates higher productivity improvement
        </p>
      </div>
    </div>
  );
};

export default DeveloperComparisonChart;
