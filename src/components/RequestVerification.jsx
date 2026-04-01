import { useState } from "react";
import { FiX, FiShield, FiLoader, FiCheck, FiInfo, FiActivity, FiUpload, FiCreditCard, FiTrash2, FiEye } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const RequestVerification = ({ onClose, onSubmitted }) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [identityType, setIdentityType] = useState("NID");
    const [identityNumber, setIdentityNumber] = useState("");
    const [documents, setDocuments] = useState([]); // { type: string, url: string }
    const [isUploading, setIsUploading] = useState(false);

    // Update file selection to use local previews and store File objects
    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Generate a local preview URL
        const previewUrl = URL.createObjectURL(file);
        
        // Store document metadata and the actual File object for later upload
        setDocuments(prev => {
            // Remove if type already exists
            const filtered = prev.filter(d => d.type !== type);
            return [...filtered, { type, url: previewUrl, file, isLocal: true }];
        });
        
        toast.success(`${type.replace('_', ' ')} ready!`);
    };

    const removeDocument = (index) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (documents.length === 0) {
            toast.warning("Please upload at least one identity document.");
            return;
        }
        if (!identityNumber) {
            toast.warning("Please provide your ID number.");
            return;
        }
        if (!reason) {
            toast.warning("Please provide a reason for verification.");
            return;
        }

        setLoading(true);
        try {
            // Convert files to Base64 for backend upload (matches StartCampaign logic)
            const uploadResults = await Promise.all(
                documents.map(async (doc) => {
                    const reader = new FileReader();
                    const base64 = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(doc.file);
                    });
                    return { type: doc.type, base64 };
                })
            );

            const payload = {
                reason,
                identityType,
                identityNumber,
                documents: uploadResults, // Sending Base64 to backend
                userType: 'donor'
            };

            const response = await axiosInstance.post("/verification/submit", payload);
            if (response.data.success) {
                toast.success("Verification request submitted for admin review!");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-8 border-white relative my-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-10 h-10 bg-neutral rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group z-10"
                >
                    <FiX className="group-hover:rotate-90 transition-transform" />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center text-2xl mx-auto mb-4">
                            <FiShield />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase font-sans">
                            Trust <span className="text-primary">Stamp</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Industry-grade identity validation.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Documentation Info */}
                        <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 flex items-start gap-4">
                            <FiInfo className="text-primary text-xl shrink-0 mt-1" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Required Documents</p>
                                <p className="text-[10px] font-bold text-primary/70 leading-relaxed uppercase">
                                    Please upload a clear photo of your Govt ID (NID/Passport) and a selfie for validation.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Identity Type & Number */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Identity Document Type</label>
                                    <select 
                                        value={identityType}
                                        onChange={(e) => setIdentityType(e.target.value)}
                                        className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-6 py-4 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="NID">National ID (NID)</option>
                                        <option value="Passport">International Passport</option>
                                        <option value="Driving License">Driving License</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">ID / Passport Number</label>
                                    <div className="relative group">
                                        <FiCreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={identityNumber}
                                            onChange={(e) => setIdentityNumber(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none text-sm font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                            placeholder="Ex: 1234567890"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Document Uploads */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Upload Proofs</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['id_front', 'id_back', 'utility_bill', 'other'].map((type) => {
                                        const existing = documents.find(d => d.type === type);
                                        return (
                                            <div key={type} className="relative aspect-square">
                                                {existing ? (
                                                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20 group">
                                                        <img src={existing.url} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button type="button" onClick={() => removeDocument(documents.indexOf(existing))} className="p-2 bg-white rounded-lg text-red-500 hover:scale-110 transition-transform"><FiTrash2 /></button>
                                                        </div>
                                                        <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                            <p className="text-[8px] font-black uppercase text-center truncate">{type.replace('_', ' ')}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="w-full h-full rounded-2xl bg-neutral border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, type)} disabled={isUploading} />
                                                        <FiUpload className="text-gray-300 group-hover:text-primary transition-colors text-xl" />
                                                        <span className="text-[8px] font-black uppercase text-gray-400 text-center px-1">{type.replace('_', ' ')}</span>
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Verification Statement</label>
                            <div className="relative group">
                                <FiActivity className="absolute left-6 top-6 text-gray-400 group-focus-within:text-primary transition-colors text-xl" />
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows="3"
                                    className="w-full pl-16 pr-8 py-6 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-[2rem] outline-none text-sm font-bold text-gray-900 transition-all resize-none placeholder:text-gray-300"
                                    placeholder="Explain why you wish to be verified..."
                                    required
                                ></textarea>
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
                                disabled={loading || isUploading || documents.length === 0}
                                className="flex-2 px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-20 flex items-center justify-center gap-3 cursor-pointer"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <><FiCheck /> Submit Request</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
