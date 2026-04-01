import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { FiPlus, FiExternalLink, FiEdit3, FiLayers, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router";
import LoadingSpinner from "./LoadingSpinner";
import EditCampaign from "./EditCampaign";
import WithdrawFundsModal from "./WithdrawFundsModal";

const UserCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [withdrawingCampaign, setWithdrawingCampaign] = useState(null);

    const handleUpdate = (updatedCampaign) => {
        setCampaigns(prev => prev.map(c => c._id === updatedCampaign._id ? updatedCampaign : c));
    };

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

    if (loading) return (
        <div className="py-20 flex justify-center">
            <LoadingSpinner />
        </div>
    );

    if (campaigns.length === 0) {
        return (
            <div className="text-center py-24 px-8 bg-neutral rounded-[3rem] border-4 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200">
                    <FiLayers className="text-primary text-4xl" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-4">No Missions <span className="text-primary">Started</span></h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-10">The world is waiting for your kindness. Launch your first humanitarian mission today.</p>
                <Link
                    to="/create-campaign"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    <FiPlus /> Launch New Mission
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
                <div key={campaign._id} className="group bg-white rounded-[2.5rem] border-8 border-white shadow-2xl shadow-gray-200/50 overflow-hidden hover:shadow-primary/10 transition-all duration-500 flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={campaign.coverImage}
                            alt={campaign.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                            {campaign.status}
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-6 line-clamp-1 font-sans">{campaign.title}</h4>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Impact Progress</span>
                                    <span className="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                                        {Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-neutral rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(2,132,199,0.3)]"
                                        style={{ width: `${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-neutral rounded-2xl border border-gray-50">
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <FiTrendingUp className="text-primary" /> Raised
                                    </p>
                                    <p className="text-sm font-black text-gray-900 tracking-tighter">৳{campaign.currentAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-neutral rounded-2xl border border-gray-50">
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <FiDollarSign className="text-accent" /> Goal
                                    </p>
                                    <p className="text-sm font-black text-gray-900 tracking-tighter">৳{campaign.goalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-50">
                                <Link
                                    to={`/campaigns/${campaign._id}`}
                                    className="flex-1 flex items-center justify-center p-4 rounded-xl bg-neutral text-gray-500 hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest group/link"
                                >
                                    <FiExternalLink className="mr-2 group-hover/link:translate-x-0.5 transition-transform" /> View
                                </Link>
                                <button
                                    onClick={() => setEditingCampaign(campaign)}
                                    className="flex-1 flex items-center justify-center p-4 rounded-xl bg-neutral text-gray-500 hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest group/edit"
                                >
                                    <FiEdit3 className="mr-2 group-hover/edit:rotate-12 transition-transform" /> Edit
                                </button>
                            </div>

                            {/* Withdrawal Section */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setWithdrawingCampaign(campaign)}
                                    disabled={campaign.currentAmount <= (campaign.withdrawnAmount || 0)}
                                    className="w-full flex items-center justify-center p-4 rounded-xl bg-gray-900 text-white hover:bg-black transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed group/withdraw"
                                >
                                    <FiDollarSign className="mr-2 group-hover/withdraw:scale-125 transition-transform" /> 
                                    {campaign.currentAmount <= (campaign.withdrawnAmount || 0) ? "No Funds Available" : "Withdraw Funds"}
                                </button>
                                {campaign.withdrawnAmount > 0 && (
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2 text-center">
                                        ৳{campaign.withdrawnAmount.toLocaleString()} Withdrawn Successfully
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {withdrawingCampaign && (
                <WithdrawFundsModal
                    isOpen={!!withdrawingCampaign}
                    onClose={() => setWithdrawingCampaign(null)}
                    campaignId={withdrawingCampaign._id}
                    campaignTitle={withdrawingCampaign.title}
                    availableBalance={withdrawingCampaign.currentAmount - (withdrawingCampaign.withdrawnAmount || 0)}
                />
            )}
        </div>
    );
};

export default UserCampaigns;
