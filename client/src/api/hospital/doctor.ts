import { get } from '@/api/request'

export function getDoctorList(params?: any) {
  return get('/doctors', params)
}

export function getDoctorDetail(id: number) {
  return get(`/doctors/${id}`)
}

export function getDoctorsByDepartment(departmentId: number) {
  return get('/doctors', { departmentId })
}
