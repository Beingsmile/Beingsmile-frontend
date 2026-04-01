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
        <div className="bg-neutral min-h-screen pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white overflow-hidden">
                    {/* Header/Cover Area */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                    </div>

                    <div className="px-12 pb-12">
                        <div className="relative flex flex-col lg:flex-row lg:items-end -mt-20 mb-12 gap-10">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-44 h-44 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-gray-300 overflow-hidden group">
                                    <div className="w-full h-full rounded-[2rem] bg-neutral overflow-hidden relative">
                                        {user?.data?.avatar ? (
                                            <img src={user.data.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FiUser className="text-5xl" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="absolute inset-0 bg-primary/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                        >
                                            <FiImage className="text-2xl" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20 border-4 border-white">
                                    <FiActivity />
                                </div>
                            </div>

                            {/* Name & Basic Info */}
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase font-sans">
                                            {user?.data?.name || user?.displayName}
                                        </h1>
                                        {user?.data?.isVerified && (
                                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-green-100">
                                                <FiCheckCircle /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-lg font-medium text-gray-500 flex items-center gap-2">
                                        <FiMail className="text-primary" /> {user?.email}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-5 py-2 bg-neutral text-gray-600 text-xs font-black uppercase tracking-widest rounded-xl border border-gray-50">
                                        Role: {user?.data?.role || "Supporter"}
                                    </span>
                                    <span className="px-5 py-2 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest rounded-xl border border-primary/10">
                                        Member Since {new Date(user?.data?.createdAt).getFullYear()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-8 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    <FiEdit /> Edit Identity
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-8 py-4 bg-neutral text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-2 border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar pb-1">
                            {[
                                { id: "info", icon: <FiUser />, label: "Information" },
                                { id: "campaigns", icon: <FiLayers />, label: "My Missions" },
                                { id: "donations", icon: <FiHeart />, label: "My Gifts" },
                                { id: "settings", icon: <FiSettings />, label: "Security" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative group whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-lg shadow-primary/50 animate-in fade-in zoom-in duration-300"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
            <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                    <FiShield className="text-lg" /> Identity Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InfoItem label="Legal Name" value={user?.data?.name} icon={<FiUser />} />
                    <InfoItem label="Email Identity" value={user?.email} icon={<FiMail />} verified={user?.emailVerified} />
                    <InfoItem label="Phone Connection" value={user?.data?.phoneNumber || "Not Connected"} icon={<FiPhone />} />
                    <InfoItem label="Impact Joined" value={new Date(user?.data?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} icon={<FiCalendar />} />
                </div>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                    <FiActivity className="text-lg" /> Mission Statement
                </h3>
                <div className="p-10 bg-neutral rounded-[2.5rem] border border-gray-100 min-h-[200px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-6xl text-gray-100 group-hover:text-primary/10 transition-colors">
                        <FiEdit />
                    </div>
                    {user?.data?.bio ? (
                        <p className="text-xl font-medium text-gray-700 leading-relaxed whitespace-pre-wrap relative z-10">{user.data.bio}</p>
                    ) : (
                        <p className="text-gray-400 italic relative z-10">You haven't added a mission statement yet. Share your story with the world!</p>
                    )}
                </div>
            </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
            <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10 space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Security & Trust</h4>

                <div className="space-y-4">
                    <StatusBadge
                        label="Account Integrity"
                        value={user?.data?.status}
                        type={user?.data?.status === "active" ? "success" : "danger"}
                        icon={<FiCheckCircle />}
                    />
                    <StatusBadge
                        label="Verification Level"
                        value={user?.data?.identity?.isVerified ? "Trusted Mission Hero" : "Standard Participant"}
                        type={user?.data?.identity?.isVerified ? "success" : "warning"}
                        icon={<FiShield />}
                        description={
                            user?.data?.identity?.isVerified 
                                ? "Your identity is officially verified. You have full access to platform features." 
                                : pendingRequest 
                                    ? "Your request is being reviewed by our team."
                                    : "Verify your account to gain higher trust and unlock features."
                        }
                        action={
                            !user?.data?.identity?.isVerified ? (
                                isStatusLoading ? (
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <FiClock className="animate-spin" /> Verifying Status...
                                    </div>
                                ) : pendingRequest ? (
                                    <Link
                                        to="/dashboard/verification-status"
                                        className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-200"
                                    >
                                        <FiClock /> Application Under Review
                                    </Link>
                                ) : (
                                    <button
                                        onClick={onVerifyClick}
                                        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline group cursor-pointer"
                                    >
                                        Request Trust Stamp <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )
                            ) : (
                                <Link 
                                    to="/dashboard/verification-status"
                                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline group cursor-pointer"
                                >
                                    View Verification Record <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )
                        }
                    />
                </div>

                <div className="pt-8 border-t border-primary/10">
                    <p className="text-[10px] font-bold text-gray-500 leading-relaxed">
                        Verification helps ensure 100% transparency. Verified users have higher campaign success rates.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const InfoItem = ({ label, value, icon, verified }) => (
    <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-xl shadow-gray-200/20 hover:shadow-gray-300/40 transition-all group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 group-hover:text-primary transition-colors">{label}</label>
        <div className="flex items-center text-gray-900 font-bold tracking-tight">
            <span className="w-10 h-10 bg-neutral text-primary rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-all">{icon}</span>
            <div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {value}
                {verified && <FiCheckCircle className="inline-block ml-2 text-green-500" />}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ label, value, type, action, icon, description }) => {
    const colors = {
        success: "text-green-600 bg-green-50 border-green-100",
        warning: "text-amber-600 bg-amber-50 border-amber-100",
        danger: "text-red-600 bg-red-50 border-red-100"
    };
    return (
        <div className={`p-8 rounded-[2rem] border-2 ${colors[type] || colors.warning} space-y-4`}>
            <div className="flex items-center gap-4">
                <div className="text-2xl">{icon}</div>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-tight opacity-60 block">{label}</label>
                    <span className="text-sm font-black uppercase tracking-widest block mt-1">
                        {value}
                    </span>
                </div>
            </div>
            {description && <p className="text-[10px] font-medium leading-relaxed opacity-70">{description}</p>}
            {action}
        </div>
    );
};

export default Profile;
