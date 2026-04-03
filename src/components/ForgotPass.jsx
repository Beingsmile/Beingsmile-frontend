import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiMail, FiArrowLeft, FiLoader, FiShield, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading } = useContext(AuthContext);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        const result = await forgotPassword(email);
        if (result.success) {
            setSent(true);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#F8FDFB]">
            <div className="max-w-[450px] w-full bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(27,67,50,0.12)] border border-[#E5F0EA] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                
                {/* Brand Header */}
                <div className="bg-[#1B4332] p-8 text-white relative overflow-hidden text-center">
                    <span className="absolute -top-10 -left-10 w-32 h-32 bg-[#2D6A4F]/40 rounded-full blur-2xl" />
                    <span className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#52B788]/20 rounded-full blur-2xl" />
                    
                    <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                        <FiShield size={24} className="text-[#52B788]" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2 relative z-10">
                        Reset <span className="text-[#52B788]">Password</span>
                    </h2>
                    <p className="text-white/60 text-xs font-medium max-w-[240px] mx-auto relative z-10">
                        Recover your secure access to continue making an impact.
                    </p>
                </div>

                <div className="p-8 md:p-10">
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                                    <FiMail size={10} className="text-[#2D6A4F]" /> Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-wider py-3 rounded-lg transition-all shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-xs flex items-center justify-center gap-2.5 group cursor-pointer"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin text-lg" />
                                ) : (
                                    <>
                                        Send Reset Link
                                        <FiArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
                            <div className="w-16 h-16 bg-[#F0FBF4] border border-[#D1EAD9] rounded-2xl flex items-center justify-center mx-auto text-[#2D6A4F] shadow-sm">
                                <FiCheckCircle size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-[#0f2418] tracking-tight">
                                    Check your inbox
                                </h3>
                                <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                                    We've sent a recovery link to <br /><strong className="text-[#0f2418]">{email}</strong>.
                                </p>
                            </div>
                            <button
                                onClick={() => setSent(false)}
                                className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F] hover:underline"
                            >
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#2D6A4F] transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Entrance
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;