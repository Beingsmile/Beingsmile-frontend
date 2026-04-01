import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { FiUsers, FiSearch, FiFilter, FiMoreVertical, FiShield, FiAlertTriangle, FiCheckCircle, FiLoader, FiSlash, FiZap, FiExternalLink, FiEye, FiClock, FiXCircle, FiX, FiFileText, FiAlertCircle, FiUser } from "react-icons/fi";
import { Link } from "react-router";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, donor, fundraiser, admin, suspended
  const [actionLoading, setActionLoading] = useState(null); // ID of user being updated

  const [suspensionModal, setSuspensionModal] = useState({ 
    isOpen: false, 
    userId: null, 
    message: "", 
    currentStatus: "" 
  });
  
  const [verificationModal, setVerificationModal] = useState({
    isOpen: false,
    user: null,
    history: [],
    loading: false
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, status, message = "") => {
    try {
      setActionLoading(id);
      await axiosInstance.patch(`/admin/users/${id}/toggle-status`, { message });
      toast.success(`User ${status === 'active' ? 'suspended' : 'activated'} successfully`);
      fetchUsers();
      setSuspensionModal({ isOpen: false, userId: null, message: "", currentStatus: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const openSuspensionModal = (id, currentStatus) => {
    if (currentStatus === 'active') {
      setSuspensionModal({ isOpen: true, userId: id, message: "", currentStatus });
    } else {
      handleToggleStatus(id, currentStatus);
    }
  };

  const handleManualVerify = async (id, isVerified) => {
    try {
      setActionLoading(id);
      await axiosInstance.patch(`/admin/users/${id}/verify`, { isVerified });
      toast.success(`Verification ${isVerified ? 'approved' : 'revoked'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update verification");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchVerificationHistory = async (user) => {
    try {
      setVerificationModal({ ...verificationModal, isOpen: true, user, loading: true, history: [] });
      const res = await axiosInstance.get(`/admin/users/${user._id}/verification-history`);
      setVerificationModal(prev => ({ ...prev, history: res.data.history, loading: false }));
    } catch (err) {
      toast.error("Failed to fetch verification history");
      setVerificationModal(prev => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === "all" || 
      (filter === "suspended" && user.status === "suspended") ||
      (filter === "verified" && user.identity?.isVerified) ||
      (user.userType === filter) || (user.role === filter);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
            User <span className="text-primary">Registry</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage platform participants and maintain community safety.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:border-primary/30 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 pl-10 pr-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 focus:border-primary/30 outline-none transition-all shadow-sm cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="donor">Donors</option>
              <option value="fundraiser">Fundraisers</option>
              <option value="admin">Admins</option>
              <option value="verified">Verified Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-neutral/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role & Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Verification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security & Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-neutral/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <div className="w-full h-full bg-primary/5 text-primary flex items-center justify-center rounded-2xl text-lg font-black uppercase">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                        {user.identity?.isVerified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-lg flex items-center justify-center text-[10px] shadow-lg border-2 border-white">
                            <FiCheckCircle />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link 
                          to={`/p/${user.slug}`} 
                          target="_blank"
                          className="text-sm font-black text-gray-900 uppercase tracking-tight truncate hover:text-primary transition-colors flex items-center gap-1 group/link"
                        >
                          {user.name} <FiExternalLink className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user.slug || 'No Slug'}</p>
                        <p className="text-[10px] font-medium text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          user.role === 'admin' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-500'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1.5">
                        <FiZap className="text-primary text-[10px]" /> {user.userType}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                       {user.identity?.isVerified ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border bg-primary/5 border-primary/20 text-primary">
                              <FiCheckCircle /> Verified Hero
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Identity: {user.identity.idType}</span>
                          </div>
                       ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border bg-gray-50 border-gray-100 text-gray-400">
                              <FiClock /> Unverified
                            </span>
                            <Link 
                              to="/admin/verifications" 
                              className="text-[8px] font-black uppercase text-primary hover:underline"
                            >
                              Check Requests
                            </Link>
                          </div>
                       )}
                       <button 
                          onClick={() => fetchVerificationHistory(user)}
                          className="text-[8px] font-black uppercase text-gray-500 hover:text-primary transition-colors flex items-center gap-1 mt-1"
                        >
                          <FiEye className="text-[10px]" /> View Documents
                        </button>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                       <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border ${
                          user.status === 'active' 
                            ? 'bg-green-50 border-green-100 text-green-600' 
                            : 'bg-red-50 border-red-100 text-red-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                          {user.status}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <FiShield className={user.security?.twoFactorEnabled ? "text-primary" : "text-gray-200"} />
                          {user.security?.twoFactorEnabled ? "2FA Active" : "2FA Off"}
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => openSuspensionModal(user._id, user.status)}
                      disabled={actionLoading === user._id || user.role === 'admin'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        user.status === 'active'
                          ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-100'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {actionLoading === user._id ? (
                        <FiLoader className="animate-spin" />
                      ) : user.status === 'active' ? (
                        <><FiSlash /> Suspend</>
                      ) : (
                        <><FiZap /> Activate</>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => handleManualVerify(user._id, !user.identity?.isVerified)}
                      disabled={actionLoading === user._id || user.role === 'admin'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        user.identity?.isVerified
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border border-amber-100'
                          : 'bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10'
                      } disabled:opacity-30 disabled:cursor-not-allowed ml-2`}
                      title={user.identity?.isVerified ? "Revoke Verification" : "Manually Verify"}
                    >
                      {actionLoading === user._id ? (
                        <FiLoader className="animate-spin" />
                      ) : user.identity?.isVerified ? (
                        <><FiXCircle /> Revoke</>
                      ) : (
                        <><FiShield /> Verify</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              No users found matching your filters.
            </div>
          )}
        </div>
      </div>
      {/* Suspension Message Modal */}
      {suspensionModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border-4 border-white animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Suspend <span className="text-red-500">Account</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Explain the reason for suspension. The user will see this message.</p>
            
            <textarea
              className="w-full bg-neutral border-2 border-transparent focus:border-red-100 focus:bg-white p-6 rounded-3xl text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all outline-none min-h-[150px] mb-6 resize-none"
              placeholder="e.g. Unusual activity detected, Violation of community guidelines..."
              value={suspensionModal.message}
              onChange={(e) => setSuspensionModal({ ...suspensionModal, message: e.target.value })}
            />
            
            <div className="flex gap-4">
              <button
                onClick={() => setSuspensionModal({ isOpen: false, userId: null, message: "", currentStatus: "" })}
                className="flex-1 px-6 py-4 bg-neutral text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:text-gray-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(suspensionModal.userId, suspensionModal.currentStatus, suspensionModal.message)}
                disabled={actionLoading === suspensionModal.userId}
                className="flex-1 px-6 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all"
              >
                {actionLoading === suspensionModal.userId ? <FiLoader className="animate-spin mx-auto" /> : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification History & Documents Modal */}
      {verificationModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-2xl relative border-4 border-white animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setVerificationModal({ ...verificationModal, isOpen: false, user: null, history: [] })}
              className="absolute top-6 right-6 w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer group"
            >
              <FiX className="group-hover:rotate-90 transition-transform" />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Verification <span className="text-primary">History</span></h2>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <FiUser className="text-primary" /> {verificationModal.user?.name}
              </div>
            </div>

            {verificationModal.loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <FiLoader className="animate-spin text-4xl text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving records...</p>
              </div>
            ) : verificationModal.history.length === 0 ? (
              <div className="py-20 text-center">
                <FiFileText className="text-4xl text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No verification requests found for this user.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {verificationModal.history.map((request, idx) => (
                  <div key={request._id} className={`p-6 rounded-[2rem] border-2 ${idx === 0 ? 'border-primary/10 bg-primary/5' : 'border-gray-50 bg-neutral/30'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border mb-2 ${
                          request.status === 'approved' 
                            ? 'bg-green-50 border-green-100 text-green-600' 
                            : request.status === 'rejected'
                            ? 'bg-red-50 border-red-100 text-red-500'
                            : 'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                          {request.status}
                        </span>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {request.reviewedBy && (
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase text-gray-400 tracking-tight mb-1">Reviewed By</p>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-bold text-gray-900">{request.reviewedBy.name}</span>
                            <img src={request.reviewedBy.avatar} alt="" className="w-6 h-6 rounded-lg object-cover border border-white shadow-sm" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Identity Details</p>
                          <p className="text-xs font-black text-gray-900 uppercase">{request.identityType}</p>
                          <p className="font-mono text-xs font-bold text-gray-600">{request.identityNumber}</p>
                        </div>
                        {request.adminMessage && (
                          <div className="bg-white/50 p-4 rounded-2xl border border-white shadow-sm">
                            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Admin Notes</p>
                            <p className="text-xs text-gray-600 italic font-medium leading-relaxed">"{request.adminMessage}"</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase text-gray-400 mb-2 ml-2">Documents</p>
                        <div className="grid grid-cols-2 gap-2">
                          {request.documents?.map((doc, dIdx) => (
                            <a 
                              key={dIdx} 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group relative aspect-[4/3] bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary transition-all shadow-sm"
                            >
                              <img src={doc.url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FiEye className="text-white text-lg" />
                              </div>
                              <div className="absolute bottom-1 left-1 right-1 bg-white/90 backdrop-blur-sm p-1 rounded-md text-center">
                                <p className="text-[7px] font-black uppercase text-gray-900 truncate">{doc.type?.replace('_', ' ')}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
