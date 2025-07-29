
const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => {
          onPageChange(page - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg border text-sm font-medium transition
                   bg-white text-gray-800 hover:bg-gray-100
                   dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <span className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-100 text-gray-800
                       dark:bg-gray-700 dark:text-white">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => {
          onPageChange(page + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg border text-sm font-medium transition
                   bg-white text-gray-800 hover:bg-gray-100
                   dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;