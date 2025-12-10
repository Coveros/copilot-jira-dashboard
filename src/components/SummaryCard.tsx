interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

const SummaryCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
}: SummaryCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 500 }}>
            {title}
          </p>
          <p
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              margin: '0 0 4px 0',
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              fontSize: '36px',
              opacity: 0.6,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              color: getTrendColor(),
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {getTrendIcon()}
          </span>
          <span style={{ color: getTrendColor(), fontSize: '14px', fontWeight: 500 }}>
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
