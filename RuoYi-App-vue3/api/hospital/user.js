import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function getUser(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data: data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: data
  })
}

export function delUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
