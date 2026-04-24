import { get, post, put, del } from './api';

export const departmentService = {
  /**
   * 获取科室列表
   * API: 4.1 GET /departments
   */
  getDepartments: async () => {
    return await get('/departments');
  },

  /**
   * 获取单个科室信息
   * API: 4.2 GET /departments/{id}
   */
  getDepartmentById: async (id) => {
    return await get(`/departments/${id}`);
  },

  /**
   * 创建新科室
   * API: 4.3 POST /departments
   */
  createDepartment: async (data) => {
    return await post('/departments', data);
  },

  /**
   * 更新科室信息
   * API: 4.4 PUT /departments/{id}
   */
  updateDepartment: async (id, data) => {
    return await put(`/departments/${id}`, data);
  },

  /**
   * 删除科室
   * API: 4.5 DELETE /departments/{id}
   */
  deleteDepartment: async (id) => {
    return await del(`/departments/${id}`);
  }
};
