import { useNavigate } from "react-router";
import campaign1 from "../assets/hero.jpg";
import dayjs from "dayjs";
import { FiCalendar, FiArrowRight, FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Campaign = ({ campaign, isFeatured = false }) => {
  const { t } = useTranslation();
  const {
    _id,
    title,
    coverImage,
    goalAmount,
    currentAmount,
    endDate,
    creatorUsername,
    supporters = [],
    category,
    location = "Verified Cause"
  } = campaign || {};

  const navigate = useNavigate();

  const percentage = Math.min((currentAmount / goalAmount) * 100, 100) || 0;
  const daysLeft = dayjs(endDate).diff(dayjs(), "day");

  const handleDetails = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/campaigns/${_id}`);
  };

  return (
    <div
      onClick={handleDetails}
      className={`group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
        isFeatured
          ? "border-2 border-[#2D6A4F] shadow-md"
          : "border border-[#E5F0EA] shadow-sm hover:shadow-md hover:border-[#B7DFC9]"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={coverImage || campaign1}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            isFeatured
              ? "bg-[#2D6A4F] text-white"
              : "bg-white/90 text-gray-700"
          }`}>
            {category}
          </span>
        </div>
        {isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-[#2D6A4F] text-white rounded-full text-[10px] font-black uppercase tracking-wide">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-[#2D6A4F] mb-2">
          <FiMapPin size={10} />
          {location}
        </div>

        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#2D6A4F] transition-colors">
          {title}
        </h3>

        <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed mb-4">
          {t("campaign.support_text", { creator: creatorUsername, category: category })}
        </p>

        {/* Progress */}
        <div className="mt-auto space-y-2">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-full rounded-full bg-[#2D6A4F] transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">{t("campaign.raised")}</p>
              <p className="text-sm font-black text-gray-900">৳{currentAmount?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">{Math.round(percentage)}%</p>
              <p className="text-xs font-semibold text-gray-500">of ৳{goalAmount?.toLocaleString()}</p>
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
              <FiCalendar size={10} className="text-[#2D6A4F]" />
              {daysLeft > 0 ? `${daysLeft} ${t("campaign.days_left")}` : t("campaign.ending_soon")}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold transition-all group-hover:gap-1.5 ${
              isFeatured ? "text-[#2D6A4F]" : "text-gray-400 group-hover:text-[#2D6A4F]"
            }`}>
              {t("campaign.view")} <FiArrowRight size={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
