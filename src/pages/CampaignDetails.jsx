import { useState, useContext, useEffect, useRef } from "react";
import { useOutletContext, useParams, useLocation, Link } from "react-router";
import { useCampaignDetails, useComments } from "../hooks/useCampaign";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Payment from "../components/Payment";
import DiscussionSection from "../components/DiscussionSection";
import MissionUpdates from "../components/MissionUpdates";
import ShareSection from "../components/ShareSection";
import {
  FiUser, FiCalendar, FiCheckCircle, FiShield, FiLoader,
  FiHeart, FiBookmark, FiAlertTriangle, FiThumbsUp, FiInfo,
  FiMessageSquare,
  FiBell, FiFlag, FiPlay,
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { toggleRecommend, toggleSave, toggleSubscribe, getPlatformSettings } from "../api/campaign";
import axioInstance from "../api/axiosInstance";

const fmtMoney = (n) =>
  "৳" + (n || 0).toLocaleString("en-IN");

const daysLeft = (end) => {
  const d = Math.ceil((new Date(end) - Date.now()) / 86400000);
  return d < 0 ? "Ended" : `${d} day${d !== 1 ? "s" : ""} left`;
};

const timeStr = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Admin Notice Banner ───────────────────────────────────────────────────────
const AdminNoticeBanner = ({ notice }) => {
  if (!notice?.isActive || !notice?.text) return null;
  const colors = {
    warning: "bg-amber-50 border-amber-300 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    danger: "bg-red-50 border-red-300 text-red-800",
  };
  return (
    <div className={`border-l-4 rounded-r-xl px-5 py-4 flex items-start gap-3 mb-4 ${colors[notice.type] || colors.warning}`}>
      <FiAlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wide mb-0.5">Admin Notice</p>
        <p className="text-sm">{notice.text}</p>
      </div>
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const Progress = ({ current, goal }) => {
  const pct = Math.min(Math.round((current / goal) * 100), 100);
  return (
    <div>
      <div className="h-2 bg-[#E5F0EA] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1.5">
        <span className="text-[#2D6A4F]">{pct}% funded</span>
      </div>
    </div>
  );
};

// ── Donor Avatar Row ──────────────────────────────────────────────────────────
const DonorRow = ({ donations = [] }) => {
  const visible = donations.slice(-5).reverse();
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex -space-x-2">
        {visible.map((d, i) => (
          <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[#2D6A4F] flex items-center justify-center text-white text-[9px] font-bold">
            {d.isAnonymous || d.isAnonymousFromAll ? "?" : (d.donorName || d.donor?.name || "?")[0]}
          </div>
        ))}
      </div>
      {donations.length > 0 && (
        <span className="text-[10px] text-gray-500 font-medium">
          {donations.length} kind donor{donations.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function CampaignDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { setAuth } = useOutletContext();
  const qc = useQueryClient();

  const [amount, setAmount] = useState(500);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAnonymousFromAll, setIsAnonymousFromAll] = useState(false);
  const [donorMsg, setDonorMsg] = useState("");
  const [addFee, setAddFee] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("story");

  // Platform settings
  const { data: platformSettings } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: getPlatformSettings,
  });

  // Comments for badge count
  const { data: commentData } = useComments(id, 1);
  const feeMode = platformSettings?.donationFee?.mode || "none";
  const feeType = platformSettings?.donationFee?.type || "percent";
  const feePercent = platformSettings?.donationFee?.percent || 2.5;
  const feeFixed = platformSettings?.donationFee?.fixed || 10;
  const feeLabel = platformSettings?.donationFee?.label || "Support BeingSmile";
  const minDonation = platformSettings?.minimumDonation || 100;

  const feeAmount = feeMode !== "none"
    ? (feeType === "percent" ? Math.round(amount * feePercent / 100) : feeFixed)
    : 0;
  const totalAmount = amount + (feeMode === "forced" || addFee ? feeAmount : 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (location.state?.paymentSuccess) {
      setShowSuccess(true);
      setShowSubscribePrompt(true);
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowSuccess(false), 6000);
    }
  }, [location]);

  const { data, isLoading, isError } = useCampaignDetails(id);
  const campaign = data?.campaign;
  const isCreator = user?.data?._id && campaign?.creator?._id?.toString() === user?.data?._id;
  const isAdmin = user?.data?.role === "admin" || user?.data?.role === "moderator";

  const allImages = campaign ? [campaign.coverImage, ...(campaign.images || [])].filter(Boolean) : [];

  // Engagement mutations
  const recommendMutation = useMutation({
    mutationFn: () => {
      if (!user) { setAuth("login"); throw new Error("Auth"); }
      return toggleRecommend(id);
    },
    onSuccess: (res) => {
      qc.invalidateQueries(["campaign", id]);
      toast.success(res.recommended ? "You recommended this mission! 👍" : "Recommendation removed");
    },
    onError: (e) => { if (e.message !== "Auth") toast.error("Failed"); },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!user) { setAuth("login"); throw new Error("Auth"); }
      return toggleSave(id);
    },
    onSuccess: (res) => {
      qc.invalidateQueries(["campaign", id]);
      toast.success(res.saved ? "Mission saved for later 🔖" : "Removed from saved");
    },
    onError: (e) => { if (e.message !== "Auth") toast.error("Failed"); },
  });

  const subscribeMutation = useMutation({
    mutationFn: () => toggleSubscribe(id, subscribeEmail),
    onSuccess: (res) => {
      qc.invalidateQueries(["campaign", id]);
      setShowSubscribePrompt(false);
      toast.success(res.subscribed ? "You'll receive mission updates! 🔔" : "Unsubscribed from updates");
    },
    onError: () => toast.error("Failed to update subscription"),
  });

  const quickAmounts = [100, 250, 500, 1000, 2500].filter((a) => a >= minDonation);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <FiLoader size={28} className="animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
        <p className="text-sm font-bold text-gray-500">Mission not found</p>
        <Link to="/campaigns/browse" className="text-xs text-[#2D6A4F] underline">Browse all missions</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Mint Header Strip ─────────────────────────────────── */}
      <div className="bg-[#F0FBF4] border-b border-[#D1EAD9] pt-20 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <AdminNoticeBanner notice={campaign.adminNotice} />
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-white border border-[#D1EAD9] text-[#2D6A4F] text-[10px] font-bold rounded-full uppercase">
              {campaign.category}
            </span>
            {campaign.status === "active" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#2D6A4F]">
                <FiCheckCircle size={11} /> Verified Mission
              </span>
            )}
            {campaign.isFeatured && (
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">
                ⭐ Featured
              </span>
            )}
            {campaign.status === "suspended" && (
              <span className="px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-full">
                Suspended
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 max-w-3xl">
            {campaign.title}
          </h1>
          {campaign.tagline && (
            <p className="text-sm text-gray-500 italic mb-3">{campaign.tagline}</p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <FiUser size={12} />
              By <Link to={`/p/${campaign.creator?.slug}`} className="font-bold text-gray-700 hover:text-[#2D6A4F] ml-1">
                {campaign.creatorUsername}
              </Link>
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar size={12} /> {daysLeft(campaign.endDate)}
            </span>
            {campaign.location && (
              <span className="flex items-center gap-1.5">
                📍 {campaign.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image gallery */}
            {allImages.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-[#E5F0EA]">
                <div className="aspect-video bg-[#F8FDFB] relative">
                  <img
                    src={allImages[imgIdx]}
                    className="w-full h-full object-cover"
                    alt={campaign.title}
                  />
                  {campaign.status === "suspended" && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg">Mission Suspended</span>
                    </div>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-2 p-3 bg-[#F8FDFB] border-t border-[#E5F0EA] overflow-x-auto">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          i === imgIdx ? "border-[#2D6A4F]" : "border-transparent"
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats mini-strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Raised", value: fmtMoney(campaign.currentAmount), sub: `of ${fmtMoney(campaign.goalAmount)}` },
                { label: "Donors", value: campaign.donations?.length || 0, sub: "contributions" },
                { label: "Recommended", value: campaign.recommendations?.length || 0, sub: "times" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F8FDFB] border border-[#E5F0EA] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                  <p className="text-[9px] text-gray-300">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="bg-white border border-[#E5F0EA] rounded-xl p-5">
              <Progress current={campaign.currentAmount} goal={campaign.goalAmount} />
              <DonorRow donations={campaign.donations} />
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-[#E5F0EA] sticky top-[60px] bg-white z-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
              {[
                { id: 'story', label: 'Story', icon: <FiHeart size={12} /> },
                { id: 'updates', label: 'Updates', count: campaign.updates?.length || 0, icon: <FiBell size={12} /> },
                { id: 'supporters', label: 'Supporters', count: campaign.donations?.length || 0, icon: <FiUser size={12} /> },
                { id: 'discussion', label: 'Discussion', count: commentData?.total || 0, icon: <FiMessageSquare size={12} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all transition-colors ${
                    activeTab === tab.id ? "text-[#2D6A4F]" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline opacity-70">{tab.icon}</span>
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black leading-none ${
                        activeTab === tab.id ? "bg-[#2D6A4F] text-white shadow-sm" : "bg-gray-100 text-gray-400"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D6A4F] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {activeTab === 'story' && (
                <div className="bg-white border border-[#E5F0EA] rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <FiHeart size={14} /> Mission Story
                  </h2>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                    {campaign.description}
                  </div>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-4">
                   <MissionUpdates
                    updates={campaign.updates || []}
                    pendingUpdates={campaign.pendingUpdates || []}
                    campaignId={id}
                    isCreator={isCreator}
                  />
                </div>
              )}

              {activeTab === 'supporters' && (
                <div className="bg-white border border-[#E5F0EA] rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <FiUser size={14} /> Global Supporters
                  </h2>
                  <div className="space-y-4">
                    {campaign.donations?.length > 0 ? (
                      [...campaign.donations].reverse().map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary border border-emerald-100 shadow-sm font-black text-sm">
                                {d.isAnonymous || d.isAnonymousFromAll ? "?" : (d.donorName || d.donor?.name || "K")[0].toUpperCase()}
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                   {d.isAnonymousFromAll ? "Anonymous Helper" : (d.isAnonymous ? (isCreator ? `${d.donorName} (Privately)` : "Anonymous") : d.donorName || d.donor?.name || "Kind Soul")}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                   {timeStr(d.donatedAt)} {d.message && `• "${d.message}"`}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-primary">৳{d.amount.toLocaleString()}</p>
                             {d.isAnonymous && <p className="text-[8px] font-black text-gray-300 uppercase">Private Contribution</p>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                         <FiHeart className="mx-auto text-gray-100 mb-2" size={48} />
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No contributions yet. Be the first!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <DiscussionSection campaignId={id} setAuth={setAuth} />
              )}
            </div>
          </div>

          {/* RIGHT: Donation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="hidden lg:block">
              <AdminNoticeBanner notice={campaign.adminNotice} />
            </div>

            {/* ── Engagement Actions ──────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => recommendMutation.mutate()}
                disabled={recommendMutation.isPending}
                className={`group flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl border transition-all duration-300 ${
                  campaign.isRecommendedByMe
                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-lg shadow-[#2D6A4F]/20"
                    : "bg-white border-[#E5F0EA] text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F] hover:shadow-sm"
                }`}
              >
                <FiThumbsUp size={16} className={`transition-transform group-hover:scale-110 ${campaign.isRecommendedByMe ? "fill-current" : ""}`} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Recommend</span>
                <span className="text-[9px] font-bold opacity-60">
                   {campaign.recommendations?.length || 0} voices
                </span>
              </button>

              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className={`group flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl border transition-all duration-300 ${
                  campaign.isSavedByMe
                    ? "bg-[#F0FBF4] text-[#2D6A4F] border-[#2D6A4F] shadow-inner"
                    : "bg-white border-[#E5F0EA] text-gray-600 hover:border-[#2D6A4F] hover:text-[#2D6A4F] hover:shadow-sm"
                }`}
              >
                <FiBookmark size={16} className={`transition-transform group-hover:scale-110 ${campaign.isSavedByMe ? "fill-current" : ""}`} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {campaign.isSavedByMe ? "Saved" : "Save Mission"}
                </span>
                <span className="text-[9px] font-bold opacity-60">
                  For later
                </span>
              </button>
            </div>

            {/* ── Donation Card ──────────────────────────────── */}
            {campaign.status === "active" ? (
              <div className="bg-white border border-[#E5F0EA] rounded-xl p-5 space-y-4 sticky top-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Raised</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{fmtMoney(campaign.currentAmount)}</p>
                  <p className="text-xs text-gray-400">of {fmtMoney(campaign.goalAmount)} goal</p>
                  <div className="mt-2">
                    <Progress current={campaign.currentAmount} goal={campaign.goalAmount} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                    <span>{daysLeft(campaign.endDate)}</span>
                    <span>{campaign.donations?.length || 0} donors</span>
                  </div>
                </div>

                {/* Show Success prompt */}
                {showSuccess && (
                  <div className="bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-[#2D6A4F]">🎉 Donation successful!</p>
                    <p className="text-xs text-gray-500 mt-0.5">Thank you for making a difference.</p>
                  </div>
                )}

                {/* Subscribe prompt after payment */}
                {showSubscribePrompt && user && (
                  <div className="bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1.5">
                      <FiBell size={12} /> Stay Updated
                    </p>
                    <p className="text-xs text-gray-500">Would you like to receive updates about this mission?</p>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input type="checkbox" className="accent-[#2D6A4F]" checked={subscribeEmail} onChange={(e) => setSubscribeEmail(e.target.checked)} />
                      Also send me email notifications
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => subscribeMutation.mutate()}
                        className="flex-1 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] transition-colors"
                      >
                        Yes, notify me
                      </button>
                      <button
                        onClick={() => setShowSubscribePrompt(false)}
                        className="px-3 py-2 text-xs text-gray-500 border border-[#E5F0EA] rounded-lg"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Amount Presets */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Choose Amount</p>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAmount(a)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          amount === a
                            ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                            : "bg-white text-gray-700 border-[#E5F0EA] hover:border-[#2D6A4F]"
                        }`}
                      >
                        ৳{a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D6A4F] font-bold text-sm">৳</span>
                    <input
                      type="number"
                      value={amount}
                      min={minDonation}
                      onChange={(e) => setAmount(Math.max(minDonation, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-sm font-bold text-gray-800 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 text-center">Minimum donation: ৳{minDonation}</p>
                </div>

                {/* Platform Fee */}
                {feeMode === "optional_button" && feeAmount > 0 && (
                  <label className="flex items-center gap-2.5 p-3 bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addFee}
                      onChange={(e) => setAddFee(e.target.checked)}
                      className="accent-[#2D6A4F] w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">{feeLabel}</p>
                      <p className="text-[10px] text-gray-400">+৳{feeAmount} to cover platform costs</p>
                    </div>
                  </label>
                )}
                {feeMode === "forced" && feeAmount > 0 && (
                  <div className="flex items-center gap-2.5 p-3 bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl">
                    <FiInfo size={13} className="text-[#2D6A4F] flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      ৳{feeAmount} platform fee included in total
                    </p>
                  </div>
                )}

                {/* Donor Message */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Message <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={donorMsg}
                    onChange={(e) => setDonorMsg(e.target.value.slice(0, 500))}
                    rows={2}
                    placeholder="Leave a kind message..."
                    className="w-full px-3 py-2 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-lg text-xs outline-none resize-none"
                  />
                  <p className="text-[9px] text-gray-300 text-right mt-0.5">{donorMsg.length}/500</p>
                </div>

                {/* Anonymous Options */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Privacy</p>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => {
                        setIsAnonymous(e.target.checked);
                        if (!e.target.checked) setIsAnonymousFromAll(false);
                      }}
                      className="accent-[#2D6A4F] w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Make my donation anonymous to the public</p>
                      <p className="text-[10px] text-gray-400">Your name will be hidden from donors & visitors. The fundraiser and admin can still see you.</p>
                    </div>
                  </label>
                  {isAnonymous && (
                    <label className="flex items-start gap-2 cursor-pointer ml-5">
                      <input
                        type="checkbox"
                        checked={isAnonymousFromAll}
                        onChange={(e) => setIsAnonymousFromAll(e.target.checked)}
                        className="accent-[#2D6A4F] w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Also hide from the fundraiser</p>
                        <p className="text-[10px] text-gray-400">Only BeingSmile admin will know your identity. The fundraiser won't see your name.</p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Total */}
                <div className="bg-[#1B4332] text-white rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-medium">Total</span>
                  <span className="text-lg font-bold">{fmtMoney(totalAmount)}</span>
                </div>

                {/* Donate Button */}
                <Payment
                  campaignId={id}
                  amount={totalAmount}
                  platformFee={feeMode === "forced" || addFee ? feeAmount : 0}
                  isAnonymous={isAnonymous}
                  isAnonymousFromAll={isAnonymousFromAll}
                  donorMessage={donorMsg}
                  campaign={campaign}
                />

                {/* How to donate */}
                <button
                  onClick={() => setShowTutorial((p) => !p)}
                  className="w-full flex items-center justify-center gap-1.5 text-[10px] text-gray-400 hover:text-[#2D6A4F] transition-colors py-1"
                >
                  <FiPlay size={10} /> How to make a donation?
                </button>
                {showTutorial && (
                  <div className="bg-[#F8FDFB] border border-[#E5F0EA] rounded-xl p-3 text-xs text-gray-600 space-y-1.5">
                    {[
                      "1. Choose an amount or enter a custom value",
                      "2. Optionally add a message or mark as anonymous",
                      "3. Click Donate Now — you'll be taken to a secure payment page",
                      "4. Complete payment via bKash, card, or other methods",
                      "5. You'll receive a confirmation and can track your donation",
                    ].map((s) => <p key={s}>{s}</p>)}
                  </div>
                )}

                {/* Policies link */}
                <p className="text-center text-[10px] text-gray-400">
                  By donating you agree to our{" "}
                  <Link to="/terms" className="text-[#2D6A4F] underline">Terms & Policies</Link>
                </p>
              </div>
            ) : (
              <div className="bg-white border border-[#E5F0EA] rounded-xl p-5 text-center">
                <p className="text-sm font-bold text-gray-500 mb-1">
                  {campaign.status === "completed" ? "Mission Completed 🎉" : "Donations Paused"}
                </p>
                <p className="text-xs text-gray-400">
                  {campaign.status === "completed"
                    ? "This mission reached its goal!"
                    : "This mission is currently not accepting donations."}
                </p>
              </div>
            )}

            {/* ── Engagement Actions ──────────────────────────── (Moved up) */}

            {/* Subscribe (if not post-payment) */}
            {!showSubscribePrompt && user && (
              <button
                onClick={() => subscribeMutation.mutate()}
                className={`w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold rounded-xl border transition-all ${
                  campaign.isSubscribed
                    ? "bg-[#F0FBF4] text-[#2D6A4F] border-[#2D6A4F]"
                    : "border-[#E5F0EA] text-gray-500 hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                }`}
              >
                <FiBell size={13} />
                {campaign.isSubscribed ? "Receiving Updates" : "Get Mission Updates"}
              </button>
            )}

            {/* Share */}
            <ShareSection campaignId={id} campaignTitle={campaign.title} />

            {/* Trust badges */}
            <div className="bg-[#1B4332] text-white rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-3">Why Trust BeingSmile?</p>
              {[
                ["🔒", "Secure & verified payments"],
                ["📋", "Every mission is admin reviewed"],
                ["💯", "Transparent fund usage"],
                ["🔔", "Real-time updates to donors"],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2.5 text-xs">
                  <span>{icon}</span>
                  <span className="text-white/80">{text}</span>
                </div>
              ))}
            </div>

            {/* Report */}
            <button className="w-full flex items-center justify-center gap-1.5 text-[10px] text-gray-300 hover:text-red-400 transition-colors py-1">
              <FiFlag size={10} /> Report this mission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
