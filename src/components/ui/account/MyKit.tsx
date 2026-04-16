import { Package, Check, ChevronRight, Cpu } from "lucide-react";
import { useMemo } from "react";
import useKitStore from "../../../store/kit";
import Card from "../../Card";
import { useKits, useProjects } from "../../../hooks/useTutorialData";
import type { TutorialComponent, KitTier } from "../../../types/tutorial";
import { kitColor, sortKitsByTier } from "../../../utils/kitHelpers";

/** Per-tier: find the max quantity of each component across all that tier's projects.
 *  Then SUM across tiers — each physical kit you own contributes its own component set. */
function deriveKitComponents(
    projects: { kitTier: KitTier; components: TutorialComponent[] }[],
    ownedTiers: Set<string>,
): TutorialComponent[] {
    // Step 1: per tier, take the max of each component (covers the most demanding project)
    const perTierMax = new Map<string, Map<string, TutorialComponent>>();
    for (const tier of ownedTiers) {
        const tierMap = new Map<string, TutorialComponent>();
        for (const p of projects) {
            if (p.kitTier !== tier) continue;
            for (const c of p.components) {
                const ex = tierMap.get(c.name);
                if (ex) {
                    ex.quantity = Math.max(ex.quantity, c.quantity);
                } else {
                    tierMap.set(c.name, { ...c });
                }
            }
        }
        perTierMax.set(tier, tierMap);
    }
    // Step 2: sum across kits — owning two kits means you physically have both
    const combined = new Map<string, TutorialComponent>();
    for (const tierMap of perTierMax.values()) {
        for (const [name, comp] of tierMap) {
            const ex = combined.get(name);
            if (ex) {
                ex.quantity += comp.quantity;
            } else {
                combined.set(name, { ...comp });
            }
        }
    }
    return [...combined.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default function MyKit() {
    const { ownedSkus, toggleKit } = useKitStore();
    const { data: kits, loading } = useKits();
    const { data: projects } = useProjects();

    const sortedKits = sortKitsByTier(kits);

    const ownedTiers = useMemo(
        () => new Set(kits.filter((k) => ownedSkus.includes(k.sku)).map((k) => k.tier)),
        [kits, ownedSkus],
    );

    const kitComponents = useMemo(
        () =>
            ownedTiers.size > 0
                ? deriveKitComponents(projects, ownedTiers)
                : [],
        [projects, ownedTiers],
    );

    return (
        <Card bg="transparent" padding="px-4 py-4">
            <Card.Header
                title="My Kits"
                icon={<Package className="w-5 h-5 text-purple-400" />}
                subtitle="Select all Freenove kits you own — access unlocks up to your highest tier"
            />
            <Card.Body>
                {loading && kits.length === 0 ? (
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : kits.length === 0 ? (
                    <p className="text-white/30 text-xs text-center py-4">
                        Kit data not available — check your Supabase connection
                    </p>
                ) : (
                    <div className="space-y-3">
                        {sortedKits.map((kit) => {
                            const color = kitColor(kits, kit.tier);
                            const isOwned = ownedSkus.includes(kit.sku);

                            return (
                                <button
                                    key={kit.sku}
                                    onClick={() => toggleKit(kit.sku)}
                                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${isOwned
                                        ? "border-opacity-50 bg-opacity-10"
                                        : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15"
                                        }`}
                                    style={
                                        isOwned
                                            ? { borderColor: `${color}50`, backgroundColor: `${color}10` }
                                            : undefined
                                    }
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                                    >
                                        <Package className="w-5 h-5" style={{ color }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-medium text-sm">{kit.name}</span>
                                            <span
                                                className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                                                style={{
                                                    color,
                                                    borderColor: `${color}30`,
                                                    backgroundColor: `${color}10`,
                                                }}
                                            >
                                                {kit.sku}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-xs mt-0.5 capitalize">
                                            {kit.tier} tier
                                        </p>
                                        <p className="text-xs mt-1.5 font-medium" style={{ color }}>
                                            {kit.projectCount} projects
                                        </p>
                                    </div>

                                    {/* Checkbox indicator */}
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${isOwned ? "border-transparent" : "border-white/20"
                                            }`}
                                        style={isOwned ? { backgroundColor: color } : undefined}
                                    >
                                        {isOwned && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            );
                        })}

                        {/* Summary banner */}
                        {ownedSkus.length > 0 && ownedTiers.size > 0 && (() => {
                            const ownedKitList = kits.filter((k) => ownedSkus.includes(k.sku));
                            const totalProjects = ownedKitList.reduce((sum, k) => sum + (k.projectCount ?? 0), 0);
                            const bannerColor = kitColor(kits, ownedKitList[ownedKitList.length - 1]?.tier ?? "basic");
                            return (
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl border"
                                    style={{
                                        borderColor: `${bannerColor}25`,
                                        backgroundColor: `${bannerColor}08`,
                                    }}
                                >
                                    <ChevronRight
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: bannerColor }}
                                    />
                                    <p className="text-white/60 text-xs leading-relaxed">
                                        You own{" "}
                                        <span className="font-semibold text-white">
                                            {ownedSkus.length} kit{ownedSkus.length > 1 ? "s" : ""}
                                        </span>
                                        {" "}with{" "}
                                        <span className="font-semibold text-white">
                                            {totalProjects} projects
                                        </span>
                                        .
                                    </p>
                                </div>
                            );
                        })()}
                        {ownedSkus.length === 0 && (
                            <p className="text-white/25 text-xs text-center py-2">
                                No kits selected — tap a kit above to track your accessible projects
                            </p>
                        )}

                        {/* Kit Components Section */}
                        {kitComponents.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Cpu className="w-4 h-4 text-cyan-400" />
                                    <h4 className="text-sm font-medium text-white/70">
                                        Components in Your Kit
                                        <span className="text-white/30 text-xs ml-1.5">
                                            ({kitComponents.length})
                                        </span>
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {kitComponents.map((c) => (
                                        <span
                                            key={c.name}
                                            className="text-[11px] px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-white/50"
                                        >
                                            {c.name}
                                            {c.quantity > 1 && (
                                                <span className="text-white/25 ml-1">×{c.quantity}</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
