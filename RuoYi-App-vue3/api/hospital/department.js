import request from '@/utils/request'

export function getDepartmentList() {
  return request({
    url: '/departments',
    method: 'get'
  })
}

export function getDepartment(id) {
  return request({
    url: '/departments/' + id,
    method: 'get'
  })
}

export function addDepartment(data) {
  return request({
    url: '/departments',
    method: 'post',
    data: data
  })
}

export function updateDepartment(id, data) {
  return request({
    url: '/departments/' + id,
    method: 'put',
    data: data
  })
}

export function delDepartment(id) {
  return request({
    url: '/departments/' + id,
    method: 'delete'
  })
}
