import { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化时从 localStorage 读取
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);

    if (result && result.code === 200 && result.data && result.data.token) {
      const newToken = result.data.token;
      const newUser = result.data.user;

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
    }

    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user?.role]);

  const isDoctor = useMemo(() => {
    return user?.role === 'DOCTOR';
  }, [user?.role]);

  const isPatient = useMemo(() => {
    return user?.role === 'PATIENT';
  }, [user?.role]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      isDoctor,
      isPatient,
      login,
      logout,
    }),
    [user, token, loading, isAuthenticated, isAdmin, isDoctor, isPatient, login, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export { AuthContext };
