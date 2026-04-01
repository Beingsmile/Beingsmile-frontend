import { useState, useEffect } from "react";
import { useBrowseCampaigns } from "../hooks/useCampaign";
import CampaignCard from "../components/Campaign";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router";
import { FiAlertCircle, FiSearch, FiLayers, FiHeart } from "react-icons/fi";
import { Link } from "react-router";

const categories = [
  { id: 1, name: "All Missions" },
  { id: 2, name: "Education" },
  { id: 3, name: "Health" },
  { id: 4, name: "Art" },
  { id: 5, name: "Environment" },
  { id: 6, name: "Technology" },
  { id: 7, name: "Community" },
  { id: 8, name: "Others" },
];

export default function BrowseCampaigns() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const { data, isLoading, error } = useBrowseCampaigns({
    category:
      selectedCategory === 1
        ? null
        : categories.find((c) => c.id === selectedCategory)?.name,
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
    <div className="min-h-screen bg-white pb-20">
      {/* Page header — mint green, matching reference */}
      <section className="bg-[#F0FBF4] border-b border-[#D1EAD9] pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-2">Mission Directory</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Explore <em className="not-italic text-[#2D6A4F]">Impact</em> Missions
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                Discover verified humanitarian projects and join the global movement for kindness.
              </p>
            </div>
            <div className="w-full lg:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0 space-y-5">
            {/* Category filter */}
            <div className="bg-white p-5 rounded-xl border border-[#E5F0EA]">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiLayers size={12} className="text-[#2D6A4F]" /> Filter by Sector
              </h3>
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategoryChange}
              />
            </div>

            {/* Sidebar CTA */}
            <div className="bg-[#1B4332] p-5 rounded-xl text-white">
              <div className="w-9 h-9 bg-[#2D6A4F] rounded-lg flex items-center justify-center mb-4">
                <FiHeart size={16} className="text-white" />
              </div>
              <h4 className="text-sm font-bold mb-2 leading-snug">Your Contribution Changes Lives.</h4>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Join 24,000+ donors making a real impact today.
              </p>
              <Link
                to="/campaigns/create"
                className="block w-full py-2.5 bg-white text-[#2D6A4F] text-xs font-bold text-center rounded-lg hover:bg-[#F0FBF4] transition-colors"
              >
                Start A Mission
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="w-full h-64 bg-[#F0FBF4] rounded-xl border border-[#D1EAD9] flex flex-col items-center justify-center gap-3">
                <LoadingSpinner />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Loading missions...</p>
              </div>
            ) : error ? (
              <div className="w-full h-64 bg-[#F0FBF4] rounded-xl border border-[#D1EAD9] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center">
                  <FiAlertCircle size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-700">Unable to load missions</h3>
                <p className="text-xs text-gray-400 text-center max-w-xs">Please check your connection and try again.</p>
              </div>
            ) : data?.campaigns?.length === 0 ? (
              <div className="w-full h-64 bg-[#F0FBF4] rounded-xl border border-[#D1EAD9] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-white text-gray-300 rounded-xl flex items-center justify-center border border-[#E5F0EA]">
                  <FiSearch size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-700">No Missions Found</h3>
                <p className="text-xs text-gray-400 text-center max-w-xs">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory(1); }}
                  className="px-5 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-lg hover:bg-[#1B4332] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-7">
                {/* Results count */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400">
                    Showing <span className="text-gray-700 font-bold">{data?.campaigns?.length}</span> missions
                  </p>
                  <p className="text-xs text-gray-400">
                    Page {data?.page} of {data?.totalPages || 1}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data?.campaigns?.map((campaign, idx) => (
                    <div
                      key={campaign._id}
                      style={{ animationDelay: `${idx * 80}ms` }}
                      className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                    >
                      <CampaignCard campaign={campaign} />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center pt-4 border-t border-[#E5F0EA]">
                  <Pagination
                    page={data?.page}
                    totalPages={data?.totalPages || 1}
                    onPageChange={(newPage) => setCurrentPage(newPage)}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
