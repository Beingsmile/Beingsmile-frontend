import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import CampaignCard from "../../components/Campaign";
import { FiBookmark, FiLoader, FiCompass } from "react-icons/fi";
import { Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";

const SavedCampaigns = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading } = useQuery({
    queryKey: ["savedCampaigns", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get("/campaigns/saved");
      return res.data;
    },
    enabled: !!user,
  });

  const campaigns = data?.campaigns || [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-[#2D6A4F]" size={26} />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Saved Missions</h1>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
            {campaigns.length} bookmarked mission{campaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/campaigns/browse"
          className="flex items-center gap-2 px-4 py-2.5 border border-[#E5F0EA] text-gray-500 text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-[#2D6A4F]/40 hover:text-[#2D6A4F] transition-all"
        >
          <FiCompass size={13} />
          Browse More
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E5F0EA] p-16 text-center space-y-5">
          <div className="w-14 h-14 bg-[#F8FDFB] rounded-2xl flex items-center justify-center text-gray-300 mx-auto border border-[#E5F0EA]">
            <FiBookmark size={26} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">No Saved Missions</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">
              Bookmark missions that inspire you — they'll appear here for easy access.
            </p>
          </div>
          <Link
            to="/campaigns/browse"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2D6A4F] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-[#2D6A4F]/20 hover:bg-[#1B4332] transition-all"
          >
            <FiCompass size={13} /> Explore Causes
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCampaigns;
