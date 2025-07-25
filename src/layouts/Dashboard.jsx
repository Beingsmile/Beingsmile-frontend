import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiBriefcase, 
  FiUsers, 
  FiCreditCard, 
  FiBarChart2, 
  FiPieChart, 
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiLogOut
} from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme'; // Custom hook for theme management

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Assuming you have a theme context/hook

  const menuItems = [
    { path: 'profile', name: 'Profile', icon: <FiUser /> },
    { path: 'manage-campaigns', name: 'Campaigns', icon: <FiBriefcase /> },
    { path: 'manage-users', name: 'Users', icon: <FiUsers /> },
    { path: 'transactions', name: 'Transactions', icon: <FiCreditCard /> },
    { path: 'reports', name: 'Reports', icon: <FiBarChart2 /> },
    { path: 'analytics', name: 'Analytics', icon: <FiPieChart /> },
    { path: 'verify-requests', name: 'Verify Requests', icon: <FiCheckCircle /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white"><a href="/">Beingsmile</a></h1>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      location.pathname.includes(item.path)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom section with theme toggle and logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <FiSun className="mr-3" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <FiMoon className="mr-3" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
            >
              <FiLogOut className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg font-medium text-gray-800 dark:text-white">
            {menuItems.find(item => location.pathname.includes(item.path))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      <ToastContainer position="bottom-right" theme={theme} />
    </div>
  );
};

export default Dashboard;