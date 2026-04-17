import { useParams, Link } from "react-router";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthProvider";
import {
  FiCheckCircle, FiHeart, FiActivity, FiExternalLink,
  FiShare2, FiGlobe, FiLoader, FiShield, FiAlertCircle,
  FiCalendar, FiTrendingUp, FiAward, FiArrowLeft,
  FiUser
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PublicProfile = () => {
  const { slug } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/auth/public/${slug}`);
        setProfileUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F0FBF4] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-[#E5F0EA] border-t-[#2D6A4F] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D6A4F]/60 animate-pulse">Loading profile...</p>
    </div>
  );

  if (!profileUser) return (
    <div className="min-h-screen bg-[#F0FBF4] flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center text-2xl mb-5 border border-red-100">
        <FiAlertCircle />
      </div>
      <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">
        Profile <span className="text-[#2D6A4F]">Not Found</span>
      </h1>
      <p className="text-gray-500 font-medium text-sm mb-6 max-w-sm leading-relaxed">
        This profile doesn't exist or has been set to private.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-[#2D6A4F] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
      >
        <FiArrowLeft size={13} /> Back to Home
      </Link>
    </div>
  );

  const isOwnProfile = currentUser?.data?._id === profileUser._id;
  const isVerified = profileUser.identity?.isVerified;
  const joinedYear = profileUser.createdAt
    ? new Date(profileUser.createdAt).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-[#F0FBF4] pt-14">

      {/* ─── Hero Banner ─────────────────────────────────────── */}
      <div className="relative">
        <div className="h-32 sm:h-44 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-8 left-1/2 w-48 h-48 bg-[#52B788]/15 rounded-full blur-2xl" />
          </div>

          {/* Action Buttons (floating) */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-end gap-2">
            {isOwnProfile && (
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/20"
              >
                <FiUser size={12} /> Edit Profile
              </Link>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 cursor-pointer"
            >
              <FiShare2 size={12} /> Share
            </button>
          </div>
        </div>

        {/* ─── Profile Card floating over banner ─────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-14 sm:-mt-16 bg-white rounded-2xl shadow-lg border border-[#E5F0EA] px-6 sm:px-8 pt-0 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative -mt-8 sm:-mt-10 shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden">
                  {profileUser.avatar ? (
                    <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#EDFAF3] flex items-center justify-center text-3xl font-black text-[#2D6A4F] uppercase">
                      {profileUser.name?.charAt(0)}
                    </div>
                  )}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <FiCheckCircle size={11} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-black text-gray-900 tracking-tight truncate">{profileUser.name}</h1>
                      {isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                          <FiShield size={9} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mt-0.5">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {/* Role Badge */}
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] font-black uppercase tracking-wider rounded-md border border-slate-100">
                           <FiUser size={10} /> {profileUser.role || 'User'}
                        </span>

                        {/* Donor Badge */}
                        {profileUser.metrics?.totalDonated > 0 && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-wider rounded-md border border-rose-100">
                             <FiHeart size={10} className="fill-rose-100" /> Donor
                          </span>
                        )}

                        {/* Fundraiser Badge */}
                        {profileUser.metrics?.campaignCount > 0 && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-wider rounded-md border border-blue-100">
                             <FiActivity size={10} /> Fundraiser
                          </span>
                        )}
                      </div>
                      {joinedYear && (
                        <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                          <FiCalendar size={9} /> Since {joinedYear}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <MiniStat label="Missions" value={profileUser.metrics?.campaignCount || 0} />
                    <MiniStat label="Raised" value={`৳${(profileUser.metrics?.totalRaised || 0).toLocaleString()}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Body Content ──────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — About + Trust */}
          <div className="space-y-5">

            {/* Bio Card */}
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
                <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiActivity size={13} />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Mission Statement</h2>
              </div>
              <div className="p-5">
                {profileUser.bio ? (
                  <blockquote className="text-sm text-gray-700 font-medium leading-relaxed italic border-l-4 border-[#2D6A4F] pl-4">
                    "{profileUser.bio}"
                  </blockquote>
                ) : (
                  <p className="text-sm text-gray-400 italic">This member prefers to let their actions speak.</p>
                )}
              </div>
            </div>

            {/* Trust Status */}
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
                <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiShield size={13} />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Trust Status</h2>
              </div>
              <div className="p-5 space-y-3">
                <TrustRow
                  label="Identity Verified"
                  status={isVerified ? "verified" : "unverified"}
                  icon={<FiShield size={13} />}
                />
                <TrustRow
                  label="Platform Member"
                  status="verified"
                  icon={<FiCheckCircle size={13} />}
                />
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-4 relative z-10">Impact Summary</p>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <ImpactStat label="Donated" value={`৳${(profileUser.metrics?.totalDonated || 0).toLocaleString()}`} />
                <ImpactStat label="Raised" value={`৳${(profileUser.metrics?.totalRaised || 0).toLocaleString()}`} />
                <ImpactStat label="Missions" value={profileUser.metrics?.campaignCount || 0} />
                <ImpactStat label="Member Since" value={joinedYear || "—"} />
              </div>
            </div>
          </div>

          {/* RIGHT — Active Missions */}
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F0F9F4] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                    <FiTrendingUp size={13} />
                  </div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Active Missions</h2>
                </div>
                <Link to="/campaigns/browse" className="text-[10px] font-black uppercase tracking-widest text-[#2D6A4F] hover:underline flex items-center gap-1">
                  Browse All <FiExternalLink size={11} />
                </Link>
              </div>

              <div className="p-5">
                {profileUser.campaigns && profileUser.campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {profileUser.campaigns.map((campaign, i) => (
                      <motion.div
                        key={campaign._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="group"
                      >
                        <Link to={`/campaigns/${campaign._id}`} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-[#F8FDFB] border border-transparent hover:border-[#E5F0EA] transition-all">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F0F9F4]">
                            {campaign.coverImage ? (
                              <img src={campaign.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#2D6A4F]/30">
                                <FiHeart size={20} />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#2D6A4F]/60 mb-0.5">{campaign.category}</p>
                            <h3 className="text-sm font-black text-gray-900 truncate group-hover:text-[#2D6A4F] transition-colors">{campaign.title}</h3>
                            {/* Progress */}
                            <div className="mt-2">
                              <div className="h-1.5 bg-[#F0F9F4] rounded-full overflow-hidden w-full">
                                <div
                                  className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#52B788] rounded-full"
                                  style={{ width: `${Math.min(((campaign.currentAmount || 0) / (campaign.goalAmount || 1)) * 100, 100)}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-gray-400 font-semibold mt-1">
                                ৳{(campaign.currentAmount || 0).toLocaleString()} raised of ৳{(campaign.goalAmount || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <FiExternalLink size={14} className="text-gray-300 group-hover:text-[#2D6A4F] transition-colors shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-gray-300 mx-auto border border-[#E5F0EA]">
                      <FiAward size={22} />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No public missions yet.</p>
                    <Link to="/campaigns/browse" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#2D6A4F] hover:underline">
                      Explore other causes <FiExternalLink size={11} />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* CTA — Support */}
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm p-6 text-center space-y-4">
              <div className="w-10 h-10 bg-[#EDFAF3] text-[#2D6A4F] rounded-xl flex items-center justify-center mx-auto">
                <FiHeart size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                  Support {profileUser.name?.split(' ')[0]}'s Cause
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                  Your contribution can directly change lives. Every amount counts.
                </p>
              </div>
              <Link
                to="/campaigns/browse"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
              >
                <FiHeart size={13} /> Browse Missions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────── */

const MiniStat = ({ label, value }) => (
  <div className="flex flex-col items-center px-3 py-1.5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA]">
    <span className="text-sm font-black text-gray-900 leading-none truncate max-w-[80px]">{value}</span>
    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</span>
  </div>
);

const TrustRow = ({ label, status, icon }) => {
  const ok = status === "verified";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg text-sm ${ok ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-300"}`}>
          {icon}
        </div>
        <p className="text-[11px] font-bold text-gray-700">{label}</p>
      </div>
      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${ok ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
        {status}
      </span>
    </div>
  );
};

const ImpactStat = ({ label, value }) => (
  <div className="bg-white/10 rounded-xl p-3">
    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300/80 mb-1">{label}</p>
    <p className="text-base font-black text-white truncate">{value}</p>
  </div>
);

export default PublicProfile;
