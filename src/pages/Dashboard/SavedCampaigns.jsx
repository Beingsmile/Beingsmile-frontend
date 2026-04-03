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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Saved Missions</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Stay connected with the causes you've bookmarked
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-2 border border-gray-100 shadow-sm">
            <FiBookmark size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tighter">No Saved Missions</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
            Missions you bookmark while browsing will appear here for easy access.
          </p>
          <Link 
            to="/campaigns/browse"
            className="inline-block px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-4"
          >
            Browse Missions
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCampaigns;
