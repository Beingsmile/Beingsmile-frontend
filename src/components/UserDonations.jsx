import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { FiHeart, FiCalendar, FiArrowRight, FiShield } from "react-icons/fi";
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

    if (loading) return (
        <div className="py-20 flex justify-center">
            <LoadingSpinner />
        </div>
    );

    if (donations.length === 0) {
        return (
            <div className="text-center py-24 px-8 bg-neutral rounded-[3rem] border-4 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200">
                    <FiHeart className="text-primary text-4xl" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-4">No Gifts <span className="text-primary">Sent</span></h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-10">Your generosity can light up someone's world. Start your journey of giving today.</p>
                <Link
                    to="/campaigns"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    Browse Missions
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Recent Generosity</h4>
                <div className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-green-100 flex items-center gap-2">
                    <FiShield /> Secure Transactions
                </div>
            </div>

            <div className="space-y-4">
                {donations.map((donation, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2.5rem] border-4 border-white shadow-xl shadow-gray-200/40 hover:shadow-primary/5 transition-all group animate-in fade-in slide-in-from-right-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-neutral rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden relative">
                                <FiHeart className="text-2xl relative z-10" />
                                <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase group-hover:text-primary transition-colors font-sans">
                                    {donation.campaignTitle}
                                </h4>
                                <p className="text-xs font-bold text-gray-400 flex items-center mt-2 gap-2">
                                    <FiCalendar className="text-primary" /> {new Date(donation.donatedAt).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-10">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Impact Gift</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">৳{donation.amount.toLocaleString()}</p>
                            </div>
                            <Link
                                to={`/campaigns/${donation.campaignId}`}
                                className="w-14 h-14 rounded-2xl bg-neutral flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all group/arrow"
                            >
                                <FiArrowRight className="text-2xl group-hover/arrow:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDonations;
