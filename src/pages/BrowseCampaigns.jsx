import { useState } from "react";
import { useBrowseCampaigns } from "../hooks/useCampaign";
import CampaignCard from "../components/Campaign";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Education" },
  { id: 3, name: "Health" },
  { id: 4, name: "Art" },
  { id: 5, name: "Environment" },
  { id: 6, name: "Technology" },
  { id: 7, name: "Community" },
  { id: 8, name: "Animals" },
  { id: 9, name: "Others" },
];

export default function BrowseCampaigns() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useBrowseCampaigns({
    category: selectedCategory === 1 ? null : categories.find((c) => c.id === selectedCategory)?.name,
    search: searchQuery,
    page: currentPage,
    limit: 6,
  });

  console.log("BrowseCampaigns data:", data);
  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Campaigns</h1>

      <SearchBar onSearch={handleSearch} />
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategoryChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Failed to load campaigns.</p>
      ) : data?.campaigns?.length === 0 ? (
        <p className="text-center text-gray-600">No campaigns found.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data?.campaigns?.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>

          <div className="mt-10">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}
