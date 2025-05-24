const Campaign = ({ image, title, author, initials, raised, goal, daysLeft, supporters }) => {
  const percentage = (raised / goal) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full max-w-sm mx-auto flex flex-col h-full">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

        <div className="flex items-center mt-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">by {author}</p>
        </div>

        <div className="mt-4">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ${raised?.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {" "}
              raised out of ${goal?.toLocaleString()}
            </span>
          </p>
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
            <span>{daysLeft} Days Left</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{supporters} Supporters</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
            Share
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
