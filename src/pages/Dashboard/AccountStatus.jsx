import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import axiosInstance from "../../api/axiosInstance";
import { 
    FiShield, FiClock, FiCheckCircle, FiXCircle, 
    FiAlertTriangle, FiMail, FiLock, FiChevronRight, 
    FiArrowLeft, FiLoader, FiMessageSquare 
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSendOTP, useVerifyOTP } from "../../hooks/useAuth";

const AccountStatus = () => {
    const { user, setUser } = useContext(AuthContext);
    const [otp, setOtp] = useState("");
    const [identityRequests, setIdentityRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const navigate = useNavigate();

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
        if (user?.data?.isEmailVerified) {
            fetchIdentityHistory();
        }
    }, [user]);

    const handleSendOTP = async () => {
        try {
            await sendOtpMutation.mutateAsync(user.data.email);
            toast.success("Verification code sent to your email!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send code");
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await verifyOtpMutation.mutateAsync({ email: user.data.email, otp });
            toast.success("Email verified successfully!");
            // Update local user state
            setUser({
                ...user,
                data: { ...user.data, isEmailVerified: true }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid code");
        }
    };

    if (!user) return null;

    const isSuspended = user.data.status === 'suspended';
    const isEmailUnverified = !user.data.isEmailVerified;
    const latestIdentity = identityRequests[0];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] mb-2 transition-colors">
                        <FiArrowLeft /> Back to Profile
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                        Account <span className="text-[#2D6A4F]">Status</span>
                    </h1>
                    <p className="text-[#2D6A4F]/60 text-[10px] font-black uppercase tracking-widest mt-1">Security & Administrative Center</p>
                </div>
            </header>

            {/* 1. Account Suspension Alert */}
            {isSuspended && (
                <div className="bg-red-50 rounded-2xl p-8 border border-red-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <FiAlertTriangle size={120} className="text-red-500" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-200">
                            <FiXCircle /> Restricted Access
                        </div>
                        <h2 className="text-2xl font-black text-red-900 uppercase tracking-tight">Your account is suspended</h2>
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-red-100 shadow-sm">
                             <h3 className="text-[9px] font-black uppercase text-red-400 mb-2 flex items-center gap-2 tracking-widest">
                                <FiMessageSquare /> Administrative Reason
                             </h3>
                             <p className="text-gray-700 font-bold leading-relaxed text-base italic">
                                "{user.data.statusMessage || "Your account has been suspended for violating our platform terms."}"
                             </p>
                        </div>
                        <p className="text-red-800/60 text-[9px] font-black uppercase tracking-widest max-w-xl">
                            Reference ID: <span className="font-mono">{user.data.firebaseUid}</span> • Contact Support to appeal.
                        </p>
                    </div>
                </div>
            )}

            {/* 2. Email Verification Section */}
            {isEmailUnverified ? (
                <div className="bg-white rounded-2xl p-8 border border-[#E5F0EA] shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-24 h-24 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-4xl text-[#2D6A4F] border border-[#E5F0EA] shadow-inner">
                            <FiMail />
                        </div>
                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Confirm Your <span className="text-[#2D6A4F]">Email</span></h2>
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider max-w-md">Verification code sent to <span className="text-gray-900 font-black">{user.data.email}</span></p>
                            
                            <div className="flex flex-col md:flex-row gap-3 pt-3">
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="px-6 py-3.5 bg-[#F8FDFB] rounded-xl text-center text-xl font-black tracking-[0.4em] text-[#2D6A4F] border border-[#E5F0EA] focus:border-[#2D6A4F]/30 outline-none w-full md:w-40 transition-all font-mono"
                                />
                                <button 
                                    onClick={handleVerifyOTP}
                                    disabled={otp.length !== 6 || verifyOtpMutation.isPending}
                                    className="flex-1 bg-[#2D6A4F] text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-8 shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {verifyOtpMutation.isPending ? <FiLoader className="animate-spin mx-auto" /> : "Verify Account"}
                                </button>
                            </div>
                            <button 
                                onClick={handleSendOTP}
                                disabled={sendOtpMutation.isPending}
                                className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] transition-colors flex items-center gap-2 mt-2"
                            >
                                {sendOtpMutation.isPending ? "Sending code..." : "Resend code"} <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl text-green-500 border border-green-100 shadow-sm group-hover:scale-110 transition-transform">
                            <FiCheckCircle />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-green-900 uppercase tracking-tight">Primary Auth Secured</h3>
                            <p className="text-green-700/60 text-[9px] font-black uppercase tracking-widest mt-0.5">{user.data.email}</p>
                        </div>
                    </div>
                    <div className="hidden md:block px-3 py-1 bg-white rounded-lg text-[8px] font-black uppercase text-green-600 border border-green-100 tracking-wider">
                        Email Integrity: 100%
                    </div>
                </div>
            )}

            {/* 3. Identity Verification Status */}
            {!isEmailUnverified && (
                <div className="bg-white rounded-2xl p-8 border border-[#E5F0EA] shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                        <FiShield className="text-[#2D6A4F]" /> Identity Verification Record
                    </h3>
                    
                    {!latestIdentity ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-14 h-14 bg-[#F8FDFB] rounded-xl flex items-center justify-center text-gray-200 mx-auto border border-[#E5F0EA]">
                                <FiShield size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase">No Submissions Found</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verification unlocks platform features and community trust.</p>
                            </div>
                            <Link to="/dashboard/profile" className="inline-block px-5 py-2.5 bg-[#2D6A4F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] shadow-lg shadow-[#2D6A4F]/10 transition-all">Start Verification</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Latest Identity Card */}
                            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 items-center ${latestIdentity.status === 'approved' ? 'bg-green-50/50 border-green-100' : latestIdentity.status === 'rejected' ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'}`}>
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm ${latestIdentity.status === 'approved' ? 'bg-white text-green-500' : latestIdentity.status === 'rejected' ? 'bg-white text-red-500' : 'bg-white text-amber-500'}`}>
                                    {latestIdentity.status === 'approved' ? <FiCheckCircle /> : latestIdentity.status === 'rejected' ? <FiXCircle /> : <FiClock />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${latestIdentity.status === 'approved' ? 'bg-green-500 text-white' : latestIdentity.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {latestIdentity.status}
                                        </span>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{latestIdentity.identityType} Validation</p>
                                    </div>
                                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">ID: {latestIdentity._id.slice(-8).toUpperCase()}</p>
                                </div>
                                {latestIdentity.status === 'rejected' && (
                                    <Link to="/dashboard/profile" className="px-5 py-3 bg-white text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 shadow-sm hover:bg-red-500 hover:text-white transition-all">Fix & Retry</Link>
                                )}
                            </div>

                            {latestIdentity.adminMessage && (
                                <div className="p-5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] italic text-gray-600 text-sm leading-relaxed">
                                   <div className="flex items-center gap-2 mb-2 not-italic">
                                        <FiMessageSquare size={12} className="text-[#2D6A4F]" />
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Moderator Feedback</span>
                                   </div>
                                   "{latestIdentity.adminMessage}"
                                </div>
                            )}

                            {identityRequests.length > 1 && (
                                <div className="pt-4 space-y-2.5">
                                     <p className="text-[9px] font-black uppercase text-gray-400 ml-1 tracking-widest">Previous Attempts</p>
                                     {identityRequests.slice(1).map((req, idx) => (
                                         <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-300"><FiClock size={14} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{req.identityType}</p>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase">{new Date(req.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-black uppercase text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md">{req.status}</span>
                                         </div>
                                     ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountStatus;
