import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export enum RequestErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  USER_NOT_FOUND = 1001,
  PASSWORD_ERROR = 1002,
  USERNAME_EXISTS = 1003,
  PHONE_EXISTS = 1004,
  ID_CARD_EXISTS = 1005,
  EMAIL_EXISTS = 1006,
  DEPT_NOT_FOUND = 2001,
  DEPT_NAME_EXISTS = 2002,
  DOCTOR_NOT_FOUND = 3001,
  NOT_DOCTOR = 3002,
  SCHEDULE_NOT_FOUND = 4001,
  SCHEDULE_CANCELLED = 4002,
  SCHEDULE_FULL = 4003,
  APPOINTMENT_NOT_FOUND = 5001,
  APPOINTMENT_COMPLETED = 5002,
  APPOINTMENT_CANCELLED = 5003,
  APPOINTMENT_EXPIRED = 5004,
  NETWORK_ERROR = 10001,
  TIMEOUT = 10002,
  REQUEST_CANCELLED = 10003,
  RETRY_FAILED = 10004,
}

export const RequestErrorMessage: Record<number, string> = {
  [RequestErrorCode.BAD_REQUEST]: '请求参数错误',
  [RequestErrorCode.UNAUTHORIZED]: '未授权，请重新登录',
  [RequestErrorCode.FORBIDDEN]: '禁止访问',
  [RequestErrorCode.NOT_FOUND]: '请求的资源不存在',
  [RequestErrorCode.METHOD_NOT_ALLOWED]: '请求方法不支持',
  [RequestErrorCode.SERVER_ERROR]: '服务器内部错误',
  [RequestErrorCode.SERVICE_UNAVAILABLE]: '服务暂时不可用',
  [RequestErrorCode.USER_NOT_FOUND]: '用户名或密码错误',
  [RequestErrorCode.PASSWORD_ERROR]: '密码不正确',
  [RequestErrorCode.USERNAME_EXISTS]: '用户名已被注册',
  [RequestErrorCode.PHONE_EXISTS]: '手机号码已被注册',
  [RequestErrorCode.ID_CARD_EXISTS]: '身份证号已被注册',
  [RequestErrorCode.EMAIL_EXISTS]: '邮箱已被注册',
  [RequestErrorCode.DEPT_NOT_FOUND]: '科室不存在',
  [RequestErrorCode.DEPT_NAME_EXISTS]: '科室名称已被使用',
  [RequestErrorCode.DOCTOR_NOT_FOUND]: '医生不存在',
  [RequestErrorCode.NOT_DOCTOR]: '该用户不是医生角色',
  [RequestErrorCode.SCHEDULE_NOT_FOUND]: '排班不存在',
  [RequestErrorCode.SCHEDULE_CANCELLED]: '排班已取消',
  [RequestErrorCode.SCHEDULE_FULL]: '排班预约人数已达上限',
  [RequestErrorCode.APPOINTMENT_NOT_FOUND]: '预约不存在',
  [RequestErrorCode.APPOINTMENT_COMPLETED]: '预约已完成，无法操作',
  [RequestErrorCode.APPOINTMENT_CANCELLED]: '预约已取消，无法操作',
  [RequestErrorCode.APPOINTMENT_EXPIRED]: '预约时间已过，无法操作',
  [RequestErrorCode.NETWORK_ERROR]: '网络错误，请检查网络连接',
  [RequestErrorCode.TIMEOUT]: '请求超时，请稍后重试',
  [RequestErrorCode.REQUEST_CANCELLED]: '请求已取消',
  [RequestErrorCode.RETRY_FAILED]: '重试失败，请稍后重试',
}

export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  retryCount?: number
  retryDelay?: number
  silent?: boolean
  roleHeader?: string
}

export interface RequestInstance {
  get: <T>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>
  post: <T>(url: string, data?: any, config?: RequestConfig) => Promise<ApiResponse<T>>
  put: <T>(url: string, data?: any, config?: RequestConfig) => Promise<ApiResponse<T>>
  delete: <T>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>
  request: <T>(config: RequestConfig) => Promise<ApiResponse<T>>
  cancelRequest: (url: string) => void
  cancelAllRequests: () => void
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface LoadingState {
  pending: number
  loading: boolean
}

export interface SecurityConfig {
  enableXSSProtection?: boolean
  enableCSRFProtection?: boolean
  csrfTokenKey?: string
  csrfHeaderName?: string
}

export const DEFAULT_RETRY_COUNT = 3
export const DEFAULT_RETRY_DELAY = 1000
export const DEFAULT_TIMEOUT = 30000
export const MAX_RETRY_COUNT = 5
export const MAX_RETRY_DELAY = 10000
