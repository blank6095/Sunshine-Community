import { get } from '@/api/request'

export function getDepartmentList() {
  return get('/departments')
}

export function getDepartmentDetail(id: number) {
  return get(`/departments/${id}`)
}
