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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary mb-2 transition-colors">
                        <FiChevronLeft /> Back to Profile
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        Verification <span className="text-primary">Journal</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Track your humanitarian trust validation process.</p>
                </div>
            </header>

            {!latestRequest ? (
                <div className="bg-white p-12 rounded-[2.5rem] border-4 border-dashed border-gray-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-neutral rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                        <FiShield className="text-3xl" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase">No History Found</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">You haven't submitted any verification requests yet. Your account is currently at Standard Participant level.</p>
                    <Link to="/dashboard/profile" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Submit Request</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Latest Status Card */}
                    <div className={`bg-white rounded-[2.5rem] p-8 border-4 shadow-xl ${getStatusStyles(latestRequest.status).border} relative overflow-hidden`}>
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-lg ${getStatusStyles(latestRequest.status).bg} ${getStatusStyles(latestRequest.status).text}`}>
                                {getStatusStyles(latestRequest.status).icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusStyles(latestRequest.status).bg} ${getStatusStyles(latestRequest.status).text}`}>
                                    {latestRequest.status}
                                </span>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                    {latestRequest.status === 'approved' ? 'Identity Secured' : latestRequest.status === 'rejected' ? 'Validation Failed' : 'Review in Progress'}
                                </h2>
                                <p className="text-gray-500 font-medium text-sm">
                                    Submitted on {format(new Date(latestRequest.createdAt), 'PPP')}
                                </p>
                            </div>
                        </div>

                        {latestRequest.adminMessage && (
                            <div className="mt-8 p-6 bg-neutral rounded-3xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed relative">
                                <FiInfo className="absolute -top-2 -left-2 text-primary bg-white rounded-full text-xl" />
                                " {latestRequest.adminMessage} "
                            </div>
                        )}

                        {latestRequest.status === 'rejected' && (
                            <div className="mt-8 flex justify-center">
                                <Link to="/dashboard/profile" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                    Re-submit with Updates
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <FiFileText className="text-primary" /> Submitted Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-gray-400">ID Type & Number</p>
                                    <p className="font-mono text-sm font-bold text-gray-900">{latestRequest.identityType} / {latestRequest.identityNumber?.replace(/./g, (c, i) => i < 4 ? c : '*')}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-gray-400">Target Role</p>
                                    <p className="text-sm font-black text-primary uppercase">{latestRequest.userType}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-gray-400">Reason for Request</p>
                                    <p className="text-xs font-medium text-gray-500 italic mt-1 font-serif">"{latestRequest.reason}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <FiShield className="text-primary" /> Document Trail
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {latestRequest.documents?.map((doc, idx) => (
                                    <div key={idx} className="aspect-square bg-neutral rounded-2xl overflow-hidden border border-gray-50 flex items-center justify-center relative group">
                                        {doc.url ? (
                                            <img src={doc.url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <FiAlertCircle className="text-gray-200 text-xl" />
                                        )}
                                        <span className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase text-center py-1 rounded-lg border border-white">
                                            {doc.type?.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline/History */}
                    {requests.length > 1 && (
                        <div className="bg-neutral/50 p-8 rounded-[2.5rem] border border-gray-100">
                             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Previous Submissions</h3>
                             <div className="space-y-4">
                                {requests.slice(1).map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getStatusStyles(req.status).bg} ${getStatusStyles(req.status).text}`}>
                                                {getStatusStyles(req.status).icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-900">{req.identityType} - {req.userType}</p>
                                                <p className="text-[8px] font-bold text-gray-400">{format(new Date(req.createdAt), 'PP')}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getStatusStyles(req.status).bg} ${getStatusStyles(req.status).text}`}>
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
