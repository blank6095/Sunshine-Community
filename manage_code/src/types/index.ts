export interface User {
  id: number
  username: string
  name: string
  gender: string
  age: number
  phone: string
  email: string
  idCard: string
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  id: number
  userId: number
  userName: string
  userPhone: string
  userEmail: string
  departmentId: number
  departmentName: string
  title: string
  specialty: string
  bio: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: number
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface Schedule {
  id: number
  doctorId: number
  doctorName: string
  departmentId: number
  departmentName: string
  date: string
  startTime: string
  endTime: string
  maxPatients: number
  availableSlots: number
  status: 'ACTIVE' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: number
  patientId: number
  patientName: string
  doctorId: number
  doctorName: string
  departmentName: string
  scheduleId: number
  appointmentTime: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  symptoms: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  username: string
  password: string
  name: string
  gender: string
  age: number
  phone: string
  email?: string
  id_card?: string
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
}

export interface CreateDoctorRequest {
  user: { id: number }
  department: { id: number }
  title: string
  specialty?: string
  bio?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface UpdateDoctorRequest {
  department?: { id: number }
  title?: string
  specialty?: string
  bio?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateScheduleRequest {
  doctor: { id: number }
  date: string
  startTime: string
  endTime: string
  maxPatients: number
  status?: 'ACTIVE' | 'CANCELLED'
}

export interface UpdateScheduleRequest {
  startTime?: string
  endTime?: string
  maxPatients?: number
  status?: 'ACTIVE' | 'CANCELLED'
}

export interface CreateAppointmentRequest {
  patient: { id: number }
  doctor: { id: number }
  schedule: { id: number }
  appointmentTime: string
  symptoms?: string
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

export interface UpdateAppointmentRequest {
  appointmentTime?: string
  symptoms?: string
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

export interface UpdateUserRequest {
  name?: string
  gender?: string
  age?: number
  phone?: string
  email?: string
  idCard?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateUserRequest {
  username: string
  password: string
  name: string
  gender: string
  age: number
  phone: string
  email?: string
  idCard?: string
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT'
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface UpdateDepartmentRequest {
  name?: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
}
