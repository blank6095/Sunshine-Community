import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ROLE_MAP = {
  ADMIN: '管理员',
  DOCTOR: '医生',
  PATIENT: '患者',
};

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-[50]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="bg-transparent border-0 p-2 cursor-pointer text-gray-600 flex items-center rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
        <span className="text-lg font-semibold text-gray-900">智慧医院挂号预约系统 - 管理端</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            {getInitials(user?.name)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{user?.name || '用户'}</div>
            <div className="text-xs text-gray-500">{ROLE_MAP[user?.role] || user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 border-0 rounded-md cursor-pointer text-sm font-medium hover:bg-red-100 transition-colors duration-200"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </header>
  );
};

export default Header;
