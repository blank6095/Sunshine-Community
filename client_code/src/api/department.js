import request from '@/utils/request'

export const getDepartments = () => {
  return request.get('/departments')
}

export const getDepartmentById = (id) => {
  return request.get(`/departments/${id}`)
}

export const createDepartment = (data) => {
  return request.post('/departments', data)
}

export const updateDepartment = (id, data) => {
  return request.put(`/departments/${id}`, data)
}

export const deleteDepartment = (id) => {
  return request.delete(`/departments/${id}`)
}
