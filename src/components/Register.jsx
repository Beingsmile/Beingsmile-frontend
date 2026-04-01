import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegister } from "../hooks/useAuth";
import { deleteUser } from "firebase/auth";
import axiosInstance from "../api/axiosInstance";
import { FiX, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiCheckCircle, FiHeart, FiActivity } from "react-icons/fi";

const Register = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const { setUser, createWithEmail, loading } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [formData, setFormData] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { mutateAsync, isPending } = useRegister();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setAuth(null);
    }
  };

  const handleClose = () => {
    setAuth(null);
  };

  const onSubmit = async (data) => {
    const { name, email, password, confirmPassword, userType } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setFormData(data);
    try {
      setIsVerifying(true);
      await axiosInstance.post("/auth/send-otp", { email });
      setStep(2);
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
      // 1. Verify OTP
      await axiosInstance.post("/auth/verify-otp", { 
        email: formData.email, 
        otp: otpValue 
      });

      // 2. Create in Firebase
      const res = await createWithEmail(formData.email, formData.password);

      if (res.success) {
        // 3. Register in MongoDB
        const serverRes = await mutateAsync({
          uid: res.user.uid,
          email: formData.email,
          name: formData.name,
          avatar: res.user.photoURL || "",
          bio: "",
          donatedCampaigns: [],
          userType: formData.userType,
          isEmailVerified: true, // Mark as verified immediately
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


  const passwordValue = watch("password");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isLoadingUI = loading || isPending;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-md relative border-4 border-white animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-8 h-8 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group z-10"
          aria-label="Close"
        >
          <FiX className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl mx-auto mb-3">
            <FiUser />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight font-sans uppercase">
            Join the <span className="text-primary">Family</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Choose your role and start spreading smiles.</p>
        </div>

        {step === 1 ? (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  value="donor"
                  {...register("userType")}
                  defaultChecked
                  className="peer hidden"
                />
                <div className="p-4 rounded-2xl bg-neutral border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                  <FiHeart className="mx-auto mb-2 text-primary text-xl" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Be a Donor</p>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  value="fundraiser"
                  {...register("userType")}
                  className="peer hidden"
                />
                <div className="p-4 rounded-2xl bg-neutral border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                  <FiActivity className="mx-auto mb-2 text-primary text-xl" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Need Help</p>
                </div>
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Identity</label>
              <div className="relative group">
                <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Mail Address</label>
              <div className="relative group">
                <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Magic Password</label>
              <div className="relative group">
                <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-14 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Repeat Magic</label>
              <div className="relative group">
                <FiCheckCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Confirmation is required",
                    validate: (val) => val === passwordValue || "Magic must match",
                  })}
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isVerifying || isLoadingUI}
              className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-[10px]"
            >
              {isVerifying || isLoadingUI ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Verify Email & Join"}
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="p-6 bg-neutral rounded-3xl border-2 border-primary/10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Check your email</p>
              <p className="text-sm font-bold text-gray-900">{formData?.email}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">6-Digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-6 py-5 rounded-2xl text-center text-3xl font-black tracking-[0.5em] text-primary transition-all outline-none uppercase placeholder:text-gray-300"
                placeholder="000000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerifyAndRegister}
                disabled={isVerifying || otpValue.length !== 6}
                className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-[10px]"
              >
                {isVerifying ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Finish Registration"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors text-center"
              >
                Go back and edit info
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Already part of the family?{" "}
            <button
              onClick={() => setAuth("login")}
              className="text-primary hover:underline ml-1"
            >
              Secure Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
