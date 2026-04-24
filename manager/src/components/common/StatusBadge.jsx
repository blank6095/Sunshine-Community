import {
  USER_STATUS,
  USER_ROLES,
  APPOINTMENT_STATUS,
  SCHEDULE_STATUS,
} from '../../utils/constants';

const STATUS_MAP = {
  [USER_STATUS.ACTIVE]: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '启用' },
  [USER_STATUS.INACTIVE]: { bg: 'bg-gray-100', text: 'text-gray-500', label: '禁用' },
  [USER_ROLES.ADMIN]: { bg: 'bg-blue-50', text: 'text-blue-700', label: '管理员' },
  [USER_ROLES.DOCTOR]: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '医生' },
  [USER_ROLES.PATIENT]: { bg: 'bg-gray-100', text: 'text-gray-500', label: '患者' },
  [APPOINTMENT_STATUS.PENDING]: { bg: 'bg-amber-50', text: 'text-amber-700', label: '待确认' },
  [APPOINTMENT_STATUS.CONFIRMED]: { bg: 'bg-blue-50', text: 'text-blue-700', label: '已确认' },
  [APPOINTMENT_STATUS.COMPLETED]: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '已完成' },
  [APPOINTMENT_STATUS.CANCELLED]: { bg: 'bg-red-50', text: 'text-red-700', label: '已取消' },
  [SCHEDULE_STATUS.ACTIVE]: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '正常' },
  [SCHEDULE_STATUS.CANCELLED]: { bg: 'bg-gray-100', text: 'text-gray-500', label: '已取消' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_MAP[status] || { bg: 'bg-gray-100', text: 'text-gray-500', label: status };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
