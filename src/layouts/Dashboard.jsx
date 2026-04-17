import { useContext, useState, useRef } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../contexts/AuthProvider';
import { toast } from 'react-toastify';
import {
  FiUser, FiBriefcase, FiCreditCard, FiHeart,
  FiLogOut, FiBookmark, FiShield, FiCheckCircle,
  FiCamera, FiSettings, FiUpload, FiMaximize2, FiX, FiDollarSign
} from 'react-icons/fi';
import profile from '../assets/user.png';
import EditProfile from '../components/EditProfile';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

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
    { to: 'saved-campaigns', label: 'Saved', icon: <FiBookmark /> },
    { to: 'donations', label: 'Donations', icon: <FiCreditCard /> },
  ];

  // Add Wallet tab for all authenticated users to ensure accessibility
  navItems.push({ to: 'wallet', label: 'My Wallet', icon: <FiDollarSign /> });

  const isVerified = user?.data?.identity?.isVerified;
  const joinedYear = user?.data?.createdAt
    ? new Date(user.data.createdAt).getFullYear()
    : null;

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    try {
      setAvatarUploading(true);
      setAvatarMenuOpen(false);
      const base64 = await toBase64(file);
      const res = await axiosInstance.put('/users/profile/avatar', { avatarUrl: base64 });
      if (res.data.success) {
        setUser(prev => ({ ...prev, data: { ...prev.data, avatar: base64 } }));
        toast.success('Profile photo updated!');
      }
    } catch (err) {
      toast.error('Failed to update photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBF4] font-sans">
      <ToastContainer position="bottom-right" />

      {/* ─── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788] relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-1/4 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-4 left-1/2 w-40 h-40 bg-[#52B788]/20 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg group-hover:bg-white/30 transition-all border border-white/20">
                <FiHeart className="text-white text-sm" />
              </div>
              <span className="text-sm font-black tracking-tight text-white uppercase">
                Being<span className="text-[#B7E4C7]">Smile</span>
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white/80 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 cursor-pointer"
            >
              <FiLogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* ─── Profile Card overlapping banner ─────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl shadow-lg shadow-emerald-900/8 border border-[#E5F0EA] px-6 sm:px-8 pt-0 pb-5">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 pt-0">

              {/* ─── Avatar with click menu ────────────────────── */}
              <div className="relative -mt-8 sm:-mt-10 shrink-0">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden relative group cursor-pointer"
                  onClick={() => setAvatarMenuOpen(v => !v)}
                >
                  {avatarUploading ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={user?.data?.avatar || profile}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FiCamera className="text-white drop-shadow-md" size={18} />
                  </div>
                </div>

                {/* Verified badge */}
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                    <FiCheckCircle size={11} className="text-white" />
                  </div>
                )}

                {/* Avatar action dropdown */}
                {avatarMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setAvatarMenuOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#E5F0EA] z-40 overflow-hidden">
                      <button
                        onClick={() => { setAvatarMenuOpen(false); fileInputRef.current?.click(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-gray-700 hover:bg-[#F8FDFB] hover:text-[#2D6A4F] transition-all cursor-pointer"
                      >
                        <FiUpload size={13} /> Upload New Photo
                      </button>
                      <button
                        onClick={() => { setAvatarMenuOpen(false); setLightboxOpen(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-gray-700 hover:bg-[#F8FDFB] hover:text-[#2D6A4F] transition-all cursor-pointer border-t border-[#F0F9F4]"
                      >
                        <FiMaximize2 size={13} /> View Full Photo
                      </button>
                    </div>
                  </>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name + Meta */}
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight truncate">
                        {user?.data?.name || 'Humanitarian'}
                      </h1>
                      {isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                          <FiShield size={9} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5 truncate">
                      {user?.email}
                      {joinedYear && (
                        <span className="ml-3 text-[#2D6A4F]/60">· Member since {joinedYear}</span>
                      )}
                    </p>
                  </div>

                  {/* Stats + Edit */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatChip label="Role" value={user?.data?.role || 'Supporter'} />
                    <StatChip label="Missions" value={user?.data?.campaignCount ?? 0} />
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/30 cursor-pointer"
                    >
                      <FiSettings size={11} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Tab Navigation ───────────────────────────────── */}
            <div className="mt-5 pt-4 border-t border-[#F0F9F4]">
              <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${isActive
                        ? 'bg-[#EDFAF3] text-[#2D6A4F] border border-[#C8EDDA]'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Page Content ─────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-7 pb-20">
        <Outlet />
      </main>

      {/* ─── Edit Profile Modal ────────────────────────────────── */}
      {isEditOpen && (
        <EditProfile onClose={() => setIsEditOpen(false)} />
      )}

      {/* ─── Avatar Lightbox ───────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:text-gray-900 transition-colors z-10 cursor-pointer"
            >
              <FiX size={15} />
            </button>
            <img
              src={user?.data?.avatar || profile}
              alt="Profile"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const StatChip = ({ label, value }) => (
  <div className="flex flex-col items-center px-3 py-1.5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA]">
    <span className="text-base font-black text-gray-900 leading-none">{value}</span>
    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</span>
  </div>
);

export default Dashboard;