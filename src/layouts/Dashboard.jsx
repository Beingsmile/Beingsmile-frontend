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
  FiBookmark,
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
    { to: 'saved-campaigns', label: 'Saved Missions', icon: <FiBookmark /> },
    { to: 'transactions', label: 'Donations', icon: <FiCreditCard /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FDFB] font-sans">
      <ToastContainer position="bottom-right" />

      {/* Top Dashboard Header */}
      <header className="bg-white border-b border-[#E5F0EA] sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 group transition-all">
              <div className="p-1.5 bg-[#2D6A4F] rounded-lg group-hover:scale-110 transition-transform">
                <FiHeart className="text-white text-[13px]" />
              </div>
              <span className="text-base font-black tracking-tight text-gray-900 uppercase">
                Being<span className="text-[#2D6A4F]">Smile</span>
              </span>
            </Link>

            {/* Nav Tabs - Desktop */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${isActive
                      ? 'bg-[#2D6A4F] text-white shadow-lg shadow-[#2D6A4F]/20'
                      : 'text-gray-500 hover:text-[#2D6A4F] hover:bg-[#F0FBF4]'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* User + Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                  {user?.data?.name || 'Member'}
                </span>
                <span className="text-[10px] text-[#2D6A4F] font-bold mt-1 opacity-80">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile nav tabs */}
          <div className="md:hidden flex gap-1.5 pb-2.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${isActive
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-gray-400 border border-transparent hover:text-gray-700'
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;