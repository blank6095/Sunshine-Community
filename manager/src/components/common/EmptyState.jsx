import { Inbox, Search, UserPlus, CalendarPlus } from 'lucide-react';

const iconMap = {
  inbox: Inbox,
  search: Search,
  addUser: UserPlus,
  calendar: CalendarPlus,
};

export const EmptyState = ({
  title = 'No data found',
  description = 'Try adjusting your filters or search terms',
  icon = 'inbox',
  action = null,
  className = '',
}) => {
  const Icon = iconMap[icon] || Inbox;

  return (
    <div
      className={`empty-container ${className}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', padding: '2rem', textAlign: 'center' }}
    >
      <div style={{
        width: '3.5rem', height: '3.5rem', background: 'var(--color-gray-100)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
      }}>
        <Icon size={28} style={{ color: 'var(--color-gray-500)' }} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-900)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: action ? '1.5rem' : 0 }}>
          {description}
        </p>
      )}
      {action && action}
    </div>
  );
};
