import { useNavigate, useLocation } from "react-router";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryParam = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", newPage);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    onPageChange(newPage);
    updateQueryParam(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const btnBase = "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed group";

  return (
    <div className="inline-flex items-center gap-2 bg-white p-1.5 rounded-full shadow-sm border border-[#E5F0EA]">
      <div className="flex items-center gap-1 border-r border-[#E5F0EA] pr-2 mr-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          title="First Page"
          className={`${btnBase} text-gray-400 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] cursor-pointer`}
        >
          <FiChevronsLeft size={16} />
        </button>

        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          title="Previous Page"
          className={`${btnBase} text-gray-400 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] cursor-pointer`}
        >
          <FiChevronLeft size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 px-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page</span>
        <div className="min-w-[40px] h-10 flex items-center justify-center bg-[#F0FBF4] border border-[#D1EAD9] rounded-full">
          <span className="text-sm font-black text-[#2D6A4F]">{page}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">of {totalPages}</span>
      </div>

      <div className="flex items-center gap-1 border-l border-[#E5F0EA] pl-2 ml-1">
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          title="Next Page"
          className={`${btnBase} text-gray-400 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] cursor-pointer`}
        >
          <FiChevronRight size={18} />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
          title="Last Page"
          className={`${btnBase} text-gray-400 hover:bg-[#F0FBF4] hover:text-[#2D6A4F] cursor-pointer`}
        >
          <FiChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
