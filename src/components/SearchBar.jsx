import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors text-xl" />
      </div>
      <input
        type="text"
        placeholder="Search for a cause, name, or category..."
        className="w-full bg-neutral border-2 border-transparent focus:border-primary/20 focus:bg-white px-16 py-6 rounded-[2rem] text-sm font-bold text-gray-900 placeholder-gray-400 transition-all outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute inset-y-2 right-2">
        <button
          type="submit"
          className="h-full px-8 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;