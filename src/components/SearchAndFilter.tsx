import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterCategory: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categories: string[];
  placeholder?: string;
}

// The reusable SearchAndFilter component.
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories,
  placeholder,
}) => {
  return (
    <div className="flex space-x-4">
      <div className="flex-1 relative">
        <Search className="w-5 h-5 absolute left-3 top-3 text-blue-300" />
        <input
          type="text"
          placeholder={placeholder ?? "start typing..."}
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={filterCategory}
        onChange={onFilterChange}
        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchAndFilter;
