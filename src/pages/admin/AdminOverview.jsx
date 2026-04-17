import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiUsers, FiActivity, FiDollarSign, FiHeart, FiLoader, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";

const AdminOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data.stats;
    }
  });

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <FiLoader className="text-4xl text-primary animate-spin" />
    </div>
  );

  const statsList = [
    { label: "Total Users", value: data.totalUsers, icon: <FiUsers />, color: "bg-blue-500" },
    { label: "Active missions", value: data.activeCampaigns, icon: <FiCheckCircle />, color: "bg-emerald-500" },
    { label: "Net Donations", value: `৳${data.netDonations?.toLocaleString()}`, icon: <FiHeart />, color: "bg-pink-500" },
    { label: "Platform Fees", value: `৳${data.platformFees?.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-amber-500" },
    { label: "System Holdings", value: `৳${data.platformHoldings?.toLocaleString()}`, icon: <FiActivity />, color: "bg-purple-500" },
    { label: "Total Payouts", value: `৳${data.totalPayouts?.toLocaleString()}`, icon: <FiClock />, color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Platform <span className="text-primary">Pulse</span></h1>
        <p className="text-gray-500 font-medium">Real-time performance and integrity metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsList.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Ledger (Comprehensive Financial Status) */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Platform Financial Ledger</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed breakdown of platform holdings and flow</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Gross Inflow (Platform)</p>
            <p className="text-xl font-black text-gray-900">৳{(data.netDonations + data.platformFees).toLocaleString()}</p>
            <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Net Mission Payouts</p>
            <p className="text-xl font-black text-gray-900">৳{data.totalPayouts.toLocaleString()}</p>
            <div className="h-1 w-12 bg-red-400 rounded-full"></div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Accumulated Fees</p>
            <p className="text-xl font-black text-primary">৳{data.platformFees.toLocaleString()}</p>
            <div className="h-1 w-12 bg-primary rounded-full"></div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Current Liquidity</p>
            <p className="text-xl font-black text-emerald-600">৳{data.platformHoldings.toLocaleString()}</p>
            <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
            <FiShield size={14} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            Automated Audit: All platform holdings are backed by verified successful transactions in the gateway logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
