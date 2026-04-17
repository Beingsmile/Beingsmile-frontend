import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiDollarSign, FiArrowUpRight, FiArrowDownLeft, FiClock, FiCheckCircle, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import WithdrawFundsModal from "../../components/WithdrawFundsModal";

const MyWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch: refetchWallet } = useQuery({
    queryKey: ["myWallet"],
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 mins
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axiosInstance.get("/payouts/wallet");
      return res.data.wallet;
    },
  });

  const { data: missionsData, isLoading: missionsLoading } = useQuery({
    queryKey: ["userCampaignsPayouts"],
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 mins
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axiosInstance.get("/campaigns/my-missions");
      return res.data.campaigns;
    },
  });

  const { data: withdrawalsData, isLoading: withdrawalsLoading, refetch: refetchWithdrawals } = useQuery({
    queryKey: ["myWithdrawals"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axiosInstance.get("/payouts/my-requests");
      return res.data.withdrawals;
    },
  });

  if (isLoading || missionsLoading || withdrawalsLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const wallet = data || { balance: 0, totalEarnings: 0, totalWithdrawn: 0, transactions: [] };
  const missions = missionsData || [];
  const withdrawals = withdrawalsData || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">My <span className="text-primary">Wallet</span></h1>
          <p className="text-sm text-gray-500 font-medium">Manage your earnings and request payouts securely.</p>
        </div>
        <button 
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
          onClick={() => setIsModalOpen(true)}
          disabled={wallet.balance < 100 || missions.length === 0}
        >
          {missions.length === 0 ? "No Missions Active" : "Request Payout"}
        </button>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Available Balance", val: `৳${wallet.balance.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-primary" },
          { label: "Total Earnings", val: `৳${wallet.totalEarnings.toLocaleString()}`, icon: <FiArrowUpRight />, color: "bg-blue-500" },
          { label: "Total Withdrawn", val: `৳${wallet.totalWithdrawn.toLocaleString()}`, icon: <FiArrowDownLeft />, color: "bg-amber-500" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-black text-gray-900">{item.val}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Transaction History ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <FiClock className="text-primary" /> Recent Transactions
          </h2>
          <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-widest">Live Updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {wallet.transactions.length > 0 ? (
                [...wallet.transactions].reverse().map((trx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{trx.description}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tabular-nums">ID: {trx.relatedId || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${
                        trx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className={`text-sm font-black ${trx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {trx.type === 'credit' ? '+' : '-'}৳{trx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-green-500 font-bold text-[10px] uppercase">
                        <FiCheckCircle size={10} /> Completed
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-bold text-gray-500">{new Date(trx.timestamp).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-gray-400 uppercase">{new Date(trx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                        <FiFileText size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No transactions yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Withdrawal Requests ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm mt-8">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <FiClock className="text-amber-500" /> Withdrawal Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-4">Status & Details</th>
                <th className="px-6 py-4">Mission</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-right">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {withdrawals.length > 0 ? (
                withdrawals.map((req, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${
                          req.status === 'completed' ? 'bg-green-50 text-green-600' :
                          req.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          req.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {req.status}
                        </span>
                        {req.adminNotes && <p className="text-[10px] font-bold text-gray-500 mt-2">Note: {req.adminNotes}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{req.campaign?.title || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-black text-gray-900">৳{req.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-bold text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-gray-400 uppercase">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                        <FiFileText size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No withdrawal requests yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WithdrawFundsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={wallet.balance}
        missions={missions}
        onRefresh={() => { refetchWallet(); refetchWithdrawals(); }}
      />
    </div>
  );
};

export default MyWallet;
