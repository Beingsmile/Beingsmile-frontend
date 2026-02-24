import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { FiPlus, FiMoreVertical, FiExternalLink, FiEdit3 } from "react-icons/fi";
import { Link } from "react-router";
import LoadingSpinner from "./LoadingSpinner";

const UserCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axiosInstance.get("/campaigns/my-campaigns");
                setCampaigns(response.data.campaigns);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (campaigns.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLayers className="text-gray-400 size-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Ready to make an impact? Start your first campaign today!</p>
                <Link
                    to="/create-campaign"
                    className="inline-flex items-center px-6 py-3 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20"
                >
                    <FiPlus className="mr-2" /> Create Campaign
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
                <div key={campaign._id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-40">
                        <img
                            src={campaign.coverImage}
                            alt={campaign.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest">
                            {campaign.status}
                        </div>
                    </div>

                    <div className="p-5">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">{campaign.title}</h4>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Progress</span>
                                    <span>{Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-tertiary transition-all duration-500"
                                        style={{ width: `${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Raised</p>
                                    <p className="font-bold text-tertiary">৳{campaign.currentAmount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Goal</p>
                                    <p className="font-bold text-gray-700 dark:text-gray-300">৳{campaign.goalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-gray-700">
                                <Link
                                    to={`/campaigns/${campaign._id}`}
                                    className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-tertiary hover:bg-tertiary/10 transition-all font-bold text-xs"
                                >
                                    <FiExternalLink className="mr-1" /> View
                                </Link>
                                <button className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-tertiary hover:bg-tertiary/10 transition-all font-bold text-xs">
                                    <FiEdit3 className="mr-1" /> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserCampaigns;
