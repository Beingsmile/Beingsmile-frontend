import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import {
  FiUser, FiMail, FiPhone, FiEdit,
  FiCheckCircle, FiXCircle, FiShield, FiChevronRight,
  FiClock, FiAward, FiEye, FiHash, FiActivity, FiHeart
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EditProfile from "../components/EditProfile";
import { Link } from "react-router";
import RequestVerification from "../components/RequestVerification";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  const fetchVerificationStatus = async () => {
    try {
      setIsStatusLoading(true);
      const res = await axiosInstance.get("/verification/my-requests");
      setVerificationRequests(res.data.requests);
    } catch (err) {
      console.error("Failed to fetch verification status");
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchVerificationStatus();
  }, [user]);

  const pendingRequest = verificationRequests.find(r => r.status === 'pending');

  if (!user) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#EDFAF3] rounded-2xl flex items-center justify-center text-[#2D6A4F] text-2xl mx-auto">
          <FiShield />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Access Restricted</h2>
        <Link to="/login" className="inline-block bg-[#2D6A4F] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all">
          Sign In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* ─── Two Column Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT — Identity + Bio */}
        <div className="xl:col-span-2 space-y-5">

          {/* Identity Card */}
          <SectionCard title="Core Identity" icon={<FiUser />}>
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Role Badge */}
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                <FiUser size={12} /> {user.data?.role || 'User'}
              </span>

              {/* Donor Badge */}
              {user.data?.metrics?.totalDonated > 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100 animate-in fade-in zoom-in duration-500">
                  <FiHeart size={12} className="fill-rose-100" /> Donor
                </span>
              )}

              {/* Fundraiser Badge */}
              {user.data?.metrics?.campaignCount > 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 animate-in fade-in zoom-in duration-500">
                  <FiActivity size={12} /> Fundraiser
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField label="Legal Name" value={user.data?.name} sub="Verified display name" />
              <InfoField label="Email" value={user.email} sub="Primary contact" />
              <InfoField label="Phone" value={user.data?.phoneNumber || "—"} sub="Secure line" />
              <InfoField label="Profile ID" value={`BS-${user.data?._id?.slice(-6).toUpperCase()}`} sub="Platform identifier" />
            </div>
            <div className="pt-3 border-t border-[#F0F9F4] flex flex-wrap gap-2 mt-1">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2D6A4F] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/20 cursor-pointer"
              >
                <FiEdit size={12} /> Edit Identity
              </button>
              <Link
                to={`/p/${user.data?.slug || user.data?._id}`}
                className="flex items-center gap-2 px-4 py-2 border border-[#E5F0EA] text-gray-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-[#2D6A4F]/30 hover:text-[#2D6A4F] transition-all"
              >
                <FiEye size={12} /> Public Profile
              </Link>
            </div>
          </SectionCard>

          {/* Mission Statement */}
          <SectionCard title="Mission Statement" icon={<FiActivity />}>
            {user.data?.bio ? (
              <blockquote className="text-gray-700 font-medium leading-relaxed text-sm p-4 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] italic">
                "{user.data.bio}"
              </blockquote>
            ) : (
              <div className="p-6 bg-[#F8FDFB] rounded-xl border border-dashed border-[#E5F0EA] text-center space-y-2">
                <p className="text-gray-400 text-sm font-medium">Your bio is empty.</p>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-[#2D6A4F] text-[11px] font-black uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1 mx-auto"
                >
                  Add your mission <FiChevronRight size={12} />
                </button>
              </div>
            )}
          </SectionCard>

          {/* Quick Access Links */}
          <SectionCard title="Quick Access" icon={<FiChevronRight />}>
            <div className="space-y-1">
              <AccessRow icon={<FiEdit />} label="Edit Personal Information" onClick={() => setIsEditModalOpen(true)} />
              <AccessRow icon={<FiEye />} label="View Public Profile" to={`/p/${user.data?.slug || user.data?._id}`} />
              <AccessRow icon={<FiClock />} label="Donation History" to="/dashboard/donations" />
              <AccessRow icon={<FiHash />} label="Account Status" to="/dashboard/account-status" />
            </div>
          </SectionCard>
        </div>

        {/* RIGHT — Trust + Security */}
        <div className="space-y-5">

          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6" />
            <div className="relative z-10 space-y-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-1">Platform Status</p>
                <h3 className="text-2xl font-black tracking-tight">Trust Center</h3>
              </div>

              <div className="space-y-3">
                <TrustRow
                  label="Identity Verified"
                  status={user.data?.identity?.isVerified ? "verified" : (pendingRequest ? "pending" : "incomplete")}
                  icon={<FiShield size={14} />}
                />
                <TrustRow
                  label="Email Confirmed"
                  status={user?.emailVerified ? "verified" : "incomplete"}
                  icon={<FiMail size={14} />}
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                {!user.data?.identity?.isVerified ? (
                  pendingRequest ? (
                    <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                      <FiClock className="text-amber-300 shrink-0 animate-pulse" size={18} />
                      <p className="text-xs font-bold text-emerald-100 leading-snug">
                        Documents under review. Est. 24h.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsVerifyModalOpen(true)}
                      className="w-full bg-white text-[#1B4332] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] hover:shadow-lg transition-all cursor-pointer"
                    >
                      Apply for Verified Badge
                    </button>
                  )
                ) : (
                  <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 border border-emerald-400/20">
                    <FiAward className="text-emerald-300 shrink-0" size={18} />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-50">Identity Verified ✓</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <SectionCard title="Activity Stats" icon={<FiActivity />}>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Missions" value={user.data?.campaignCount ?? 0} color="green" />
              <StatBox label="Role" value={user.data?.role || "Supporter"} color="blue" text />
              <StatBox
                label="Since"
                value={user.data?.createdAt
                  ? new Date(user.data.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                  : '—'}
                color="purple" text
              />
              <StatBox label="Status" value={user.data?.status || "Active"} color="emerald" text />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EditProfile onClose={() => setIsEditModalOpen(false)} />
          </motion.div>
        )}
        {isVerifyModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RequestVerification
              onClose={() => setIsVerifyModalOpen(false)}
              onSubmitted={() => {
                setIsVerifyModalOpen(false);
                fetchVerificationStatus();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Shared UI ─────────────────────────────────────────────── */

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="px-6 py-4 border-b border-[#F0F9F4] flex items-center gap-2.5">
      <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center text-sm">
        {icon}
      </div>
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoField = ({ label, value, sub }) => (
  <div className="p-3.5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] hover:border-[#C8EDDA] hover:bg-white transition-all duration-200 group">
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D6A4F]/60 mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-900 truncate">{value || "—"}</p>
    {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

const TrustRow = ({ label, status, icon }) => {
  const ok = status === "verified";
  const pending = status === "pending";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${ok ? "bg-emerald-400 text-[#1B4332]" : "bg-white/10 text-white/60"}`}>
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/50">{label}</p>
          <p className={`text-xs font-black uppercase ${ok ? "text-emerald-300" : pending ? "text-amber-300" : "text-white/40"}`}>
            {status}
          </p>
        </div>
      </div>
      {ok ? <FiCheckCircle className="text-emerald-400" size={15} /> : <FiXCircle className="text-white/20" size={15} />}
    </div>
  );
};

const AccessRow = ({ icon, label, to, onClick }) => {
  const content = (
    <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#F8FDFB] border border-transparent hover:border-[#E5F0EA] transition-all group cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 group-hover:text-[#2D6A4F] transition-colors text-sm">{icon}</span>
        <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
      </div>
      <FiChevronRight className="text-gray-300 group-hover:text-[#2D6A4F] transform group-hover:translate-x-0.5 transition-all" size={14} />
    </div>
  );
  if (to) return <Link to={to} className="block">{content}</Link>;
  return <div onClick={onClick}>{content}</div>;
};

const StatBox = ({ label, value, color, text }) => {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
    emerald: "bg-teal-50 text-teal-700",
  };
  return (
    <div className={`rounded-xl p-3 ${colors[color]}`}>
      <p className={`${text ? "text-xs" : "text-2xl"} font-black leading-tight truncate`}>{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">{label}</p>
    </div>
  );
};

export default Profile;
