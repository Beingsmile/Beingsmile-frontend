import Campaign from "./Campaign";
import { FiArrowRight, FiTarget, FiActivity } from "react-icons/fi";
import { useFeaturedCampaigns } from "../hooks/useCampaign";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";

const FeaturedCampaigns = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useFeaturedCampaigns();
  const campaigns = data?.campaigns || [];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header — centered like reference */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">
            {t("featured.top_missions", { defaultValue: "Top Missions" })}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("featured.featured", { defaultValue: "Featured" })}{" "}
            <em className="not-italic text-[#2D6A4F]">{t("featured.impacts", { defaultValue: "Impacts" })}</em>
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            {t("featured.description", { defaultValue: "Discover verified missions that are changing lives right now. Your kindness can create a lasting smile." })}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-gray-400 bg-[#F0FBF4] rounded-xl border border-[#D1EAD9]">
            <FiActivity size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">{t("featured.error", { defaultValue: "Unable to load featured missions" })}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-[#F0FBF4] rounded-xl border border-[#D1EAD9]">
            <p className="text-sm font-semibold">{t("featured.no_campaigns", { defaultValue: "No featured missions at the moment" })}</p>
          </div>
        ) : (
          <>
            {/* Campaign grid — 3 columns with middle highlighted, matching reference carousel */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.slice(0, 3).map((campaign, idx) => (
                <div
                  key={campaign._id}
                  className={idx === 1 ? "card-featured rounded-xl" : ""}
                >
                  <Campaign campaign={campaign} isFeatured={idx === 1} />
                </div>
              ))}
            </div>

            {/* Pagination dots like reference */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === 1 ? "w-6 h-2 bg-[#2D6A4F]" : "w-2 h-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* See all link */}
        <div className="text-center mt-8">
          <a
            href="/campaigns/browse"
            className="inline-flex items-center gap-2 text-[#2D6A4F] text-sm font-bold hover:text-[#1B4332] transition-colors"
          >
            {t("featured.see_all", { defaultValue: "See All Missions" })}
            <FiArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
