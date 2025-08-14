import { useState } from "react";
import type { Component } from "../../types/component";
import { Plus } from "lucide-react";
import emptyBoxAnimation from "../../assets/lottie/empty-box.json";
import EmptyState from "../EmptyState";
import SearchAndFilter from "../SearchAndFilter";
import Card from "../Card";
import Button from "../Button";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const components: Component[] = [];

  const categories: string[] = Array.from(
    new Set(components.map((c) => c.category))
  );
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
    <div className="space-y-6 min-height p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Component Inventory
        </h2>
        <Button variant="gradient" onClick={() => {}}>
          <Plus className="w-5 h-5" />
          <span className="whitespace-nowrap">Add Component</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        categories={categories}
        placeholder="Search components..."
      />

      {/* Components Grid */}
      {components.length === 0 ? (
        <EmptyState
          mediaType="lottie"
          media={emptyBoxAnimation}
          title="No Components Yet"
          message="Your inventory is empty. Start by adding your first component!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <Card
              key={component.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {component.name}
                </h3>
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
                    $
                    {(component.quantity * (component.unitPrice ?? 0)).toFixed(
                      2
                    )}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
