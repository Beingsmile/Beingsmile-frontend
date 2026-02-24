import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { FiHeart, FiCalendar, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import LoadingSpinner from "./LoadingSpinner";

const UserDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axiosInstance.get("/payment/user-donations");
                setDonations(response.data.donations);
            } catch (error) {
                console.error("Error fetching donations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (donations.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="text-gray-400 size-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No donations yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Your kindness can change a life. Support a campaign today!</p>
                <Link
                    to="/campaigns"
                    className="inline-flex items-center px-6 py-3 bg-tertiary text-white font-bold rounded-xl hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20"
                >
                    Browse Campaigns
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {donations.map((donation, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                        <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary shrink-0">
                            <FiHeart size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-tertiary transition-colors">
                                {donation.campaignTitle}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                <FiCalendar className="mr-1" /> {new Date(donation.donatedAt).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Amount</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">৳{donation.amount.toLocaleString()}</p>
                        </div>
                        <Link
                            to={`/campaigns/${donation.campaignId}`}
                            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-tertiary hover:bg-tertiary/10 transition-all"
                        >
                            <FiArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserDonations;
