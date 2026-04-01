import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiUsers, FiActivity, FiDollarSign, FiHeart, FiLoader, FiCheckCircle, FiClock } from "react-icons/fi";

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
    { label: "Donors", value: data.totalDonors, icon: <FiHeart />, color: "bg-pink-500" },
    { label: "Fundraisers", value: data.totalFundraisers, icon: <FiActivity />, color: "bg-purple-500" },
    { label: "Total Raised", value: `৳${data.totalRaised.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-green-500" },
    { label: "Active Missions", value: data.activeCampaigns, icon: <FiCheckCircle />, color: "bg-emerald-500" },
    { label: "Pending Review", value: data.pendingCampaigns, icon: <FiClock />, color: "bg-amber-500" },
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

      {/* Placeholder for charts/recent activity */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-64 flex items-center justify-center italic text-gray-300">
        Activity charts and growth analytics coming soon...
      </div>
    </div>
  );
};

export default AdminOverview;
