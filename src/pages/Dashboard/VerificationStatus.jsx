import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FiShield, FiClock, FiCheckCircle, FiXCircle,
  FiInfo, FiChevronLeft, FiFileText, FiAlertCircle
} from "react-icons/fi";
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

  useEffect(() => { fetchRequests(); }, []);

  const getStatus = (status) => ({
    approved: {
      bar: "bg-emerald-500",
      chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <FiCheckCircle className="text-emerald-600" size={22} />,
      label: "Identity Secured",
    },
    rejected: {
      bar: "bg-red-400",
      chip: "bg-red-50 text-red-600 border-red-100",
      icon: <FiXCircle className="text-red-500" size={22} />,
      label: "Validation Failed",
    },
  }[status] ?? {
    bar: "bg-amber-400",
    chip: "bg-amber-50 text-amber-700 border-amber-100",
    icon: <FiClock className="text-amber-600 animate-pulse" size={22} />,
    label: "Review in Progress",
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-72 gap-3">
      <div className="w-10 h-10 border-4 border-[#E5F0EA] border-t-[#2D6A4F] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D6A4F]/60 animate-pulse">Loading history...</p>
    </div>
  );

  const latestRequest = requests[0];

  return (
    <div className="max-w-3xl space-y-5">

      {/* Header */}
      <div>
        <Link to="/dashboard/profile" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2D6A4F] mb-3 transition-colors">
          <FiChevronLeft size={13} /> Back to Profile
        </Link>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Verification Journal</h1>
        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Trust Validation & Identity Roadmap</p>
      </div>

      {!latestRequest ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E5F0EA] p-14 text-center space-y-4">
          <div className="w-14 h-14 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-gray-300 mx-auto border border-[#E5F0EA]">
            <FiShield size={26} />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 uppercase">No History Found</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
              You haven't submitted any verification requests yet.
            </p>
          </div>
          <Link
            to="/dashboard/profile"
            className="inline-block bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
          >
            Start Validation
          </Link>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Hero Status Card */}
          {(() => {
            const st = getStatus(latestRequest.status);
            return (
              <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
                <div className={`h-1.5 ${st.bar}`} />
                <div className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-12 h-12 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] flex items-center justify-center shrink-0">
                      {st.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${st.chip}`}>
                          {latestRequest.status}
                        </span>
                        <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">{st.label}</h2>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Submitted {format(new Date(latestRequest.createdAt), 'PPp')}
                      </p>
                    </div>
                    {latestRequest.status === 'rejected' && (
                      <Link
                        to="/dashboard/profile"
                        className="px-4 py-2 bg-[#2D6A4F] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1B4332] transition-all shadow-sm shrink-0"
                      >
                        Verify Again
                      </Link>
                    )}
                  </div>

                  {latestRequest.adminMessage && (
                    <div className="p-4 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] flex gap-3">
                      <FiInfo size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Moderator Note</p>
                        <p className="text-sm text-gray-600 italic leading-relaxed">"{latestRequest.adminMessage}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Submitted Data */}
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
                <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiFileText size={13} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Submitted Data</h3>
              </div>
              <div className="p-5 space-y-4">
                <DataRow label="Identification" value={`${latestRequest.identityType} / ${latestRequest.identityNumber?.replace(/./g, (c, i) => i < 4 ? c : '*')}`} mono />
                <DataRow label="Claimed Identity" value={latestRequest.userType} />
                <DataRow label="Mission Context" value={`"${latestRequest.reason}"`} italic />
              </div>
            </div>

            {/* Evidence Locker */}
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
                <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiShield size={13} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Evidence Locker</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  {latestRequest.documents?.map((doc, idx) => (
                    <div key={idx} className="aspect-square bg-[#F8FDFB] rounded-xl overflow-hidden border border-[#E5F0EA] flex items-center justify-center relative group hover:border-[#C8EDDA] transition-colors">
                      {doc.url ? (
                        <img src={doc.url} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <FiAlertCircle className="text-gray-300 text-xl" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-[7px] font-black uppercase text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {doc.type?.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Audit */}
          {requests.length > 1 && (
            <div className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#F0F9F4] flex items-center gap-2">
                <div className="w-7 h-7 bg-[#EDFAF3] text-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiClock size={13} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600">Historical Audit</h3>
              </div>
              <div className="p-4 space-y-2">
                {requests.slice(1).map((req, idx) => {
                  const s = getStatus(req.status);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#F8FDFB] rounded-xl border border-[#E5F0EA] hover:border-[#C8EDDA] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg border border-[#E5F0EA] flex items-center justify-center text-sm">{s.icon && <span className="scale-75">{s.icon}</span>}</div>
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-900 tracking-tight">{req.identityType} · {req.userType}</p>
                          <p className="text-[9px] text-gray-400 font-semibold">{format(new Date(req.createdAt), 'PP')}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${s.chip}`}>{req.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

const DataRow = ({ label, value, mono, italic }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className={`text-sm text-gray-900 leading-snug ${mono ? "font-mono font-black" : "font-bold"} ${italic ? "italic text-gray-500 text-xs" : ""}`}>
      {value}
    </p>
  </div>
);

export default VerificationStatus;
