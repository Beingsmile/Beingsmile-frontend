import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiCheckCircle, FiXCircle, FiLoader, FiExternalLink, FiArchive, FiCreditCard, FiUser, FiEye } from "react-icons/fi";
import { useState } from "react";

const AdminPayoutLogs = () => {
  const [selectedProof, setSelectedProof] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["payoutLogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/payouts/logs");
      return res.data.requests;
    }
  });

  if (isLoading) return <div className="p-20 flex justify-center"><FiLoader className="animate-spin text-primary text-4xl" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Payout <span className="text-primary">Logs</span></h1>
        <p className="text-gray-500 font-medium italic">"Audit history of all processed disbursements."</p>
      </header>

      {data?.length === 0 ? (
        <div className="bg-white p-20 rounded-[2rem] border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-neutral rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiArchive size={32} />
            </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest">No payout history available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data?.map((log) => (
            <div key={log._id} className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 transition-all hover:shadow-md ${log.status === 'rejected' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-emerald-500'}`}>
              
              <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Campaign Reference</p>
                        <h3 className="text-lg font-black text-gray-900">{log.campaign?.title}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Processed: {new Date(log.processedAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-xl font-black ${log.status === 'rejected' ? 'text-red-500' : 'text-emerald-500'}`}>৳{log.amount.toLocaleString()}</p>
                        <div className={`mt-1 inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-1 rounded-md ${log.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                           {log.status === 'rejected' ? <FiXCircle /> : <FiCheckCircle />} {log.status}
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                             <FiUser /> Requester
                        </p>
                        <p className="text-xs font-black text-gray-900 uppercase">{log.user?.name}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Details / Ref</p>
                       {log.status === 'rejected' ? (
                          <p className="text-xs font-bold text-red-500">{log.adminNotes || "No reason provided"}</p>
                       ) : (
                          <p className="text-xs font-black text-gray-900 font-mono">{log.transactionReference}</p>
                       )}
                    </div>
                 </div>
              </div>

              {log.status === 'completed' && log.proofDocument && (
                <div className="w-full md:w-48 flex items-center justify-center border-l border-gray-100 pl-8">
                   <button 
                      onClick={() => setSelectedProof(log.proofDocument)}
                      className="flex flex-col items-center gap-2 text-primary hover:text-emerald-600 transition-colors group cursor-pointer"
                   >
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiEye className="text-xl" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">View Proof</span>
                   </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for Proof */}
      {selectedProof && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
             <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <img src={selectedProof} alt="Payout Proof Document" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                <button 
                   onClick={() => setSelectedProof(null)}
                   className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                   Close Document
                </button>
             </div>
         </div>
      )}
    </div>
  );
};

export default AdminPayoutLogs;
