import { useState } from "react";
import { FiDollarSign, FiX, FiCheck, FiArrowRight, FiInfo, FiCreditCard, FiSmartphone } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const WithdrawFundsModal = ({ isOpen, onClose, campaignId, availableBalance, campaignTitle }) => {
  const queryClient = useQueryClient();
  const [method, setMethod] = useState("bank");
  const [formData, setFormData] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    routingNumber: "",
    mobileMoneyNumber: "",
    mobileMoneyType: "bkash",
  });

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/payouts/request", data),
    onSuccess: () => {
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
    
    if (parseFloat(formData.amount) > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    const payload = {
      campaignId,
      amount: parseFloat(formData.amount),
      bankDetails: method === "bank" ? {
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        branchName: formData.branchName,
        routingNumber: formData.routingNumber,
      } : {
        mobileMoneyNumber: formData.mobileMoneyNumber,
        mobileMoneyType: formData.mobileMoneyType,
      }
    };

    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Withdraw <span className="text-primary">Funds</span></h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">{campaignTitle}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-neutral rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto">
          {/* Balance Card */}
          <div className="bg-neutral p-6 rounded-3xl border border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Available for Payout</p>
              <p className="text-2xl font-black text-gray-900">৳{availableBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                <FiDollarSign size={24} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">How much would you like to withdraw?</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">৳</span>
                <input 
                  type="number" 
                  required
                  min="100"
                  max={availableBalance}
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white p-4 pl-10 rounded-2xl font-black text-gray-900 transition-all outline-none"
                  placeholder="500"
                />
              </div>
            </div>

            {/* Method Choice */}
            <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button"
                 onClick={() => setMethod("bank")}
                 className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${method === 'bank' ? 'border-primary bg-primary/5 text-primary' : 'border-neutral bg-neutral/50 text-gray-400'}`}
               >
                 <FiCreditCard /> <span className="text-[10px] font-black uppercase">Bank Transfer</span>
               </button>
               <button 
                 type="button"
                 onClick={() => setMethod("mobile")}
                 className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${method === 'mobile' ? 'border-primary bg-primary/5 text-primary' : 'border-neutral bg-neutral/50 text-gray-400'}`}
               >
                 <FiSmartphone /> <span className="text-[10px] font-black uppercase">Mobile Money</span>
               </button>
            </div>

            {/* Dynamic Details */}
            {method === "bank" ? (
               <div className="space-y-4 animate-in slide-in-from-top-2">
                 <input 
                   placeholder="Account Name" 
                   required
                   value={formData.accountName}
                   onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                   className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                 />
                 <input 
                   placeholder="Account Number" 
                   required
                   value={formData.accountNumber}
                   onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                   className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Bank Name" 
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                    />
                    <input 
                      placeholder="Branch Name" 
                      required
                      value={formData.branchName}
                      onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                      className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                    />
                 </div>
               </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                   <select 
                     className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                     value={formData.mobileMoneyType}
                     onChange={(e) => setFormData({...formData, mobileMoneyType: e.target.value})}
                   >
                     <option value="bkash">bKash</option>
                     <option value="nagad">Nagad</option>
                     <option value="rocket">Rocket</option>
                   </select>
                   <input 
                     placeholder="Mobile Number" 
                     required
                     value={formData.mobileMoneyNumber}
                     onChange={(e) => setFormData({...formData, mobileMoneyNumber: e.target.value})}
                     className="w-full bg-neutral p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-gray-200"
                   />
                </div>
            )}

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
               <FiInfo className="text-amber-500 shrink-0" size={18} />
               <p className="text-[10px] text-amber-700 font-medium leading-relaxed italic">
                 Audit Note: Withdrawal requests are reviewed by Beingsmile admins within 24-48 hours. Ensure your account details are 100% correct.
               </p>
            </div>

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-gray-900 text-white p-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
            >
              {mutation.isPending ? "Processing..." : "Submit Payout Request"} <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFundsModal;
