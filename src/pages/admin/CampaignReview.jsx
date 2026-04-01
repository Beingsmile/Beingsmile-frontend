import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiClock, FiCheck, FiX, FiEye, FiDownload, FiLoader, FiMessageCircle, FiUser, FiFileText, FiMaximize2, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import ImageModal from "../../components/ImageModal";
import { useState } from "react";

const CampaignReview = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminNotes, setAdminNotes] = useState({}); // { [id]: notes }

  const { data, isLoading } = useQuery({
    queryKey: ["pendingCampaigns"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/pending-campaigns");
      return res.data.campaigns;
    }
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }) => 
      axiosInstance.patch(`/admin/campaigns/${id}/review`, { status, adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingCampaigns"]);
      toast.success("Review submitted successfully");
    },
    onError: (err) => toast.error(err.message)
  });

  const handleReview = (id, status) => {
    const notes = adminNotes[id] || "";
    
    if (status !== 'active' && !notes.trim()) {
      toast.warn("Please provide a reason for rejection or more information.");
      return;
    }

    reviewMutation.mutate({ id, status, adminNotes: notes });
  };

  const updateNotes = (id, value) => {
    setAdminNotes(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) return <div className="p-20 flex justify-center"><FiLoader className="animate-spin text-primary text-4xl" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Mission <span className="text-primary">Control</span></h1>
        <p className="text-gray-500 font-medium italic">"Every mission is a life. Review with integrity."</p>
      </header>

      {data?.length === 0 ? (
        <div className="bg-white p-20 rounded-[2rem] border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No pending missions to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           {data?.map((campaign) => {
             const allImages = [campaign.coverImage, ...(campaign.images || [])].filter(Boolean);
             
             return (
               <div key={campaign._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow">
                 {/* Campaign Preview / Gallery */}
                 <div className="w-full md:w-80 space-y-4">
                   <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden relative group">
                     <img src={campaign.coverImage} className="w-full h-full object-cover" alt="" />
                     <button 
                        onClick={() => setSelectedImage(campaign.coverImage)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                     >
                        <FiMaximize2 size={24} />
                     </button>
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary border border-primary/10">
                       {campaign.category}
                     </div>
                   </div>

                   {/* Additional Images Grid */}
                   {campaign.images?.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {campaign.images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setSelectedImage(img)}
                                className="aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-primary transition-all relative group"
                            >
                                <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                    <FiEye size={12} />
                                </div>
                            </button>
                        ))}
                      </div>
                   )}
                 </div>

              {/* Campaign Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-snug">{campaign.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                    <FiUser /> Created by {campaign.creator?.name || "Unknown"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-neutral p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Goal</p>
                    <p className="text-sm font-black text-gray-900">৳{campaign.goalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Deadline</p>
                    <p className="text-sm font-bold text-gray-900">{new Date(campaign.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Verification Documents */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <FiFileText /> Verification Evidence
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.verificationDetails?.documents?.map((doc, idx) => {
                      const isPDF = doc?.toLowerCase().endsWith(".pdf");
                      
                      return (
                        <a 
                          key={idx} 
                          href={doc} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-neutral transition-colors flex items-center gap-2 group/doc"
                        >
                          {isPDF ? <FiFileText className="text-red-500" /> : <FiEye />} 
                          Document {idx + 1}
                          {isPDF && <span className="text-[8px] opacity-40">PDF</span>}
                        </a>
                      );
                    })}
                    {campaign.verificationDetails?.documents?.length === 0 && (
                      <p className="text-[10px] font-bold text-red-400 italic">No documents provided!</p>
                    )}
                  </div>
                </div>

                {/* Inline Notes Input */}
                <div className="mt-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Internal Admin Feedback</p>
                  <textarea 
                    value={adminNotes[campaign._id] || ""}
                    onChange={(e) => updateNotes(campaign._id, e.target.value)}
                    placeholder="Provide detailed feedback or reason for rejection/info request..."
                    className="w-full bg-neutral/50 border border-gray-100 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-3 justify-center">
                <button
                  onClick={() => handleReview(campaign._id, 'active')}
                  disabled={reviewMutation.isPending}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewMutation.isPending ? <FiLoader className="animate-spin" /> : <FiCheck />} Approve
                </button>
                <button
                  onClick={() => handleReview(campaign._id, 'needs_info')}
                  disabled={reviewMutation.isPending}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewMutation.isPending ? <FiLoader className="animate-spin" /> : <FiMessageCircle />} Need Info
                </button>
                <button
                  onClick={() => handleReview(campaign._id, 'suspended')}
                  disabled={reviewMutation.isPending}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewMutation.isPending ? <FiLoader className="animate-spin" /> : <FiX />} Reject
                </button>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Full Image Modal */}
      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default CampaignReview;
