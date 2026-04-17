import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiMail, FiPhone, FiLoader, FiShield, FiX, FiCheckCircle, FiInfo, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AamarpayForm = ({ campaignId, amount, isAnonymous = false, isAnonymousFromAll = false, donorMessage = '', platformFee = 0 }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  // Sync user data when it becomes available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user?.displayName || user?.data?.name || prev.customerName,
        customerEmail: user?.email || user?.data?.email || prev.customerEmail,
        customerPhone: user?.data?.phone || prev.customerPhone,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ... (keep handleDonateClick and initiatePayment same as before)
  const handleDonateClick = (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.customerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.customerEmail.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setShowConfirmModal(true);
  };

  const initiatePayment = async () => {
    setLoading(true);
    setError("");
    setShowConfirmModal(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/payment/aamarpay/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(amount),
          campaignId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          isAnonymous,
          isAnonymousFromAll,
          donorMessage,
          platformFee,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const data = await response.json();
      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error(data.error || "Payment initiation failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] px-4 py-3 pl-10 rounded-lg text-sm font-bold text-gray-900 placeholder-gray-300 outline-none transition-all";

  const isNameLocked = !!(user?.displayName || user?.data?.name);
  const isEmailLocked = !!(user?.email || user?.data?.email);
  const isProfileLocked = isNameLocked && isEmailLocked;

  return (
    <>
      <form onSubmit={handleDonateClick} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
            <FiInfo className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Locked Profile Identity (Shows if logged in) */}
        {isProfileLocked ? (
          <div className="bg-[#f1f8f4] border border-[#d1e9db] p-4 rounded-xl flex items-center gap-3 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <FiShield size={60} className="text-emerald-900" />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
               <FiLock size={16} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[9px] font-black uppercase text-emerald-700 tracking-[0.2em] mb-0.5">Donating As</p>
               <h4 className="text-sm font-black text-gray-900 truncate uppercase leading-tight">{formData.customerName}</h4>
               <p className="text-[10px] font-bold text-gray-400 truncate">{formData.customerEmail}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Name (Only for Guests) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Email (Only for Guests) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="+880 ..."
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Amount Summary */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1B4332] rounded-xl shadow-lg border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Amount</span>
          <span className="text-xl font-black text-white">৳{amount}</span>
        </div>

        {/* Submit Button Trigger */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#1B4332] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-900/10"
        >
          {loading ? (
            <><FiLoader className="animate-spin" size={14} /> Processing...</>
          ) : (
            `Donate Now`
          )}
        </button>

        <p className="text-[10px] text-center text-gray-300 font-medium flex items-center justify-center gap-1.5">
          <FiShield className="text-emerald-500" /> Redirects to Secure Gateway
        </p>
      </form>

      {/* ── Confirmation Modal (Overhauled - Compact & Premium) ────────────────── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Elegant Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-[6px]"
            />

            {/* Premium Compact Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-[380px] bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-emerald-50 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 w-full" />

              <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <FiShield size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">Safe Donation</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Verification</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Summary receipt-style container */}
                  <div className="bg-[#F8FDFB] border border-emerald-100/50 rounded-2xl p-4 space-y-3 shadow-inner">
                    {/* Donor Row */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/80">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Contributor</span>
                      <span className="text-[11px] font-black text-gray-800 uppercase max-w-[150px] truncate">{formData.customerName}</span>
                    </div>

                    {/* Financial rows */}
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-gray-500">Mission Gift</span>
                          <span className="text-gray-900">৳{(amount - platformFee).toLocaleString()}</span>
                       </div>
                       {platformFee > 0 && (
                         <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-gray-500">Support Fee</span>
                            <span className="text-amber-600">+৳{platformFee.toLocaleString()}</span>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Badges / Options Section */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      isAnonymous ? "bg-gray-900 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}>
                      {isAnonymous ? "Private" : "Public Name"}
                    </span>
                    {isAnonymousFromAll && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-md border border-red-100">Hidden from Fundraiser</span>
                    )}
                  </div>

                  {/* Message Preview (if exists) */}
                  {donorMessage && (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg border-l-2 border-emerald-200">
                       <p className="text-[10px] text-gray-500 font-medium italic line-clamp-2 leading-relaxed">"{donorMessage}"</p>
                    </div>
                  )}

                  {/* Large Total Block */}
                  <div className="relative group overflow-hidden bg-emerald-900 rounded-2xl p-4 flex flex-col items-center justify-center transition-all">
                      <div className="absolute top-0 right-0 p-1 opacity-20"><FiShield size={40} className="text-white" /></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80 mb-1">Final Total</span>
                      <p className="text-3xl font-black text-white tracking-tighter">৳{amount.toLocaleString()}</p>
                  </div>

                  {/* Final Submit */}
                  <button
                    onClick={initiatePayment}
                    className="w-full py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-xl shadow-emerald-900/10"
                  >
                    Confirm & Proceed <FiCheckCircle />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest pt-2">
                    <FiShield className="text-emerald-500/50" /> Secure Encryption Active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AamarpayForm;
