import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { 
  FiSearch, FiFilter, FiDollarSign, FiUser, FiCalendar, FiCheckCircle, 
  FiXCircle, FiClock, FiLoader, FiExternalLink, FiHash 
} from "react-icons/fi";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["adminTransactions", searchTerm, statusFilter, page],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/transactions", {
        params: { search: searchTerm, status: statusFilter, page, limit: 12 }
      });
      return res.data;
    }
  });

  const transactions = data?.transactions || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "success": return "bg-green-50 text-green-600 border-green-100";
      case "failed": return "bg-red-50 text-red-600 border-red-100";
      case "initiated": return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled": return "bg-gray-50 text-gray-600 border-gray-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Transaction Logs</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Monitor all financial movements across the platform
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Email..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-all w-64"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="initiated">Initiated</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order & Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contributor</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Mission</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                        <FiHash className="text-gray-300" /> {trx.transactionId}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                        <FiCalendar /> {new Date(trx.createdAt).toLocaleDateString()} {new Date(trx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center text-xs font-black text-gray-400">
                        {trx.customerDetails?.name?.[0] || <FiUser />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-700 truncate max-w-[150px]">{trx.customerDetails?.name || "Guest"}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{trx.customerDetails?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <p className="text-xs font-bold text-gray-900 line-clamp-1 group hover:text-primary transition-colors cursor-pointer">
                          {trx.campaign?.title || "N/A"}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-gray-900">৳{trx.amount.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Net: ৳{trx.netAmount?.toLocaleString() || trx.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${getStatusColor(trx.status)}`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-gray-400 italic">No transaction records found.</p>
          </div>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-black text-gray-400 uppercase mx-2">Page {page} of {data.totalPages}</span>
          <button 
            disabled={page === data.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
