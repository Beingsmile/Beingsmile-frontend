import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import CampaignCard from "../../components/Campaign";
import { FiBookmark, FiHeart, FiLoader, FiSearch } from "react-icons/fi";
import { Link } from "react-router";
import { toast } from "react-toastify";

const SavedCampaigns = () => {
  const qc = useQueryClient();

  // Fetch saved campaigns
  const { data, isLoading } = useQuery({
    queryKey: ["savedCampaigns"],
    queryFn: async () => {
      const res = await axiosInstance.get("/campaigns/saved");
      return res.data;
    }
  });

  const campaigns = data?.campaigns || [];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <FiLoader className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Saved Missions</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          Causes you've bookmarked for later
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5F0EA] p-16 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 bg-[#F8FDFB] rounded-xl flex items-center justify-center text-gray-300 mx-auto mb-2 border border-[#E5F0EA]">
            <FiBookmark size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">No Saved Missions</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-wide">
            Bookmarked missions will appear here for easy access.
          </p>
          <Link 
            to="/campaigns"
            className="inline-block px-8 py-3 bg-[#2D6A4F] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#2D6A4F]/20 hover:bg-[#1B4332] active:scale-95 transition-all mt-4"
          >
            Explore Causes
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCampaigns;
