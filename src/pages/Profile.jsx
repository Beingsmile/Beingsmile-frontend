import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { FiUser, FiMail, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Profile = () => {
    const { user } = useContext(AuthContext);
    console.log(user);
    return (
        <div className="max-w-6xl min-h-[92vh] mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-2 md:mt-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Profile Information</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {user?.data.avatar ? (
                            <img src={user?.data.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Change Avatar
                    </button>
                </div>
                
                {/* Basic Information Section */}
                <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
                                {user?.data.name || "Not provided"}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center">
                                <FiMail className="mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-800 dark:text-gray-200">{user?.data.email}</span>
                                {user?.emailVerified ? (
                                    <FiCheckCircle className="ml-2 text-green-500" />
                                ) : (
                                    <span className="ml-2 text-xs text-red-500">(Not verified)</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    user?.data.status === 'active' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                    {user?.data.status.charAt(0).toUpperCase() + user?.data.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <span className="capitalize text-gray-800 dark:text-gray-200">{user?.data.role}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center">
                                <FiCalendar className="mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-800 dark:text-gray-200">
                                    {new Date(user?.data.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification Status</label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center">
                                {user?.data.isVerified ? (
                                    <>
                                        <FiCheckCircle className="mr-2 text-green-500" />
                                        <span className="text-gray-800 dark:text-gray-200">Verified</span>
                                    </>
                                ) : (
                                    <>
                                        <FiXCircle className="mr-2 text-red-500" />
                                        <span className="text-gray-800 dark:text-gray-200">Not Verified</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bio Section */}
            <div className="mt-6 space-y-1">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md min-h-20">
                    {user?.data.bio ? (
                        <p className="text-gray-800 dark:text-gray-200">{user?.data.bio}</p>
                    ) : (
                        <p className="text-gray-400 italic">No bio provided</p>
                    )}
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Edit Profile
                </button>
                {!user?.emailVerified && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Verify Email
                    </button>
                )}
                {!user?.data.isVerified && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        Request Verification
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;