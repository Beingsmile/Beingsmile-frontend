import { useState } from "react";
import { useBrowseCampaigns } from "../hooks/useCampaign";
import CampaignCard from "../components/Campaign";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = [
  { id: 1, name: "all" },
  { id: 2, name: "education" },
  { id: 3, name: "health" },
  { id: 4, name: "art" },
  { id: 5, name: "environment" },
  { id: 6, name: "technology" },
  { id: 7, name: "community" },
  { id: 8, name: "animals" },
  { id: 9, name: "others" },
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
