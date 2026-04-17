import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { FiClock, FiCheck, FiX, FiDollarSign, FiUser, FiHome, FiCheckCircle, FiLoader, FiExternalLink, FiCreditCard, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState, useRef } from "react";

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const PayoutReview = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);
  const [txnRef, setTxnRef] = useState("");
  const [proofDoc, setProofDoc] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
       toast.error("File must be under 5MB");
       return;
    }
    setFileName(file.name);
    try {
      const base64 = await toBase64(file);
      setProofDoc(base64);
    } catch (err) {
      toast.error("Failed to read file.");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["pendingPayouts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/payouts/pending");
      return res.data.requests;
    }
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }) => 
      axiosInstance.patch(`/payouts/review/${id}`, { status, adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPayouts"]);
      toast.success("Request status updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update")
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, transactionReference, proofDocument }) => 
      axiosInstance.patch(`/payouts/complete/${id}`, { transactionReference, proofDocument }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPayouts"]);
      toast.success("Payout marked as completed");
      setProcessingId(null);
      setTxnRef("");
      setProofDoc("");
      setFileName("");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to complete")
  });

  const handleReview = (id, status) => {
    const notes = prompt(`Add notes for ${status === 'approved' ? 'approval' : 'rejection'}:`);
    if (notes !== null) {
      reviewMutation.mutate({ id, status, adminNotes: notes });
    }
  };

  const handleComplete = (id) => {
    if (!txnRef) {
      toast.warn("Please enter a transaction reference ID");
      return;
    }
    completeMutation.mutate({ id, transactionReference: txnRef, proofDocument: proofDoc });
  };

  if (isLoading) return <div className="p-20 flex justify-center"><FiLoader className="animate-spin text-primary text-4xl" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Payout <span className="text-primary">Control</span></h1>
        <p className="text-gray-500 font-medium italic">"Ensure the kindness reaches the heroes. Secure disbursements."</p>
      </header>

      {data?.length === 0 ? (
        <div className="bg-white p-20 rounded-[2rem] border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-neutral rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiCheckCircle size={32} />
            </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest">All payouts are up to date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data?.map((request) => (
            <div key={request._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
              
              {/* Request Info */}
              <div className="flex-1 space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">Campaign</p>
                        <h3 className="text-xl font-black text-gray-900">{request.campaign?.title}</h3>
                    </div>
                    <div className="px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-2xl font-black text-primary">৳{request.amount.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 border-y border-gray-50 py-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                             <FiUser /> Requester
                        </p>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase">{request.user?.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{request.user?.email}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                             <FiCreditCard /> Bank/Mobile Details
                        </p>
                        {request.bankDetails?.mobileMoneyNumber ? (
                            <div className="bg-neutral p-3 rounded-xl border border-gray-50">
                                <p className="text-[10px] font-black text-gray-900 uppercase">{request.bankDetails.mobileMoneyType}</p>
                                <p className="text-sm font-bold text-primary">{request.bankDetails.mobileMoneyNumber}</p>
                            </div>
                        ) : (
                            <div className="bg-neutral p-3 rounded-xl border border-gray-50 space-y-1">
                                <p className="text-[10px] font-black text-gray-900 uppercase">{request.bankDetails?.bankName}</p>
                                <p className="text-xs font-bold text-primary">{request.bankDetails?.accountNumber}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">{request.bankDetails?.accountName}</p>
                            </div>
                        )}
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="w-full md:w-64 space-y-3 flex flex-col justify-center">
                 {processingId === request._id ? (
                     <div className="space-y-3 animate-in zoom-in duration-300">
                        <p className="text-[10px] font-black uppercase text-amber-500 mb-2">Step 2: Enter Completion Info</p>
                        <input 
                            value={txnRef}
                            onChange={(e) => setTxnRef(e.target.value)}
                            placeholder="Bank Ref ID (e.g. CITY-55231)"
                            className="w-full bg-neutral p-3 rounded-xl text-xs font-bold border-2 border-primary/20 focus:border-primary outline-none"
                        />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full p-3 rounded-xl text-xs font-bold border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${proofDoc ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-primary/20 bg-neutral text-gray-500 hover:border-primary/50'}`}
                        >
                            <input type="file" accept="image/*,.pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            <FiUpload className="mb-1" size={16} />
                            {fileName ? <span className="truncate w-full text-center px-2">{fileName}</span> : "Upload Proof Document"}
                        </div>
                        <button 
                             onClick={() => handleComplete(request._id)}
                             disabled={completeMutation.isPending || !proofDoc}
                             className={`w-full text-white p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${completeMutation.isPending || !proofDoc ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'}`}
                        >
                            {completeMutation.isPending ? "Processing Upload..." : "Confirm & Complete"}
                        </button>
                        <button 
                             onClick={() => { setProcessingId(null); setTxnRef(""); setProofDoc(""); setFileName(""); }}
                             className="w-full text-[10px] font-black uppercase text-gray-400 hover:text-red-500"
                        >
                            Cancel
                        </button>
                     </div>
                 ) : (
                     <>
                        <button 
                            onClick={() => setProcessingId(request._id)}
                            className="w-full bg-gray-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg shadow-gray-200 transition-all"
                        >
                            Process Payout
                        </button>
                        <button 
                            onClick={() => handleReview(request._id, 'rejected')}
                            className="w-full bg-white border border-gray-200 text-gray-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-200 transition-all"
                        >
                            Reject Request
                        </button>
                     </>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayoutReview;
