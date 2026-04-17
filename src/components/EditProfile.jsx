import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiX, FiUser, FiPhone, FiInfo, FiLoader, FiShield } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
        setUser(prev => ({ ...prev, data: { ...prev.data, ...formData } }));
        if (onUpdate) onUpdate();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-[#E5F0EA]"
      >
        {/* Accent header top line */}
        <div className="h-1 bg-gradient-to-r from-[#1B4332] to-[#52B788]" />

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#F0F9F4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EDFAF3] text-[#2D6A4F] rounded-xl flex items-center justify-center">
              <FiUser size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight">Edit Identity</h2>
              <p className="text-[10px] text-gray-400 font-semibold">Update your profile information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer border border-gray-100"
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <FiUser size={10} /> Legal Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 focus:bg-white rounded-xl outline-none text-sm text-gray-900 font-bold transition-all placeholder:text-gray-300"
                placeholder="Your full name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <FiPhone size={10} /> Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 focus:bg-white rounded-xl outline-none text-sm text-gray-900 font-bold transition-all placeholder:text-gray-300"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <FiInfo size={10} /> Mission Statement (Bio)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 focus:bg-white rounded-xl outline-none text-sm text-gray-900 font-medium transition-all resize-none placeholder:text-gray-300 leading-relaxed"
              placeholder="Tell the world what drives your kindness..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-white text-gray-500 font-black uppercase tracking-widest text-[11px] rounded-xl border border-[#E5F0EA] hover:bg-gray-50 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[1.5] px-6 py-3 bg-[#2D6A4F] text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {loading ? <FiLoader className="animate-spin" size={14} /> : <FiShield size={14} />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
