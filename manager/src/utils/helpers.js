import {
  USER_ROLES,
  USER_STATUS,
  APPOINTMENT_STATUS,
  SCHEDULE_STATUS,
} from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return '-';
  return timeString;
};

export const getUserRoleName = (role) => {
  const map = {
    [USER_ROLES.ADMIN]: '管理员',
    [USER_ROLES.DOCTOR]: '医生',
    [USER_ROLES.PATIENT]: '患者',
  };
  return map[role] || role;
};

export const getUserStatusName = (status) => {
  const map = {
    [USER_STATUS.ACTIVE]: '启用',
    [USER_STATUS.INACTIVE]: '禁用',
  };
  return map[status] || status;
};

export const getAppointmentStatusName = (status) => {
  const map = {
    [APPOINTMENT_STATUS.PENDING]: '待确认',
    [APPOINTMENT_STATUS.CONFIRMED]: '已确认',
    [APPOINTMENT_STATUS.COMPLETED]: '已完成',
    [APPOINTMENT_STATUS.CANCELLED]: '已取消',
  };
  return map[status] || status;
};

export const getScheduleStatusName = (status) => {
  const map = {
    [SCHEDULE_STATUS.ACTIVE]: '正常',
    [SCHEDULE_STATUS.CANCELLED]: '已取消',
  };
  return map[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    [USER_STATUS.ACTIVE]: 'success',
    [USER_STATUS.INACTIVE]: 'default',
    [USER_ROLES.ADMIN]: 'primary',
    [USER_ROLES.DOCTOR]: 'success',
    [USER_ROLES.PATIENT]: 'default',
    [APPOINTMENT_STATUS.PENDING]: 'warning',
    [APPOINTMENT_STATUS.CONFIRMED]: 'primary',
    [APPOINTMENT_STATUS.COMPLETED]: 'success',
    [APPOINTMENT_STATUS.CANCELLED]: 'danger',
    [SCHEDULE_STATUS.ACTIVE]: 'success',
    [SCHEDULE_STATUS.CANCELLED]: 'default',
  };
  return colorMap[status] || 'default';
};

export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const parseResponse = (response) => {
  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }
  return response.json().then((data) => {
    const error = new Error(data.message || '请求失败');
    error.code = data.code;
    error.status = response.status;
    throw error;
  });
};
