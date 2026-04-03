import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { 
  FiSettings, FiDollarSign, FiShield, FiCheck, FiLoader, 
  FiAlertCircle, FiInfo, FiPercent, FiSave, FiClock 
} from "react-icons/fi";
import { toast } from "react-toastify";

const PlatformSettings = () => {
  const qc = useQueryClient();
  const [formData, setFormData] = useState(null);

  // Fetch current settings
  const { data, isLoading } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/platform-settings");
      if (!formData) setFormData(res.data.settings);
      return res.data.settings;
    }
  });

  // Mutation to update settings
  const updateSettings = useMutation({
    mutationFn: async (newData) => await axiosInstance.patch("/admin/platform-settings", newData),
    onSuccess: () => {
      qc.invalidateQueries(["platformSettings"]);
      toast.success("Platform settings updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to update settings");
    }
  });

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    const nextData = { ...formData };
    let current = nextData;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(nextData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading || !formData) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Platform Configuration</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Manage global fees, donation constraints, and maintenance status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Donation Fee Management */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <FiDollarSign className="text-primary" /> Donation Fee Settings
            </h2>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
              formData.donationFee?.mode !== 'none' ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"
            }`}>
              Fee Mode: {formData.donationFee?.mode}
            </div>
          </div>
          
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fee Mode</label>
                <div className="grid grid-cols-3 gap-2">
                   {['none', 'optional_button', 'forced'].map(mode => (
                     <button 
                       key={mode} 
                       type="button" 
                       onClick={() => handleInputChange('donationFee.mode', mode)}
                       className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                         formData.donationFee?.mode === mode 
                           ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                           : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                       }`}
                     >
                       {mode.replace('_', ' ')}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fee Type</label>
                <div className="flex bg-gray-50 p-1 rounded-xl w-32 border border-gray-100">
                   {['percent', 'fixed'].map(type => (
                     <button 
                       key={type} 
                       type="button" 
                       onClick={() => handleInputChange('donationFee.type', type)}
                       className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                         formData.donationFee?.type === type 
                           ? "bg-white text-primary shadow-md shadow-black/5" 
                           : "text-gray-400"
                       }`}
                     >
                       {type === 'percent' ? '%' : '৳'}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {formData.donationFee?.type === 'percent' ? "Percentage Fee (%)" : "Fixed Fee (৳)"}
                </label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      {formData.donationFee?.type === 'percent' ? <FiPercent size={14} /> : <FiDollarSign size={14} />}
                   </div>
                   <input 
                     type="number" 
                     value={formData.donationFee?.type === 'percent' ? formData.donationFee?.percent : formData.donationFee?.fixed}
                     onChange={(e) => handleInputChange(formData.donationFee?.type === 'percent' ? 'donationFee.percent' : 'donationFee.fixed', parseFloat(e.target.value))}
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-black text-gray-700 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Public Label Text</label>
                <input 
                  type="text" 
                  value={formData.donationFee?.label}
                  onChange={(e) => handleInputChange('donationFee.label', e.target.value)}
                  placeholder="e.g. Support BeingSmile"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-bold text-gray-700 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Constraints */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FiAlertCircle className="text-primary" /> Minimum Donation
                </h2>
              </div>
              <div className="p-8 space-y-4 flex-1">
                 <p className="text-xs text-gray-400 leading-relaxed font-medium">
                   Set the world-wide minimum donation amount across all missions.
                 </p>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs uppercase">৳</span>
                    <input 
                      type="number" 
                      value={formData.minimumDonation}
                      onChange={(e) => handleInputChange('minimumDonation', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-black text-gray-700 outline-none transition-all"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FiClock className="text-primary" /> Payout Hold Days
                </h2>
              </div>
              <div className="p-8 space-y-4 flex-1">
                 <p className="text-xs text-gray-400 leading-relaxed font-medium">
                   Specify the number of days a campaign must wait after completion before requesting a payout.
                 </p>
                 <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[10px] uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded-lg">Days</span>
                    <input 
                      type="number" 
                      value={formData.payoutHoldDays}
                      onChange={(e) => handleInputChange('payoutHoldDays', parseInt(e.target.value))}
                      className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-black text-gray-700 outline-none transition-all"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Maintenance Mode */}
        <div className={`rounded-3xl border p-8 transition-all ${
          formData.maintenanceMode 
            ? "bg-red-50 border-red-100 text-red-900" 
            : "bg-white border-gray-100 grayscale-[0.5] opacity-80"
        }`}>
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-sm font-black uppercase tracking-widest">Maintenance Mode</h3>
                 <p className={`text-xs font-medium ${formData.maintenanceMode ? "text-red-600/70" : "text-gray-400"}`}>
                   When active, users cannot create missions or make donations. Admins still have full access.
                 </p>
              </div>
              <button 
                type="button" 
                onClick={() => handleInputChange('maintenanceMode', !formData.maintenanceMode)}
                className={`w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner ${
                  formData.maintenanceMode ? "bg-red-500" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                  formData.maintenanceMode ? "left-7" : "left-1"
                }`} />
              </button>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
           <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
              <FiInfo className="text-primary" />
              <span>Settings are applied globally in real-time</span>
           </div>
           
           <button 
             type="submit" 
             disabled={updateSettings.isPending}
             className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
           >
             {updateSettings.isPending ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
             Save Configuration
           </button>
        </div>
      </form>
    </div>
  );
};

export default PlatformSettings;
