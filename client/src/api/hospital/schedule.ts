import { get } from '@/api/request'

export function getScheduleList(params?: any) {
  return get('/schedules', params)
}

export function getSchedulesByDoctor(doctorId: number, date?: string) {
  return get('/schedules', { doctorId, date })
}
