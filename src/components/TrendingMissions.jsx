import Campaign from "./Campaign";
import { FiTrendingUp, FiArrowRight, FiActivity } from "react-icons/fi";
import { useTrendingCampaigns } from "../hooks/useCampaign";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const TrendingMissions = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useTrendingCampaigns();
  const campaigns = data?.campaigns || [];

  return (
    <section className="py-24 px-4 bg-[#F8FDFB] border-y border-[#E5F0EA]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D1EAD9] text-[#2D6A4F] rounded-full text-[10px] font-black uppercase tracking-widest">
              <FiTrendingUp /> Trending Now
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Missions Gaining <em className="not-italic text-[#2D6A4F]">Momentum</em>
            </h2>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              These causes are rapidly reaching their goals thanks to the incredible support of people like you. Join the wave of kindness.
            </p>
          </div>
          
          <Link 
            to="/campaigns/browse?sort=trending"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#D1EAD9] text-[#2D6A4F] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#2D6A4F] hover:text-white transition-all shadow-sm"
          >
            Explore Trending <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse border border-[#E5F0EA]" />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-gray-400">
            <FiActivity size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold uppercase tracking-widest italic">Wait! We can't find the momentum right now.</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic font-bold">
            Stay tuned! Fresh missions are gaining track soon.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.slice(0, 3).map((campaign) => (
              <Campaign key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingMissions;
