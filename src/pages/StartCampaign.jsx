import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FiShield, FiImage, FiTarget, FiCalendar, FiFileText, FiHeart,
  FiArrowRight, FiArrowLeft, FiCheck, FiX, FiUpload, FiLoader,
  FiAlertTriangle, FiEye, FiLock, FiInfo, FiMapPin, FiTag,
  FiPlus,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import RequestVerification from "../components/RequestVerification";
import axioInstance from "../api/axiosInstance";

// ── 17 comprehensive categories ───────────────────────────────────────────────
const CATEGORIES = [
  { value: "Education",                icon: "📚", desc: "Schools, scholarships, skill training" },
  { value: "Health & Medical",         icon: "🏥", desc: "Medical bills, treatment, equipment" },
  { value: "Disaster Relief",          icon: "🆘", desc: "Flood, cyclone, fire, earthquake aid" },
  { value: "Poverty & Food",           icon: "🍛", desc: "Food security, poverty alleviation" },
  { value: "Environment",             icon: "🌱", desc: "Climate, trees, clean water" },
  { value: "Animals",                  icon: "🐾", desc: "Animal rescue, shelters, vet care" },
  { value: "Community Development",    icon: "🏘️", desc: "Infrastructure, public spaces" },
  { value: "Arts & Culture",           icon: "🎨", desc: "Art, music, heritage preservation" },
  { value: "Technology & Innovation",  icon: "💡", desc: "Tech for good, digital inclusion" },
  { value: "Women Empowerment",        icon: "👩", desc: "Women's rights, safety, livelihood" },
  { value: "Child Welfare",            icon: "👶", desc: "Orphans, child nutrition, protection" },
  { value: "Elderly Care",             icon: "👴", desc: "Old-age homes, elder support" },
  { value: "Mental Health",            icon: "🧠", desc: "Counseling, awareness, therapy" },
  { value: "Sports & Fitness",         icon: "⚽", desc: "Sports for youth, fitness access" },
  { value: "Religious & Spiritual",    icon: "🕌", desc: "Mosques, temples, religious causes" },
  { value: "Legal Aid",                icon: "⚖️", desc: "Legal support for those in need" },
  { value: "Others",                   icon: "✨", desc: "Any other cause that matters" },
];

const STEPS = [
  { id: 1, label: "Basics",     icon: <FiTag /> },
  { id: 2, label: "Media",      icon: <FiImage /> },
  { id: 3, label: "Funding",    icon: <FiTarget /> },
  { id: 4, label: "Story",      icon: <FiHeart /> },
  { id: 5, label: "Documents",  icon: <FiLock /> },
  { id: 6, label: "Policies",   icon: <FiShield /> },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const toBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

const validateFiles = (files) => {
  const valid = [];
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE) {
      toast.error(`"${f.name}" exceeds 2MB — skipped.`);
    } else {
      valid.push(f);
    }
  }
  return valid;
};

// ── Field helpers ─────────────────────────────────────────────────────────────
const FormField = ({ label, hint, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
      {hint && <span className="ml-2 normal-case font-normal text-gray-400 text-[10px]">({hint})</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <FiAlertTriangle size={11} /> {error}
      </p>
    )}
  </div>
);

const inputCls = (err) =>
  `w-full px-4 py-3 bg-[#F8FDFB] border rounded-lg text-sm text-gray-800 font-medium outline-none transition-all placeholder:text-gray-300 ${
    err ? "border-red-400 focus:border-red-400" : "border-[#E5F0EA] focus:border-[#2D6A4F]"
  }`;

