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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary mb-2 transition-colors">
                        <FiArrowLeft /> Back to Profile
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        Account <span className="text-primary">Status Center</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Manage your identity, security, and administrative alerts.</p>
                </div>
            </header>

            {/* 1. Account Suspension Alert (Highest Priority) */}
            {isSuspended && (
                <div className="bg-red-50 rounded-[2.5rem] p-10 border-4 border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiAlertTriangle size={120} className="text-red-500" />
                    </div>
                    <div className="relative z-10 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-200">
                            <FiXCircle /> Account Suspended
                        </div>
                        <h2 className="text-3xl font-black text-red-900 uppercase tracking-tight">Access Restricted</h2>
                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border border-red-100">
                             <h3 className="text-[10px] font-black uppercase text-red-400 mb-3 flex items-center gap-2 tracking-widest">
                                <FiMessageSquare /> Official Admin Message
                             </h3>
                             <p className="text-gray-700 font-medium italic leading-relaxed text-lg">
                                "{user.data.statusMessage || "Your account has been suspended for violating our terms of service."}"
                             </p>
                        </div>
                        <p className="text-red-800/60 text-[10px] font-bold uppercase tracking-widest max-w-xl">
                            If you believe this is a mistake, please contact our support team with your reference ID: {user.data.firebaseUid}
                        </p>
                    </div>
                </div>
            )}

            {/* 2. Email Verification Section */}
            {isEmailUnverified ? (
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-32 h-32 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-5xl text-primary border-4 border-primary/10 shadow-inner">
                            <FiMail />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Confirm Your <span className="text-primary">Email</span></h2>
                            <p className="text-gray-500 font-medium max-w-md">We sent a 6-digit code to <span className="text-gray-900 font-black">{user.data.email}</span>. Please verify it to unlock full platform access.</p>
                            
                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="px-6 py-4 bg-neutral rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-primary border-2 border-transparent focus:border-primary/20 outline-none w-full md:w-48 transition-all"
                                />
                                <button 
                                    onClick={handleVerifyOTP}
                                    disabled={otp.length !== 6 || verifyOtpMutation.isPending}
                                    className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl px-8 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {verifyOtpMutation.isPending ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Confirm Verification"}
                                </button>
                            </div>
                            <button 
                                onClick={handleSendOTP}
                                disabled={sendOtpMutation.isPending}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                {sendOtpMutation.isPending ? "Sending..." : "Resend Verification Code"} <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-green-500 shadow-sm">
                            <FiCheckCircle />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-green-900 uppercase tracking-tight">Email Secured</h3>
                            <p className="text-green-700/60 text-[10px] font-bold uppercase tracking-widest">{user.data.email}</p>
                        </div>
                    </div>
                    <div className="hidden md:block px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-green-600 border border-green-200">
                        Primary Auth Verified
                    </div>
                </div>
            )}

            {/* 3. Identity Verification Status */}
            {!isEmailUnverified && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                        <FiShield /> Identity Verification History
                    </h3>
                    
                    {!latestIdentity ? (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-neutral rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                                <FiShield className="text-3xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase">No Identity Submissions</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verify your ID to gain full community trust.</p>
                            </div>
                            <Link to="/dashboard/profile" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Submit ID Now</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Latest Identity Card */}
                            <div className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row gap-6 items-center ${latestIdentity.status === 'approved' ? 'bg-green-50 border-green-100' : latestIdentity.status === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${latestIdentity.status === 'approved' ? 'bg-white text-green-500' : latestIdentity.status === 'rejected' ? 'bg-white text-red-500' : 'bg-white text-amber-500'}`}>
                                    {latestIdentity.status === 'approved' ? <FiCheckCircle /> : latestIdentity.status === 'rejected' ? <FiXCircle /> : <FiClock />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${latestIdentity.status === 'approved' ? 'bg-green-500 text-white' : latestIdentity.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {latestIdentity.status}
                                        </span>
                                        <p className="text-xs font-black text-gray-900 uppercase">{latestIdentity.identityType} Verification</p>
                                    </div>
                                    <p className="text-gray-500 text-[10px] font-medium">Submission ID: {latestIdentity._id}</p>
                                </div>
                                {latestIdentity.status === 'rejected' && (
                                    <Link to="/dashboard/profile" className="px-6 py-3 bg-white text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm hover:bg-red-500 hover:text-white transition-all">Retry Submission</Link>
                                )}
                            </div>

                            {latestIdentity.adminMessage && (
                                <div className="p-6 bg-neutral rounded-3xl border border-gray-100 italic text-gray-600 text-sm">
                                   <div className="flex items-center gap-2 mb-2 not-italic">
                                        <FiMessageSquare className="text-primary" />
                                        <span className="text-[10px] font-black uppercase text-gray-400">Admin Feedback</span>
                                   </div>
                                   "{latestIdentity.adminMessage}"
                                </div>
                            )}

                            {identityRequests.length > 1 && (
                                <div className="pt-4 space-y-3">
                                     <p className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">Historical Timeline</p>
                                     {identityRequests.slice(1).map((req, idx) => (
                                         <div key={idx} className="flex items-center justify-between p-4 bg-neutral/30 rounded-2xl border border-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="text-gray-400 text-lg"><FiClock /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-900">{req.identityType}</p>
                                                    <p className="text-[8px] font-bold text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-black uppercase text-gray-400">{req.status}</span>
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
