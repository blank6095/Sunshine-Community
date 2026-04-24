export const BASE_URL = 'http://localhost:8080/api/v1';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  DEPARTMENTS: '/departments',
  DOCTORS: '/doctors',
  SCHEDULES: '/schedules',
  APPOINTMENTS: '/appointments',
  STATISTICS: '/statistics',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const SCHEDULE_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const GENDER_OPTIONS = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: '管理员' },
  { value: 'DOCTOR', label: '医生' },
  { value: 'PATIENT', label: '患者' },
];

export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '启用' },
  { value: 'INACTIVE', label: '禁用' },
];

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: '待确认' },
  { value: 'CONFIRMED', label: '已确认' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
];

export const SCHEDULE_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '正常' },
  { value: 'CANCELLED', label: '已取消' },
];
