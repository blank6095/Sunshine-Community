import httpRequest from '@/utils/request'
import type { RequestConfig, ApiResponse } from '@/utils/request/types'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Doctor,
  Department,
  Schedule,
  Appointment,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  UpdateUserRequest,
  CreateUserRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types'

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return httpRequest.post<LoginResponse>('/auth/login', data, { silent: true } as RequestConfig)
}

export const refreshToken = (token: string): Promise<ApiResponse<{ token: string }>> => {
  return httpRequest.post<{ token: string }>('/auth/refresh', { token })
}

export const register = (data: RegisterRequest): Promise<ApiResponse<User>> => {
  return httpRequest.post<User>('/auth/register', data)
}

export const getUsers = (): Promise<ApiResponse<User[]>> => {
  return httpRequest.get<User[]>('/users')
}

export const getUserById = (id: number): Promise<ApiResponse<User>> => {
  return httpRequest.get<User>(`/users/${id}`)
}

export const createUser = (data: CreateUserRequest): Promise<ApiResponse<User>> => {
  return httpRequest.post<User>('/users', data)
}

export const updateUser = (id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
  return httpRequest.put<User>(`/users/${id}`, data)
}

export const deleteUser = (id: number): Promise<ApiResponse<void>> => {
  return httpRequest.delete<void>(`/users/${id}`)
}

export const getDepartments = (): Promise<ApiResponse<Department[]>> => {
  return httpRequest.get<Department[]>('/departments')
}

export const getDepartmentById = (id: number): Promise<ApiResponse<Department>> => {
  return httpRequest.get<Department>(`/departments/${id}`)
}

export const createDepartment = (data: CreateDepartmentRequest): Promise<ApiResponse<Department>> => {
  return httpRequest.post<Department>('/departments', data)
}

export const updateDepartment = (id: number, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> => {
  return httpRequest.put<Department>(`/departments/${id}`, data)
}

export const deleteDepartment = (id: number): Promise<ApiResponse<void>> => {
  return httpRequest.delete<void>(`/departments/${id}`)
}

export const getDoctors = (): Promise<ApiResponse<Doctor[]>> => {
  return httpRequest.get<Doctor[]>('/doctors')
}

export const getDoctorById = (id: number): Promise<ApiResponse<Doctor>> => {
  return httpRequest.get<Doctor>(`/doctors/${id}`)
}

export const createDoctor = (data: CreateDoctorRequest): Promise<ApiResponse<Doctor>> => {
  return httpRequest.post<Doctor>('/doctors', data)
}

export const updateDoctor = (id: number, data: UpdateDoctorRequest): Promise<ApiResponse<Doctor>> => {
  return httpRequest.put<Doctor>(`/doctors/${id}`, data)
}

export const deleteDoctor = (id: number): Promise<ApiResponse<void>> => {
  return httpRequest.delete<void>(`/doctors/${id}`)
}

export const getDoctorsByDepartment = (departmentId: number): Promise<ApiResponse<Doctor[]>> => {
  return httpRequest.get<Doctor[]>(`/doctors/department/${departmentId}`)
}

export const getDoctorsByStatus = (status: string): Promise<ApiResponse<Doctor[]>> => {
  return httpRequest.get<Doctor[]>(`/doctors/status/${status}`)
}

export const getSchedules = (): Promise<ApiResponse<Schedule[]>> => {
  return httpRequest.get<Schedule[]>('/schedules')
}

export const getScheduleById = (id: number): Promise<ApiResponse<Schedule>> => {
  return httpRequest.get<Schedule>(`/schedules/${id}`)
}

export const createSchedule = (data: CreateScheduleRequest): Promise<ApiResponse<Schedule>> => {
  return httpRequest.post<Schedule>('/schedules', data)
}

export const updateSchedule = (id: number, data: UpdateScheduleRequest): Promise<ApiResponse<Schedule>> => {
  return httpRequest.put<Schedule>(`/schedules/${id}`, data)
}

export const deleteSchedule = (id: number): Promise<ApiResponse<void>> => {
  return httpRequest.delete<void>(`/schedules/${id}`)
}

export const getSchedulesByDoctor = (doctorId: number): Promise<ApiResponse<Schedule[]>> => {
  return httpRequest.get<Schedule[]>(`/schedules/doctor/${doctorId}`)
}

export const getSchedulesByDate = (date: string): Promise<ApiResponse<Schedule[]>> => {
  return httpRequest.get<Schedule[]>(`/schedules/date/${date}`)
}

export const getSchedulesByDoctorAndDate = (doctorId: number, date: string): Promise<ApiResponse<Schedule[]>> => {
  return httpRequest.get<Schedule[]>(`/schedules/doctor/${doctorId}/date/${date}`)
}

export const getSchedulesByStatus = (status: string): Promise<ApiResponse<Schedule[]>> => {
  return httpRequest.get<Schedule[]>(`/schedules/status/${status}`)
}

export const getAppointments = (): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>('/appointments')
}

export const getAppointmentById = (id: number): Promise<ApiResponse<Appointment>> => {
  return httpRequest.get<Appointment>(`/appointments/${id}`)
}

export const createAppointment = (data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
  return httpRequest.post<Appointment>('/appointments', data)
}

export const updateAppointment = (id: number, data: UpdateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
  return httpRequest.put<Appointment>(`/appointments/${id}`, data)
}

export const deleteAppointment = (id: number): Promise<ApiResponse<void>> => {
  return httpRequest.delete<void>(`/appointments/${id}`)
}

export const getAppointmentsByPatient = (patientId: number): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>(`/appointments/patient/${patientId}`)
}

export const getAppointmentsByDoctor = (doctorId: number): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>(`/appointments/doctor/${doctorId}`)
}

export const getAppointmentsBySchedule = (scheduleId: number): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>(`/appointments/schedule/${scheduleId}`)
}

export const getAppointmentsByStatus = (status: string): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>(`/appointments/status/${status}`)
}

export const getAppointmentsByPatientAndStatus = (patientId: number, status: string): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>(`/appointments/patient/${patientId}/status/${status}`)
}

export const getAppointmentsByTimeRange = (start: string, end: string): Promise<ApiResponse<Appointment[]>> => {
  return httpRequest.get<Appointment[]>('/appointments/time-range', { params: { start, end } })
}

export const cancelRequest = (url: string) => {
  httpRequest.cancelRequest(url)
}

export const cancelAllRequests = () => {
  httpRequest.cancelAllRequests()
}
