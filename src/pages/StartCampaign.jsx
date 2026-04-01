import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axioInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiPlus, FiImage, FiCalendar, FiTarget, FiInfo, FiActivity, FiArrowRight, FiShield, FiHeart, FiX, FiUpload, FiCheck, FiLoader, FiAlertTriangle, FiFileText } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import RequestVerification from "../components/RequestVerification";

const StartCampaign = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "health"
    }
  });

  const [loading, setLoading] = useState(false);
  const [verificationDocs, setVerificationDocs] = useState([]);
  const [missionImages, setMissionImages] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { mutateAsync } = useMutation({
    mutationFn: (campaignData) =>
      axioInstance.post("/campaigns/create", campaignData),
  });

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File "${file.name}" is too large. Max size is 2MB.`);
      return false;
    }
    return true;
  };

  const handleMissionImages = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFileSize);
    
    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    const base64s = await Promise.all(readers);
    setMissionImages(prev => [...prev, ...base64s]);
  };

  const handleVerificationDocs = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFileSize);
    
    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    const base64s = await Promise.all(readers);
    setVerificationDocs(prev => [...prev, ...base64s]);
  };

  const onSubmit = async (data) => {
    if (missionImages.length === 0) {
      toast.warning("Please upload at least one mission image.");
      return;
    }
    if (verificationDocs.length === 0) {
      toast.warning("Please upload proof documents for this mission.");
      return;
    }

    const formattedData = {
      ...data,
      coverImage: missionImages[0], // First image as cover
      images: missionImages.slice(1), // Others as extra
      endDate: new Date(data.endDate).toISOString(),
      verificationDocuments: verificationDocs,
    };
    
    setLoading(true);
    await mutateAsync(formattedData)
      .then((response) => {
        const campaignId = response?.data?.campaign?._id;
        toast.success("Mission launched successfully!");
        navigate(`/campaigns/${campaignId}`);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to launch mission");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Verification Guard UI
  if (!user?.data?.identity?.isVerified) {
    return (
      <div className="min-h-screen bg-neutral pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 text-center shadow-2xl border-8 border-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-[12rem] text-primary/5 rotate-12">
            <FiShield />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-6">
              <FiShield />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">
              Verification <span className="text-primary italic">Required</span>
            </h1>
            <p className="text-base text-gray-500 font-medium italic max-w-md mx-auto leading-relaxed">
              "To maintain the absolute integrity of our humanitarian platform, only verified fundraisers can launch missions. This ensures every smile we build is based on truth."
            </p>
            <div className="pt-6">
              <button 
                onClick={() => setShowVerificationModal(true)}
                className="px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-4 mx-auto cursor-pointer"
              >
                Become a Verified Fundraiser <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {showVerificationModal && (
          <RequestVerification 
            onClose={() => setShowVerificationModal(false)} 
            onSubmitted={() => {
              toast.info("Thank you! Once an admin verifies your profile, you'll be able to launch missions.");
              navigate("/dashboard");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral pt-16 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none border border-primary/10">
            <FiActivity size={12} className="animate-pulse" />
            Launch Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans uppercase">
            Start Your <span className="text-primary italic">Story</span>
          </h1>
          <p className="text-base text-gray-500 font-medium max-w-xl mx-auto italic">
            "Your compassion is the spark. Fill out the mission details below and let's bring smiles to the world together."
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="bg-white rounded-[2.5rem] border-4 border-white shadow-xl shadow-gray-200/50 p-8 md:p-12 space-y-10">
            {/* Visual Section - Multiple Images */}
            <div className="space-y-6">
              <label className="flex items-center gap-3 text-sm font-black text-gray-900 uppercase tracking-widest mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <FiImage size={16} />
                </div>
                Mission Images* <span className="text-[10px] text-gray-400 normal-case ml-2">(Max 2MB per file)</span>
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {missionImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/10 group">
                    <img src={img} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setMissionImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-lg">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-neutral hover:bg-neutral/80 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleMissionImages} />
                  <FiPlus className="text-2xl text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-black uppercase text-gray-400 italic">Add Image</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiActivity className="text-primary" /> Mission Title*
                </label>
                <input
                  {...register("title", {
                    required: "A meaningful title is required",
                    maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
                  })}
                  placeholder="e.g. Help Build a Healthier Future"
                  className={`w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-xl outline-none text-gray-900 font-bold transition-all placeholder:text-gray-300 font-sans ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiTarget className="text-primary" /> Goal Amount (৳)*
                </label>
                <input
                  type="number"
                  {...register("goalAmount", {
                    required: "Goal is required",
                    min: { value: 10, message: "Min ৳10" },
                    valueAsNumber: true,
                  })}
                  className={`w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-xl outline-none text-gray-900 font-black transition-all ${errors.goalAmount ? "border-red-500" : ""}`}
                />
                {errors.goalAmount && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.goalAmount.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Field*
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-xl outline-none text-gray-900 font-black uppercase tracking-widest text-xs transition-all appearance-none cursor-pointer"
                >
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="environment">Environment</option>
                  <option value="community">Community</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiCalendar className="text-primary" /> Mission Deadline*
                </label>
                <input
                  type="datetime-local"
                  {...register("endDate", {
                    required: "Deadline is required",
                    validate: (value) => new Date(value) > new Date() || "Date must be in the future",
                  })}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-xl outline-none text-gray-900 font-bold transition-all ${errors.endDate ? "border-red-500" : ""}`}
                />
                {errors.endDate && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.endDate.message}</p>}
              </div>
            </div>

            {/* Mandatory Proof Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                <FiFileText className="text-primary" /> Proof of Need (Relevant Documents)* <span className="text-[10px] normal-case ml-2">(Max 2MB per file)</span>
              </label>
              <div className="p-8 bg-neutral rounded-[2rem] border-2 border-dashed border-gray-200">
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={handleVerificationDocs}
                  className="hidden"
                  id="mission-doc-upload"
                />
                <label htmlFor="mission-doc-upload" className="cursor-pointer flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-50">
                    <FiUpload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight text-gray-900 mb-1">Upload Proof Documents</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">
                      Medical records, legal papers, or any relevant evidence <br/> proving why this mission is necessary.
                    </p>
                  </div>
                </label>

                {verificationDocs.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {verificationDocs.map((doc, idx) => (
                      <div key={idx} className="relative w-20 h-20 bg-white rounded-2xl border-2 border-primary/5 p-1 shadow-sm group">
                        {doc.startsWith('data:image') ? (
                          <img src={doc} className="w-full h-full object-cover rounded-xl" alt="Doc" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black uppercase text-primary gap-1">
                            <FiFileText size={18} />
                            <span>PDF</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setVerificationDocs(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-lg w-6 h-6 flex items-center justify-center shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                <FiHeart className="text-primary" /> The Impact Story*
              </label>
              <textarea
                rows={6}
                {...register("description", {
                  required: "Your story is crucial for donors",
                  minLength: { value: 50, message: "Please share at least 50 characters of your story" }
                })}
                placeholder="Share the details of your mission and why it matters..."
                className={`w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-medium leading-relaxed transition-all resize-none placeholder:text-gray-300 ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.description.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50"
              >
                {loading ? <FiLoader className="animate-spin" /> : "Launch Humanitarian Mission"}
                {!loading && <FiArrowRight />}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 italic">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiShield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Truth Enforcement</p>
              <p className="text-xs text-gray-500 font-medium italic">"Every document is reviewed manually for absolute integrity."</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiHeart size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Zero Leakage</p>
              <p className="text-xs text-gray-500 font-medium italic">"100% of reach ensures zero platform fees for pure impact."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCampaign;
