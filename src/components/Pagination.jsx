import { useNavigate, useLocation } from "react-router";

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

  const baseBtnClasses = `px-4 py-2 rounded-md border text-sm font-medium transition
    shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
    dark:ring-offset-gray-900 dark:focus:ring-offset-gray-900
    disabled:opacity-40 disabled:cursor-not-allowed`;

  const lightTheme = `bg-white text-gray-800 hover:bg-gray-50 border-gray-300 focus:ring-blue-500`;
  const darkTheme = `dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400`;

  return (
    <div className="flex justify-center items-center mt-8 flex-wrap gap-3 text-sm">
      <button
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
        title="First Page"
        className={`${baseBtnClasses} ${lightTheme} ${darkTheme} cursor-pointer`}
      >
        |←
      </button>

      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`${baseBtnClasses} ${lightTheme} ${darkTheme} cursor-pointer`}
      >
        Prev
      </button>

      <span className="px-4 py-2 font-semibold rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`${baseBtnClasses} ${lightTheme} ${darkTheme} cursor-pointer`}
      >
        Next
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
        title="Last Page"
        className={`${baseBtnClasses} ${lightTheme} ${darkTheme} cursor-pointer`}
      >
        →|
      </button>
    </div>
  );
};

export default Pagination;
