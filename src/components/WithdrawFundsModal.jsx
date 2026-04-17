import { useState } from "react";
import { FiDollarSign, FiX, FiArrowRight, FiInfo, FiCreditCard, FiSmartphone, FiLoader } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const WithdrawFundsModal = ({ isOpen, onClose, campaignId: initialCampaignId, availableBalance, missions = [] }) => {
  const queryClient = useQueryClient();
  const [method, setMethod] = useState("bank");
  const [selectedCampaignId, setSelectedCampaignId] = useState(initialCampaignId || (missions.length > 0 ? missions[0]._id : ""));
  
  const [formData, setFormData] = useState({
    amount: "", accountName: "", accountNumber: "",
    bankName: "", branchName: "", routingNumber: "",
    mobileMoneyNumber: "", mobileMoneyType: "bkash",
  });

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/payouts/request", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["myWallet"]);
      queryClient.invalidateQueries(["userCampaigns"]);
      toast.success("Withdrawal request submitted for review");
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit request");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      toast.error("Please select a mission for this payout");
      return;
    }
    if (parseFloat(formData.amount) > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    const payload = {
      campaignId: selectedCampaignId,
      amount: parseFloat(formData.amount),
      bankDetails: method === "bank" ? {
        accountName: formData.accountName, accountNumber: formData.accountNumber,
        bankName: formData.bankName, branchName: formData.branchName,
        routingNumber: formData.routingNumber,
      } : {
        mobileMoneyNumber: formData.mobileMoneyNumber,
        mobileMoneyType: formData.mobileMoneyType,
      }
    };
    mutation.mutate(payload);
  };

  const inputClass = "w-full bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 focus:bg-white px-4 py-3 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-[#E5F0EA] flex flex-col max-h-[90vh]"
      >
        {/* Accent line */}
        <div className="h-1 bg-gradient-to-r from-[#1B4332] to-[#52B788]" />

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#F0F9F4] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EDFAF3] text-[#2D6A4F] rounded-xl flex items-center justify-center">
              <FiDollarSign size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight">Withdraw Funds</h2>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Platform Payout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer border border-gray-100"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto">

          {/* Mission Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Mission</label>
            <select
              className={inputClass}
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              required
            >
              <option value="" disabled>Choose a mission...</option>
              {missions.map(m => (
                <option key={m._id} value={m._id}>
                  {m.title} (Raised: ৳{m.currentAmount?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-xl p-4 flex items-center justify-between text-white">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300 mb-1">Available for Payout</p>
              <p className="text-2xl font-black">৳{availableBalance?.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <FiDollarSign size={20} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">৳</span>
                <input
                  type="number" required min="100" max={availableBalance}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`${inputClass} pl-9`}
                  placeholder="500"
                />
              </div>
            </div>

            {/* Method Pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <MethodButton
                  active={method === "bank"}
                  onClick={() => setMethod("bank")}
                  icon={<FiCreditCard size={14} />}
                  label="Bank Transfer"
                />
                <MethodButton
                  active={method === "mobile"}
                  onClick={() => setMethod("mobile")}
                  icon={<FiSmartphone size={14} />}
                  label="Mobile Money"
                />
              </div>
            </div>

            {/* Dynamic Fields */}
            {method === "bank" ? (
              <div className="space-y-3">
                <input placeholder="Account Name" required value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className={inputClass} />
                <input placeholder="Account Number" required value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Bank Name" required value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className={inputClass} />
                  <input placeholder="Branch Name" required value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  className={inputClass}
                  value={formData.mobileMoneyType}
                  onChange={(e) => setFormData({ ...formData, mobileMoneyType: e.target.value })}
                >
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
                <input placeholder="Mobile Number" required value={formData.mobileMoneyNumber}
                  onChange={(e) => setFormData({ ...formData, mobileMoneyNumber: e.target.value })}
                  className={inputClass} />
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <FiInfo className="text-amber-500 shrink-0 mt-0.5" size={15} />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                Withdrawal requests are reviewed within 24–48 hours. Ensure your account details are correct.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#2D6A4F] text-white py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/20 disabled:opacity-50 cursor-pointer"
            >
              {mutation.isPending
                ? <><FiLoader className="animate-spin" size={14} /> Processing...</>
                : <><FiArrowRight size={14} /> Submit Payout Request</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const MethodButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
      active
        ? "border-[#2D6A4F] bg-[#EDFAF3] text-[#2D6A4F]"
        : "border-[#E5F0EA] bg-[#F8FDFB] text-gray-400 hover:border-[#2D6A4F]/30 hover:text-gray-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default WithdrawFundsModal;
