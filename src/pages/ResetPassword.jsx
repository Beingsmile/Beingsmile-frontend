import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthProvider";
import { FiLock, FiEye, FiEyeOff, FiLoader, FiCheck, FiX, FiArrowLeft, FiShield, FiActivity, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyResetCode, confirmReset } = useContext(AuthContext);

    const [oobCode, setOobCode] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [resetComplete, setResetComplete] = useState(false);

    // Password criteria states
    const criteria = {
        length: newPassword.length >= 8,
        upper: /[A-Z]/.test(newPassword),
        lower: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[\W_]/.test(newPassword)
    };

    const isPasswordValid = Object.values(criteria).every(Boolean);

    useEffect(() => {
        // Guard: If reset already completed successfully, don't re-verify
        if (resetComplete) return;

        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("oobCode");

        if (!code) {
            setError("Invalid or missing security code.");
            setVerifying(false);
            return;
        }

        setOobCode(code);

        const verifyCode = async () => {
            const result = await verifyResetCode(code);
            if (result.success) {
                setEmail(result.email);
            } else {
                setError("The security link is invalid or has expired.");
            }
            setVerifying(false);
        };

        verifyCode();
    }, [location, resetComplete, verifyResetCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error("Please meet all security requirements");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setSubmitting(true);
            const result = await confirmReset(oobCode, newPassword);
            if (result.success) {
                setResetComplete(true); // Guard against re-verification error
                toast.success("Security reset successful!");
                setTimeout(() => navigate("/", { state: { openLogin: true } }), 1500);
            }
        } catch (err) {
            toast.error(err.message || "Failed to update password");
        } finally {
            setSubmitting(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FDFB]">
                <div className="text-center space-y-4">
                    <FiLoader className="animate-spin text-[#2D6A4F] text-5xl mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D6A4F]/60">Verifying Security Code</p>
                </div>
            </div>
        );
    }

    if (error && !resetComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FDFB]">
                <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_32px_80px_rgba(27,67,50,0.12)] border border-[#E5F0EA] text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <FiX size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-[#0f2418] tracking-tight mb-4 uppercase">Reset Link Error</h2>
                    <p className="text-gray-400 text-sm font-semibold mb-10 leading-relaxed">{error}</p>
                    <Link to="/" className="w-full inline-block bg-[#2D6A4F] text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-1 transition-all text-xs">
                        Back to Entrance
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#F8FDFB]">
            <div className="max-w-[480px] w-full bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(27,67,50,0.12)] border border-[#E5F0EA] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                
                {/* Visual Header */}
                <div className="bg-[#1B4332] p-10 text-white relative overflow-hidden text-center">
                    <span className="absolute -top-16 -left-16 w-48 h-48 bg-[#2D6A4F]/40 rounded-full blur-3xl" />
                    <span className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#52B788]/20 rounded-full blur-3xl" />
                    
                    <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                        <FiShield size={28} className="text-[#52B788]" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">
                        Security <span className="text-[#52B788]">Reset</span>
                    </h2>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest max-w-[280px] mx-auto relative z-10">
                        Enhancing Protection for <span className="text-white">{email}</span>
                    </p>
                </div>

                <div className="p-10">
                    {resetComplete ? (
                         <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="w-20 h-20 bg-emerald-50 text-[#2D6A4F] rounded-[2rem] flex items-center justify-center mx-auto shadow-sm animate-pulse">
                                 <FiCheckCircle size={40} />
                             </div>
                             <div className="space-y-2">
                                 <h3 className="text-2xl font-black text-[#0f2418] uppercase tracking-tight">Access Restored</h3>
                                 <p className="text-xs font-bold text-gray-400">Your profile is now secured. Redirecting...</p>
                             </div>
                         </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <FiLock size={12} className="text-[#2D6A4F]" /> New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-4 py-3.5 rounded-xl text-sm font-bold text-[#0f2418] transition-all outline-none"
                                            placeholder="Enter your strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D6A4F]"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirm Access</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-4 py-3.5 rounded-xl text-sm font-bold text-[#0f2418] transition-all outline-none"
                                        placeholder="Repeat your password"
                                    />
                                </div>
                            </div>

                            {/* Security Requirements Checklist */}
                            <div className="bg-[#F8FDFB] border border-[#E5F0EA] rounded-[1.5rem] p-6 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#2D6A4F]/60 flex items-center gap-2">
                                    <FiActivity size={12} className="animate-pulse" /> Security Policy
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <CriteriaItem met={criteria.length} text="8+ Characters" />
                                    <CriteriaItem met={criteria.upper} text="Uppercase" />
                                    <CriteriaItem met={criteria.lower} text="Lowercase" />
                                    <CriteriaItem met={criteria.number} text="Numbers" />
                                    <CriteriaItem met={criteria.special} text="Special Char" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !isPasswordValid}
                                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-[#2D6A4F]/20 hover:-translate-y-1 disabled:opacity-50 text-xs flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <FiLoader className="animate-spin text-lg" />
                                ) : (
                                    <>
                                        Update Security Key
                                        <FiCheck size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Return to Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CriteriaItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 transition-all duration-300 ${met ? "text-[#2D6A4F]" : "text-red-500"}`}>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${met ? "bg-[#2D6A4F] border-[#2D6A4F]" : "bg-red-50 border-red-200"}`}>
            {met ? <FiCheck size={10} className="text-white" /> : <FiX size={10} className="text-red-400" />}
        </div>
        <span className="text-[10px] font-black tracking-tighter truncate">{text}</span>
    </div>
);

export default ResetPassword;
