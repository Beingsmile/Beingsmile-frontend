import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import {
    FiUser, FiMail, FiCalendar, FiCheckCircle,
    FiXCircle, FiPhone, FiEdit, FiLayers,
    FiHeart, FiLogOut, FiSettings, FiImage, FiActivity, FiShield, FiChevronRight, FiClock
} from "react-icons/fi";
import EditProfile from "../components/EditProfile";
import { Link } from "react-router";
import UserCampaigns from "../components/UserCampaigns";
import UserDonations from "../components/UserDonations";
import AccountSettings from "../components/AccountSettings";
import RequestVerification from "../components/RequestVerification";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("info");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [isStatusLoading, setIsStatusLoading] = useState(true);

    const fetchVerificationStatus = async () => {
        try {
            setIsStatusLoading(true);
            const res = await axiosInstance.get("/verification/my-requests");
            setVerificationRequests(res.data.requests);
        } catch (err) {
            console.error("Failed to fetch verification status");
        } finally {
            setIsStatusLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVerificationStatus();
        }
    }, [user]);

    const pendingRequest = verificationRequests.find(r => r.status === 'pending');

    if (!user) {
        return (
            <div className="bg-neutral min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center text-3xl mx-auto">
                        <FiUser />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Access <span className="text-primary">Denied</span></h2>
                        <p className="text-gray-500 font-medium mt-2">Please login to view your humanitarian dashboard.</p>
                    </div>
                    <Link to="/login" className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                        Secure Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FDFB] min-h-screen pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E5F0EA] overflow-hidden">
                    {/* Header/Cover Area */}
                    <div className="h-40 bg-gradient-to-br from-[#2D6A4F]/10 via-[#F0FBF4] to-transparent relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#2D6A4F] via-transparent to-transparent"></div>
                    </div>

                    <div className="px-6 lg:px-10 pb-10">
                        <div className="relative flex flex-col md:flex-row md:items-end -mt-16 mb-10 gap-6 lg:gap-8">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-white p-1.5 shadow-xl border border-[#E5F0EA] overflow-hidden group">
                                    <div className="w-full h-full rounded-xl bg-[#F8FDFB] overflow-hidden relative">
                                        {user?.data?.avatar ? (
                                            <img src={user.data.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                <FiUser size={48} />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="absolute inset-0 bg-[#2D6A4F]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                                        >
                                            <FiImage className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1.5 -right-1.5 w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                                    <FiActivity size={14} />
                                </div>
                            </div>

                            {/* Name & Basic Info */}
                            <div className="flex-1 space-y-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                            {user?.data?.name || user?.displayName}
                                        </h1>
                                        {user?.data?.isVerified && (
                                            <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full tracking-wider border border-green-100">
                                                <FiCheckCircle size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                                        <FiMail className="text-[#2D6A4F]" /> {user?.email}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-[#F8FDFB] text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#E5F0EA]">
                                        Role: {user?.data?.role || "Supporter"}
                                    </span>
                                    <span className="px-3 py-1.5 bg-[#2D6A4F]/5 text-[#2D6A4F] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#2D6A4F]/10">
                                        Since {new Date(user?.data?.createdAt).getFullYear()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-5 py-3 bg-[#2D6A4F] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FiEdit size={12} /> Edit Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-5 py-3 bg-white text-gray-500 font-black uppercase tracking-widest text-[10px] rounded-xl border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FiLogOut size={12} /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-2 border-b border-[#F0FBF4] mb-8 overflow-x-auto no-scrollbar">
                            {[
                                { id: "info", icon: <FiUser />, label: "Information" },
                                { id: "campaigns", icon: <FiLayers />, label: "My Missions" },
                                { id: "donations", icon: <FiHeart />, label: "Gifts" },
                                { id: "settings", icon: <FiSettings />, label: "Security" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-wider transition-all relative group whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "text-[#2D6A4F]" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D6A4F] rounded-full shadow-lg animate-in fade-in zoom-in duration-300"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {activeTab === "info" && (
                                <PersonalInfo 
                                    user={user} 
                                    pendingRequest={pendingRequest}
                                    isStatusLoading={isStatusLoading}
                                    onVerifyClick={() => setIsVerifyModalOpen(true)} 
                                />
                            )}
                            {activeTab === "campaigns" && <UserCampaigns />}
                            {activeTab === "donations" && <UserDonations />}
                            {activeTab === "settings" && <AccountSettings />}
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditProfile onClose={() => setIsEditModalOpen(false)} />
            )}

            {isVerifyModalOpen && (
                <RequestVerification
                    onClose={() => setIsVerifyModalOpen(false)}
                    onSubmitted={() => {
                        setIsVerifyModalOpen(false);
                        fetchVerificationStatus();
                    }}
                />
            )}
        </div>
    );
};

const PersonalInfo = ({ user, onVerifyClick, pendingRequest, isStatusLoading }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 space-y-10">
            <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D6A4F] mb-6 flex items-center gap-2">
                    <FiShield className="text-base" /> Identity Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem label="Legal Name" value={user?.data?.name} icon={<FiUser />} />
                    <InfoItem label="Email Identity" value={user?.email} icon={<FiMail />} verified={user?.emailVerified} />
                    <InfoItem label="Phone Connection" value={user?.data?.phoneNumber || "Not Connected"} icon={<FiPhone />} />
                    <InfoItem label="Impact Joined" value={new Date(user?.data?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} icon={<FiCalendar />} />
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D6A4F] mb-6 flex items-center gap-2">
                    <FiActivity className="text-base" /> Mission Statement
                </h3>
                <div className="p-8 bg-[#F8FDFB] rounded-2xl border border-[#E5F0EA] min-h-[160px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 text-5xl text-[#2D6A4F]/5 group-hover:text-primary/10 transition-colors">
                        <FiEdit />
                    </div>
                    {user?.data?.bio ? (
                        <p className="text-base font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap relative z-10">{user.data.bio}</p>
                    ) : (
                        <p className="text-gray-400 font-bold text-sm italic relative z-10">You haven't added a mission statement yet. Share your story with the world!</p>
                    )}
                </div>
            </section>
        </div>

        <div className="lg:col-span-5">
            <div className="bg-[#F0FBF4]/50 rounded-2xl p-8 border border-[#E5F0EA] space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#2D6A4F]">Security & Trust</h4>

                <div className="space-y-4">
                    <StatusBadge
                        label="Account Status"
                        value={user?.data?.status}
                        type={user?.data?.status === "active" ? "success" : "danger"}
                        icon={<FiCheckCircle />}
                    />
                    <StatusBadge
                        label="Verification Level"
                        value={user?.data?.identity?.isVerified ? "Trusted Hero" : "Standard"}
                        type={user?.data?.identity?.isVerified ? "success" : "warning"}
                        icon={<FiShield />}
                        description={
                            user?.data?.identity?.isVerified 
                                ? "Your identity is officially verified." 
                                : pendingRequest 
                                    ? "Your request is being reviewed."
                                    : "Verify to unlock platform features."
                        }
                        action={
                            !user?.data?.identity?.isVerified ? (
                                isStatusLoading ? (
                                    <div className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <FiClock className="animate-spin" /> Verifying...
                                    </div>
                                ) : pendingRequest ? (
                                    <Link
                                        to="/dashboard/verification-status"
                                        className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-lg border border-amber-200"
                                    >
                                        <FiClock /> Under Review
                                    </Link>
                                ) : (
                                    <button
                                        onClick={onVerifyClick}
                                        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2D6A4F] hover:underline group cursor-pointer"
                                    >
                                        Request Trust Stamp <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )
                            ) : (
                                <Link 
                                    to="/dashboard/verification-status"
                                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2D6A4F] hover:underline group cursor-pointer"
                                >
                                    View Record <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )
                        }
                    />
                </div>

                <div className="pt-4 border-t border-[#E5F0EA]">
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
                        Transparency ensures higher campaign success.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const InfoItem = ({ label, value, icon, verified }) => (
    <div className="p-5 bg-white rounded-xl border border-[#E5F0EA] shadow-sm hover:shadow-md transition-all group">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-4 group-hover:text-[#2D6A4F] transition-colors">{label}</label>
        <div className="flex items-center text-gray-900 font-bold tracking-tight text-sm">
            <span className="w-9 h-9 bg-[#F8FDFB] text-[#2D6A4F] rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#2D6A4F] group-hover:text-white transition-all shadow-sm">{icon}</span>
            <div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {value}
                {verified && <FiCheckCircle className="inline-block ml-2 text-green-500" />}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ label, value, type, action, icon, description }) => {
    const colors = {
        success: "text-green-600 bg-green-50/50 border-green-100",
        warning: "text-amber-600 bg-amber-50/50 border-amber-100",
        danger: "text-red-600 bg-red-50/50 border-red-100"
    };
    return (
        <div className={`p-6 rounded-2xl border ${colors[type] || colors.warning} space-y-3`}>
            <div className="flex items-center gap-3">
                <div className="text-xl opacity-80">{icon}</div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-wider opacity-60 block">{label}</label>
                    <span className="text-xs font-black uppercase tracking-widest block mt-0.5">
                        {value}
                    </span>
                </div>
            </div>
            {description && <p className="text-[10px] font-bold leading-relaxed opacity-70 uppercase tracking-wide">{description}</p>}
            {action}
        </div>
    );
};

export default Profile;
