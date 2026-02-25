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
    const { email, password } = data;
    setLoading(true);

    const res = await loginWithEmail(email, password).catch((error) => {
      toast.error(`Login failed: ${error.message}`);
    });

    if (res.success) {
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
          console.error("Error fetching user:", fetchError);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isLoadingUI = loading || isPending || isRegisterPending;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-[3rem] shadow-2xl p-10 w-full max-w-md relative border-8 border-white animate-in zoom-in-95 duration-300"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 w-10 h-10 bg-neutral rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group"
          aria-label="Close"
        >
          <FiX className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="text-center mb-10 space-y-2">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4">
            <FiShield />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight font-sans uppercase">
            Welcome <span className="text-primary">Back</span>
          </h2>
          <p className="text-sm font-medium text-gray-500">Secure access to your humanitarian dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 transition-all outline-none"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase ml-4">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Security Password</label>
            <div className="relative group">
              <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white pl-14 pr-14 py-4 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 transition-all outline-none"
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

          <div className="flex items-center justify-between px-4">
            <Link
              to="/forgot-password"
              onClick={handleClose}
              className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
            >
              Forgot Identity?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoadingUI}
            className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs"
          >
            {isLoadingUI ? <FiLoader className="animate-spin mx-auto text-xl" /> : "Secure Login"}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest bg-white px-4 text-gray-300">Or Continue With</div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-4 bg-neutral py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
            onClick={handleRegisterWithGoogle}
          >
            <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285f4" d="M533.5 278.4c0-17.2-1.5-34-4.3-50.2H272.1v95h146.9c-6.3 34.3-25.1 63.4-53.6 82.8v68.2h86.6c50.7-46.8 81.5-115.7 81.5-195.8z" />
              <path fill="#34a853" d="M272.1 544.3c72.8 0 133.9-24.1 178.5-65.5l-86.6-68.2c-24.1 16.1-55 25.6-91.9 25.6-70.7 0-130.6-47.8-152-112.1H30.5v70.9c44.7 88.1 136.4 149.3 241.6 149.3z" />
            </svg>
            <span>Google Safety</span>
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Joining for the first time?{" "}
            <button
              onClick={() => setAuth("register")}
              className="text-primary hover:underline ml-1"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
