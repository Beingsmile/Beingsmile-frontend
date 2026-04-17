import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegister } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import {
  FiX, FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiLoader, FiCheckCircle, FiHeart, FiActivity, FiArrowRight
} from "react-icons/fi";

/* ── decorative left panel ── */
const GreenPanel = ({ step }) => (
  <div className="hidden md:flex flex-col justify-between bg-[#1B4332] rounded-l-[2rem] p-10 text-white relative overflow-hidden w-[40%] shrink-0">
    <span className="absolute -top-16 -left-16 w-56 h-56 bg-[#2D6A4F]/40 rounded-full blur-3xl pointer-events-none" />
    <span className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#52B788]/20 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10">
      <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-8">
        <FiHeart size={22} className="text-[#52B788]" />
      </div>
      <h3 className="text-2xl font-black leading-tight tracking-tight mb-3">
        {step === 1 ? (
          <>Join the <br /><span className="text-[#52B788]">Family.</span></>
        ) : (
          <>Verify Your <br /><span className="text-[#52B788]">Identity.</span></>
        )}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed font-medium">
        {step === 1
          ? "Create your account and start making a difference in the lives of people across Bangladesh."
          : "We sent a 6-digit code to your email. Enter it below to complete your registration."}
      </p>
    </div>

    {/* Step tracker */}
    <div className="relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Registration Steps</p>
      <div className="space-y-3">
        {[
          { num: 1, label: "Account Details" },
          { num: 2, label: "Email Verification" },
        ].map(({ num, label }) => (
          <div key={num} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 ${
                step >= num
                  ? "bg-[#52B788] text-[#1B4332]"
                  : "bg-white/10 border border-white/20 text-white/40"
              }`}
            >
              {step > num ? <FiCheckCircle size={12} /> : num}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= num ? "text-white" : "text-white/40"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Register = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const { setUser, createWithEmail, loading } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const {
    register, handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { mutateAsync, isPending } = useRegister();

  const handleClose = () => setAuth(null);
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) setAuth(null);
  };

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setFormData(data);
    try {
      setIsVerifying(true);
      await axiosInstance.post("/auth/send-otp", { email: data.email });
      setStep(2);
      setTimeLeft(60); // Start 60s cooldown
      toast.success("Verification code sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    try {
      setIsVerifying(true);
      await axiosInstance.post("/auth/verify-otp", { email: formData.email, otp: otpValue });
      const res = await createWithEmail(formData.email, formData.password);
      if (res.success) {
        const serverRes = await mutateAsync({
          uid: res.user.uid,
          email: formData.email,
          name: formData.name,
          avatar: res.user.photoURL || "",
          bio: "",
          donatedCampaigns: [],
          isEmailVerified: true,
        });
        res.user.data = serverRes.user;
        setUser(res.user);
        handleClose();
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0 || isResending) return;
    try {
      setIsResending(true);
      await axiosInstance.post("/auth/send-otp", { email: formData.email });
      setTimeLeft(60);
      toast.success("New verification code sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const passwordValue = watch("password");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const isLoadingUI = loading || isPending;

  return (
    <div className="fixed inset-0 bg-[#0f2418]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(27,67,50,0.25)] w-full max-w-[860px] flex overflow-hidden relative"
        style={{ maxHeight: "95vh" }}
      >
        <GreenPanel step={step} />

        {/* ── RIGHT: Form Panel ── */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer group z-10"
            aria-label="Close"
          >
            <FiX size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* ──── STEP 1: Details ──── */}
          {step === 1 && (
            <form
              className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#52B788] mb-1">Step 1 of 2</p>
                <h2 className="text-2xl font-black text-[#0f2418] tracking-tight">Create your account</h2>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                  <FiUser size={10} className="text-[#2D6A4F]" /> Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none"
                  placeholder="e.g. Atik Rahman"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                  <FiMail size={10} className="text-[#2D6A4F]" /> Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Use a valid email" },
                  })}
                  className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.email.message}</p>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                    <FiLock size={10} className="text-[#2D6A4F]" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
                      className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D6A4F] transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Confirm</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Required",
                      validate: (val) => val === passwordValue || "Passwords must match",
                    })}
                    className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || isLoadingUI}
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-wider py-3 rounded-lg transition-all shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-xs flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                {isVerifying || isLoadingUI ? (
                  <FiLoader className="animate-spin text-lg" />
                ) : (
                  <>
                    Continue to Verification
                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuth("login")}
                    className="text-[#2D6A4F] font-black hover:underline underline-offset-2"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ──── STEP 2: OTP ──── */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-400">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#52B788] mb-1">Step 2 of 2</p>
                <h2 className="text-2xl font-black text-[#0f2418] tracking-tight">Verify your email</h2>
              </div>

              <div className="bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-[#D1EAD9] flex items-center justify-center shrink-0">
                  <FiMail size={18} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]/60 mb-0.5">Verification code sent to</p>
                  <p className="text-sm font-black text-[#0f2418]">{formData?.email}</p>
                </div>
              </div>

              {/* OTP progress indicator */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5,6].map(i => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      otpValue.length >= i ? "bg-[#2D6A4F]" : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 text-center block">
                  6-Digit Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-4 py-4 rounded-lg text-center text-2xl font-black tracking-[0.5em] text-[#2D6A4F] transition-all outline-none placeholder:opacity-20"
                  placeholder="000000"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVerifyAndRegister}
                  disabled={isVerifying || otpValue.length !== 6}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-wider py-3 rounded-lg transition-all shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 text-xs flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  {isVerifying ? (
                    <FiLoader className="animate-spin text-lg" />
                  ) : (
                    <>
                      Complete Registration
                      <FiCheckCircle size={14} />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={timeLeft > 0 || isResending}
                    className="text-[10px] font-black uppercase tracking-widest text-[#2D6A4F] hover:underline disabled:opacity-30 disabled:no-underline transition-all cursor-pointer"
                  >
                    {isResending ? "Sending..." : timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend Verification Code"}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#2D6A4F] transition-colors py-1 cursor-pointer"
                  >
                    ← Edit my details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
