import { useState } from "react";
import { FiX, FiShield, FiLoader, FiCheck, FiInfo, FiActivity } from "react-icons/fi";
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-8 border-white relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-10 h-10 bg-neutral rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group z-10"
                >
                    <FiX className="group-hover:rotate-90 transition-transform" />
                </button>

                <div className="p-10">
                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4">
                            <FiShield />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">
                            Trust <span className="text-primary">Stamp</span>
                        </h2>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Elevate your humanitarian status.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 flex items-start gap-4">
                            <FiInfo className="text-primary text-xl shrink-0 mt-1" />
                            <p className="text-xs font-medium text-primary leading-relaxed">
                                Verified heroes gain higher trust from the community. Share your mission history or social proof to unlock your Trust Stamp.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Verification Mission</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-6 text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                                    <FiActivity />
                                </div>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows="5"
                                    className="w-full pl-16 pr-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-gray-900 font-bold transition-all resize-none placeholder:text-gray-300"
                                    placeholder="I have organized multiple charity events and wish to build more trust..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${reason.length < 20 ? 'text-gray-400' : 'text-green-500'}`}>
                                    {reason.length < 20 ? `Need ${20 - reason.length} more characters` : "Minimum requirement met"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-5 bg-neutral text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Not Now
                            </button>
                            <button
                                type="submit"
                                disabled={loading || reason.length < 20}
                                className="flex-2 px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-20 flex items-center justify-center gap-3 cursor-pointer"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                Submit for Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
