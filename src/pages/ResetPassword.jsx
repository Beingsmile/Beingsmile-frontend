import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthProvider";
import { FiLock, FiEye, FiEyeOff, FiLoader, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyResetCode, confirmReset } = useContext(AuthContext);

    const [oobCode, setOobCode] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Password criteria states
    const criteria = {
        length: newPassword.length >= 8,
        upper: /[A-Z]/.test(newPassword),
        lower: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[\W_]/.test(newPassword)
    };

    const isPasswordValid = Object.values(criteria).every(Boolean);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("oobCode");

        if (!code) {
            setError("Invalid or missing reset code.");
            setVerifying(false);
            return;
        }

        setOobCode(code);

        const verifyCode = async () => {
            const result = await verifyResetCode(code);
            if (result.success) {
                setEmail(result.email);
            } else {
                setError("The password reset link is invalid or has expired.");
            }
            setVerifying(false);
        };

        verifyCode();
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error("Please meet all password criteria");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setSubmitting(true);
        const result = await confirmReset(oobCode, newPassword);
        if (result.success) {
            navigate("/login");
        }
        setSubmitting(false);
    };

    if (verifying) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <FiLoader className="animate-spin text-tertiary text-4xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiX size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reset Failed</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
                    <Link to="/login" className="bg-tertiary text-white px-8 py-3 rounded-xl font-bold hover:bg-tertiary/90 transition-all">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">New Password</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Setting a new password for <span className="text-gray-900 dark:text-white font-semibold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FiLock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FiLock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Criteria List */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Requirements</p>
                        <CriteriaItem met={criteria.length} text="At least 8 characters" />
                        <CriteriaItem met={criteria.upper} text="At least 1 uppercase letter" />
                        <CriteriaItem met={criteria.lower} text="At least 1 lowercase letter" />
                        <CriteriaItem met={criteria.number} text="At least 1 number" />
                        <CriteriaItem met={criteria.special} text="At least 1 special character" />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !isPasswordValid}
                        className="w-full py-4 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20 disabled:opacity-50 flex items-center justify-center"
                    >
                        {submitting && <FiLoader className="animate-spin mr-2" />}
                        Reset Password
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-tertiary transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

const CriteriaItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
        {met ? <FiCheck className="shrink-0" /> : <FiX className="shrink-0" />}
        <span className={met ? "font-medium" : ""}>{text}</span>
    </div>
);

export default ResetPassword;
