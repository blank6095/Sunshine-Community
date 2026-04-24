import { post } from './api';

// 默认模拟用户（用于开发和测试）
const MOCK_USER = {
  id: 1,
  username: 'admin',
  name: '管理员',
  role: 'ADMIN',
  status: 'ACTIVE',
  gender: '男',
  age: 30,
  phone: '13800138000',
  email: 'admin@example.com',
  idCard: '110101199001011234',
  createdAt: '2023-01-01T00:00:00',
  updatedAt: '2023-01-01T00:00:00',
};

export const authService = {
  /**
   * 用户登录
   * API: 2.1 POST /auth/login
   */
  login: async (username, password) => {
    try {
      // 先尝试真实 API
      const result = await post('/auth/login', { username, password });
      // 登录成功后保存本地存储
      if (result && result.data && result.data.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      return result;
    } catch (error) {
      // API 不可用时使用模拟登录
      console.warn('使用模拟登录，因为真实 API 不可用');

      // 验证默认账号
      if (username === 'admin' && password === '123456') {
        const mockToken = 'mock-jwt-token-' + Date.now();

        // 保存到 localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(MOCK_USER));

        // 返回模拟响应（和 API 文档格式一致）
        return {
          code: 200,
          message: '成功',
          data: {
            token: mockToken,
            user: MOCK_USER,
          },
        };
      }

      // 用户名或密码错误
      throw {
        status: 401,
        message: '用户名或密码错误',
      };
    }
  },

  /**
   * 刷新令牌
   * API: 2.2 POST /auth/refresh
   */
  refreshToken: async (token) => {
    try {
      const result = await post('/auth/refresh', { token });
      if (result && result.data && result.data.token) {
        localStorage.setItem('token', result.data.token);
      }
      return result;
    } catch (error) {
      // 模拟刷新
      const newToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', newToken);
      return {
        code: 200,
        message: '成功',
        data: { token: newToken },
      };
    }
  },

  /**
   * 用户注册
   * API: 2.3 POST /auth/register
   */
  register: async (userData) => {
    return await post('/auth/register', userData);
  },

  /**
   * 退出登录
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * 获取当前 token
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};
