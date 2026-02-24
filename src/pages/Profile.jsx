import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import {
    FiUser, FiMail, FiCalendar, FiCheckCircle,
    FiXCircle, FiPhone, FiEdit, FiLayers,
    FiHeart, FiLogOut, FiSettings, FiImage
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

    if (!user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
                    <Link to="/login" className="bg-tertiary text-white px-6 py-2 rounded-lg">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Header/Cover Area */}
                <div className="h-32 bg-gradient-to-r from-tertiary to-tertiary/60"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row md:items-end -mt-12 mb-8 gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-700 p-1 shadow-lg">
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden group/avatar relative"
                                >
                                    {user?.data?.avatar ? (
                                        <img src={user.data.avatar} alt="Profile" className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-opacity" />
                                    ) : (
                                        <FiUser className="w-16 h-16 text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/20">
                                        <FiImage className="text-white" size={24} />
                                    </div>
                                </button>
                            </div>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-tertiary hover:text-tertiary/80 transition-colors border border-gray-100 dark:border-gray-700"
                            >
                                <FiEdit size={18} />
                            </button>
                        </div>

                        {/* Name & Basic Info */}
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {user?.data?.name || user?.displayName}
                                </h1>
                                <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full uppercase tracking-wider">
                                    {user?.data?.role}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                <FiMail className="mr-2" /> {user?.email}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center px-4 py-2 bg-tertiary text-white font-semibold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20"
                            >
                                <FiEdit className="mr-2" /> Edit Profile
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                            >
                                <FiLogOut className="mr-2" /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700 mb-8 overflow-x-auto scrollbar-hide">
                        <TabButton
                            active={activeTab === "info"}
                            onClick={() => setActiveTab("info")}
                            icon={<FiUser />}
                            label="Information"
                        />
                        <TabButton
                            active={activeTab === "campaigns"}
                            onClick={() => setActiveTab("campaigns")}
                            icon={<FiLayers />}
                            label="My Campaigns"
                        />
                        <TabButton
                            active={activeTab === "donations"}
                            onClick={() => setActiveTab("donations")}
                            icon={<FiHeart />}
                            label="My Donations"
                        />
                        <TabButton
                            active={activeTab === "settings"}
                            onClick={() => setActiveTab("settings")}
                            icon={<FiSettings />}
                            label="Settings"
                        />
                    </div>
                    {/* Tab Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "info" && <PersonalInfo user={user} onVerifyClick={() => setIsVerifyModalOpen(true)} />}
                        {activeTab === "campaigns" && <UserCampaigns />}
                        {activeTab === "donations" && <UserDonations />}
                        {activeTab === "settings" && <AccountSettings />}
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
                        // Optionally refresh user data
                    }}
                />
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${active
            ? "border-tertiary text-tertiary bg-tertiary/5"
            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
    >
        {icon}
        {label}
    </button>
);

const PersonalInfo = ({ user, onVerifyClick }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                <span className="w-1 h-6 bg-tertiary mr-3 rounded-full"></span>
                Basic Details
            </h3>
            <div className="grid gap-4">
                <InfoItem label="Full Name" value={user?.data?.name} icon={<FiUser />} />
                <InfoItem label="Email" value={user?.email} icon={<FiMail />} verified={user?.emailVerified} />
                <InfoItem label="Phone Number" value={user?.data?.phoneNumber || "Not set"} icon={<FiPhone />} />
                <InfoItem label="Member Since" value={new Date(user?.data?.createdAt).toLocaleDateString()} icon={<FiCalendar />} />
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                <span className="w-1 h-6 bg-tertiary mr-3 rounded-full"></span>
                About Me
            </h3>
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 min-h-[150px]">
                {user?.data?.bio ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{user.data.bio}</p>
                ) : (
                    <p className="text-gray-400 italic">No bio provided yet. Click "Edit Profile" to add one!</p>
                )}
            </div>

            <div className="flex gap-4">
                <StatusBadge
                    label="Account Status"
                    value={user?.data?.status}
                    type={user?.data?.status === "active" ? "success" : "danger"}
                />
                <StatusBadge
                    label="Verification"
                    value={user?.data?.isVerified ? "Verified" : "Not Verified"}
                    type={user?.data?.isVerified ? "success" : "warning"}
                    action={!user?.data?.isVerified ? (
                        <button
                            onClick={onVerifyClick}
                            className="text-[10px] font-black uppercase text-tertiary hover:underline mt-1 block"
                        >
                            Request Verification
                        </button>
                    ) : null}
                />
            </div>
        </div>
    </div>
);

const InfoItem = ({ label, value, icon, verified }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
        <div className="flex items-center text-gray-900 dark:text-white font-semibold">
            <span className="text-tertiary mr-2">{icon}</span>
            {value}
            {verified && <FiCheckCircle className="ml-2 text-green-500" size={14} />}
        </div>
    </div>
);

const StatusBadge = ({ label, value, type, action }) => {
    const colors = {
        success: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
        warning: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
        danger: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
    };
    return (
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
            <div className="flex flex-col">
                <span className={`w-fit px-3 py-1 text-xs font-bold rounded-full uppercase tracking-tighter ${colors[type] || colors.warning}`}>
                    {value}
                </span>
                {action}
            </div>
        </div>
    );
};

export default Profile;