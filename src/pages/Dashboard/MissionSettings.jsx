import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import {
  FiSave, FiArrowLeft, FiInfo, FiLoader,
  FiChevronRight, FiUpload, FiX, FiCheckCircle,
  FiShield, FiImage, FiPlus
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

  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ["missionSettings", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/campaigns/${id}`);
      const c = res.data.campaign;
      if (!formData) {
        setFormData({
          title: c.title, tagline: c.tagline || "", category: c.category,
          goalAmount: c.goalAmount, endDate: new Date(c.endDate).toISOString().split('T')[0],
          description: c.description, location: c.location || "",
          coverImage: c.coverImage, gallery: c.gallery || [],
        });
      }
      return c;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (newData) => await axiosInstance.patch(`/campaigns/${id}`, newData),
    onSuccess: (res) => {
      qc.invalidateQueries(["missionSettings", id]);
      if (res.data.pendingApproval) toast.info("Edit request submitted for admin review! ⏳");
      else toast.success("Mission updated successfully! ✨");
      navigate("/dashboard/manage-campaigns");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update mission")
  });

  const uploadDocsMutation = useMutation({
    mutationFn: async (docs) => await axiosInstance.post(`/campaigns/${id}/documents`, { documents: docs }),
    onSuccess: () => {
      qc.invalidateQueries(["missionSettings", id]);
      toast.success("Documents submitted for admin review!");
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
      <FiLoader className="animate-spin text-[#2D6A4F]" size={28} />
    </div>
  );

  if (isError) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-[#E5F0EA]">
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Failed to load mission.</p>
      <Link to="/dashboard/manage-campaigns" className="text-[#2D6A4F] font-black uppercase tracking-widest text-[10px] hover:underline mt-3 inline-block">
        Back to My Missions
      </Link>
    </div>
  );

  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    suspended: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard/manage-campaigns" className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-[#2D6A4F] transition-all mb-2 uppercase tracking-widest">
            <FiArrowLeft size={12} /> Back to My Missions
          </Link>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Mission Settings</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
            ID: <span className="text-[#2D6A4F]">{id.slice(-8).toUpperCase()}</span>
          </p>
        </div>
        <span className={`self-start px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[campaign.status] || "bg-gray-50 text-gray-400 border-gray-100"}`}>
          {campaign.status}
        </span>
      </div>

      {/* Active Mission Notice */}
      {campaign.status === "active" && (
        <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <div className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center shrink-0">
              <FiInfo size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-[#1B4332] uppercase tracking-wide">Active Mission Protection</p>
              <p className="text-[11px] text-[#2D6A4F]/80 mt-1 font-medium leading-relaxed">
                Updates to active missions require moderator approval before going public. Changes will be marked as <span className="font-black underline">Pending Review</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-5">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="lg:col-span-8 space-y-5">

          {/* Visuals */}
          <FormCard title="Mission Visuals" icon={<FiImage size={13} />}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-700">Cover Image</label>
                <div className="relative group rounded-xl overflow-hidden border border-[#E5F0EA] bg-[#F8FDFB] aspect-video">
                  <img src={previewCover || campaign.coverImage} className="w-full h-full object-cover" alt="" />
                  {previewCover && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#2D6A4F] text-white text-[9px] font-black uppercase rounded-lg shadow">
                      New Selection
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                    <FiUpload size={20} />
                    <span className="text-[10px] font-black uppercase mt-1.5">Change Image</span>
                    <input type="file" className="hidden" onChange={handleCoverUpload} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-700">Gallery</label>
                <div className="grid grid-cols-3 gap-2">
                  {campaign.gallery?.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#E5F0EA] bg-[#F8FDFB] opacity-60">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {previewGallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-[#2D6A4F] relative group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => setPreviewGallery(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#E5F0EA] flex items-center justify-center text-gray-300 hover:border-[#2D6A4F]/40 hover:text-[#2D6A4F] transition-all cursor-pointer bg-[#F8FDFB]">
                    <FiPlus size={18} />
                    <input type="file" multiple className="hidden" onChange={handleGalleryUpload} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          </FormCard>

          {/* Details */}
          <FormCard title="Descriptive Details" icon={<FiChevronRight size={13} />}>
            <div className="grid gap-4">
              <FormField label="Mission Title" name="title" value={formData.title} onChange={handleInputChange} />
              <FormField label="Tagline / Brief" name="tagline" value={formData.tagline} onChange={handleInputChange} />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <FormField label="Location" name="location" value={formData.location} onChange={handleInputChange} />
              </div>
            </div>
          </FormCard>

          {/* Logistics */}
          <FormCard title="Logistics & Goals" icon={<FiChevronRight size={13} />}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Target Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] font-black">৳</span>
                  <input
                    type="number" name="goalAmount" value={formData.goalAmount}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-black text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>
              <FormField label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
            </div>
          </FormCard>

          {/* Story */}
          <FormCard title="Detailed Narrative" icon={<FiChevronRight size={13} />}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="7"
              className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 rounded-xl text-sm font-medium leading-relaxed text-gray-700 outline-none resize-none transition-all"
            />
          </FormCard>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full py-3.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/20 flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
          >
            {updateMutation.isPending ? <FiLoader className="animate-spin" size={15} /> : <FiSave size={15} />}
            {campaign.status === "active" ? "Submit Review Request" : "Commit Changes"}
          </button>
        </form>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Documents */}
          <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden lg:sticky lg:top-6">
            <div className="px-5 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
              <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                <FiShield size={13} />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Trust Documents</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Admin Locked</p>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider mb-2">
                  Verified ({campaign.verificationDetails?.documents?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {campaign.verificationDetails?.documents?.map((_, i) => (
                    <div key={i} className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                      <FiCheckCircle size={14} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#F0F9F4]">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-wider">Add Addendum</p>
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[#E5F0EA] rounded-xl cursor-pointer hover:border-[#2D6A4F]/30 hover:bg-[#F8FDFB] transition-all">
                  <FiUpload className="text-gray-300" size={18} />
                  <span className="text-[9px] font-black text-gray-400 uppercase mt-1.5">Upload Proof</span>
                  <input type="file" multiple className="hidden" onChange={handleDocUpload} />
                </label>

                {newDocs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {newDocs.map((_, i) => (
                        <div key={i} className="relative w-10 h-10 rounded-xl bg-[#2D6A4F]/5 flex items-center justify-center text-[#2D6A4F] border border-[#2D6A4F]/10">
                          <FiUpload size={12} />
                          <button
                            onClick={() => setNewDocs(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                          >
                            <FiX size={9} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => uploadDocsMutation.mutate(newDocs)}
                      disabled={uploadDocsMutation.isPending}
                      className="w-full py-2 bg-[#2D6A4F]/10 text-[#2D6A4F] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#2D6A4F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {uploadDocsMutation.isPending ? <FiLoader className="animate-spin" size={12} /> : <FiSave size={12} />}
                      Upload {newDocs.length} Doc{newDocs.length > 1 ? "s" : ""}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10" />
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2 relative z-10">Success Manager</p>
            <h4 className="text-sm font-bold mb-3 tracking-tight leading-snug relative z-10">Need expedited review?</h4>
            <Link to="/contact-us" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#52B788] hover:text-white transition-all relative z-10">
              Speak with Admin <FiChevronRight size={11} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ─── Shared Form Components ──────────────────────────────── */

const FormCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
      <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">{icon}</div>
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const FormField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F]/40 focus:bg-white rounded-xl text-sm font-bold text-gray-900 outline-none transition-all"
    />
  </div>
);

export default MissionSettings;
