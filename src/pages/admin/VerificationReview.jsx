import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiEye, FiUser, FiFileText, FiClock, FiAlertCircle, FiLoader, FiCheckSquare, FiAlertTriangle, FiShield } from "react-icons/fi";

const VerificationReview = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/verifications?status=pending");
      setRequests(res.data.requests);
    } catch (err) {
      toast.error("Failed to fetch verification requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (id, status) => {
    if (status === 'rejected' && !adminMessage) {
      toast.warning("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading(true);
      await axiosInstance.patch(`/admin/verifications/${id}/review`, {
        status,
        adminMessage
      });
      toast.success(`Verification ${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
      setSelectedRequest(null);
      setAdminMessage("");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
            Verification <span className="text-primary">Pipeline</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Review and validate user identities to maintain platform trust.</p>
        </div>
        <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10">
          <span className="text-xs font-black uppercase tracking-widest">{requests.length} Pending Requests</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
            <FiCheckSquare className="text-2xl" />
          </div>
          <h3 className="text-gray-900 font-black uppercase tracking-tight">All Caught Up!</h3>
          <p className="text-gray-400 text-sm mt-1">There are no pending verification requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div 
              key={request._id} 
              className={`bg-white rounded-[2rem] p-6 border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group relative ${
                request.duplicateWarning?.isDuplicate 
                  ? 'border-red-200 ring-2 ring-red-100' 
                  : 'border-gray-100'
              }`}
            >
              {/* Duplicate Warning Badge on Card */}
              {request.duplicateWarning?.isDuplicate && (
                <div className="absolute -top-2.5 left-4 flex items-center gap-1.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  <FiAlertTriangle size={9} />
                  Duplicate ID Detected
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral rounded-xl overflow-hidden flex-shrink-0">
                  {request.user?.avatar ? (
                    <img src={request.user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 uppercase font-black">
                      {request.user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-gray-900 truncate uppercase tracking-tight text-sm">{request.user?.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-widest">{request.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-neutral/50 p-3 rounded-xl border border-gray-50">
                  <span className="text-[10px] font-black uppercase text-gray-400">Requesting Role</span>
                  <span className="text-[10px] font-black uppercase text-primary px-2 py-0.5 bg-primary/10 rounded-full">{request.userType}</span>
                </div>
                <div className="flex justify-between items-center bg-neutral/50 p-3 rounded-xl border border-gray-50">
                  <span className="text-[10px] font-black uppercase text-gray-400">ID Type</span>
                  <span className="text-[10px] font-black uppercase text-gray-900">{request.identityType}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRequest(request)}
                className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <FiEye /> Review Documents
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-2xl relative border-4 border-white animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group"
            >
              <FiX className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Review <span className="text-primary">Verification</span></h2>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <FiUser className="text-primary" /> {selectedRequest.user?.name}
              </div>
            </div>

            {/* ⚠️ Duplicate ID Warning Banner */}
            {selectedRequest.duplicateWarning?.isDuplicate && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <FiAlertTriangle className="text-red-500 text-lg" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">⚠️ Critical: Duplicate Identity Detected</p>
                  <p className="text-xs font-bold text-red-800 leading-relaxed">
                    This identity document is already registered and verified to another account:
                  </p>
                  <div className="mt-2 flex items-center gap-2 bg-white p-2 rounded-xl border border-red-100">
                    {selectedRequest.duplicateWarning.conflictingUser?.avatar ? (
                      <img src={selectedRequest.duplicateWarning.conflictingUser.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <FiShield className="text-red-400 text-sm" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black text-red-900">{selectedRequest.duplicateWarning.conflictingUser?.name}</p>
                      <p className="text-[10px] font-bold text-red-500">{selectedRequest.duplicateWarning.conflictingUser?.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-wide">Approving this will be blocked by the system. Reject this request.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-4">Self-Reported Identity</label>
                  <div className="bg-neutral p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">ID Number (NID/Passport)</p>
                    <p className="font-mono text-sm font-bold text-gray-900">{selectedRequest.identityNumber}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-4">Submission Reason</label>
                  <div className="bg-neutral p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">"{selectedRequest.reason}"</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-4">Proof Documents ({selectedRequest.documents?.length || 0})</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                    selectedRequest.documents.map((doc, idx) => (
                      <a 
                        key={idx} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative aspect-[4/3] bg-neutral rounded-2xl overflow-hidden border border-gray-100 hover:border-primary transition-all shadow-sm"
                      >
                        {doc.url ? (
                          <>
                            <img src={doc.url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <FiEye className="text-white text-xl drop-shadow-md" />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-white">
                              <p className="text-[8px] font-black uppercase tracking-tight text-gray-900 truncate text-center">{doc.type?.replace('_', ' ')}</p>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <FiAlertCircle className="text-gray-300 text-xl" />
                            <p className="text-[8px] font-black uppercase text-gray-400">Broken Link</p>
                          </div>
                        )}
                      </a>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 bg-neutral rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                      <FiFileText className="text-2xl text-gray-200 mb-2" />
                      <p className="text-[10px] font-black uppercase text-gray-400">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Admin Message (Required if rejecting)</label>
                <textarea 
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Provide approval confirmation or rejection reason..."
                  className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-medium outline-none transition-all resize-none h-24"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleReview(selectedRequest._id, 'rejected')}
                  disabled={actionLoading}
                  className="flex-1 bg-neutral hover:bg-gray-100 text-gray-900 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiX className="text-red-500" /> Reject Request
                </button>
                <button 
                  onClick={() => handleReview(selectedRequest._id, 'approved')}
                  disabled={actionLoading}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <FiLoader className="animate-spin" /> : <><FiCheck /> Approve & Verify</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReview;
