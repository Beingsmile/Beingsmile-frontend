import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiCheck, FiX, FiClock, FiUser, FiLoader, FiMessageCircle, FiImage, FiFileText, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";

const PendingUpdates = () => {
  const qc = useQueryClient();

  // Fetch pending updates
  const { data, isLoading } = useQuery({
    queryKey: ["pendingUpdates"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/pending-updates");
      return res.data;
    }
  });

  const pendingUpdates = data?.pendingUpdates || [];

  // Mutations
  const reviewUpdate = useMutation({
    mutationFn: async ({ campaignId, updateId, status, adminNote }) => 
      await axiosInstance.patch(`/admin/campaigns/${campaignId}/updates/${updateId}/review`, { status, adminNote }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["pendingUpdates"]);
      toast.success(`Update ${variables.status === 'approved' ? 'approved' : 'rejected'}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to review update")
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Pending Mission Updates</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Review and approve updates from mission creators
        </p>
      </div>

      <div className="grid gap-6">
        {pendingUpdates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-4 border border-gray-100 shadow-sm">
              <FiCheck size={32} />
            </div>
            <p className="text-sm font-bold text-gray-400 italic">No pending updates found. You're all caught up!</p>
          </div>
        ) : (
          pendingUpdates.map((item) => {
            const { update: up } = item;
            return (
              <div key={up._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar Info */}
                <div className="w-full md:w-64 bg-gray-50/50 p-6 border-b md:border-b-0 md:border-r border-gray-100 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mission</p>
                    <p className="text-sm font-black text-gray-900 leading-tight">{item.campaignTitle}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted By</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold uppercase">
                        {item.creatorUsername ? item.creatorUsername[0] : "U"}
                      </div>
                      <p className="text-xs font-bold text-gray-700">{item.creatorUsername}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted Date & Time</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <FiClock size={12} />
                      {(() => {
                        const d = new Date(up.submittedAt || item.createdAt);
                        return isNaN(d.getTime()) ? "Recently submitted" : d.toLocaleString("en-GB", { 
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        });
                      })()}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => reviewUpdate.mutate({ campaignId: item.campaignId, updateId: up._id, status: "approved" })}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason !== null) {
                          reviewUpdate.mutate({ 
                            campaignId: item.campaignId, 
                            updateId: up._id, 
                            status: "rejected", 
                            adminNote: reason 
                          });
                        }
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Update Content */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="space-y-1.5 pb-3 border-b border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FiMessageCircle size={12} className="text-primary" /> Update Title
                    </p>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">{up.title}</h3>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FiFileText size={12} className="text-primary" /> Update Content
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{up.content}</p>
                  </div>

                  {up.images?.length > 0 && (
                    <div className="space-y-3 pt-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <FiImage size={12} className="text-primary" /> Attached Images ({up.images.length})
                      </p>
                      <div className="flex flex-wrap gap-3">
                          {up.images.map((img, i) => {
                            const src = typeof img === 'string' ? img : img?.url;
                            if (!src) return null;
                            return (
                              <a key={i} href={src} target="_blank" rel="noreferrer" className="relative group">
                                <img 
                                  src={src} 
                                  className="w-24 h-24 rounded-2xl object-cover border border-gray-100 group-hover:scale-105 transition-transform duration-300 shadow-sm" 
                                  alt={`Update image ${i+1}`} 
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <FiEye className="text-white" />
                                </div>
                              </a>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PendingUpdates;
