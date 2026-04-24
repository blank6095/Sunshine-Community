import request from '@/utils/request'

export const getDoctors = () => {
  return request.get('/doctors')
}

export const getDoctorById = (id) => {
  return request.get(`/doctors/${id}`)
}

export const createDoctor = (data) => {
  return request.post('/doctors', data)
}

export const updateDoctor = (id, data) => {
  return request.put(`/doctors/${id}`, data)
}

export const deleteDoctor = (id) => {
  return request.delete(`/doctors/${id}`)
}

export const getDoctorsByDepartment = (departmentId) => {
  return request.get(`/doctors/department/${departmentId}`)
}

export const getDoctorsByStatus = (status) => {
  return request.get(`/doctors/status/${status}`)
}
