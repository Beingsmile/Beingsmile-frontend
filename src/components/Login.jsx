import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthProvider";

const Login = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutateAsync, isPending } = useLogin();
  const { setUser, loginWithEmail, logout, loading } = useContext(AuthContext);

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
      }
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

            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {(loading || isPending) ? (
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
