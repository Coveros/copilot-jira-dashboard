import { getDeveloperComparison } from '../utils/analytics';

const DeveloperTable = () => {
  const data = getDeveloperComparison();

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
        Developer Performance Details
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Individual developer metrics and improvements
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Developer
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '12px 8px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Before Copilot
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '12px 8px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Current Velocity
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '12px 8px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Improvement
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '12px 8px',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Acceptance Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((dev, index) => (
              <tr
                key={dev.developer}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                }}
              >
                <td style={{ padding: '12px 8px', fontWeight: 500, color: '#111827' }}>
                  {dev.developer}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: '#6b7280' }}>
                  {dev.beforeVelocity} pts
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: '#111827', fontWeight: 500 }}>
                  {dev.currentVelocity} pts
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: dev.improvement >= 30 ? '#10b981' : dev.improvement >= 15 ? '#3b82f6' : '#6b7280',
                  }}
                >
                  +{dev.improvement.toFixed(1)}%
                </td>
                <td
                  style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    color: '#6b7280',
                  }}
                >
                  {dev.acceptanceRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          <strong>Note:</strong> Velocity measured in story points per sprint. Acceptance rate
          indicates how often developers accept Copilot's suggestions.
        </p>
      </div>
    </div>
  );
};

export default DeveloperTable;
