import request from '@/utils/request'

export function getScheduleList() {
  return request({
    url: '/schedules',
    method: 'get'
  })
}

export function getSchedule(id) {
  return request({
    url: '/schedules/' + id,
    method: 'get'
  })
}

export function getSchedulesByDoctor(doctorId) {
  return request({
    url: '/schedules/doctor/' + doctorId,
    method: 'get'
  })
}

export function getSchedulesByDate(date) {
  return request({
    url: '/schedules/date/' + date,
    method: 'get'
  })
}

export function getSchedulesByDoctorAndDate(doctorId, date) {
  return request({
    url: '/schedules/doctor/' + doctorId + '/date/' + date,
    method: 'get'
  })
}

export function getSchedulesByStatus(status) {
  return request({
    url: '/schedules/status/' + status,
    method: 'get'
  })
}

export function addSchedule(data) {
  return request({
    url: '/schedules',
    method: 'post',
    data: data
  })
}

export function updateSchedule(id, data) {
  return request({
    url: '/schedules/' + id,
    method: 'put',
    data: data
  })
}

export function delSchedule(id) {
  return request({
    url: '/schedules/' + id,
    method: 'delete'
  })
}
