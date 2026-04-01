import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 group-focus-within:text-[#2D6A4F] transition-colors" size={16} />
      </div>
      <input
        type="text"
        placeholder="Find missions by cause, name, or location..."
        className="w-full bg-white border border-[#E5F0EA] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 px-11 py-3 rounded-lg text-sm font-medium text-gray-800 placeholder-gray-400 transition-all outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute inset-y-1.5 right-1.5">
        <button
          type="submit"
          className="h-full px-5 bg-[#2D6A4F] text-white text-xs font-bold rounded-md hover:bg-[#1B4332] transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;