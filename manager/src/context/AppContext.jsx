import { createContext, useCallback, useMemo, useState, useContext } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
    }),
    [sidebarCollapsed, toggleSidebar]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext };

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
