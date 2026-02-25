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
  const { setUser, loginWithEmail, createWithGoogle, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setAuth(null);
    }
  };

  const handleClose = () => setAuth(null);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    const res = await loginWithEmail(email, password).catch((error) => {
      toast.error(`Login failed: ${error.message}`);
    });
    if (res?.success) {
      try {
        const serverRes = await mutateAsync({ email });
        res.user.data = serverRes.user;
        setUser(res.user);
        setAuth(null);
        toast.success("Login successful!");
      } catch (error) {
        await logout();
        setUser(null);
        toast.error(`Login failed. ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const userCredential = await createWithGoogle();
      const firebaseUid = userCredential.user.uid;
      try {
        const result = await axiosInstance.get(`/auth/user/exist/${firebaseUid}`);
        if (result.data?.user) {
          setUser({ ...userCredential.user, data: result.data.user });
          handleClose();
          toast.success("Login successful!");
          return;
        }
      } catch (fetchError) {
        if (fetchError.response?.status !== 404) {
          toast.error("An error occurred while checking your account.");
          return;
        }
      }
      const serverRes = await registerMutate({
        uid: firebaseUid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        avatar: userCredential.user.photoURL || "",
        bio: "",
        donatedCampaigns: [],
      });
      userCredential.user.data = serverRes.user;
      setUser(userCredential.user);
      handleClose();
      toast.success("Registration successful!");
    } catch (error) {
      setUser(null);
      toast.error(`Google authentication failed: ${error.message}`);
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
                {showPassword ? <FiEyeOff /> : <FiEye />}
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

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300 bg-white px-3">Or Continue With</div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-neutral border border-gray-200 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            onClick={handleRegisterWithGoogle}
          >
            <svg className="h-4 w-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285f4" d="M533.5 278.4c0-17.2-1.5-34-4.3-50.2H272.1v95h146.9c-6.3 34.3-25.1 63.4-53.6 82.8v68.2h86.6c50.7-46.8 81.5-115.7 81.5-195.8z" />
              <path fill="#34a853" d="M272.1 544.3c72.8 0 133.9-24.1 178.5-65.5l-86.6-68.2c-24.1 16.1-55 25.6-91.9 25.6-70.7 0-130.6-47.8-152-112.1H30.5v70.9c44.7 88.1 136.4 149.3 241.6 149.3z" />
              <path fill="#fbbc04" d="M120.1 324.3c-5.5-16.1-8.6-33.4-8.6-51.1s3.1-35 8.6-51.1V151H30.5c-17.8 35.4-28 75-28 116.1s10.2 80.7 28 116.1l89.6-58.9z" />
              <path fill="#ea4335" d="M272.1 107.7c39.8 0 75.5 13.7 103.6 40.5l77.5-77.5C406 24.1 345 0 272.1 0 166.9 0 75.2 61.2 30.5 149.3l89.6 70.9c21.4-64.4 81.3-112.5 152-112.5z" />
            </svg>
            <span>Continue with Google</span>
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
      </div>
    </div>
  );
};

export default Login;
