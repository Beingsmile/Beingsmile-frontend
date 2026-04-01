import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useRegister } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import { FiX, FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiShield } from "react-icons/fi";

const Login = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isPending } = useLogin();
  const { mutateAsync: registerMutate, isPending: isRegisterPending } = useRegister();
  const { setUser, loginWithEmail, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // "login", "otp", "suspended"
  const [errorReason, setErrorReason] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setAuth(null);
    }
  };

  const handleClose = () => setAuth(null);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setPendingEmail(email);
    setLoading(true);
    
    try {
      // 1. Firebase Login
      const res = await loginWithEmail(email, password);
      
      if (res?.success) {
        // 2. MongoDB Sync
        try {
          const serverRes = await mutateAsync({ email });
          res.user.data = serverRes.user;
          setUser(res.user);
          setAuth(null);
          toast.success("Welcome back!");
        } catch (error) {
          // Check for specific restriction errors
          if (error.response?.status === 403) {
            const msg = error.response.data.message;
            const reason = error.response.data.reason;
            
            if (msg === "PLEASE_VERIFY_EMAIL") {
              setStep("otp");
              // Automatically trigger an OTP send
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
      toast.error(`Invalid credentials or login error.`);
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
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm relative border border-gray-100 animate-in zoom-in-95 duration-200"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer"
          aria-label="Close"
        >
          <FiX className="hover:rotate-90 transition-transform" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mx-auto mb-3">
            <FiShield />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight font-sans uppercase">
            Welcome <span className="text-primary">Back</span>
          </h2>
          <p className="text-xs font-medium text-gray-400">Secure access to your humanitarian dashboard.</p>
        </div>

        {step === "login" && (
          <>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                    className="w-full bg-neutral border border-gray-200 focus:border-primary/30 focus:bg-white pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 transition-all outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Password is required" })}
                    className="w-full bg-neutral border border-gray-200 focus:border-primary/30 focus:bg-white pl-10 pr-10 py-3 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary text-sm"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  onClick={handleClose}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoadingUI}
                className="w-full bg-primary text-white font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs"
              >
                {isLoadingUI ? <FiLoader className="animate-spin mx-auto text-lg" /> : "Secure Login"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs font-medium text-gray-400">
                New to BeingSmile?{" "}
                <button
                  onClick={() => setAuth("register")}
                  className="text-primary hover:underline font-bold"
                >
                  Create account
                </button>
              </p>
            </div>
          </>
        )}

        {step === "otp" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Verification Required</p>
              <p className="text-xs font-bold text-gray-900">{pendingEmail}</p>
            </div>
            
            <input
              type="text"
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-2 py-4 rounded-xl text-center text-3xl font-black tracking-[0.4em] text-primary transition-all outline-none"
              placeholder="000000"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpValue.length !== 6}
              className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 text-[10px]"
            >
              {isVerifying ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Confirm & Unlock"}
            </button>
            <button
              onClick={() => setStep("login")}
              className="w-full text-center text-[9px] font-black uppercase text-gray-400 hover:text-primary transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {step === "suspended" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">Access Denied</p>
              <p className="text-xs font-bold text-red-900 italic leading-relaxed">
                "{errorReason}"
              </p>
            </div>
            <button
              onClick={() => setStep("login")}
              className="w-full bg-neutral text-gray-900 font-black uppercase tracking-widest py-4 rounded-xl text-[10px] hover:bg-gray-100 transition-all"
            >
              I Understand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
