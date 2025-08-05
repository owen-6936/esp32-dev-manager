import { Plus, Search } from "lucide-react";
import { use, useState } from "react";
import { useComponentStore } from "../../store/component/component";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddComponent, setShowAddComponent] = useState(false);
  const components = useComponentStore((state) => state.components);
  const categories = Array.from(new Set(components.map((c) => c.category)));
  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (component.description &&
        component.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      filterCategory === "all" || component.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="space-y-6 min-h-full sm:min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Component Inventory</h2>
        <button
          onClick={() => setShowAddComponent(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Component</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-blue-300" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{component.name}</h3>
              <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                {component.category}
              </span>
            </div>

            <p className="text-blue-200 text-sm mb-4">
              {component.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Quantity:</span>
                <span className="text-white">{component.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">In Use:</span>
                <span className="text-white">{component.inUse}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Unit Price:</span>
                <span className="text-white">${component.unitPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Total Value:</span>
                <span className="text-white">
                  ${(component.quantity * component.unitPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {component.supplier && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-blue-200 text-xs">
                  Supplier: {component.supplier}
                </p>
                {component.partNumber && (
                  <p className="text-blue-200 text-xs">
                    Part #: {component.partNumber}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
