import request from '@/utils/request'

export const getSchedules = () => {
  return request.get('/schedules')
}

export const getScheduleById = (id) => {
  return request.get(`/schedules/${id}`)
}

export const createSchedule = (data) => {
  return request.post('/schedules', data)
}

export const updateSchedule = (id, data) => {
  return request.put(`/schedules/${id}`, data)
}

export const deleteSchedule = (id) => {
  return request.delete(`/schedules/${id}`)
}

export const getSchedulesByDoctor = (doctorId) => {
  return request.get(`/schedules/doctor/${doctorId}`)
}

export const getSchedulesByDate = (date) => {
  return request.get(`/schedules/date/${date}`)
}

export const getSchedulesByDoctorAndDate = (doctorId, date) => {
  return request.get(`/schedules/doctor/${doctorId}/date/${date}`)
}

export const getSchedulesByStatus = (status) => {
  return request.get(`/schedules/status/${status}`)
}
