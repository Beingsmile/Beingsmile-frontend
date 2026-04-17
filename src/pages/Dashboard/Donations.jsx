import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FiHeart, FiCalendar, FiArrowRight, FiLoader,
  FiTrendingUp, FiDollarSign, FiPackage, FiFileText
} from "react-icons/fi";
import { Link } from "react-router";
import { motion } from "framer-motion";
import DonationTranscriptModal from "../../components/DonationTranscriptModal";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openTranscript = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

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
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-10 h-10 border-4 border-[#E5F0EA] border-t-[#2D6A4F] rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2D6A4F]/60 animate-pulse">Loading donations...</p>
    </div>
  );

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Donation History</h1>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
            {donations.length} transaction{donations.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <Link
          to="/campaigns/browse"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1B4332] transition-all shadow-sm shadow-[#2D6A4F]/20"
        >
          <FiHeart size={13} /> Give Again
        </Link>
      </div>

      {/* Summary Cards */}
      {donations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={<FiDollarSign size={18} />}
            label="Total Given"
            value={`৳${totalDonated.toLocaleString()}`}
            color="green"
          />
          <SummaryCard
            icon={<FiPackage size={18} />}
            label="Missions Supported"
            value={new Set(donations.map(d => d.campaignId)).size}
            color="blue"
          />
          <SummaryCard
            icon={<FiTrendingUp size={18} />}
            label="Avg. Donation"
            value={donations.length > 0 ? `৳${Math.round(totalDonated / donations.length).toLocaleString()}` : "—"}
            color="purple"
            className="col-span-2 sm:col-span-1"
          />
        </div>
      )}

      {/* Empty State */}
      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E5F0EA] p-16 text-center space-y-5">
          <div className="w-14 h-14 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-gray-300 mx-auto border border-[#E5F0EA]">
            <FiHeart size={26} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">No Donations Yet</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">
              Your generosity can change lives. Browse missions and make your first contribution.
            </p>
          </div>
          <Link
            to="/campaigns/browse"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
          >
            <FiHeart size={13} /> Browse Missions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((donation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-[#E5F0EA] shadow-sm hover:shadow-md hover:border-[#C8EDDA] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className="w-11 h-11 bg-[#EDFAF3] text-[#2D6A4F] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#2D6A4F] group-hover:text-white transition-all duration-300">
                  <FiHeart size={18} />
                </div>

                {/* Title + Date */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-900 truncate group-hover:text-[#2D6A4F] transition-colors">
                    {donation.campaignTitle}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <FiCalendar size={10} className="text-[#2D6A4F]/60" />
                    {new Date(donation.donatedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Amount</p>
                  <p className="text-lg font-black text-gray-900 leading-none">৳{donation.amount?.toLocaleString()}</p>
                  <button 
                    onClick={() => openTranscript(donation)}
                    className="mt-2 flex items-center gap-1.5 text-[9px] font-black uppercase text-[#2D6A4F] hover:text-[#1B4332] transition-colors cursor-pointer ml-auto"
                  >
                    <FiFileText size={11} /> Transcript
                  </button>
                </div>

                {/* Arrow link */}
                <Link
                  to={`/campaigns/${donation.campaignId}`}
                  className="w-9 h-9 bg-[#F8FDFB] border border-[#E5F0EA] rounded-xl flex items-center justify-center text-gray-400 hover:text-[#2D6A4F] hover:border-[#C8EDDA] transition-all shrink-0"
                >
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Transcript Modal */}
      <DonationTranscriptModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        donation={selectedDonation}
      />
    </div>
  );
};

const SummaryCard = ({ icon, label, value, color, className = "" }) => {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-violet-50 text-violet-700 border-violet-100",
  };
  return (
    <div className={`bg-white rounded-2xl border border-[#E5F0EA] shadow-sm p-4 ${className}`}>
      <div className={`w-9 h-9 rounded-xl ${colors[color]} flex items-center justify-center mb-3 border`}>
        {icon}
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
};

export default Donations;
