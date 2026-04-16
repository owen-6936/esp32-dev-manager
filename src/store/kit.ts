import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KitStore {
    /** SKUs the user owns — multi-select, empty = none */
    ownedSkus: string[];
    toggleKit: (sku: string) => void;
    setOwnedSkus: (skus: string[]) => void;
    ownsKit: (sku: string) => boolean;
}

const useKitStore = create<KitStore>()(
    persist(
        (set, get) => ({
            ownedSkus: [],
            toggleKit: (sku) =>
                set((state) => ({
                    ownedSkus: state.ownedSkus.includes(sku)
                        ? state.ownedSkus.filter((s) => s !== sku)
                        : [...state.ownedSkus, sku],
                })),
            setOwnedSkus: (skus) => set({ ownedSkus: skus }),
            ownsKit: (sku) => get().ownedSkus.includes(sku),
        }),
        { name: "esp32-owned-kits" },
    ),
);

export default useKitStore;
