import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiShield, FiClock, FiCheckCircle, FiXCircle, FiInfo, FiChevronLeft, FiFileText, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router";
import { format } from "date-fns";

const VerificationStatus = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/verification/my-requests");
            setRequests(res.data.requests);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <FiClock className="animate-spin text-4xl text-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading your trust history...</p>
            </div>
        );
    }

    const latestRequest = requests[0];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: <FiCheckCircle /> };
            case 'rejected': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100', icon: <FiXCircle /> };
            default: return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: <FiClock /> };
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] mb-1 transition-colors">
                        <FiChevronLeft /> Back to Profile
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                        Verification <span className="text-[#2D6A4F]">Journal</span>
                    </h1>
                    <p className="text-[#2D6A4F]/60 text-[10px] font-black uppercase tracking-widest mt-1">Trust Validation & Identity Roadmap</p>
                </div>
            </header>

            {!latestRequest ? (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-[#E5F0EA] text-center space-y-4">
                    <div className="w-14 h-14 bg-[#F8FDFB] rounded-xl flex items-center justify-center text-gray-200 mx-auto border border-[#E5F0EA]">
                        <FiShield size={24} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase">No History Found</h3>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide max-w-xs mx-auto leading-relaxed">You haven't submitted any verification requests yet.</p>
                    <Link to="/dashboard/profile" className="inline-block bg-[#2D6A4F] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#2D6A4F]/10 hover:bg-[#1B4332] transition-all mt-2">Start Validation</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Latest Status Card */}
                    <div className={`bg-white rounded-2xl p-6 lg:p-8 border shadow-sm ${getStatusStyles(latestRequest.status).border} relative overflow-hidden group`}>
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform ${getStatusStyles(latestRequest.status).bg} ${getStatusStyles(latestRequest.status).text}`}>
                                {getStatusStyles(latestRequest.status).icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${getStatusStyles(latestRequest.status).bg} ${getStatusStyles(latestRequest.status).text}`}>
                                    {latestRequest.status}
                                </span>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {latestRequest.status === 'approved' ? 'Identity Secured' : latestRequest.status === 'rejected' ? 'Validation Failed' : 'Review in Progress'}
                                </h2>
                                <p className="text-gray-400 font-black uppercase tracking-widest text-[9px]">
                                    Submitted {format(new Date(latestRequest.createdAt), 'PPp')}
                                </p>
                            </div>
                        </div>

                        {latestRequest.adminMessage && (
                            <div className="mt-6 p-5 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] italic text-gray-600 text-sm leading-relaxed relative">
                                <FiInfo size={14} className="absolute -top-1.5 -left-1.5 text-[#2D6A4F] bg-white rounded-full" />
                                " {latestRequest.adminMessage} "
                            </div>
                        )}

                        {latestRequest.status === 'rejected' && (
                            <div className="mt-6 flex justify-center">
                                <Link to="/dashboard/profile" className="bg-[#2D6A4F] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-95 transition-all">
                                    Verify Again
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-[#E5F0EA] shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <FiFileText className="text-[#2D6A4F]" /> Submitted Data
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Identification Layer</p>
                                    <p className="font-mono text-xs font-black text-gray-900 mt-0.5">{latestRequest.identityType} / <span className="opacity-40">{latestRequest.identityNumber?.replace(/./g, (c, i) => i < 4 ? c : '*')}</span></p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Claimed Identity</p>
                                    <p className="text-xs font-black text-[#2D6A4F] uppercase mt-0.5">{latestRequest.userType}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Mission Context</p>
                                    <p className="text-[11px] font-bold text-gray-500 italic mt-1 leading-relaxed">"{latestRequest.reason}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[#E5F0EA] shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <FiShield className="text-[#2D6A4F]" /> Evidence Locker
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {latestRequest.documents?.map((doc, idx) => (
                                    <div key={idx} className="aspect-square bg-[#F8FDFB] rounded-xl overflow-hidden border border-[#E5F0EA] flex items-center justify-center relative group">
                                        {doc.url ? (
                                            <img src={doc.url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <FiAlertCircle className="text-gray-200 text-xl" />
                                        )}
                                        <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-[7px] font-black uppercase text-center py-1 rounded-md border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            {doc.type?.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline/History */}
                    {requests.length > 1 && (
                        <div className="pt-4 space-y-3">
                             <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Historical Audit</h3>
                             <div className="space-y-2.5">
                                {requests.slice(1).map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm border border-[#E5F0EA] hover:border-[#2D6A4F]/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm ${getStatusStyles(req.status).bg} ${getStatusStyles(req.status).text}`}>
                                                {getStatusStyles(req.status).icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-900 tracking-tight">{req.identityType} - {req.userType}</p>
                                                <p className="text-[8px] font-black text-gray-400 uppercase">{format(new Date(req.createdAt), 'PP')}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border shadow-sm ${getStatusStyles(req.status).bg} ${getStatusStyles(req.status).text} ${getStatusStyles(req.status).border}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerificationStatus;
