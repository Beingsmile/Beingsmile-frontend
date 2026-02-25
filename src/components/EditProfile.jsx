import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiX, FiUser, FiPhone, FiInfo, FiLoader, FiShield, FiActivity } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const EditProfile = ({ onClose, onUpdate }) => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.data?.name || user?.displayName || "",
        bio: user?.data?.bio || "",
        phoneNumber: user?.data?.phoneNumber || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.put("/users/profile/update", formData);
            if (response.data.success) {
                toast.success("Identity updated successfully!");
                // Update local auth context
                setUser(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        ...formData
                    }
                }));
                if (onUpdate) onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.error || "Failed to update identity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-8 border-white relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-10 h-10 bg-neutral rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group z-10"
                    aria-label="Close"
                >
                    <FiX className="group-hover:rotate-90 transition-transform" />
                </button>

                <div className="p-10">
                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4">
                            <FiActivity />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">
                            Edit <span className="text-primary">Identity</span>
                        </h2>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Refine your humanitarian presence.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Legal Name</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                                    <FiUser />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-16 pr-8 py-5 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all placeholder:text-gray-300"
                                    placeholder="Your real name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Phone Connection</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                                        <FiPhone />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full pl-16 pr-8 py-5 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all placeholder:text-gray-300"
                                        placeholder="+880 1XXX-XXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Mission Statement (Bio)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-6 text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                                    <FiInfo />
                                </div>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows="4"
                                    className="w-full pl-16 pr-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-bold transition-all resize-none placeholder:text-gray-300"
                                    placeholder="Tell us what drives your kindness..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-5 bg-neutral text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Discard Changes
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiShield />}
                                Save Identity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
