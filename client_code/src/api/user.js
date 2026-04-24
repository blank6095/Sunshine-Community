import request from '@/utils/request'

export const getUserList = () => {
  return request.get('/users')
}

export const getUserById = (id) => {
  return request.get(`/users/${id}`)
}

export const updateUser = (id, data) => {
  return request.put(`/users/${id}`, data)
}

export const deleteUser = (id) => {
  return request.delete(`/users/${id}`)
}
