import { useState, useMemo } from "react";
import type { Component } from "../../types/component";
import { Plus, Pencil, Trash2 } from "lucide-react";
import emptyBoxAnimation from "../../assets/lottie/empty-box.json";
import EmptyState from "../EmptyState";
import SearchAndFilter from "../SearchAndFilter";
import Card from "../Card";
import Button from "../Button";
import AddComponent from "../ui/Modals/AddComponent";
import useKitStore from "../../store/kit";
import useComponentStore from "../../store/component";
import { useProjects, useKits } from "../../hooks/useTutorialData";
import type { ComponentCategory } from "../../types/component";

/** Map tutorial hardware categories to component categories */
function toComponentCategory(hw: string): ComponentCategory {
    const map: Record<string, ComponentCategory> = {
        led: "active", resistor: "passive", capacitor: "passive",
        button: "active", buzzer: "active", sensor: "sensor",
        motor: "actuator", display: "display", module: "active",
        connector: "other", ic: "active", camera: "sensor",
        relay: "active", potentiometer: "passive", misc: "other",
    };
    return map[hw] ?? "other";
}

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [showAddComponent, setShowAddComponent] = useState<boolean>(false);
    const [editingComponent, setEditingComponent] = useState<Component | null>(null);

    const { ownedSkus } = useKitStore();
    const userComponents = useComponentStore((s) => s.components);
    const deleteComponent = useComponentStore((s) => s.deleteComponent);
    const { data: projects } = useProjects();
    const { data: kits } = useKits();

    // Derive components from kit projects, merge with user-added components
    const components: Component[] = useMemo(() => {
        // Resolve owned tiers directly from owned SKUs
        const ownedTiers = new Set(
            kits.filter((k) => ownedSkus.includes(k.sku)).map((k) => k.tier),
        );
        if (ownedTiers.size === 0) return userComponents;

        // Step 1: per tier, take the max quantity of each component across that tier's projects
        const perTierMax = new Map<string, Map<string, Component>>();
        for (const tier of ownedTiers) {
            const tierMap = new Map<string, Component>();
            for (const p of projects) {
                if (p.kitTier !== tier) continue;
                for (const c of p.components) {
                    const ex = tierMap.get(c.name);
                    if (ex) {
                        ex.quantity = Math.max(ex.quantity, c.quantity);
                    } else {
                        tierMap.set(c.name, {
                            id: `kit-${c.name}`,
                            name: c.name,
                            category: toComponentCategory(c.category),
                            quantity: c.quantity,
                            supplier: "Freenove",
                            partNumber: c.partNumber ?? "",
                            inUse: 0,
                            description: `Included in ${tier} kit`,
                        });
                    }
                }
            }
            perTierMax.set(tier, tierMap);
        }
        // Step 2: sum across kits — each kit you own physically contributes its components
        const derived = new Map<string, Component>();
        for (const tierMap of perTierMax.values()) {
            for (const [name, comp] of tierMap) {
                const ex = derived.get(name);
                if (ex) {
                    ex.quantity += comp.quantity;
                } else {
                    derived.set(name, { ...comp });
                }
            }
        }

        // User-added components override kit-derived ones by id
        const userIds = new Set(userComponents.map((c) => c.id));
        const merged = [...derived.values()].filter((c) => !userIds.has(c.id));
        return [...userComponents, ...merged];
    }, [ownedSkus, kits, projects, userComponents]);

    const categories: string[] = Array.from(
        new Set(components.map((c) => c.category)),
    );
    const filteredComponents = components.filter((component) => {
        const matchesSearch =
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (component.description &&
                component.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));
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
                <Button
                    variant="gradient"
                    onClick={() => setShowAddComponent(true)}
                >
                    <Plus className="w-5 h-5" />
                    <span className="whitespace-nowrap">Add Component</span>
                </Button>
            </div>
            {showAddComponent && (
                <AddComponent setShowAddComponent={setShowAddComponent} />
            )}
            {editingComponent && (
                <AddComponent
                    setShowAddComponent={(show) => { if (!show) setEditingComponent(null); }}
                    component={editingComponent}
                />
            )}

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
                                <div className="flex items-center gap-1">
                                    <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                                        {component.category}
                                    </span>
                                    {/* Edit/delete only for user-added components, not kit-derived */}
                                    {!component.id.startsWith("kit-") && (
                                        <>
                                            <button
                                                onClick={() => setEditingComponent(component)}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                title="Edit component"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete "${component.name}"?`)) {
                                                        deleteComponent(component.id);
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                title="Delete component"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="text-blue-200 text-sm mb-4">
                                {component.description}
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-200 text-sm">
                                        Quantity:
                                    </span>
                                    <span className="text-white">
                                        {component.quantity}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-200 text-sm">
                                        In Use:
                                    </span>
                                    <span className="text-white">
                                        {component.inUse}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-200 text-sm">
                                        Unit Price:
                                    </span>
                                    <span className="text-white">
                                        ${component.unitPrice}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-200 text-sm">
                                        Total Value:
                                    </span>
                                    <span className="text-white">
                                        $
                                        {(
                                            component.quantity *
                                            (component.unitPrice ?? 0)
                                        ).toFixed(2)}
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
