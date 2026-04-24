import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCog,
  CalendarClock,
  CalendarCheck,
  BarChart3,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '首页仪表盘' },
  { path: '/users', icon: Users, label: '用户管理' },
  { path: '/departments', icon: Building2, label: '科室管理' },
  { path: '/doctors', icon: UserCog, label: '医生管理' },
  { path: '/schedules', icon: CalendarClock, label: '排班管理' },
  { path: '/appointments', icon: CalendarCheck, label: '预约管理' },
  { path: '/statistics', icon: BarChart3, label: '统计报表' },
];

const Sidebar = ({ collapsed = false }) => {
  return (
    <aside className={`h-screen bg-gray-800 flex flex-col fixed left-0 top-0 z-[100] transition-all duration-300 ease ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className={`h-16 flex items-center border-b border-gray-700 ${collapsed ? 'px-3' : 'px-6'}`}>
        <span className="text-2xl mr-3 flex-shrink-0">🏥</span>
        <span className={`text-white font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'text-lg w-auto opacity-100'}`}>
          智慧医院
        </span>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'px-4' : 'px-6'} py-3 no-underline transition-all duration-200 border-l-[3px] ${
                isActive
                  ? 'text-primary bg-primary/10 border-primary'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border-transparent'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
