import { useNavigate } from "react-router";
import campaign1 from "../assets/hero.jpg";
import dayjs from "dayjs";
import { FiUsers, FiCalendar, FiArrowRight, FiActivity } from "react-icons/fi";

const Campaign = ({ campaign }) => {
  const {
    title,
    coverImage,
    goalAmount,
    currentAmount,
    endDate,
    creatorUsername,
    supporters = [],
    category
  } = campaign || {};

  const navigate = useNavigate();

  const initials = creatorUsername
    ? creatorUsername
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "BS";

  const percentage = Math.min((currentAmount / goalAmount) * 100, 100) || 0;
  const daysLeft = dayjs(endDate).diff(dayjs(), "day");

  const handleDetails = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/campaigns/${campaign?._id}`);
  };

  return (
    <div
      className="group bg-white rounded-[2.5rem] border-4 border-white shadow-md shadow-gray-100/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col h-full active:scale-[0.98]"
      onClick={handleDetails} // Added onClick to the main div for navigation
    >
      {/* Image Wrapper */}
      <div className="relative h-64 overflow-hidden"> {/* Changed h-56 to h-64 */}
        <img
          src={coverImage || campaign1}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {category && (
          <div className="absolute top-4 left-4"> {/* Changed top-5 left-5 to top-4 left-4 */}
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm"> {/* Changed px-4 py-1.5, bg-white/95, shadow-lg to px-3 py-1, bg-white/90, shadow-sm */}
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1">
        {/* Title & Author */}
        <div className="space-y-4 mb-auto">
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight font-sans">
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral text-primary flex items-center justify-center font-black text-xs border border-gray-50 uppercase shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Created By</p>
              <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                {creatorUsername || "Hero"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6 pt-6 border-t border-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <FiActivity className="text-primary" /> Impact Progress
              </span>
              <span className="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full bg-neutral rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(2,132,199,0.3)]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral rounded-2xl border border-gray-50">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Raised</p>
              <p className="text-sm font-black text-gray-900 tracking-tighter">৳{currentAmount?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-neutral rounded-2xl border border-gray-50">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Goal</p>
              <p className="text-sm font-black text-gray-900 tracking-tighter">৳{goalAmount?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em]">
            <div className="flex items-center gap-1.5 text-gray-400">
              <FiCalendar className="text-primary text-sm" />
              <span>
                {daysLeft > 0 ? `${daysLeft} Days Left` : "Finalizing"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <FiUsers className="text-primary text-sm" />
              <span>
                {supporters.length} Heroes
              </span>
            </div>
          </div>
        </div>

        {/* Inline CTA — no overlay, clean hover reveal */}
        <div className="pt-5 mt-4 border-t border-gray-50">
          <button
            onClick={handleDetails}
            className="w-full py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Support Mission
            <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
