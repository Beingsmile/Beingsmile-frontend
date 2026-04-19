import { useState } from "react";
import { FiX, FiShield, FiLoader, FiCheck, FiInfo, FiActivity, FiUpload, FiCreditCard, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const RequestVerification = ({ onClose, onSubmitted }) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [identityType, setIdentityType] = useState("NID");
    const [identityNumber, setIdentityNumber] = useState("");
    const [documents, setDocuments] = useState([]); 
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        
        setDocuments(prev => {
            const filtered = prev.filter(d => d.type !== type);
            return [...filtered, { type, url: previewUrl, file, isLocal: true }];
        });
        
        toast.success(`${type.replace('_', ' ').toUpperCase()} ready!`);
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
                documents: uploadResults,
                userType: 'donor'
            };

            const response = await axiosInstance.post("/verification/submit", payload);
            if (response.data.success) {
                toast.success("Verification request submitted successfully!");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f2418]/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[520px] max-h-[90vh] rounded-[2rem] shadow-[0_32px_120px_-20px_rgba(27,67,50,0.3)] border border-emerald-50 relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-400">
                
                {/* Header Section */}
                <div className="p-6 md:p-8 pb-4 border-b border-gray-50 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-[#2D6A4F] transition-all cursor-pointer group z-20"
                    >
                        <FiX size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-emerald-50 text-[#2D6A4F] rounded-xl flex items-center justify-center text-xl shrink-0">
                            <FiShield />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-black text-[#0f2418] tracking-tight uppercase">
                                Trust <span className="text-[#2D6A4F]">Stamp</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Tier-1 Identity Validation</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-6 custom-scrollbar">
                    
                    {/* Compact Info Box */}
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <FiInfo size={16} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-emerald-800/80 leading-relaxed uppercase tracking-tight">
                            Identity documents are strictly private and visible only to administrators for secure verification.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5">
                            {/* Document Type & ID Number */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">ID Type</label>
                                    <select 
                                        value={identityType}
                                        onChange={(e) => setIdentityType(e.target.value)}
                                        className="w-full bg-[#F8FDFB] border border-gray-200 focus:border-[#2D6A4F] focus:bg-white px-3 py-2.5 rounded-xl text-xs font-bold text-gray-900 outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="NID">National ID (NID)</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Driving License">Driving License</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Document Number</label>
                                    <div className="relative">
                                        <FiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="text"
                                            value={identityNumber}
                                            onChange={(e) => setIdentityNumber(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-[#F8FDFB] border border-gray-200 focus:border-[#2D6A4F] focus:bg-white rounded-xl outline-none text-xs font-bold text-[#0f2418] transition-all placeholder:text-gray-400/60"
                                            placeholder="Ex: 8234-5678"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Verification Statement */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Why verify?</label>
                                <div className="relative">
                                    <FiActivity className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows="2"
                                        className="w-full pl-9 pr-4 py-3 bg-[#F8FDFB] border border-gray-200 focus:border-[#2D6A4F] focus:bg-white rounded-xl outline-none text-xs font-bold text-[#0f2418] transition-all resize-none placeholder:text-gray-400/60 leading-relaxed"
                                        placeholder="E.g. I want to build trust with donors and start my fundraising mission."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Document Grid - More Compact */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#2D6A4F]">Proof of Identity</label>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{documents.length}/4 uploaded</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {['id_front', 'id_back', 'utility_bill', 'other'].map((type) => {
                                        const existing = documents.find(d => d.type === type);
                                        return (
                                            <div key={type} className="relative aspect-square">
                                                {existing ? (
                                                    <div className="w-full h-full rounded-xl overflow-hidden border border-emerald-100 group">
                                                        <img src={existing.url} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeDocument(documents.indexOf(existing))} 
                                                                className="p-1.5 bg-white text-red-500 rounded-lg hover:scale-110 shadow-sm transition-transform cursor-pointer"
                                                            >
                                                                <FiTrash2 size={12} />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-0 inset-x-0 bg-[#0f2418]/80 backdrop-blur-sm px-1.5 py-0.5">
                                                            <p className="text-[7px] font-black text-white uppercase text-center truncate">{type.replace('_', ' ')}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="w-full h-full rounded-xl bg-gray-50 border border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group">
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            accept="image/*" 
                                                            onChange={(e) => handleFileUpload(e, type)} 
                                                            disabled={isUploading} 
                                                        />
                                                        <FiUpload className="text-gray-300 group-hover:text-[#2D6A4F] transition-colors text-sm" />
                                                        <span className="text-[7px] font-black uppercase text-gray-400 group-hover:text-[#2D6A4F] text-center px-1 leading-tight">{type.replace('_', ' ')}</span>
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-xl border border-gray-100 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                            >
                                Not Now
                            </button>
                            <button
                                type="submit"
                                disabled={loading || isUploading || documents.length === 0}
                                className="flex-[2] px-6 py-3 bg-[#2D6A4F] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-colors disabled:opacity-20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin text-sm" />
                                ) : (
                                    <><FiCheck size={14} /> Submit Application</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
