import Campaign from "./Campaign";
import { FiClock, FiArrowRight, FiActivity } from "react-icons/fi";
import { useNewestCampaigns } from "../hooks/useCampaign";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const NewMissions = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useNewestCampaigns();
  const campaigns = data?.campaigns || [];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
               <FiClock /> Fresh Causes
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                Meet the <em className="not-italic text-primary">Newest</em> Stories
             </h2>
             <p className="text-sm text-gray-500 max-w-lg leading-relaxed font-medium">
                Be the first to ignite hope. These missions have just launched and are looking for their very first supporters to join their journey.
             </p>
          </div>
          
          <Link 
            to="/campaigns/browse?sort=newest"
            className="group inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#2D6A4F] hover:text-[#1B4332] transition-all"
          >
            Show All Recent Stories <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-3xl animate-pulse border border-gray-100" />)}
          </div>
        ) : error ? (
           <div className="text-center py-20 text-gray-400">
             <FiActivity size={32} className="mx-auto mb-3 opacity-30" />
             <p className="text-sm font-bold tracking-widest italic uppercase">Syncing with our new starters! Try again soon.</p>
           </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 text-gray-400 italic font-bold">
            All current missions have been meeting their goals. New ones launching soon!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {campaigns.slice(0, 4).map((campaign) => (
              <Campaign key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewMissions;
