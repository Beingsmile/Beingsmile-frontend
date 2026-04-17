import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import axiosInstance from "../../api/axiosInstance";
import {
  FiShield, FiClock, FiCheckCircle, FiXCircle,
  FiAlertTriangle, FiMail, FiLoader, FiMessageSquare,
  FiArrowLeft
} from "react-icons/fi";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { useSendOTP, useVerifyOTP } from "../../hooks/useAuth";

const AccountStatus = () => {
  const { user, setUser } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [identityRequests, setIdentityRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const sendOtpMutation = useSendOTP();
  const verifyOtpMutation = useVerifyOTP();

  const fetchIdentityHistory = async () => {
    try {
      setIsLoadingRequests(true);
      const res = await axiosInstance.get("/verification/my-requests");
      setIdentityRequests(res.data.requests);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user?.data?.isEmailVerified) fetchIdentityHistory();
  }, [user]);

  const handleSendOTP = async () => {
    try {
      await sendOtpMutation.mutateAsync(user.data.email);
      toast.success("Verification code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOtpMutation.mutateAsync({ email: user.data.email, otp });
      toast.success("Email verified successfully!");
      setUser({ ...user, data: { ...user.data, isEmailVerified: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    }
  };

  if (!user) return null;

  const isSuspended = user.data.status === 'suspended';
  const isEmailUnverified = !user.data.isEmailVerified;
  const latestIdentity = identityRequests[0];

  return (
    <div className="max-w-3xl space-y-5">

      {/* Page Header */}
      <div>
        <Link to="/dashboard/profile" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] mb-3 transition-colors">
          <FiArrowLeft size={12} /> Back to Profile
        </Link>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Account Status</h1>
        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Security & Administrative Center</p>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-400 to-red-600" />
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-md">Restricted</span>
                <h2 className="text-base font-black text-red-900 uppercase tracking-tight mt-1">Account Suspended</h2>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <FiMessageSquare size={11} className="text-red-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Administrative Reason</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic font-medium">
                "{user.data.statusMessage || "Your account has been suspended for violating platform terms."}"
              </p>
            </div>
            <p className="text-red-800/50 text-[9px] font-black uppercase tracking-widest">
              Ref: <span className="font-mono">{user.data.firebaseUid}</span> · Contact support to appeal.
            </p>
          </div>
        </div>
      )}

      {/* Email Verification */}
      <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
        <div className={`h-1 ${isEmailUnverified ? "bg-amber-400" : "bg-emerald-500"}`} />
        <div className="p-6">
          {isEmailUnverified ? (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Confirm Your Email</h2>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                    Verify <span className="text-gray-700 font-black">{user.data.email}</span> to unlock full access
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full sm:w-36 px-4 py-3 bg-[#F8FDFB] rounded-xl text-center text-lg font-black tracking-[0.4em] text-[#2D6A4F] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 outline-none transition-all font-mono"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || verifyOtpMutation.isPending}
                  className="flex-1 bg-[#2D6A4F] text-white font-black uppercase tracking-widest text-[11px] rounded-xl px-6 py-3 shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {verifyOtpMutation.isPending ? <FiLoader className="animate-spin mx-auto" /> : "Verify Account"}
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={sendOtpMutation.isPending}
                  className="px-4 py-3 border border-[#E5F0EA] text-gray-500 font-black uppercase tracking-widest text-[10px] rounded-xl hover:border-[#2D6A4F]/30 hover:text-[#2D6A4F] transition-all cursor-pointer"
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FiCheckCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Email Verified</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{user.data.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                Confirmed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Identity Verification */}
      {!isEmailUnverified && (
        <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0F9F4] flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center text-sm">
              <FiShield size={14} />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Identity Verification</h3>
          </div>
          <div className="p-6">
            {!latestIdentity ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-[#F8FDFB] rounded-xl flex items-center justify-center text-gray-300 mx-auto border border-[#E5F0EA]">
                  <FiShield size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase">Not Submitted</h4>
                  <p className="text-[10px] font-semibold text-gray-400 mt-1 max-w-xs mx-auto">
                    Verification unlocks campaign creation and community trust badges.
                  </p>
                </div>
                <Link
                  to="/dashboard/profile"
                  className="inline-block px-5 py-2 bg-[#2D6A4F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] shadow-sm shadow-[#2D6A4F]/20 transition-all"
                >
                  Start Verification
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Latest Record */}
                {(() => {
                  const s = latestIdentity.status;
                  const styles = {
                    approved: { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <FiCheckCircle className="text-emerald-600" size={20} /> },
                    rejected: { bar: "bg-red-400", chip: "bg-red-50 text-red-600 border-red-100", icon: <FiXCircle className="text-red-500" size={20} /> },
                    pending: { bar: "bg-amber-400", chip: "bg-amber-50 text-amber-700 border-amber-100", icon: <FiClock className="text-amber-600 animate-pulse" size={20} /> },
                  }[s] || { bar: "bg-gray-300", chip: "bg-gray-50 text-gray-500 border-gray-100", icon: <FiClock size={20} /> };

                  return (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#F8FDFB] border border-[#E5F0EA]">
                      <div className="w-10 h-10 bg-white rounded-xl border border-[#E5F0EA] flex items-center justify-center shrink-0">
                        {styles.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${styles.chip}`}>{s}</span>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{latestIdentity.identityType} Validation</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold">ID: {latestIdentity._id.slice(-8).toUpperCase()}</p>
                      </div>
                      {s === 'rejected' && (
                        <Link
                          to="/dashboard/profile"
                          className="px-4 py-2 bg-white text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all shrink-0"
                        >
                          Retry
                        </Link>
                      )}
                    </div>
                  );
                })()}

                {latestIdentity.adminMessage && (
                  <div className="p-4 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] italic text-gray-600 text-sm leading-relaxed flex gap-3">
                    <FiMessageSquare size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 not-italic mb-1">Moderator Feedback</p>
                      "{latestIdentity.adminMessage}"
                    </div>
                  </div>
                )}

                {/* History */}
                {identityRequests.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Previous Attempts</p>
                    {identityRequests.slice(1).map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <FiClock size={13} className="text-gray-300" />
                          <div>
                            <p className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{req.identityType}</p>
                            <p className="text-[9px] text-gray-400 font-semibold">{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase text-gray-400 border border-gray-200 px-2 py-0.5 rounded-md">{req.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatus;
