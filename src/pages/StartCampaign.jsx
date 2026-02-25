import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axioInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiPlus, FiImage, FiCalendar, FiTarget, FiInfo, FiActivity, FiArrowRight, FiShield } from "react-icons/fi";

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

  return (
    <div className="min-h-screen bg-neutral pt-40 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <FiTarget />
            Ignite Hope
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight font-sans leading-none uppercase">
            Launch Your <br /><span className="text-primary italic">Mission</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Your story has the power to change lives. Share your vision, build your community, and start creating impact today.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Guidance Sidebar */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                <FiInfo className="text-primary" /> Hero Guidelines
              </h2>
              <ul className="space-y-4">
                {[
                  { text: "Choose an emotional title", icon: <FiActivity /> },
                  { text: "Add an authentic cover", icon: <FiImage /> },
                  { text: "Set an achievable goal", icon: <FiTarget /> },
                  { text: "Be honest in your story", icon: <FiHeart /> },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-neutral rounded-2xl border border-gray-50 group hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pt-3 leading-none">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-accent p-8 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-accent/20 relative overflow-hidden">
              <FiShield className="text-4xl animate-pulse relative z-10" />
              <div className="space-y-2 relative z-10 font-sans">
                <h4 className="text-xl font-black uppercase tracking-tight leading-tight">Verified <br />Trust</h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed italic">"Every mission is reviewed to ensure the highest integrity of impact."</p>
              </div>
              <div className="absolute -bottom-10 -right-10 text-[10rem] text-white/10 rotate-12 select-none">
                <FiShield />
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <main className="lg:col-span-8 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white p-10 md:p-16">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Mission Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiActivity className="text-primary" /> Mission Title*
                </label>
                <input
                  {...register("title", {
                    required: "A meaningful title is required",
                    maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
                  })}
                  placeholder="e.g. Help Build a Healthier Future for Orphans"
                  className={`w-full px-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-bold transition-all placeholder:text-gray-300 font-sans ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.title.message}</p>}
              </div>

              {/* Impact Story */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiHeart className="text-primary" /> The Impact Story*
                </label>
                <textarea
                  rows={8}
                  {...register("description", {
                    required: "Your story is crucial for donors",
                    maxLength: { value: 5000, message: "Description cannot exceed 5000 characters" },
                  })}
                  placeholder="Share the details of your mission, who it helps, and why it matters..."
                  className={`w-full px-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2.5rem] outline-none text-gray-900 font-medium leading-relaxed transition-all resize-none placeholder:text-gray-300 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.description.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                    Field*
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full px-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-black uppercase tracking-widest text-xs transition-all appearance-none cursor-pointer"
                  >
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="environment">Environment</option>
                    <option value="animals">Animals</option>
                    <option value="community">Community</option>
                    <option value="art">Art</option>
                    <option value="technology">Technology</option>
                    <option value="other">Others</option>
                  </select>
                </div>

                {/* Goal Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                    Goal Amount (৳)*
                  </label>
                  <input
                    type="number"
                    {...register("goalAmount", {
                      required: "Goal is required",
                      min: { value: 10, message: "Min ৳10" },
                      valueAsNumber: true,
                    })}
                    className={`w-full px-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-black transition-all ${errors.goalAmount ? "border-red-500" : ""}`}
                  />
                  {errors.goalAmount && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.goalAmount.message}</p>}
                </div>
              </div>

              {/* Cover Mission Image */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 flex items-center gap-2">
                  <FiImage className="text-primary" /> Visual Identity*
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
                  <div className={`w-full h-48 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all group-hover:bg-neutral ${watch("coverImage") ? "border-primary/50" : "border-gray-200"}`}>
                    {watch("coverImage") ? (
                      <img src={watch("coverImage")} className="w-full h-full object-cover rounded-[2.2rem]" alt="Preview" />
                    ) : (
                      <div className="text-center space-y-2">
                        <FiPlus className="mx-auto text-4xl text-gray-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add Cover Image</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* End Deadline */}
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
                  className={`w-full px-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-bold transition-all ${errors.endDate ? "border-red-500" : ""}`}
                />
                {errors.endDate && <p className="text-[10px] font-black uppercase text-red-500 ml-4">{errors.endDate.message}</p>}
              </div>

              {/* Launch Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-10 py-6 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Launching Mission...
                    </div>
                  ) : (
                    <>
                      Launch Humanitarian Mission
                      <FiArrowRight />
                    </>
                  )}
                </button>
                <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mt-6">
                  By launching, you agree to our Humanitarian Trust Policy.
                </p>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StartCampaign;
