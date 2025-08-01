import { useNavigate } from "react-router";
import campaign1 from "../assets/hero.jpg";
import dayjs from "dayjs";

const Campaign = ({ campaign }) => {
  const {
    title,
    coverImage,
    goalAmount,
    currentAmount,
    startDate,
    endDate,
    creatorUsername,
    supporters = [],
  } = campaign;

  console.log("Campaign data:", campaign.creatorUsername);

  const navigate = useNavigate();

  const initials = creatorUsername
    ? creatorUsername
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NA";

  const percentage = (currentAmount / goalAmount) * 100;
  const daysLeft = dayjs(endDate).diff(dayjs(), "day");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col h-full">
      <img
        src={coverImage || campaign1}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <div className="flex items-center mt-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            by {creatorUsername || "Unknown"}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-4">
            <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${currentAmount?.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {" "}
                raised out of ${goalAmount?.toLocaleString()}
              </span>
            </p>
          </div>

          {campaign.category && (
            <span className="inline-block bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              {campaign.category}
            </span>
          )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-4 mb-4">
          <div className="flex items-center gap-1">
            <span>🗓️</span>
            <span>{daysLeft > 0 ? `${daysLeft} Days Left` : "Ended"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{supporters.length} Supporters</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button className="cursor-pointer flex-1 px-4 py-2 font-bold border-2  border-blue-600 text-blue-600 rounded-lg dark:hover:bg-blue-600 hover:bg-blue-100 dark:hover:text-white transition"
          onClick={() => navigate(`/campaigns/${campaign._id}`)}>
            Details
          </button>
          <button className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
