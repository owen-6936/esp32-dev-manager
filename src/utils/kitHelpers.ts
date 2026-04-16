/* ═══════════════════════════════════════════════════════════════════════════════
   Kit Helpers — Derive tier metadata from database-sourced kit data.
   No hardcoded product-specific constants.
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { FreenoveKit } from "../types/tutorial";

/** Get a kit's display color (falls back to gray if column absent) */
export function kitColor(kits: FreenoveKit[], tier: string): string {
    return kits.find((k) => k.tier === tier)?.color ?? "#6b7280";
}

/** Sort kits by their tier_order (ascending) */
export function sortKitsByTier(kits: FreenoveKit[]): FreenoveKit[] {
    return [...kits].sort((a, b) => (a.tierOrder ?? 0) - (b.tierOrder ?? 0));
}

/** Get the numeric tier order for a tier name */
export function tierOrder(kits: FreenoveKit[], tier: string): number {
    return kits.find((k) => k.tier === tier)?.tierOrder ?? 0;
}

/**
 * Derive which tiers are included (accessible) for a given tier.
 * A tier includes all tiers with tierOrder <= its own.
 */
export function includedTiers(kits: FreenoveKit[], forTier: string): string[] {
    const myOrder = kits.find((k) => k.tier === forTier)?.tierOrder;
    if (myOrder == null) return [forTier];
    return kits.filter((k) => (k.tierOrder ?? 0) <= myOrder).map((k) => k.tier);
}

/**
 * Find the highest-tier kit from a list of owned SKUs.
 * Returns null if no kits are owned.
 */
export function highestOwnedKit(
    kits: FreenoveKit[],
    ownedSkus: string[],
): FreenoveKit | null {
    const owned = kits.filter((k) => ownedSkus.includes(k.sku));
    if (owned.length === 0) return null;
    return owned.reduce((best, k) =>
        (k.tierOrder ?? 0) > (best.tierOrder ?? 0) ? k : best,
    );
}

/**
 * Build a Record<tier, string[]> of included tiers for every tier present in kits.
 * Useful for batch operations (normalizer, etc.)
 */
export function buildIncludedTiersMap(
    kits: FreenoveKit[],
): Record<string, string[]> {
    const map: Record<string, string[]> = {};
    for (const kit of kits) {
        map[kit.tier] = includedTiers(kits, kit.tier);
    }
    return map;
}
