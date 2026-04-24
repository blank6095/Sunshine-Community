import { get, post, put, del } from './api';

export const scheduleService = {
  /**
   * 获取排班列表
   * API: 6.1 GET /schedules
   */
  getSchedules: async () => {
    return await get('/schedules');
  },

  /**
   * 获取单个排班信息
   * API: 6.2 GET /schedules/{id}
   */
  getScheduleById: async (id) => {
    return await get(`/schedules/${id}`);
  },

  /**
   * 创建排班
   * API: 6.3 POST /schedules
   */
  createSchedule: async (data) => {
    return await post('/schedules', data);
  },

  /**
   * 更新排班
   * API: 6.4 PUT /schedules/{id}
   */
  updateSchedule: async (id, data) => {
    return await put(`/schedules/${id}`, data);
  },

  /**
   * 删除排班
   * API: 6.5 DELETE /schedules/{id}
   */
  deleteSchedule: async (id) => {
    return await del(`/schedules/${id}`);
  },

  /**
   * 按医生获取排班
   * API: 6.6 GET /schedules/doctor/{doctorId}
   */
  getSchedulesByDoctor: async (doctorId) => {
    return await get(`/schedules/doctor/${doctorId}`);
  },

  /**
   * 按日期获取排班
   * API: 6.7 GET /schedules/date/{date}
   */
  getSchedulesByDate: async (date) => {
    return await get(`/schedules/date/${date}`);
  },

  /**
   * 按医生和日期获取排班
   * API: 6.8 GET /schedules/doctor/{doctorId}/date/{date}
   */
  getSchedulesByDoctorAndDate: async (doctorId, date) => {
    return await get(`/schedules/doctor/${doctorId}/date/${date}`);
  },

  /**
   * 按状态获取排班
   * API: 6.9 GET /schedules/status/{status}
   */
  getSchedulesByStatus: async (status) => {
    return await get(`/schedules/status/${status}`);
  }
};
