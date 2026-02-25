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

  const btnBase = "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 font-black text-sm active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50">
      <button
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
        className={`${btnBase} bg-neutral text-gray-400 hover:bg-gray-100 hover:text-primary cursor-pointer`}
      >
        <FiChevronsLeft size={20} />
      </button>

      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} bg-neutral text-gray-400 hover:bg-gray-100 hover:text-primary cursor-pointer`}
      >
        <FiChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 px-6">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Page</span>
        <span className="text-lg font-black text-primary">{page}</span>
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">of {totalPages}</span>
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} bg-neutral text-gray-400 hover:bg-gray-100 hover:text-primary cursor-pointer`}
      >
        <FiChevronRight size={20} />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
        className={`${btnBase} bg-neutral text-gray-400 hover:bg-gray-100 hover:text-primary cursor-pointer`}
      >
        <FiChevronsRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
