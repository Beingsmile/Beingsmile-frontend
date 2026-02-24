import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiImage, FiLock, FiCheck, FiLoader, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const AccountSettings = () => {
    const { user, setUser, forgotPassword } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.data?.avatar || "");
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    const handleUpdateAvatar = async (e) => {
        e.preventDefault();
        if (!avatarUrl) return;

        setIsUpdatingAvatar(true);
        try {
            const response = await axiosInstance.put("/users/profile/avatar", { avatarUrl });
            if (response.data.success) {
                toast.success("Avatar updated successfully!");
                setUser(prev => ({
                    ...prev,
                    data: { ...prev.data, avatar: avatarUrl }
                }));
            }
        } catch (error) {
            console.error("Avatar update error:", error);
            toast.error(error.response?.data?.error || "Failed to update avatar");
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setLoading(true);
        const result = await forgotPassword(user.email);
        if (result.success) {
            toast.info("A password reset link has been sent to your registered email.");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Avatar Settings */}
            <section className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <FiImage size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Picture</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Update your avatar using a direct image URL</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateAvatar} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avatar URL</label>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                            placeholder="https://example.com/avatar.png"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdatingAvatar || avatarUrl === user?.data?.avatar}
                        className="px-6 py-3 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all disabled:opacity-50 disabled:bg-gray-400 flex items-center shrink-0"
                    >
                        {isUpdatingAvatar ? <FiLoader className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
                        Update
                    </button>
                </form>
            </section>

            {/* Security Settings */}
            <section className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                        <FiLock size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security & Privacy</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your password and account protection</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 gap-4">
                        <div className="flex items-center gap-3">
                            <FiAlertCircle className="text-amber-500 shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                To ensure security, password changes require email verification.
                            </p>
                        </div>
                        <button
                            onClick={handlePasswordReset}
                            disabled={loading}
                            className="px-5 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center shrink-0 whitespace-nowrap"
                        >
                            {loading ? <FiLoader className="animate-spin mr-2" /> : null}
                            Reset via Email
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AccountSettings;
