import { NavLink, Outlet, useNavigate } from "react-router";
import { FiGrid, FiFileText, FiUsers, FiDollarSign, FiLogOut, FiHome, FiCheckSquare, FiShield } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data.stats;
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { icon: <FiGrid />, label: "Overview", path: "/admin/overview" },
    { icon: <FiCheckSquare />, label: "Campaign Review", path: "/admin/review" },
    { icon: <FiCheckSquare />, label: "Mission Updates", path: "/admin/pending-updates" },
    { icon: <FiShield />, label: "Verification Review", path: "/admin/verifications" },
    { icon: <FiFileText />, label: "All Campaigns", path: "/admin/campaigns" },
    { icon: <FiUsers />, label: "User Management", path: "/admin/users" },
    { icon: <FiDollarSign />, label: "Payouts Control", path: "/admin/payouts" },
    { icon: <FiFileText />, label: "Transactions", path: "/admin/transactions" },
    { icon: <FiSettings />, label: "Platform Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toast Support */}
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-gray-100">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">B</div>
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase">Being<span className="text-primary">Smile</span></span>
          </NavLink>
          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Admin Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.label === "Campaign Review" && stats?.pendingCampaigns > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-200 animate-pulse">
                  {stats.pendingCampaigns}
                </span>
              )}
              {item.label === "Verification Review" && stats?.pendingVerifications > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-200 animate-pulse">
                  {stats.pendingVerifications}
                </span>
              )}
              {item.label === "Mission Updates" && stats?.pendingUpdates > 0 && (
                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
                  {stats.pendingUpdates}
                </span>
              )}
              {item.label === "Payouts Control" && stats?.pendingWithdrawals > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-amber-200 animate-pulse">
                  {stats.pendingWithdrawals}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
