import { get, post, put, del } from './api';

export const doctorService = {
  /**
   * 获取医生列表
   * API: 5.1 GET /doctors
   */
  getDoctors: async () => {
    return await get('/doctors');
  },

  /**
   * 获取单个医生信息
   * API: 5.2 GET /doctors/{id}
   */
  getDoctorById: async (id) => {
    return await get(`/doctors/${id}`);
  },

  /**
   * 创建新医生
   * API: 5.3 POST /doctors
   */
  createDoctor: async (data) => {
    return await post('/doctors', data);
  },

  /**
   * 更新医生信息
   * API: 5.4 PUT /doctors/{id}
   */
  updateDoctor: async (id, data) => {
    return await put(`/doctors/${id}`, data);
  },

  /**
   * 删除医生
   * API: 5.5 DELETE /doctors/{id}
   */
  deleteDoctor: async (id) => {
    return await del(`/doctors/${id}`);
  },

  /**
   * 按科室获取医生
   * API: 5.6 GET /doctors/department/{departmentId}
   */
  getDoctorsByDepartment: async (departmentId) => {
    return await get(`/doctors/department/${departmentId}`);
  },

  /**
   * 按状态获取医生
   * API: 5.7 GET /doctors/status/{status}
   */
  getDoctorsByStatus: async (status) => {
    return await get(`/doctors/status/${status}`);
  }
};
