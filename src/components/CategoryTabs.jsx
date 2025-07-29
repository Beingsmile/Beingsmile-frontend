
const categories = [
  { id: 1, name: "All" },
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
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium
            ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;