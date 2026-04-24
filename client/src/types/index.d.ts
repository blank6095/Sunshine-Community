export interface UserInfo {
  id: number
  username: string
  realName: string
  phone: string
  idCard: string
}

export interface Department {
  id: number
  name: string
  desc: string
}

export interface Doctor {
  id: number
  name: string
  title: string
  departmentId: number
  specialty: string
  description: string
}

export interface Schedule {
  id: number
  doctorId: number
  date: string
  period: string
  slotsTotal: number
  slotsAvailable: number
}

export interface Appointment {
  id: number
  userId: number
  doctorId: number
  scheduleId: number
  patientName: string
  patientPhone: string
  status: string
  createTime: string
}
