import request from '@/utils/request'

export function getDoctorList() {
  return request({
    url: '/doctors',
    method: 'get'
  })
}

export function getDoctor(id) {
  return request({
    url: '/doctors/' + id,
    method: 'get'
  })
}

export function getDoctorsByDepartment(departmentId) {
  return request({
    url: '/doctors/department/' + departmentId,
    method: 'get'
  })
}

export function getDoctorsByStatus(status) {
  return request({
    url: '/doctors/status/' + status,
    method: 'get'
  })
}

export function addDoctor(data) {
  return request({
    url: '/doctors',
    method: 'post',
    data: data
  })
}

export function updateDoctor(id, data) {
  return request({
    url: '/doctors/' + id,
    method: 'put',
    data: data
  })
}

export function delDoctor(id) {
  return request({
    url: '/doctors/' + id,
    method: 'delete'
  })
}
