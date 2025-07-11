import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegister } from "../hooks/useAuth";
import { deleteUser } from "firebase/auth";

const Register = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  //const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const { setUser, createWithEmail } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { mutateAsync } = useRegister();

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
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Call the createWithEmail function from AuthContext
    const res = await createWithEmail(email, password);

    if (res.success) {
      try {
        await mutateAsync({
          uid: res.user.uid,
          email: email,
          name: name,
          avatar: res.user.photoURL || "",
          bio: "",
          donatedCampaigns: [],
        });

        setUser(res.user); // Update user state
        toast.success("Registration successful!");
      } catch (error) {
        await deleteUser(res.user); // Rollback Firebase
        setUser(null); // Clear user state
        toast.error(`Registration failed: ${error.message}`);
      }
    }

    handleClose();
  };

  const password = watch("password");

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
          aria-label="Close registration"
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
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-400"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              name="email"
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
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-400"
              placeholder={showPassword ? "confirm password" : "••••••••"}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="show-password"
                  type="checkbox"
                  name="show-password"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="show-password"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Show Password
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            name="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => setAuth("login")}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
