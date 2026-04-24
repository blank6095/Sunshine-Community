import { get, post, put, del } from './api';

export const appointmentService = {
  /**
   * 获取预约列表
   * API: 7.1 GET /appointments
   */
  getAppointments: async () => {
    return await get('/appointments');
  },

  /**
   * 获取单个预约信息
   * API: 7.2 GET /appointments/{id}
   */
  getAppointmentById: async (id) => {
    return await get(`/appointments/${id}`);
  },

  /**
   * 创建新预约
   * API: 7.3 POST /appointments
   */
  createAppointment: async (data) => {
    return await post('/appointments', data);
  },

  /**
   * 更新预约
   * API: 7.4 PUT /appointments/{id}
   */
  updateAppointment: async (id, data) => {
    return await put(`/appointments/${id}`, data);
  },

  /**
   * 取消预约 (删除)
   * API: 7.5 DELETE /appointments/{id}
   */
  cancelAppointment: async (id) => {
    return await del(`/appointments/${id}`);
  },

  /**
   * 按患者获取预约
   * API: 7.6 GET /appointments/patient/{patientId}
   */
  getAppointmentsByPatient: async (patientId) => {
    return await get(`/appointments/patient/${patientId}`);
  },

  /**
   * 按医生获取预约
   * API: 7.7 GET /appointments/doctor/{doctorId}
   */
  getAppointmentsByDoctor: async (doctorId) => {
    return await get(`/appointments/doctor/${doctorId}`);
  },

  /**
   * 按排班获取预约
   * API: 7.8 GET /appointments/schedule/{scheduleId}
   */
  getAppointmentsBySchedule: async (scheduleId) => {
    return await get(`/appointments/schedule/${scheduleId}`);
  },

  /**
   * 按状态获取预约
   * API: 7.9 GET /appointments/status/{status}
   */
  getAppointmentsByStatus: async (status) => {
    return await get(`/appointments/status/${status}`);
  },

  /**
   * 按患者和状态获取预约
   * API: 7.10 GET /appointments/patient/{patientId}/status/{status}
   */
  getAppointmentsByPatientAndStatus: async (patientId, status) => {
    return await get(`/appointments/patient/${patientId}/status/${status}`);
  },

  /**
   * 按时间范围获取预约
   * API: 7.11 GET /appointments/time-range?start=&end=
   */
  getAppointmentsByTimeRange: async (start, end) => {
    return await get('/appointments/time-range', { start, end });
  }
};
