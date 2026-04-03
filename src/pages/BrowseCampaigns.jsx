import { useState, useEffect } from "react";
import { useBrowseCampaigns } from "../hooks/useCampaign";
import CampaignCard from "../components/Campaign";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSearchParams } from "react-router";
import { FiAlertCircle, FiSearch, FiLayers, FiHeart, FiFilter, FiTrendingUp, FiClock, FiStar } from "react-icons/fi";
import { Link } from "react-router";

// ── 17 comprehensive categories ───────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "All Missions", icon: "🌐" },
  { id: 2, name: "Education", icon: "📚" },
  { id: 3, name: "Health & Medical", icon: "🏥" },
  { id: 4, name: "Disaster Relief", icon: "🆘" },
  { id: 5, name: "Poverty & Food", icon: "🍛" },
  { id: 6, name: "Environment", icon: "🌱" },
  { id: 7, name: "Animals", icon: "🐾" },
  { id: 8, name: "Community Development", icon: "🏘️" },
  { id: 9, name: "Arts & Culture", icon: "🎨" },
  { id: 10, name: "Technology & Innovation", icon: "💡" },
  { id: 11, name: "Women Empowerment", icon: "👩" },
  { id: 12, name: "Child Welfare", icon: "👶" },
  { id: 13, name: "Elderly Care", icon: "👴" },
  { id: 14, name: "Mental Health", icon: "🧠" },
  { id: 15, name: "Sports & Fitness", icon: "⚽" },
  { id: 16, name: "Religious & Spiritual", icon: "🕌" },
  { id: 17, name: "Legal Aid", icon: "⚖️" },
  { id: 18, name: "Others", icon: "✨" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: <FiClock /> },
  { id: "trending", label: "Trending Now", icon: <FiTrendingUp /> },
  { id: "recommended", label: "Most Recommended", icon: <FiThumbsUp /> }, // ThumbsUp will be imported
  { id: "ending_soon", label: "Ending Soon", icon: <FiClock className="rotate-90" /> },
  { id: "close_to_goal", label: "Close to Goal", icon: <FiStar /> },
];

import { FiThumbsUp } from "react-icons/fi";

export default function BrowseCampaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State from URL params for better UX (shareable links)
  const categoryParam = searchParams.get("category") || "All Missions";
  const sortParam = searchParams.get("sort") || "newest";
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const queryParam = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.find(c => c.name === categoryParam)?.id || 1
  );
  const [sort, setSort] = useState(sortParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedCategory, sort]);

  // Sync state to URL
  useEffect(() => {
    const params = {};
    if (selectedCategory !== 1) params.category = CATEGORIES.find(c => c.id === selectedCategory)?.name;
    if (sort !== "newest") params.sort = sort;
    if (currentPage !== 1) params.page = currentPage;
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
  }, [selectedCategory, sort, currentPage, searchQuery]);

  const { data, isLoading, error } = useBrowseCampaigns({
    category: selectedCategory === 1 ? null : CATEGORIES.find(c => c.id === selectedCategory)?.name,
    search: searchQuery,
    page: currentPage,
    sort: sort,
    limit: 9, // Increased limit for better grid usage
  });

  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Page Header — Professional Mint Aesthetic */}
      <section className="bg-[#F0FBF4] border-b border-[#D1EAD9] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-4 duration-700">
                Mission Directory
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none animate-in fade-in slide-in-from-left-6 duration-700 delay-75">
                Explore <em className="not-italic text-[#2D6A4F] relative">
                  Impact
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#B7DFC9] -z-0 rounded-full opacity-50" />
                </em> Missions
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
                Discover verified humanitarian projects that need your support. Every donation, no matter the size, powers a story of hope and kindness.
              </p>
            </div>
            
            <div className="w-full lg:max-w-md animate-in fade-in slide-in-from-right-10 duration-700 delay-200">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#E5F0EA] flex items-center">
                <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar — Refined and Sticky */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Category selector */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FiLayers size={12} className="text-[#2D6A4F]" /> Sectors
                  </h3>
                  {selectedCategory !== 1 && (
                    <button 
                      onClick={() => setSelectedCategory(1)}
                      className="text-[10px] font-bold text-[#2D6A4F] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="max-h-[60vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                  <CategoryTabs
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelect={handleCategoryChange}
                  />
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="bg-[#1B4332] p-6 rounded-2xl text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#2D6A4F] rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-5 border border-white/10">
                    <FiHeart size={18} className="text-white" />
                  </div>
                  <h4 className="text-base font-bold mb-2 leading-tight">Start Your Own Mission</h4>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    Have a cause that needs support? Start a fundraising campaign in minutes.
                  </p>
                  <Link
                    to="/campaigns/create"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#2D6A4F] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#F0FBF4] transition-all active:scale-95 shadow-lg shadow-black/20"
                  >
                    Go Live Now
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results Area */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  {selectedCategory === 1 ? "Active Missions" : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  <span className="w-1 h-1 bg-[#2D6A4F] rounded-full" />
                  <span className="text-gray-400 font-medium">({data?.total || 0})</span>
                </h2>
                <div className="flex items-center gap-2">
                   <div className="flex items-center -space-x-1">
                      {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full border border-white bg-[#F0FBF4]" />)}
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trusted by 24k+ donors</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                  <select 
                    value={sort}
                    onChange={handleSortChange}
                    className="w-full sm:w-48 pl-9 pr-4 py-2.5 bg-white border border-[#E5F0EA] focus:border-[#2D6A4F] rounded-xl text-xs font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer shadow-sm shadow-[#2D6A4F]/5"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FiClock className="text-gray-300" size={10} />
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#F8FDFB] border border-[#E5F0EA] aspect-[4/5] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="w-full py-20 bg-[#F0FBF4] rounded-2xl border border-[#D1EAD9] flex flex-col items-center justify-center gap-4 text-center px-6">
                <div className="w-16 h-16 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center border border-red-100 mb-2">
                  <FiAlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 italic">Something went wrong.</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  We're having trouble fetching the missions. Please refresh the page or try again later.
                </p>
                <button 
                   onClick={() => window.location.reload()}
                   className="px-8 py-3 bg-[#2D6A4F] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#1B4332] transition-all active:scale-95 shadow-lg shadow-[#2D6A4F]/20"
                >
                  Refresh Page
                </button>
              </div>
            ) : data?.campaigns?.length === 0 ? (
              <div className="w-full py-24 bg-[#F8FDFB] rounded-2xl border border-[#D1EAD9] flex flex-col items-center justify-center gap-5 text-center px-6 border-dashed">
                <div className="w-20 h-20 bg-white text-gray-200 rounded-3xl flex items-center justify-center border border-[#E5F0EA] mb-2 shadow-sm">
                  <FiSearch size={36} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">No Missions Found</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                    We couldn't find any missions matching your current search or filter criteria.
                  </p>
                </div>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory(1); setSort("newest"); setCurrentPage(1); }}
                  className="px-8 py-3 bg-[#2D6A4F] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#1B4332] transition-all active:scale-95 shadow-lg shadow-[#2D6A4F]/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {data?.campaigns?.map((campaign, idx) => (
                    <div
                      key={campaign._id}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                    >
                      <CampaignCard campaign={campaign} />
                    </div>
                  ))}
                </div>

                {/* Pagination — Redesigned */}
                <div className="flex flex-col items-center justify-center gap-6 pt-10 border-t border-[#E5F0EA]">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    Showing {data?.campaigns?.length} of {data?.total} missions
                  </p>
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
