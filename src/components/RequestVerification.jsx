import { useState } from "react";
import { FiX, FiShield, FiLoader, FiCheck, FiInfo } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const RequestVerification = ({ onClose, onSubmitted }) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reason.length < 20) {
            toast.warning("Please provide a more detailed reason (at least 20 characters).");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/verification/submit", { reason });
            if (response.data.success) {
                toast.success("Verification request submitted!");
                onSubmitted();
                onClose();
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error(error.response?.data?.error || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <FiShield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Verification</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Get a blue badge on your profile</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                        <FiInfo className="text-blue-500 mt-1 shrink-0" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Verified users gain more trust from donors. Please describe why you are requesting verification (e.g., social presence, previous charity work).
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Why should we verify you?</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="5"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-tertiary outline-none text-gray-900 dark:text-white transition-all resize-none"
                            placeholder="I have organized multiple charity events and wish to build more trust..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || reason.length < 20}
                            className="flex-[2] py-4 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? <FiLoader className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestVerification;
