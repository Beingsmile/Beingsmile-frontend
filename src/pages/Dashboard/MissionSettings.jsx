import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { 
  FiSave, FiArrowLeft, FiAlertTriangle, FiInfo, FiLoader, 
  FiChevronRight, FiUpload, FiX, FiCheckCircle 
} from "react-icons/fi";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Education", "Health & Medical", "Disaster Relief", "Poverty & Food", "Environment", 
  "Animals", "Community Development", "Arts & Culture", "Technology & Innovation", 
  "Women Empowerment", "Child Welfare", "Elderly Care", "Mental Health", 
  "Sports & Fitness", "Religious & Spiritual", "Legal Aid", "Others"
];

const MissionSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [formData, setFormData] = useState(null);
  const [newDocs, setNewDocs] = useState([]);
  const [previewCover, setPreviewCover] = useState(null);
  const [previewGallery, setPreviewGallery] = useState([]);

  // Fetch campaign details
  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ["missionSettings", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/campaigns/${id}`);
      const c = res.data.campaign;
      if (!formData) {
        setFormData({
          title: c.title,
          tagline: c.tagline || "",
          category: c.category,
          goalAmount: c.goalAmount,
          endDate: new Date(c.endDate).toISOString().split('T')[0],
          description: c.description,
          location: c.location || "",
          coverImage: c.coverImage,
          gallery: c.gallery || [],
        });
      }
      return c;
    }
  });

  // Mutation for editing metadata
  const updateMutation = useMutation({
    mutationFn: async (newData) => await axiosInstance.patch(`/campaigns/${id}`, newData),
    onSuccess: (res) => {
      qc.invalidateQueries(["missionSettings", id]);
      if (res.data.pendingApproval) {
        toast.info("Edit request submitted for admin review! ⏳");
      } else {
        toast.success("Mission updated successfully! ✨");
      }
      navigate("/dashboard/manage-campaigns");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update mission")
  });

  // Mutation for uploading more docs
  const uploadDocsMutation = useMutation({
    mutationFn: async (docs) => await axiosInstance.post(`/campaigns/${id}/documents`, { documents: docs }),
    onSuccess: () => {
      qc.invalidateQueries(["missionSettings", id]);
      toast.success("Additional documents submitted for admin review! 🔒");
      setNewDocs([]);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await toBase64(file);
      setPreviewCover(base64);
      setFormData(prev => ({ ...prev, coverImage: base64 }));
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(f => toBase64(f)));
    setPreviewGallery(prev => [...prev, ...base64Images]);
    setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...base64Images] }));
  };

  const handleDocUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Docs = await Promise.all(files.map(f => toBase64(f)));
    setNewDocs(prev => [...prev, ...base64Docs]);
  };

  if (isLoading || !formData) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-[#2D6A4F]" size={32} />
    </div>
  );

  if (isError) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-[#E5F0EA]">
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Failed to load mission details.</p>
      <Link to="/dashboard/manage-campaigns" className="text-[#2D6A4F] font-black uppercase tracking-widest text-[10px] hover:underline mt-4 inline-block">Back to My Missions</Link>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to="/dashboard/manage-campaigns" className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-[#2D6A4F] transition-all mb-2 uppercase tracking-widest">
            <FiArrowLeft /> Back to My Missions
          </Link>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mission Settings</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Campaign ID: <span className="text-[#2D6A4F]">{id.slice(-8).toUpperCase()}</span>
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
          campaign.status === "active" ? "bg-green-50 text-green-600 border-green-100" :
          campaign.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
          "bg-gray-50 text-gray-400 border-gray-100"
        }`}>
          Status: {campaign.status}
        </div>
      </div>

      {campaign.status === "active" && (
        <div className="bg-[#F0FBF4] border-l-4 border-[#2D6A4F] p-5 rounded-r-xl flex items-start gap-4">
          <div className="p-2 bg-[#2D6A4F] text-white rounded-lg">
             <FiInfo size={16} />
          </div>
          <div>
            <p className="text-sm font-black text-[#1B4332] uppercase tracking-wide">Active Mission Protection</p>
            <p className="text-[11px] text-[#2D6A4F] mt-1 font-semibold leading-relaxed">
              To maintain platform trust, updates to active missions require moderator approval. Your proposed changes will be marked as <span className="underline font-black">Pending Review</span> and will reflect publicly once verified.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="lg:col-span-8 space-y-6">
          
          {/* Visuals - Cover & Gallery */}
          <section className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden p-6 lg:p-8 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiImage className="text-[#2D6A4F]" /> Mission Visuals
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Cover Image Update */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Cover Image</label>
                  <div className="relative group">
                     {/* Comparison view if active */}
                     <div className="aspect-video rounded-xl overflow-hidden border border-[#E5F0EA] bg-[#F8FDFB]">
                        <img src={previewCover || campaign.coverImage} className="w-full h-full object-cover" alt="" />
                        {previewCover && (
                           <div className="absolute top-2 left-2 px-2 py-1 bg-[#2D6A4F] text-white text-[8px] font-black uppercase rounded-lg shadow-lg">New Selection</div>
                        )}
                     </div>
                     <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-xl backdrop-blur-[2px]">
                        <FiUpload size={24} />
                        <span className="text-[10px] font-black uppercase mt-2">Change Image</span>
                        <input type="file" className="hidden" onChange={handleCoverUpload} accept="image/*" />
                     </label>
                  </div>
                  {previewCover && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                       <span className="line-through">Original</span>
                       <FiChevronRight />
                       <span className="text-[#2D6A4F]">Proposed New Cover</span>
                    </div>
                  )}
               </div>

               {/* Gallery Update */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Gallery Items</label>
                  <div className="grid grid-cols-3 gap-2">
                     {campaign.gallery?.map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-[#E5F0EA] opacity-60">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                     ))}
                     {previewGallery.map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden border-2 border-[#2D6A4F] relative group">
                           <img src={img} className="w-full h-full object-cover" alt="" />
                           <button 
                             type="button"
                             onClick={() => {
                               setPreviewGallery(prev => prev.filter((_, idx) => idx !== i));
                               setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => {
                                 // This logic is a bit simple, might need refinement for which one to filter
                                 return true; 
                               })}));
                             }}
                             className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                           >
                              <FiX size={10} />
                           </button>
                        </div>
                     ))}
                     <label className="aspect-square rounded-xl border-2 border-dashed border-[#E5F0EA] flex items-center justify-center text-gray-300 hover:border-[#2D6A4F]/30 hover:text-[#2D6A4F] transition-all cursor-pointer bg-[#F8FDFB]">
                        <FiPlus size={20} />
                        <input type="file" multiple className="hidden" onChange={handleGalleryUpload} accept="image/*" />
                     </label>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Gallery adds depth to your story</p>
               </div>
            </div>
          </section>

          {/* Core Info */}
          <section className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden p-6 lg:p-8 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiChevronRight className="text-[#2D6A4F]" /> Descriptive Details
            </h2>

            <div className="grid gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Mission Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Tagline / Brief</label>
                <input 
                  type="text" 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Regional Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Logistics */}
          <section className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden p-6 lg:p-8 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiChevronRight className="text-[#2D6A4F]" /> Logistics & Goals
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Target Amount (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] font-black">৳</span>
                    <input 
                      type="number" 
                      name="goalAmount"
                      value={formData.goalAmount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-black text-gray-900 outline-none transition-all"
                    />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">End Date</label>
                  <input 
                    type="date" 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-black text-gray-900 outline-none transition-all"
                  />
               </div>
            </div>
          </section>

          {/* Story */}
          <section className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden p-6 lg:p-8 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiChevronRight className="text-[#2D6A4F]" /> Detailed Narrative
            </h2>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="8"
              className="w-full px-4 py-5 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-medium leading-relaxed text-gray-700 outline-none resize-none transition-all"
            />
          </section>

          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="w-full py-4 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#1B4332] transition-all shadow-xl shadow-[#2D6A4F]/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {updateMutation.isPending ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
            {campaign.status === "active" ? "Submit Review Request" : "Commit Changes"}
          </button>
        </form>

        {/* Sidebar Actions */}
        <aside className="lg:col-span-4 space-y-6">
           {/* Document Verification Section */}
           <section className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden p-6 space-y-6 lg:sticky lg:top-24">
              <div>
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FiShield className="text-[#2D6A4F]" /> Trust Documents
                </h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">🔒 Admin Locked Access</p>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-wider font-black">Verified proof ({campaign.verificationDetails?.documents?.length || 0})</p>
                 <div className="flex flex-wrap gap-2">
                    {campaign.verificationDetails?.documents?.map((_, i) => (
                      <div key={i} className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shadow-sm">
                         <FiCheckCircle size={14} />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Provide Addendum?</p>
                 <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#E5F0EA] rounded-xl cursor-pointer hover:border-[#2D6A4F]/30 hover:bg-[#F8FDFB] transition-all">
                    <FiUpload className="text-gray-300" size={20} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-2">Upload Proof</span>
                    <input type="file" multiple className="hidden" onChange={handleDocUpload} />
                 </label>

                 {newDocs.length > 0 && (
                   <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                         {newDocs.map((_, i) => (
                            <div key={i} className="relative w-10 h-10 rounded-lg bg-[#2D6A4F]/5 flex items-center justify-center text-[#2D6A4F] border border-[#2D6A4F]/10">
                               <FiUpload size={12} />
                               <button 
                                 onClick={() => setNewDocs(prev => prev.filter((_, idx) => idx !== i))}
                                 className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md scale-75"
                               >
                                  <FiX size={10} />
                               </button>
                            </div>
                         ))}
                      </div>
                      <button 
                         onClick={() => uploadDocsMutation.mutate(newDocs)}
                         disabled={uploadDocsMutation.isPending}
                         className="w-full py-2.5 bg-[#2D6A4F]/10 text-[#2D6A4F] text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#2D6A4F]/20 transition-all flex items-center justify-center gap-2"
                      >
                         {uploadDocsMutation.isPending ? <FiLoader className="animate-spin" /> : <FiSave size={12} />}
                         Upload {newDocs.length} Docs
                      </button>
                   </div>
                 )}
              </div>
           </section>

           {/* Support Card */}
           <div className="bg-[#1B4332] rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Success Manager</p>
              <h4 className="text-sm font-bold mb-4 tracking-tight leading-snug">Require expedited review?</h4>
              <Link to="/contact-us" className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#52B788] hover:text-white transition-all">
                Speak with Admin <FiChevronRight />
              </Link>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default MissionSettings;
