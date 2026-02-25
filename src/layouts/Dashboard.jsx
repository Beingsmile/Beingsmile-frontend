import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { toast } from 'react-toastify';
import {
  FiUser,
  FiBriefcase,
  FiCreditCard,
  FiHeart,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const navItems = [
    { to: 'profile', label: 'Profile', icon: <FiUser /> },
    { to: 'manage-campaigns', label: 'My Missions', icon: <FiBriefcase /> },
    { to: 'transactions', label: 'Donations', icon: <FiCreditCard /> },
  ];

  return (
    <div className="min-h-screen bg-neutral font-sans">
      <ToastContainer position="bottom-right" />

      {/* Top Dashboard Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <FiHeart className="text-white text-sm" />
              </div>
              <span className="text-base font-black tracking-tight text-gray-900 uppercase font-sans">
                Being<span className="text-primary">Smile</span>
              </span>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${isActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User + Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                  {user?.data?.name || 'Member'}
                </span>
                <span className="text-[10px] text-primary font-bold">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile nav tabs */}
          <div className="sm:hidden flex gap-1 pb-2 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide whitespace-nowrap transition-all ${isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-400 hover:text-gray-700'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;