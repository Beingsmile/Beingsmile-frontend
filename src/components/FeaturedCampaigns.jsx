import Campaign from "./Campaign";
import campaign1 from "../assets/hero.jpg";
import { FiArrowRight, FiTarget } from "react-icons/fi";

const campaignData = [
  {
    coverImage: campaign1,
    title: "Help Build a School in Rural Bangladesh",
    creatorUsername: "Fatima Noor",
    currentAmount: 18450,
    goalAmount: 25000,
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    supporters: Array(1214).fill({}),
    category: "Education"
  },
  {
    coverImage: campaign1,
    title: "Urgent Surgery Needed for Baby Anan",
    creatorUsername: "Rahman Tuhin",
    currentAmount: 31400,
    goalAmount: 40000,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    supporters: Array(2290).fill({}),
    category: "Medical"
  },
  {
    coverImage: campaign1,
    title: "Support Relief for Families in Sylhet",
    creatorUsername: "Hasina Ahmed",
    currentAmount: 12200,
    goalAmount: 20000,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    supporters: Array(874).fill({}),
    category: "Disaster"
  },
];

const FeaturedCampaigns = () => {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <FiTarget />
              Top Missions
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans uppercase">
              Featured <span className="text-primary italic">Impacts</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl font-medium leading-relaxed">
              Discover verified missions that are changing lives right now. Your kindness can create a lasting smile.
            </p>
          </div>
          <div className="hidden md:block">
            <a
              href="/campaigns/browse"
              className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-primary/70 hover:border-primary/50 transition-all"
            >
              See All Missions
              <FiArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {campaignData.map((campaign, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <Campaign campaign={campaign} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <a
            href="/campaigns/browse"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Explore All Causes
            <FiArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
