import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import {
  FiPlus, FiGlobe, FiLoader, FiChevronRight,
  FiHash, FiTrendingUp, FiUsers, FiRss
} from "react-icons/fi";
import { Link } from "react-router";
import { motion } from "framer-motion";

const MyMissions = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading } = useQuery({
    queryKey: ["myMissions", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get("/campaigns/my-missions");
      return res.data;
    },
    enabled: !!user,
  });

  const missions = data?.campaigns || [];

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-72 gap-3">
      <div className="w-10 h-10 border-4 border-[#E5F0EA] border-t-[#2D6A4F] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D6A4F]/60 animate-pulse">Loading missions...</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">My Missions</h1>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
            {missions.length} active mission{missions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/campaigns/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/20 group"
        >
          <FiPlus size={14} className="group-hover:rotate-90 transition-transform" />
          New Mission
        </Link>
      </div>

      {/* Card Grid / Empty */}
      {missions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-dashed border-[#E5F0EA] p-16 text-center space-y-5"
        >
          <div className="w-16 h-16 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-[#2D6A4F]/20 mx-auto border border-[#E5F0EA]">
            <FiGlobe size={32} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">No Missions Yet</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">
              Start your first humanitarian mission and make a difference today.
            </p>
          </div>
          <Link
            to="/campaigns/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
          >
            <FiPlus size={13} /> Create Mission
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {missions.map((mission, index) => (
            <MissionCard key={mission._id} mission={mission} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const MissionCard = ({ mission, index }) => {
  const pct = Math.min(Math.round((mission.currentAmount / mission.goalAmount) * 100), 100);

  const statusColors = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={mission.coverImage}
          alt={mission.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${statusColors[mission.status] || "bg-gray-100 text-gray-600"} backdrop-blur-sm`}>
          {mission.status}
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <Link
            to={`/campaigns/${mission._id}`}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg flex items-center justify-center hover:bg-white hover:text-[#2D6A4F] transition-all shadow-sm text-xs"
            title="View"
          >
            <FiGlobe size={13} />
          </Link>
          <Link
            to={`/dashboard/mission-settings/${mission._id}`}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg flex items-center justify-center hover:bg-white hover:text-[#2D6A4F] transition-all shadow-sm text-xs"
            title="Settings"
          >
            <FiHash size={13} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Category + Title */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-[#2D6A4F]/60 mb-1 flex items-center gap-1">
            <FiHash size={9} /> {mission.category}
          </p>
          <h3 className="text-sm font-black text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2D6A4F] transition-colors">
            {mission.title}
          </h3>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#2D6A4F]">৳{mission.currentAmount?.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-gray-400">{pct}% of ৳{mission.goalAmount?.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-[#F0F9F4] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#52B788] rounded-full"
            />
          </div>
        </div>

        {/* Stats Row + Link */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F9F4] mt-auto">
          <div className="flex items-center gap-3">
            <MiniStat icon={<FiUsers size={11} />} value={mission.donationCount || 0} label="Gifts" />
            <MiniStat icon={<FiRss size={11} />} value={mission.updateCount || 0} label="Updates" />
          </div>
          <Link
            to={`/dashboard/mission-settings/${mission._id}`}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#2D6A4F] hover:gap-2 transition-all"
          >
            Manage <FiChevronRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const MiniStat = ({ icon, value, label }) => (
  <div className="flex items-center gap-1 text-gray-400">
    {icon}
    <span className="text-xs font-black text-gray-900">{value}</span>
    <span className="text-[9px] font-bold text-gray-400">{label}</span>
  </div>
);

export default MyMissions;
