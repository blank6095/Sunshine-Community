import { get, post, put, del } from './api';

export const userService = {
  /**
   * 获取用户列表
   * API: 3.1 GET /users
   */
  getUsers: async (params = {}) => {
    return await get('/users', params);
  },

  /**
   * 获取单个用户信息
   * API: 3.2 GET /users/{id}
   */
  getUserById: async (id) => {
    return await get(`/users/${id}`);
  },

  /**
   * 创建新用户
   * API: 3.3 POST /users
   */
  createUser: async (userData) => {
    return await post('/users', userData);
  },

  /**
   * 更新用户信息
   * API: 3.4 PUT /users/{id}
   */
  updateUser: async (id, userData) => {
    return await put(`/users/${id}`, userData);
  },

  /**
   * 删除用户
   * API: 3.5 DELETE /users/{id}
   */
  deleteUser: async (id) => {
    return await del(`/users/${id}`);
  }
};
