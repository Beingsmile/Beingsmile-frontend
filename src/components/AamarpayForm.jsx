import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiMail, FiPhone, FiLoader, FiShield } from "react-icons/fi";

const AamarpayForm = ({ campaignId, amount }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    customerName: user?.displayName || user?.data?.name || "",
    customerEmail: user?.email || user?.data?.email || "",
    customerPhone: user?.data?.phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.customerName.trim()) throw new Error("Please enter your name");
      if (!formData.customerEmail.trim()) throw new Error("Please enter your email");
      if (!formData.customerPhone.trim()) throw new Error("Please enter your phone number");
      if (formData.customerPhone.length < 10) throw new Error("Please enter a valid phone number");

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

  const inputClass = "w-full bg-neutral border border-gray-100 focus:border-primary/30 focus:bg-white px-4 py-3 pl-10 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-300 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
          {error}
        </div>
      )}

      {/* Name */}
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

      {/* Email */}
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
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</span>
        <span className="text-lg font-black text-primary">৳{amount}</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <><FiLoader className="animate-spin" /> Processing...</>
        ) : (
          `Donate ৳${amount}`
        )}
      </button>

      <p className="text-[10px] text-center text-gray-300 font-medium flex items-center justify-center gap-1.5">
        <FiShield className="text-primary" /> Redirects to Aamarpay. Your payment is secure.
      </p>
    </form>
  );
};

export default AamarpayForm;
