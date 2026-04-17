import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { 
  FiSearch, FiFilter, FiEdit, FiEye, FiCheckCircle, FiXCircle, 
  FiMoreVertical, FiAlertTriangle, FiStar, FiLoader, FiTrash2 
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Link } from "react-router";

const AdminCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  // Fetch campaigns
  const { data, isLoading } = useQuery({
    queryKey: ["adminCampaigns", searchTerm, statusFilter],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/campaigns", {
        params: { search: searchTerm, status: statusFilter }
      });
      return res.data;
    }
  });

  const campaigns = data?.campaigns || [];

  // Mutations
  const toggleFeatured = useMutation({
    mutationFn: async (id) => await axiosInstance.patch(`/admin/campaigns/${id}/featured`),
    onSuccess: () => {
      qc.invalidateQueries(["adminCampaigns"]);
      toast.success("Featured status updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update featured status");
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => await axiosInstance.patch(`/admin/campaigns/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries(["adminCampaigns"]);
      toast.success("Campaign status updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update campaign status");
    }
  });

  const postNotice = useMutation({
    mutationFn: async ({ id, notice }) => await axiosInstance.post(`/admin/campaigns/${id}/notice`, notice),
    onSuccess: () => {
      qc.invalidateQueries(["adminCampaigns"]);
      toast.success("Admin notice updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post notice");
    }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mission Management</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Review, feature, and moderate all platform missions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search missions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-all w-64"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Mission</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Creator</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Raised</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Featured</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {campaigns.map((campaign) => (
              <tr key={campaign._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={campaign.coverImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{campaign.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{campaign.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-700">{campaign.creatorUsername}</p>
                  <p className="text-[10px] text-gray-400">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-primary">৳{campaign.currentAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-bold">of ৳{campaign.goalAmount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                    campaign.status === "active" ? "bg-green-50 text-green-600 border-green-100" :
                    campaign.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                    campaign.status === "suspended" ? "bg-red-50 text-red-600 border-red-100" :
                    "bg-gray-50 text-gray-600 border-gray-100"
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleFeatured.mutate(campaign._id)}
                    className={`p-2 rounded-xl transition-all ${
                      campaign.isFeatured ? "bg-amber-50 text-amber-500 border border-amber-100" : "bg-gray-50 text-gray-300 border border-gray-100"
                    }`}
                  >
                    <FiStar fill={campaign.isFeatured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/campaigns/${campaign._id}`} 
                      className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-all border border-blue-100"
                      title="View Public Page"
                    >
                      <FiEye />
                    </Link>
                    
                    {campaign.status === "active" ? (
                      <button 
                        onClick={() => updateStatus.mutate({ id: campaign._id, status: "suspended" })}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                        title="Suspend Mission"
                      >
                        <FiXCircle />
                      </button>
                    ) : campaign.status === "suspended" ? (
                      <button 
                        onClick={() => updateStatus.mutate({ id: campaign._id, status: "active" })}
                        className="p-2 bg-green-50 text-green-500 rounded-xl hover:bg-green-100 transition-all border border-green-100"
                        title="Reactivate Mission"
                      >
                        <FiCheckCircle />
                      </button>
                    ) : null}

                    {/* Notice Toggle (Simplified for now - can open a prompt) */}
                    <button 
                      onClick={() => {
                        const text = prompt("Enter admin notice (empty to remove):", campaign.adminNotice?.text || "");
                        if (text !== null) {
                          postNotice.mutate({ 
                            id: campaign._id, 
                            notice: { 
                              text, 
                              type: "warning", 
                              isActive: text.trim() !== "" 
                            } 
                          });
                        }
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        campaign.adminNotice?.isActive ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-gray-100 text-gray-500"
                      }`}
                      title={campaign.adminNotice?.isActive ? "Update/Remove Notice" : "Add Admin Notice"}
                    >
                      <FiAlertTriangle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-gray-400 italic">No missions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;
