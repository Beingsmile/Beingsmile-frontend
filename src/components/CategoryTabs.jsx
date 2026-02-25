
const categories = [
  { id: 1, name: "All Missions" },
  { id: 2, name: "Education" },
  { id: 3, name: "Health" },
  { id: 4, name: "Art" },
  { id: 5, name: "Environment" },
  { id: 6, name: "Technology" },
  { id: 7, name: "Community" },
  { id: 8, name: "Animals" },
  { id: 9, name: "Others" },
];

const CategoryTabs = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 text-sm font-black uppercase tracking-widest border-2 
            ${selectedCategory === category.id
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]"
              : "bg-white text-gray-500 border-gray-50 hover:border-primary/30 hover:text-primary"
            }`}
          onClick={() => onSelect(category.id)}
        >
          <span>{category.name}</span>
          <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedCategory === category.id ? "bg-white scale-150" : "bg-gray-200 group-hover:bg-primary/50"
            }`} />
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;