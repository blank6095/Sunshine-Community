import { get, post, put } from '@/api/request'

export function createAppointment(data: any) {
  return post('/appointments', data)
}

export function getAppointmentList(params?: any) {
  return get('/appointments', params)
}

export function getAppointmentDetail(id: number) {
  return get(`/appointments/${id}`)
}

export function cancelAppointment(id: number) {
  return put(`/appointments/${id}/cancel`)
}
