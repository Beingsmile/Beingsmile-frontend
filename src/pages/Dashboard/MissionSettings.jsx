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

  const handleDocUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Docs = await Promise.all(files.map(f => toBase64(f)));
    setNewDocs(prev => [...prev, ...base64Docs]);
  };

  if (isLoading || !formData) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-gray-500 font-bold">Failed to load mission details.</p>
      <Link to="/dashboard/manage-campaigns" className="text-primary hover:underline mt-2 inline-block">Back to My Missions</Link>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/dashboard/manage-campaigns" className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-all mb-2">
            <FiArrowLeft /> Back to My Missions
          </Link>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mission Settings</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Editing: <span className="text-primary">{campaign.title}</span>
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
        <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-2xl flex items-start gap-4">
          <FiInfo className="text-amber-500 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-amber-900">Your mission is currently active.</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              To maintain platform integrity, edits to active missions require admin review. Your changes will wait in a pending state until approved by a moderator.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="lg:col-span-2 space-y-8">
          {/* Core Info */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 space-y-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <FiChevronRight className="text-primary" /> Basic Information
            </h2>

            <div className="grid gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mission Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-bold text-gray-700 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tagline / Subtitle</label>
                <input 
                  type="text" 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="A short punchy line for cards..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-bold text-gray-700 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-bold text-gray-700 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location (District/City)</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-bold text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Goals & Deadline */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 space-y-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <FiChevronRight className="text-primary" /> Goals & Deadline
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Amount (৳)</label>
                  <input 
                    type="number" 
                    name="goalAmount"
                    value={formData.goalAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-black text-gray-700 outline-none"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">End Date</label>
                  <input 
                    type="date" 
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-primary rounded-xl text-sm font-black text-gray-700 outline-none"
                  />
               </div>
            </div>
          </section>

          {/* Story */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 space-y-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <FiChevronRight className="text-primary" /> Story (Description)
            </h2>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="10"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-100 focus:border-primary rounded-2xl text-sm leading-relaxed text-gray-600 outline-none resize-none"
            />
          </section>

          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            {updateMutation.isPending ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
            {campaign.status === "active" ? "Submit Edit Request" : "Save Changes"}
          </button>
        </form>

        {/* Sidebar Actions */}
        <aside className="space-y-8">
           {/* Document Verification Section */}
           <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6 lg:sticky lg:top-20">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FiShield className="text-primary" /> Verification Docs
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">🔒 Admin Only Access</p>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider font-bold">Already uploaded ({campaign.verificationDetails?.documents?.length || 0})</p>
                 <div className="flex flex-wrap gap-2">
                    {campaign.verificationDetails?.documents?.map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-500">
                         <FiCheckCircle size={14} />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <p className="text-xs text-gray-500 font-medium">Need to add more proof?</p>
                 <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-primary/30 transition-all bg-gray-50">
                    <FiUpload className="text-gray-300" size={20} />
                    <span className="text-[10px] font-black text-gray-400 uppercase mt-2">Upload Proof</span>
                    <input type="file" multiple className="hidden" onChange={handleDocUpload} />
                 </label>

                 {newDocs.length > 0 && (
                   <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                         {newDocs.map((_, i) => (
                            <div key={i} className="relative w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
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
                         className="w-full py-2.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                      >
                         {uploadDocsMutation.isPending ? <FiLoader className="animate-spin" /> : <FiSave size={12} />}
                         Upload {newDocs.length} Docs
                      </button>
                   </div>
                 )}
              </div>
           </section>

           {/* Support */}
           <div className="bg-[#1B4332] rounded-3xl p-6 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">Help Center</p>
              <h4 className="text-sm font-bold mb-4 tracking-tight leading-snug">Need help with your mission?</h4>
              <Link to="/contact-us" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#B7DFC9] hover:text-white transition-all">
                Contact Support <FiChevronRight />
              </Link>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default MissionSettings;
