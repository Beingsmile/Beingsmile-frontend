import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiMail, FiArrowLeft, FiLoader } from "react-icons/fi";
import { Link } from "react-router";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading } = useContext(AuthContext);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        const result = await forgotPassword(email);
        if (result.success) {
            setSent(true);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Password
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tertiary focus:border-transparent outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-tertiary hover:bg-tertiary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <FiLoader className="animate-spin mr-2" />
                            ) : null}
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                            <FiMail className="text-green-600 dark:text-green-400 text-3xl" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Check your email
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                We've sent a password reset link to <strong>{email}</strong>.
                            </p>
                        </div>
                        <button
                            onClick={() => setSent(false)}
                            className="text-tertiary hover:underline font-medium"
                        >
                            Didn't receive the email? Try again
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-tertiary transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;