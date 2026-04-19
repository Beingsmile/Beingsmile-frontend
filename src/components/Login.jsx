import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useRegister } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import {
  FiX, FiMail, FiLock, FiEye, FiEyeOff, FiLoader,
  FiShield, FiArrowRight, FiAlertTriangle, FiCheckCircle, FiHeart
} from "react-icons/fi";

/* ── tiny helper ── */
const GreenPanel = () => (
  <div className="hidden md:flex flex-col justify-between bg-[#1B4332] rounded-l-[2rem] p-10 text-white relative overflow-hidden w-[45%] shrink-0">
    {/* decorative blobs */}
    <span className="absolute -top-16 -left-16 w-56 h-56 bg-[#2D6A4F]/40 rounded-full blur-3xl pointer-events-none" />
    <span className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#52B788]/20 rounded-full blur-3xl pointer-events-none" />

    {/* logo mark */}
    <div className="relative z-10">
      <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-8">
        <FiHeart size={22} className="text-[#52B788]" />
      </div>
      <h3 className="text-2xl font-black leading-tight tracking-tight mb-3">
        Welcome <br />
        <span className="text-[#52B788]">Back.</span>
      </h3>
      <p className="text-white/60 text-sm leading-relaxed font-medium">
        Sign in to continue supporting causes that matter and making a difference in lives across Bangladesh.
      </p>
    </div>

    {/* trust badges */}
    <div className="relative z-10 space-y-3">
      {[
        "Verified humanitarian platform",
        "Secure encrypted login",
        "Trusted by 52,000+ donors",
      ].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <FiCheckCircle size={14} className="text-[#52B788] shrink-0" />
          <span className="text-white/70 text-xs font-semibold">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const Login = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutateAsync, isPending } = useLogin();
  const { mutateAsync: registerMutate, isPending: isRegisterPending } = useRegister();
  const { setUser, loginWithEmail, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // "login" | "otp" | "suspended"
  const [errorReason, setErrorReason] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) setAuth(null);
  };
  const handleClose = () => setAuth(null);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setPendingEmail(email);
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res?.success) {
        try {
          const serverRes = await mutateAsync({ email, uid: res.user.uid });
          res.user.data = serverRes.user;
          setUser(res.user);
          setAuth(null);
          toast.success("Welcome back!");
        } catch (error) {
          if (error.response?.status === 403) {
            const msg = error.response.data.message;
            const reason = error.response.data.reason;
            if (msg === "PLEASE_VERIFY_EMAIL") {
              setStep("otp");
              await axiosInstance.post("/auth/send-otp", { email });
              toast.info("Please verify your email to continue.");
            } else if (msg === "ACCOUNT_SUSPENDED") {
              setStep("suspended");
              setErrorReason(reason);
            } else {
              toast.error(error.message);
            }
          } else {
            toast.error(`Login failed: ${error.message}`);
          }
          await logout();
          setUser(null);
        }
      }
    } catch (error) {
      toast.error("Invalid credentials or login error.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) return;
    try {
      setIsVerifying(true);
      await axiosInstance.post("/auth/verify-otp", { email: pendingEmail, otp: otpValue });
      toast.success("Email verified! Please login now.");
      setStep("login");
      setOtpValue("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoadingUI = loading || isPending || isRegisterPending;

  return (
    <div className="fixed inset-0 bg-[#0f2418]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(27,67,50,0.25)] w-full max-w-[820px] flex overflow-hidden relative"
        style={{ minHeight: 420 }}
      >
        <GreenPanel />

        {/* ── RIGHT: Form Panel ── */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer group"
            aria-label="Close"
          >
            <FiX size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* ──── LOGIN STEP ──── */}
          {step === "login" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#52B788] mb-1">Secure Access</p>
                <h2 className="text-2xl font-black text-[#0f2418] tracking-tight">Sign in to your account</h2>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                      <FiLock size={10} className="text-[#2D6A4F]" /> Password
                    </label>
                    <Link
                      to="/forgot-password"
                      onClick={handleClose}
                      className="text-[10px] font-bold text-[#2D6A4F] hover:text-[#1B4332] transition-colors uppercase tracking-wider"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
                      autoComplete="off"
                      className="w-full bg-[#F8FDFB] border-2 border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#0f2418] placeholder-gray-300 transition-all outline-none pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2D6A4F] transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoadingUI}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-wider py-3 rounded-lg transition-all shadow-lg shadow-[#2D6A4F]/20 hover:shadow-[#1B4332]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-xs flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  {isLoadingUI ? (
                    <FiLoader className="animate-spin text-lg" />
                  ) : (
                    <>
                      Sign In Securely
                      <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setAuth("register")}
                    className="text-[#2D6A4F] font-black hover:underline underline-offset-2"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ──── OTP STEP ──── */}
          {step === "otp" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-400">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#52B788] mb-1">Email Verification</p>
                <h2 className="text-2xl font-black text-[#0f2418] tracking-tight">Check your inbox</h2>
              </div>

              <div className="bg-[#F0FBF4] border border-[#D1EAD9] rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                  <FiMail size={18} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]/60 mb-0.5">Code sent to</p>
                  <p className="text-sm font-black text-[#0f2418]">{pendingEmail}</p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2">
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center block">
                  6-Digit Verification Code
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
                <p className="text-[9px] font-black uppercase tracking-widest text-[#2D6A4F]/60 text-center mt-2 flex items-center justify-center gap-1.5">
                   <FiActivity size={10} className="animate-pulse" /> This code expires in 5 minutes
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || otpValue.length !== 6}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black uppercase tracking-wider py-3 rounded-lg transition-all shadow-lg shadow-[#2D6A4F]/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? <FiLoader className="animate-spin text-lg" /> : "Verify & Continue"}
                </button>
                <button
                  onClick={() => setStep("login")}
                  className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#2D6A4F] transition-colors py-1"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* ──── SUSPENDED STEP ──── */}
          {step === "suspended" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-400 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Access Restricted</p>
                <h2 className="text-2xl font-black text-[#0f2418] tracking-tight">Account Suspended</h2>
              </div>

              <div className="bg-red-50 border-2 border-red-100 rounded-xl p-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <FiAlertTriangle size={24} className="text-red-500" />
                </div>
                <p className="text-sm font-semibold text-red-800 italic leading-relaxed max-w-xs">
                  &ldquo;{errorReason}&rdquo;
                </p>
              </div>

              <button
                onClick={() => setStep("login")}
                className="w-full bg-[#0f2418] hover:bg-black text-white font-black uppercase tracking-wider py-3 rounded-lg text-xs transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                Acknowledge &amp; Go Back
              </button>

              <p className="text-[10px] font-semibold text-gray-400 uppercase leading-snug">
                If you believe this is an error,{" "}
                <Link to="/contact-us" onClick={handleClose} className="text-[#2D6A4F] hover:underline font-bold">
                  contact support
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
