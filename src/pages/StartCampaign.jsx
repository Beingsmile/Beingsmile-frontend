import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axioInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiPlus, FiImage, FiCalendar, FiTarget, FiInfo, FiActivity, FiArrowRight, FiShield, FiHeart } from "react-icons/fi";

const StartCampaign = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { mutateAsync } = useMutation({
    mutationFn: (campaignData) =>
      axioInstance.post("/campaigns/create", campaignData),
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      endDate: new Date(data.endDate).toISOString(),
    };
    setLoading(true);
    await mutateAsync(formattedData)
      .then((response) => {
        const campaignId = response?.data?.campaign?._id;
        toast.success("Mission launched successfully!");
        navigate(`/campaigns/${campaignId}`);
      })
      .catch((error) => {
        toast.error("Failed to launch mission: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const coverImage = watch("coverImage");

  return (
    <div className="min-h-screen bg-neutral pt-16 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
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
          {/* Card Based Layout */}
          <div className="bg-white rounded-[2rem] border-4 border-white shadow-xl shadow-gray-200/50 p-8 md:p-12 space-y-10">
            {/* Visual Section */}
            <div className="space-y-6">
              <label className="flex items-center gap-3 text-sm font-black text-gray-900 uppercase tracking-widest mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <FiImage size={16} />
                </div>
                Mission Cover
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => setValue("coverImage", reader.result);
                    reader.readAsDataURL(file);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full aspect-[16/9] border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center transition-all group-hover:bg-neutral ${coverImage ? "border-primary/50" : "border-gray-200"}`}>
                  {coverImage ? (
                    <img src={coverImage} className="w-full h-full object-cover rounded-[1.4rem]" alt="Preview" />
                  ) : (
                    <div className="text-center space-y-2">
                      <FiPlus className="mx-auto text-4xl text-gray-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add Cover Image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Groups */}
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

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                <FiHeart className="text-primary" /> The Impact Story*
              </label>
              <textarea
                rows={6}
                {...register("description", {
                  required: "Your story is crucial for donors",
                })}
                placeholder="Share the details of your mission..."
                className={`w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-medium leading-relaxed transition-all resize-none placeholder:text-gray-300 ${errors.description ? "border-red-500" : ""}`}
              />
            </div>

            {/* Launch Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Launching Mission..." : "Launch Humanitarian Mission"}
                {!loading && <FiArrowRight />}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
              <FiShield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Verified Impact</p>
              <p className="text-xs text-gray-500 font-medium italic">"Every mission is reviewed for integrity."</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/5 text-accent rounded-xl flex items-center justify-center">
              <FiHeart size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Zero Platform Fee</p>
              <p className="text-xs text-gray-500 font-medium italic">"100% of donations reach the cause."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCampaign;
