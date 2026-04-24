export const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        backgroundColor: 'var(--color-gray-200)',
        borderRadius: 'var(--radius-md)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
      }}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          style={{
            height: '1rem',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
      }}
    >
      <Skeleton style={{ width: '3rem', height: '3rem', borderRadius: '50%', marginBottom: '1rem' }} />
      <SkeletonText lines={2} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Skeleton style={{ width: '5rem', height: '2rem' }} />
        <Skeleton style={{ width: '4rem', height: '2rem' }} />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={className} style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} style={{ height: '1rem', flex: 1 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
          {Array.from({ length: columns }).map((_, col) => (
            <Skeleton key={col} style={{ height: '1rem', flex: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonTable rows={6} columns={5} />
    </div>
  );
};
