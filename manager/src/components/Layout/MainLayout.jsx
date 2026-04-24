import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

const MainLayout = ({ children }) => {
  const { sidebarCollapsed, toggleSidebar } = useApp();

  const handleMenuClick = () => {
    toggleSidebar();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 ease min-h-screen ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <Header onMenuClick={handleMenuClick} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
