import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiImage, FiLock, FiCheck, FiLoader, FiAlertCircle, FiShield, FiMail, FiLink } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const AccountSettings = () => {
    const { user, setUser, forgotPassword, sendVerificationEmail } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.data?.avatar || "");
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    // Identify auth provider
    const isGoogleUser = user?.providerData?.some(p => p.providerId === "google.com");
    const isEmailUser = user?.providerData?.some(p => p.providerId === "password");

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        if (!avatarUrl) return;

        setIsUpdatingAvatar(true);
        try {
            const response = await axiosInstance.put("/users/profile/avatar", { avatarUrl });
            if (response.data.success) {
                toast.success("Avatar identity updated!");
                setUser(prev => ({
                    ...prev,
                    data: { ...prev.data, avatar: avatarUrl }
                }));
            }
        } catch (error) {
            console.error("Avatar update error:", error);
            toast.error(error.response?.data?.error || "Failed to update identity image");
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setLoading(true);
        const result = await forgotPassword(user.email);
        if (result.success) {
            toast.info("A secure recovery link has been sent to your email.");
        }
        setLoading(false);
    };

    const handleEmailVerification = async () => {
        setVerifyingEmail(true);
        await sendVerificationEmail();
        setVerifyingEmail(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between px-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Security Architecture</h4>
            </div>

            {/* Account Information */}
            <section className="bg-white rounded-[2.5rem] border-8 border-white shadow-2xl shadow-gray-200/50 p-10 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        <FiMail />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase font-sans">Identity Connection</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Primary contact & access method</p>
                    </div>
                </div>

                <div className="bg-neutral rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Email</p>
                        <p className="text-lg font-bold text-gray-900">{user?.email}</p>
                    </div>
                    {!user?.emailVerified ? (
                        <button
                            onClick={handleEmailVerification}
                            disabled={verifyingEmail}
                            className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
                        >
                            {verifyingEmail ? <FiLoader className="animate-spin" /> : <FiShield />}
                            Verify Email Identity
                        </button>
                    ) : (
                        <div className="px-6 py-3 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-green-100 flex items-center gap-2">
                            <FiCheck /> Verified Secure
                        </div>
                    )}
                </div>
            </section>

            {/* Avatar Settings */}
            <section className="bg-white rounded-[2.5rem] border-8 border-white shadow-2xl shadow-gray-200/50 p-10 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-[1.5rem] flex items-center justify-center text-2xl">
                        <FiImage />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase font-sans">Visual Identity</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Your public humanitarian avatar</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateAvatar} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                            <FiLink />
                        </div>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all placeholder:text-gray-300 placeholder:font-medium"
                            placeholder="Paste your image URL here..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdatingAvatar || avatarUrl === user?.data?.avatar}
                        className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-20 disabled:scale-100 disabled:bg-gray-400 flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {isUpdatingAvatar ? <FiLoader className="animate-spin" /> : <FiCheck />}
                        Sync Visual Identity
                    </button>
                </form>
            </section>

            {/* Security Settings */}
            <section className="bg-white rounded-[2.5rem] border-8 border-white shadow-2xl shadow-gray-200/50 p-10 space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center text-2xl">
                        <FiLock />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase font-sans">Access Control</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your secure entry point</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {isGoogleUser && !isEmailUser ? (
                        <div className="p-8 bg-primary/5 rounded-3xl border-2 border-primary/10 flex items-start gap-4">
                            <FiShield className="text-primary text-2xl shrink-0 mt-1" />
                            <div>
                                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Google Managed Identity</p>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    Your account is fully secured via Google. Authentication & security protocols are managed through your Google Account settings for maximum safety.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <FiAlertCircle className="text-red-500 text-2xl shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-black text-red-900 uppercase tracking-wider mb-1">Legacy Recovery</p>
                                    <p className="text-xs text-red-700 font-medium">
                                        Resetting your identity key requires valid email access.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handlePasswordReset}
                                disabled={loading}
                                className="px-8 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : null}
                                Trigger Recovery Email
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AccountSettings;
