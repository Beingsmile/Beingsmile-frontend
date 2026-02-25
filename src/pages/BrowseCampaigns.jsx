import { useState, useEffect } from "react";
import { useBrowseCampaigns } from "../hooks/useCampaign";
import CampaignCard from "../components/Campaign";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router";
import { FiSearch, FiFilter, FiHeart, FiHexagon, FiPlus } from "react-icons/fi";
import { Link } from "react-router";

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
    <div className="bg-neutral min-h-screen">
      {/* Hero Header Section */}
      <section className="pt-40 pb-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <FiHexagon className="animate-spin-slow" />
                Mission Explorer
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight font-sans leading-none uppercase">
                Explore <br /><span className="text-primary italic">Humanity</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Every story here is a heartbeat of hope. Find the mission that resonates with you and start your journey as a hero today.
              </p>
            </div>
            <div className="hidden lg:block pb-4">
              <Link
                to="/campaigns/create"
                className="inline-flex items-center gap-4 px-10 py-6 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-2xl hover:bg-primary transition-all group"
              >
                <FiPlus />
                Launch Your Mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-12 lg:sticky lg:top-32">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                <FiFilter /> Field of Impact
              </h3>
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategoryChange}
              />
            </div>

            <div className="p-8 bg-accent rounded-[3rem] text-white space-y-6 shadow-2xl shadow-accent/20">
              <FiHeart className="text-4xl animate-pulse" />
              <h4 className="text-xl font-black uppercase tracking-tight leading-tight">Every Mission <br />Counts</h4>
              <p className="text-sm font-medium opacity-80 leading-relaxed">Your support doesn't just fund a cause, it restores a life. Thank you for being a hero.</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-12">
            <div className="bg-white p-6 rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white group focus-within:border-primary/5 transition-all">
              <SearchBar onSearch={handleSearch} />
            </div>

            {isLoading ? (
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white p-24 flex flex-col items-center justify-center text-center space-y-6 min-h-[600px]">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary text-3xl">
                  <LoadingSpinner />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Connecting Compassion...</h3>
                  <p className="text-gray-400 font-medium text-sm">Our community is finding the best missions for you.</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white p-24 flex flex-col items-center justify-center text-center space-y-6 min-h-[600px]">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center text-3xl">
                  <FiHeart className="rotate-180" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Connection Lost</h3>
                  <p className="text-gray-400 font-medium text-sm">The humanitarian bridge is temporarily down. Please try again.</p>
                </div>
              </div>
            ) : data?.campaigns?.length === 0 ? (
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border-8 border-white p-24 flex flex-col items-center justify-center text-center space-y-6 min-h-[600px]">
                <div className="w-20 h-20 bg-neutral rounded-[1.5rem] flex items-center justify-center text-gray-300 text-3xl">
                  <FiSearch />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Shadows Only</h3>
                  <p className="text-gray-400 font-medium text-sm">We couldn't find any missions matching your current search.</p>
                </div>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory(1) }}
                  className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-16">
                <div className="grid md:grid-cols-2 gap-10">
                  {data?.campaigns?.map((campaign, idx) => (
                    <div
                      key={campaign._id}
                      className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      <CampaignCard campaign={campaign} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <Pagination
                    page={data?.page}
                    totalPages={data?.totalPages || 1}
                    onPageChange={(newPage) => {
                      setCurrentPage(newPage);
                    }}
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
