import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useRegister } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";

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
  // setLoading(false); // Ensure loading is false initially
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the visibility of the password
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
        setUser(res.user); // Update user state
        setAuth(null); // Close the modal on successful login
        toast.success("Login successful!");
      } catch (error) {
        await logout(); // Ensure user is logged out if server response fails
        setUser(null); // Reset user state
        toast.error(`Login failed. ${error.message}`);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const userCredential = await createWithGoogle(); // Firebase Google login

      const firebaseUid = userCredential.user.uid;

      try {
        // Attempt to get the user from your backend
        const result = await axiosInstance.get(
          `/auth/user/exist/${firebaseUid}`
        );

        if (result.data?.user) {
          // User exists -> Set state
          setUser({ ...userCredential.user, data: result.data.user });
          handleClose();
          toast.success("Login successful!");
          return;
        }
      } catch (fetchError) {
        if (fetchError.response?.status !== 404) {
          // Any error except 404 = backend/server issue — don't create user
          console.error("Error fetching user:", fetchError);
          toast.error("An error occurred while checking your account.");
          return;
        }
        // Otherwise, 404 = user not found — OK to create
      }

      // User doesn't exist, create in DB
      const serverRes = await registerMutate({
        uid: firebaseUid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        avatar: userCredential.user.photoURL || "",
        bio: "",
        donatedCampaigns: [],
      });

      // Attach backend user data to Firebase user
      userCredential.user.data = serverRes.user;
      setUser(userCredential.user);
      handleClose();
      toast.success("Registration successful!");
    } catch (error) {
      setUser(null); // Clear state on any error
      toast.error(`Google authentication failed: ${error.message}`);
      console.error("Google auth error:", error);
    }
  };

  // Add click listener when component mounts
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
          aria-label="Close login"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-400"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Your Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-400"
              placeholder={showPassword ? "your password" : "••••••••"}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="show-password"
                type="checkbox"
                onClick={togglePasswordVisibility}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="show-password"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Show Password
              </label>
            </div>

            <Link
              to="/forgot-password"
              onClick={handleClose}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {(loading || isPending || isRegisterPending) ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Login"
            )}
          </button>
          <button
            className="mt-4 flex items-center justify-center w-full gap-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            onClick={handleRegisterWithGoogle}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.2-1.5-34-4.3-50.2H272.1v95h146.9c-6.3 34.3-25.1 63.4-53.6 82.8v68.2h86.6c50.7-46.8 81.5-115.7 81.5-195.8z"
              />
              <path
                fill="#34a853"
                d="M272.1 544.3c72.8 0 133.9-24.1 178.5-65.5l-86.6-68.2c-24.1 16.1-55 25.6-91.9 25.6-70.7 0-130.6-47.8-152-112.1H30.5v70.9c44.7 88.1 136.4 149.3 241.6 149.3z"
              />
              <path
                fill="#fbbc04"
                d="M120.1 323.9c-10.6-31.1-10.6-64.8 0-95.9V157.1H30.5c-35.5 70.9-35.5 154.9 0 225.8l89.6-70.9z"
              />
              <path
                fill="#ea4335"
                d="M272.1 107.7c39.6 0 75.3 13.6 103.4 40.4l77.4-77.4C406.2 24.3 345 0 272.1 0 166.9 0 75.2 61.2 30.5 149.3l89.6 70.9c21.4-64.3 81.3-112.1 152-112.1z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => setAuth("register")}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
