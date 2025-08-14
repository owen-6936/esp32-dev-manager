import { motion, type Variants } from "framer-motion";
import { Search } from "lucide-react";

export const searchBarVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.12, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.1, ease: "easeIn" } },
};

export const resultsVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};
interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories,
  placeholder,
}) => {
  return (
    <motion.div
      className="flex space-x-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Search input */}
      <motion.div
        className="flex-1 relative"
        whileHover={{ scale: 1.01 }}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
      >
        <Search className="w-5 h-5 absolute left-3 top-3 text-blue-300" />
        <input
          type="text"
          placeholder={placeholder ?? "Start typing..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </motion.div>

      {/* Filter dropdown */}
      <motion.select
        value={filterCategory}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </motion.select>
    </motion.div>
  );
};

export default SearchAndFilter;