// ── Policies ──────────────────────────────────────────────────────────────────
const POLICIES = [
  {
    title: "Authenticity & Honesty Policy",
    icon: "📋",
    body: `All information submitted in this mission form must be truthful, accurate, and verifiable. Any deliberate misrepresentation, fabrication, or exaggeration of facts — including the cause, beneficiaries, or required amount — will result in immediate suspension of the mission and permanent account ban. BeingSmile reserves the right to investigate any mission at any time.`,
  },
  {
    title: "Mandatory Proof of Need",
    icon: "🔒",
    body: `You are required to upload solid, verifiable documents proving the legitimacy of your mission. Acceptable documents include: medical reports, hospital bills, legal papers, official letters, government certifications, or photographs. Vague documents or documents that cannot be verified by the BeingSmile review team will result in rejection. More documents = faster approval.`,
  },
  {
    title: "Document Visibility Policy",
    icon: "👁️",
    body: `All mission images (cover photo and gallery images) are PUBLIC and will be visible to all visitors, donors, and the general public. Verification documents are STRICTLY PRIVATE — they are only visible to BeingSmile administrators during the review process. Donors, general users, and third parties will NEVER see your private verification documents.`,
  },
  {
    title: "Payout & Withdrawal Policy",
    icon: "💰",
    body: `Funds are held securely in the BeingSmile escrow system. After your campaign ends or you request a withdrawal: (1) A mandatory 30-day hold period applies to allow for dispute resolution. (2) Full KYC (Know Your Customer) verification is required before any payout is processed. (3) The minimum withdrawal amount is ৳500. (4) Platform processing may take 3–7 business days after approval. (5) BeingSmile is not responsible for delays caused by banking institutions.`,
  },
  {
    title: "Platform Fee Policy",
    icon: "⚖️",
    body: `BeingSmile operates on a near-zero-commission model to maximise impact. A small, optional platform fee may be suggested to donors to help cover server, security, and operational costs. This fee is transparently shown to donors and is NEVER deducted from your mission goal without your knowledge. Fundraisers do not pay any upfront fees.`,
  },
  {
    title: "Content Moderation Policy",
    icon: "🛡️",
    body: `BeingSmile administrators reserve the right to: edit mission titles for clarity, request additional information, temporarily pause a mission for review, permanently suspend missions that violate platform policies, and remove content that is deemed inappropriate, offensive, or fraudulent. All moderation actions are communicated via notifications.`,
  },
  {
    title: "Mission Duration Policy",
    icon: "📅",
    body: `Missions must have a defined end date. The minimum campaign duration is 3 days, and the maximum is 365 days. You may request a deadline extension through mission settings, subject to admin approval. Automatically completed missions (100% funded) will still accept donations until the deadline unless manually closed.`,
  },
];

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function StartCampaign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVerifModal, setShowVerifModal] = useState(false);

  // Media state
  const [coverImage, setCoverImage] = useState(null);       // base64
  const [coverPreview, setCoverPreview] = useState(null);   // object URL
  const [galleryImages, setGalleryImages] = useState([]);   // [{base64, preview}]
  const [verDocs, setVerDocs] = useState([]);               // [{base64, name, isImage}]

  // Policy acceptance
  const [openPolicy, setOpenPolicy] = useState(null);
  const [policyChecks, setPolicyChecks] = useState({
    authenticity: false,
    proof: false,
    visibility: false,
    payout: false,
    fee: false,
    moderation: false,
    duration: false,
  });
  const allPoliciesAccepted = Object.values(policyChecks).every(Boolean);

  const {
    register, handleSubmit, watch, trigger,
    formState: { errors },
  } = useForm({ defaultValues: { category: "Health & Medical", goalAmount: 5000 } });

  const descVal = watch("description") || "";

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const { mutateAsync } = useMutation({
    mutationFn: (data) => axioInstance.post("/campaigns/create", data),
  });

  // ── File handlers ─────────────────────────────────────────────
  const handleCoverUpload = async (e) => {
    const file = validateFiles(Array.from(e.target.files))[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setCoverImage(b64);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryUpload = async (e) => {
    const files = validateFiles(Array.from(e.target.files));
    const results = await Promise.all(
      files.map(async (f) => ({ base64: await toBase64(f), preview: URL.createObjectURL(f) }))
    );
    setGalleryImages((p) => [...p, ...results].slice(0, 5));
  };

  const handleDocUpload = async (e) => {
    const files = validateFiles(Array.from(e.target.files));
    const results = await Promise.all(
      files.map(async (f) => ({
        base64: await toBase64(f),
        name: f.name,
        isImage: f.type.startsWith("image/"),
      }))
    );
    setVerDocs((p) => [...p, ...results]);
  };

  // ── Step validation ───────────────────────────────────────────
  const validateStep = async (s) => {
    const fieldMap = {
      1: ["title", "category", "tagline"],
      2: [],
      3: ["goalAmount", "endDate"],
      4: ["description"],
      5: [],
      6: [],
    };
    const fields = fieldMap[s] || [];
    if (fields.length) {
      const ok = await trigger(fields);
      if (!ok) return false;
    }
    if (s === 2 && !coverImage) {
      toast.warning("Please upload a cover image.");
      return false;
    }
    if (s === 5 && verDocs.length === 0) {
      toast.warning("Please upload at least one verification document.");
      return false;
    }
    return true;
  };

  const goNext = async () => {
    if (await validateStep(step)) setStep((p) => Math.min(p + 1, 6));
  };
  const goPrev = () => setStep((p) => Math.max(p - 1, 1));

  // ── Submit ────────────────────────────────────────────────────
  const onSubmit = async (formData) => {
    if (!allPoliciesAccepted) {
      toast.error("Please accept all platform policies before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        goalAmount: Number(formData.goalAmount),
        coverImage,
        images: galleryImages.map((g) => g.base64),
        verificationDocuments: verDocs.map((d) => d.base64),
        endDate: new Date(formData.endDate).toISOString(),
      };
      const res = await mutateAsync(payload);
      toast.success("Mission submitted for admin review! 🎉");
      navigate(`/campaigns/${res.data.campaign._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit mission");
    } finally {
      setLoading(false);
    }
  };

  // ── Verification guard ────────────────────────────────────────
  if (!user?.data?.identity?.isVerified) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-xl border border-[#E5F0EA] shadow-sm p-10 text-center">
          <div className="w-14 h-14 bg-[#F0FBF4] rounded-xl flex items-center justify-center text-[#2D6A4F] mx-auto mb-5">
            <FiShield size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification <span className="text-[#2D6A4F]">Required</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm mx-auto">
            To protect our platform's integrity, only verified fundraisers can launch missions. 
            Complete your identity verification to get started.
          </p>
          <button
            onClick={() => setShowVerifModal(true)}
            className="btn-primary mx-auto"
          >
            Become a Verified Fundraiser <FiArrowRight size={14} />
          </button>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-400">
            {["🔒 Secure", "✅ Transparent", "⚡ Fast Review"].map((t) => (
              <div key={t} className="bg-[#F8FDFB] rounded-lg px-2 py-2 font-medium">{t}</div>
            ))}
          </div>
        </div>
        {showVerifModal && (
          <RequestVerification
            onClose={() => setShowVerifModal(false)}
            onSubmitted={() => {
              toast.info("Verification submitted! You'll be notified once approved.");
              navigate("/dashboard/verification-status");
            }}
          />
        )}
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#F0FBF4] border-b border-[#D1EAD9] pt-20 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-1">Launch Mission</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Start Your <em className="not-italic text-[#2D6A4F]">Story</em>
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#E5F0EA] -z-0" />
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step === s.id
                  ? "bg-[#2D6A4F] text-white shadow-md"
                  : step > s.id
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white border-2 border-[#E5F0EA] text-gray-400"
                }`}
              >
                {step > s.id ? <FiCheck size={14} /> : s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide hidden sm:block ${
                step >= s.id ? "text-[#2D6A4F]" : "text-gray-400"
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl border border-[#E5F0EA] shadow-sm p-6 md:p-8 space-y-6">

            {/* ── STEP 1: BASICS ────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Mission Basics</h2>
                  <p className="text-xs text-gray-400">Tell us what this mission is about.</p>
                </div>

                <FormField label="Mission Title *" hint="10–100 characters" error={errors.title?.message}>
                  <input
                    {...register("title", {
                      required: "A meaningful title is required",
                      minLength: { value: 10, message: "Min 10 characters" },
                      maxLength: { value: 100, message: "Max 100 characters" },
                    })}
                    placeholder="e.g. Help Build a Clean Water Source for Char Areas"
                    className={inputCls(errors.title)}
                  />
                </FormField>

                <FormField label="Tagline" hint="optional, max 120 chars" error={errors.tagline?.message}>
                  <input
                    {...register("tagline", { maxLength: { value: 120, message: "Max 120 characters" } })}
                    placeholder="A short, memorable line about your mission"
                    className={inputCls(errors.tagline)}
                  />
                </FormField>

                <FormField label="Category *" error={errors.category?.message}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = watch("category") === cat.value;
                      return (
                        <label
                          key={cat.value}
                          className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-all text-xs ${
                            selected
                              ? "border-[#2D6A4F] bg-[#F0FBF4] text-[#2D6A4F]"
                              : "border-[#E5F0EA] hover:border-[#2D6A4F] text-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            value={cat.value}
                            {...register("category", { required: true })}
                            className="hidden"
                          />
                          <span className="text-base leading-none mt-0.5">{cat.icon}</span>
                          <div>
                            <p className="font-bold leading-tight">{cat.value}</p>
                            <p className="text-gray-400 font-normal text-[10px] mt-0.5">{cat.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </FormField>

                <FormField label="Location" hint="city / district / region">
                  <div className="relative">
                    <FiMapPin size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      {...register("location")}
                      placeholder="e.g. Sylhet, Bangladesh"
                      className={`${inputCls(null)} pl-9`}
                    />
                  </div>
                </FormField>
              </div>
            )}

            {/* ── STEP 2: MEDIA ─────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Mission Media</h2>
                  <div className="mt-2 p-3 bg-[#F0FBF4] border border-[#D1EAD9] rounded-lg flex items-start gap-2 text-xs text-[#2D6A4F]">
                    <FiEye size={14} className="flex-shrink-0 mt-0.5" />
                    <p><strong>Public:</strong> All images uploaded here are <strong>publicly visible</strong> to donors and visitors.</p>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Cover Image * <span className="normal-case font-normal text-gray-400">(main photo shown on campaign cards)</span>
                  </label>
                  {coverPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#E5F0EA] aspect-video">
                      <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                      <button
                        type="button"
                        onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center"
                      >
                        <FiX size={13} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-[#2D6A4F] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        COVER
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 aspect-video bg-[#F8FDFB] border-2 border-dashed border-[#D1EAD9] rounded-xl cursor-pointer hover:border-[#2D6A4F] transition-colors">
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                      <FiUpload size={24} className="text-[#2D6A4F]" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">Upload Cover Image</p>
                        <p className="text-xs text-gray-400 mt-0.5">Max 2MB · JPG, PNG, WebP</p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Additional Images <span className="normal-case font-normal text-gray-400">(up to 5 extra photos)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5F0EA]">
                        <img src={img.preview} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages((p) => p.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                    {galleryImages.length < 5 && (
                      <label className="aspect-square flex flex-col items-center justify-center bg-[#F8FDFB] border-2 border-dashed border-[#D1EAD9] rounded-lg cursor-pointer hover:border-[#2D6A4F] transition-colors">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                        <FiPlus size={18} className="text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1">Add</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: FUNDING ───────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Funding Details</h2>
                  <p className="text-xs text-gray-400">Set your goal and campaign deadline.</p>
                </div>

                <FormField label="Goal Amount (৳) *" hint="minimum ৳100" error={errors.goalAmount?.message}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] font-bold text-sm">৳</span>
                    <input
                      type="number"
                      {...register("goalAmount", {
                        required: "Goal amount is required",
                        min: { value: 100, message: "Minimum goal is ৳100" },
                        valueAsNumber: true,
                      })}
                      className={`${inputCls(errors.goalAmount)} pl-9`}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { document.querySelector('input[name="goalAmount"]').value = amt; }}
                        className="px-3 py-1 text-[10px] font-bold bg-[#F0FBF4] text-[#2D6A4F] border border-[#D1EAD9] rounded-md hover:bg-[#2D6A4F] hover:text-white transition-colors"
                      >
                        ৳{(amt/1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Campaign Deadline *" hint="minimum 3 days from today" error={errors.endDate?.message}>
                  <div className="relative">
                    <FiCalendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="datetime-local"
                      {...register("endDate", {
                        required: "Deadline is required",
                        validate: (val) => {
                          const minDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                          return new Date(val) > minDate || "Deadline must be at least 3 days from now";
                        },
                      })}
                      min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      className={`${inputCls(errors.endDate)} pl-9`}
                    />
                  </div>
                </FormField>

                {/* Payout info box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-2">
                    <FiInfo size={13} /> Payout Information
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                    <li>A 30-day hold applies after your campaign ends</li>
                    <li>Full KYC verification is required before any withdrawal</li>
                    <li>Minimum withdrawal is ৳500</li>
                    <li>Processing takes 3–7 business days after approval</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ── STEP 4: STORY ─────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Mission Story</h2>
                  <p className="text-xs text-gray-400">Write a compelling description. Be detailed and honest — this is how you earn donors' trust.</p>
                </div>

                <FormField
                  label="Full Description *"
                  hint={`${descVal.length}/10000 · min 200 chars`}
                  error={errors.description?.message}
                >
                  <textarea
                    rows={12}
                    {...register("description", {
                      required: "Your story is crucial for donors",
                      minLength: { value: 200, message: "Please write at least 200 characters" },
                      maxLength: { value: 10000, message: "Max 10,000 characters" },
                    })}
                    placeholder={`Tell your story in detail:\n\n• Who is this mission for?\n• What is the specific problem or need?\n• How will the funds be used exactly?\n• What will change if this mission succeeds?\n• Why should donors trust you?`}
                    className={inputCls(errors.description) + " resize-none leading-relaxed"}
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                    <span>{descVal.length < 200 ? `${200 - descVal.length} more chars needed` : "✓ Minimum met"}</span>
                    <span>{descVal.length} / 10,000</span>
                  </div>
                </FormField>

                <div className="p-4 bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl text-xs text-[#2D6A4F] space-y-1">
                  <p className="font-bold flex items-center gap-1.5"><FiInfo size={12} /> Writing Tips</p>
                  <p className="text-gray-500">Be specific about who benefits, exactly how funds will be spent, and include a personal connection to the cause. Missions with detailed descriptions raise 3× more on average.</p>
                </div>
              </div>
            )}

            {/* ── STEP 5: DOCUMENTS ─────────────────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Verification Documents</h2>
                  <div className="mt-2 p-4 bg-[#1B4332] rounded-xl flex items-start gap-3 text-white">
                    <FiLock size={18} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold mb-1">Admin-Only — Strictly Private</p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        These documents are <strong>never shown to donors or the public</strong>. They are reviewed 
                        <strong> only by BeingSmile administrators</strong> to verify your mission's legitimacy. 
                        Providing solid, clear documents will speed up your approval significantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Accepted Documents</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                    {[
                      "Medical reports / hospital bills",
                      "Doctor's prescription",
                      "Legal documents / court orders",
                      "Official government letters",
                      "Expense estimates / invoices",
                      "School / NGO certificates",
                      "Photographs of the situation",
                      "Bank statements",
                      "ID cards of beneficiaries",
                    ].map((doc) => (
                      <div key={doc} className="flex items-center gap-1.5 p-2 bg-[#F8FDFB] rounded-lg border border-[#E5F0EA]">
                        <FiCheck size={11} className="text-[#2D6A4F] flex-shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex flex-col items-center justify-center gap-3 py-8 bg-[#F8FDFB] border-2 border-dashed border-[#D1EAD9] rounded-xl cursor-pointer hover:border-[#2D6A4F] transition-colors">
                    <input type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleDocUpload} />
                    <div className="w-12 h-12 bg-[#F0FBF4] rounded-xl flex items-center justify-center text-[#2D6A4F]">
                      <FiUpload size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Upload Documents</p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF or Images · Max 2MB per file</p>
                    </div>
                  </label>

                  {verDocs.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {verDocs.map((doc, i) => (
                        <div key={i} className="relative">
                          <div className="aspect-square bg-[#F8FDFB] rounded-lg border border-[#E5F0EA] flex flex-col items-center justify-center gap-1 overflow-hidden">
                            {doc.isImage ? (
                              <img src={doc.base64} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <>
                                <FiFileText size={20} className="text-[#2D6A4F]" />
                                <span className="text-[9px] text-gray-400 px-1 truncate w-full text-center">PDF</span>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setVerDocs((p) => p.filter((_, idx) => idx !== i))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 6: POLICIES ──────────────────────────────── */}
            {step === 6 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-0.5">Platform Policies</h2>
                  <p className="text-xs text-gray-500">Read and accept all policies before submitting your mission for review.</p>
                </div>

                <div className="space-y-3">
                  {POLICIES.map((policy, i) => {
                    const key = Object.keys(policyChecks)[i];
                    const isOpen = openPolicy === i;
                    const accepted = policyChecks[key];
                    return (
                      <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${accepted ? "border-[#2D6A4F]" : "border-[#E5F0EA]"}`}>
                        <button
                          type="button"
                          onClick={() => setOpenPolicy(isOpen ? null : i)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{policy.icon}</span>
                            <span className={`text-sm font-semibold ${accepted ? "text-[#2D6A4F]" : "text-gray-700"}`}>{policy.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {accepted && <FiCheck size={14} className="text-[#2D6A4F]" />}
                            <span className="text-gray-400 text-xs">{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-xs text-gray-600 leading-relaxed bg-[#F8FDFB] p-3 rounded-lg border border-[#E5F0EA] mb-3">
                              {policy.body}
                            </p>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setPolicyChecks((p) => ({ ...p, [key]: e.target.checked }))}
                                className="w-4 h-4 accent-[#2D6A4F]"
                              />
                              <span className="text-xs font-semibold text-gray-700">I have read and accept this policy</span>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                {allPoliciesAccepted && (
                  <div className="p-4 bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2D6A4F] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiCheck size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2D6A4F]">All policies accepted!</p>
                      <p className="text-xs text-gray-500">Your mission will be submitted for admin review upon clicking submit.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-500 border border-[#E5F0EA] rounded-lg hover:border-[#2D6A4F] hover:text-[#2D6A4F] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiArrowLeft size={14} /> Previous
            </button>

            {step < 6 ? (
              <button
                type="button"
                onClick={goNext}
                className="btn-primary"
              >
                Next Step <FiArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !allPoliciesAccepted}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><FiLoader className="animate-spin" size={14} /> Submitting...</>
                ) : (
                  <>Submit Mission <FiArrowRight size={14} /></>
                )}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Step {step} of {STEPS.length} — Your progress is saved as you go
          </p>
        </form>
      </div>
    </div>
  );
}
