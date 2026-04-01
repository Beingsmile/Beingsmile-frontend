const CategoryTabs = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-col gap-1">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold text-left w-full
            ${selectedCategory === category.id
              ? "bg-[#2D6A4F] text-white shadow-sm"
              : "text-gray-500 hover:bg-[#F0FBF4] hover:text-[#2D6A4F]"
            }`}
          onClick={() => onSelect(category.id)}
        >
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
            selectedCategory === category.id ? "bg-white" : "bg-[#D1EAD9]"
          }`} />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;