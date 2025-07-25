import { useState } from "react";
import Campaign from "../components/Campaign";

const BrowseCampaigns = () => {
  // Sample categories data
  const categories = [
    { id: 1, name: "All Categories" },
    { id: 2, name: "Technology" },
    { id: 3, name: "Art & Creative" },
    { id: 4, name: "Education" },
    { id: 5, name: "Health & Wellness" },
    { id: 6, name: "Community" },
    { id: 7, name: "Food & Agriculture" },
    { id: 8, name: "Environment" },
  ];

  // Sample campaigns data
  const sampleCampaigns = [
    {
      id: 1,
      image: "https://via.placeholder.com/400x300",
      title: "Build a Community Garden",
      author: "Green Thumb Initiative",
      initials: "GT",
      raised: 12500,
      goal: 30000,
      daysLeft: 15,
      supporters: 142,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/400x300",
      title: "AI Learning Platform for Kids",
      author: "Tech Education Foundation",
      initials: "TE",
      raised: 45000,
      goal: 60000,
      daysLeft: 30,
      supporters: 210,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/400x300",
      title: "Local Artist Exhibition",
      author: "Arts Collective",
      initials: "AC",
      raised: 8000,
      goal: 15000,
      daysLeft: 7,
      supporters: 65,
    },
    {
      id: 4,
      image: "https://via.placeholder.com/400x300",
      title: "Clean Water Initiative",
      author: "Global Water Solutions",
      initials: "GW",
      raised: 120000,
      goal: 150000,
      daysLeft: 45,
      supporters: 532,
    },
    {
      id: 5,
      image: "https://via.placeholder.com/400x300",
      title: "Animal Shelter Renovation",
      author: "Paws & Claws",
      initials: "PC",
      raised: 23000,
      goal: 40000,
      daysLeft: 22,
      supporters: 187,
    },
    {
      id: 6,
      image: "https://via.placeholder.com/400x300",
      title: "Independent Film Production",
      author: "Dream Pictures",
      initials: "DP",
      raised: 65000,
      goal: 80000,
      daysLeft: 12,
      supporters: 321,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 6;

  // Filter campaigns based on search query and selected category
  const filteredCampaigns = sampleCampaigns.filter((campaign) => {
    const matchesCategory =
      selectedCategory === 1 ||
      campaign.title
        .toLowerCase()
        .includes(
          categories
            .find((c) => c.id === selectedCategory)
            ?.name.toLowerCase() || ""
        );
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get current campaigns for pagination
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-1">
        <div className="container mx-auto px-4 py-2 flex md:flex-row flex-col items-center gap-3">
          {/* Mobile Category Dropdown */}
          <div className="lg:hidden w-[90%] md:w-80">
            <select
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              value={selectedCategory}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="w-[90%] md:w-80 md:ml-0 mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] xl:grid-cols-[250px_1fr] gap-6">
          {/* Desktop Category Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:h-[calc(100vh-150px)] lg:overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <div className="grid gap-2">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  className={`w-[full] text-left px-4 py-2 rounded-lg ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Campaigns Content */}
          <div>
            {/* Campaigns Grid */}
            {currentCampaigns.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentCampaigns.map((campaign) => (
                    <Campaign
                      key={campaign.id}
                      image={campaign.image}
                      title={campaign.title}
                      author={campaign.author}
                      initials={campaign.initials}
                      raised={campaign.raised}
                      goal={campaign.goal}
                      daysLeft={campaign.daysLeft}
                      supporters={campaign.supporters}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="grid place-items-center mt-8">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === number
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  No campaigns found
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCampaigns;
