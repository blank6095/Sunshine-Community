import request from '@/utils/request'

export const getAppointments = () => {
  return request.get('/appointments')
}

export const getAppointmentById = (id) => {
  return request.get(`/appointments/${id}`)
}

export const createAppointment = (data) => {
  return request.post('/appointments', data)
}

export const updateAppointment = (id, data) => {
  return request.put(`/appointments/${id}`, data)
}

export const deleteAppointment = (id) => {
  return request.delete(`/appointments/${id}`)
}

export const getAppointmentsByPatient = (patientId) => {
  return request.get(`/appointments/patient/${patientId}`)
}

export const getAppointmentsByDoctor = (doctorId) => {
  return request.get(`/appointments/doctor/${doctorId}`)
}

export const getAppointmentsBySchedule = (scheduleId) => {
  return request.get(`/appointments/schedule/${scheduleId}`)
}

export const getAppointmentsByStatus = (status) => {
  return request.get(`/appointments/status/${status}`)
}

export const getAppointmentsByPatientAndStatus = (patientId, status) => {
  return request.get(`/appointments/patient/${patientId}/status/${status}`)
}

export const getAppointmentsByTimeRange = (start, end) => {
  return request.get('/appointments/time-range', { params: { start, end } })
}
