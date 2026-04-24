import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 32,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 64,
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = useCallback(() => {
    const errors = {};
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      errors.username = '请输入用户名';
    } else if (trimmedUsername.length < VALIDATION.USERNAME.MIN_LENGTH) {
      errors.username = `用户名至少需要 ${VALIDATION.USERNAME.MIN_LENGTH} 个字符`;
    } else if (trimmedUsername.length > VALIDATION.USERNAME.MAX_LENGTH) {
      errors.username = `用户名不能超过 ${VALIDATION.USERNAME.MAX_LENGTH} 个字符`;
    }

    if (!trimmedPassword) {
      errors.password = '请输入密码';
    } else if (trimmedPassword.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.password = `密码至少需要 ${VALIDATION.PASSWORD.MIN_LENGTH} 个字符`;
    } else if (trimmedPassword.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      errors.password = `密码不能超过 ${VALIDATION.PASSWORD.MAX_LENGTH} 个字符`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(username.trim(), password.trim());

      if (result && result.code === 200) {
        showToast('登录成功！欢迎回来', 'success', 2000);
        navigate('/');
      }
    } catch (err) {
      let errorMessage = '登录失败，请检查用户名和密码';

      if (err) {
        if (err.status === 401) {
          errorMessage = '用户名或密码错误，请重试';
        } else if (err.status === 403) {
          errorMessage = '账号已被禁用，请联系管理员';
        } else if (err.status === 429) {
          errorMessage = '请求过于频繁，请稍后再试';
        } else if (err.status === 500) {
          errorMessage = '服务器异常，请稍后重试';
        } else if (err.message) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
      }

      showToast(errorMessage, 'error', 3000);
      setValidationErrors({ submit: errorMessage });
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm animate-fade-in">
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            智慧医院管理系统
          </h1>
          <p className="text-xs text-gray-500">
            智能挂号预约系统 · 管理端
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="用户名"
              placeholder="请输入用户名"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              error={validationErrors.username}
              required
              disabled={loading}
              maxLength={VALIDATION.USERNAME.MAX_LENGTH}
            />
            <Input
              type="password"
              label="密码"
              placeholder="请输入密码"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              error={validationErrors.password}
              required
              disabled={loading}
              maxLength={VALIDATION.PASSWORD.MAX_LENGTH}
            />
            <Button
              type="primary"
              size="large"
              loading={loading}
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? '正在登录...' : '登录'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              默认账号: <span className="text-gray-600 font-medium">admin</span> / <span className="text-gray-600 font-medium">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
