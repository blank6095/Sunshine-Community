import request from '@/utils/request'

export function getAppointmentList() {
  return request({
    url: '/appointments',
    method: 'get'
  })
}

export function getAppointment(id) {
  return request({
    url: '/appointments/' + id,
    method: 'get'
  })
}

export function getAppointmentsByPatient(patientId) {
  return request({
    url: '/appointments/patient/' + patientId,
    method: 'get'
  })
}

export function getAppointmentsByPatientAndStatus(patientId, status) {
  return request({
    url: '/appointments/patient/' + patientId + '/status/' + status,
    method: 'get'
  })
}

export function getAppointmentsByDoctor(doctorId) {
  return request({
    url: '/appointments/doctor/' + doctorId,
    method: 'get'
  })
}

export function getAppointmentsBySchedule(scheduleId) {
  return request({
    url: '/appointments/schedule/' + scheduleId,
    method: 'get'
  })
}

export function getAppointmentsByStatus(status) {
  return request({
    url: '/appointments/status/' + status,
    method: 'get'
  })
}

export function getAppointmentsByTimeRange(start, end) {
  return request({
    url: '/appointments/time-range',
    method: 'get',
    params: { start, end }
  })
}

export function addAppointment(data) {
  return request({
    url: '/appointments',
    method: 'post',
    data: data
  })
}

export function updateAppointment(id, data) {
  return request({
    url: '/appointments/' + id,
    method: 'put',
    data: data
  })
}

export function cancelAppointment(id) {
  return request({
    url: '/appointments/' + id,
    method: 'delete'
  })
}
