/* ═══════════════════════════════════════════════════════════════════════════
   component-store.test.ts
   Tests: CRUD operations, lookup by id, immutability, localStorage persistence
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest";
import useComponentStore from "../store/component";
import type { Component } from "../types/component";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeComponent(overrides: Partial<Component> = {}): Component {
    return {
        id: "comp-1",
        name: "10kΩ Resistor",
        category: "passive",
        quantity: 20,
        unitPrice: 0.05,
        supplier: "DigiKey",
        partNumber: "RES-10K-0805",
        inUse: 2,
        description: "General-purpose through-hole resistor",
        ...overrides,
    };
}

beforeEach(() => {
    localStorage.clear();
    useComponentStore.setState({ components: [] });
});

// ─── addComponent ────────────────────────────────────────────────────────────

describe("addComponent", () => {
    it("adds a single component to an empty store", () => {
        useComponentStore.getState().addComponent(makeComponent());
        expect(useComponentStore.getState().components).toHaveLength(1);
    });

    it("stores all fields correctly", () => {
        const comp = makeComponent({ name: "LED Red", quantity: 50 });
        useComponentStore.getState().addComponent(comp);
        expect(useComponentStore.getState().components[0]).toEqual(comp);
    });

    it("appends multiple components in order", () => {
        const c1 = makeComponent({ id: "a", name: "Resistor" });
        const c2 = makeComponent({ id: "b", name: "Capacitor" });
        const c3 = makeComponent({ id: "c", name: "LED" });
        [c1, c2, c3].forEach((c) =>
            useComponentStore.getState().addComponent(c),
        );
        const names = useComponentStore
            .getState()
            .components.map((c) => c.name);
        expect(names).toEqual(["Resistor", "Capacitor", "LED"]);
    });

    it("supports optional fields being undefined", () => {
        const comp = makeComponent({
            unitPrice: undefined,
            datasheet: undefined,
            imageUrl: undefined,
        });
        useComponentStore.getState().addComponent(comp);
        const stored = useComponentStore.getState().components[0];
        expect(stored.unitPrice).toBeUndefined();
        expect(stored.datasheet).toBeUndefined();
    });

    it("accepts every ComponentCategory value", () => {
        const categories: Component["category"][] = [
            "passive",
            "active",
            "microcontroller",
            "sensor",
            "actuator",
            "power_supply",
            "display",
            "other",
        ];
        categories.forEach((category, i) => {
            useComponentStore
                .getState()
                .addComponent(makeComponent({ id: String(i), category }));
        });
        const stored = useComponentStore
            .getState()
            .components.map((c) => c.category);
        expect(stored).toEqual(categories);
    });
});

// ─── updateComponent ─────────────────────────────────────────────────────────

describe("updateComponent", () => {
    it("updates only provided fields", () => {
        useComponentStore.getState().addComponent(makeComponent());
        useComponentStore
            .getState()
            .updateComponent("comp-1", { quantity: 99 });

        const updated = useComponentStore.getState().components[0];
        expect(updated.quantity).toBe(99);
        expect(updated.name).toBe("10kΩ Resistor"); // unchanged
    });

    it("can update multiple fields in one call", () => {
        useComponentStore.getState().addComponent(makeComponent());
        useComponentStore.getState().updateComponent("comp-1", {
            name: "22kΩ Resistor",
            quantity: 30,
            inUse: 0,
        });

        const u = useComponentStore.getState().components[0];
        expect(u.name).toBe("22kΩ Resistor");
        expect(u.quantity).toBe(30);
        expect(u.inUse).toBe(0);
    });

    it("does not affect other components", () => {
        const c1 = makeComponent({ id: "a", name: "R1" });
        const c2 = makeComponent({ id: "b", name: "R2" });
        useComponentStore.getState().addComponent(c1);
        useComponentStore.getState().addComponent(c2);

        useComponentStore.getState().updateComponent("a", { name: "R1-mod" });

        expect(useComponentStore.getState().components[1].name).toBe("R2");
    });

    it("is a no-op for a non-existent id", () => {
        useComponentStore.getState().addComponent(makeComponent());
        const before = useComponentStore.getState().components[0].quantity;

        useComponentStore
            .getState()
            .updateComponent("ghost", { quantity: 999 });

        expect(useComponentStore.getState().components[0].quantity).toBe(
            before,
        );
    });
});

// ─── deleteComponent ─────────────────────────────────────────────────────────

describe("deleteComponent", () => {
    it("removes the matching component", () => {
        useComponentStore
            .getState()
            .addComponent(makeComponent({ id: "del-me" }));
        useComponentStore.getState().deleteComponent("del-me");
        expect(useComponentStore.getState().components).toHaveLength(0);
    });

    it("only removes the targeted component", () => {
        useComponentStore
            .getState()
            .addComponent(makeComponent({ id: "keep", name: "Keep" }));
        useComponentStore
            .getState()
            .addComponent(makeComponent({ id: "drop", name: "Drop" }));

        useComponentStore.getState().deleteComponent("drop");

        expect(useComponentStore.getState().components).toHaveLength(1);
        expect(useComponentStore.getState().components[0].id).toBe("keep");
    });

    it("is a no-op for a non-existent id", () => {
        useComponentStore.getState().addComponent(makeComponent());
        useComponentStore.getState().deleteComponent("phantom");
        expect(useComponentStore.getState().components).toHaveLength(1);
    });
});

// ─── getComponentById ────────────────────────────────────────────────────────

describe("getComponentById", () => {
    it("returns the matching component", () => {
        const comp = makeComponent({ id: "find-me", name: "Target" });
        useComponentStore.getState().addComponent(comp);

        const result = useComponentStore.getState().getComponentById("find-me");
        expect(result).toBeDefined();
        expect(result!.name).toBe("Target");
    });

    it("returns undefined when no match", () => {
        useComponentStore.getState().addComponent(makeComponent({ id: "a" }));
        expect(
            useComponentStore.getState().getComponentById("z"),
        ).toBeUndefined();
    });

    it("returns the correct entry among multiple components", () => {
        ["a", "b", "c"].forEach((id) =>
            useComponentStore
                .getState()
                .addComponent(makeComponent({ id, name: `Comp-${id}` })),
        );
        expect(useComponentStore.getState().getComponentById("b")!.name).toBe(
            "Comp-b",
        );
    });
});

// ─── localStorage persistence ────────────────────────────────────────────────

describe("localStorage persistence", () => {
    it("writes state to localStorage after addComponent", () => {
        useComponentStore.getState().addComponent(makeComponent());
        const raw = localStorage.getItem("esp32-components");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(parsed.state.components).toHaveLength(1);
    });

    it("updates localStorage after updateComponent", () => {
        useComponentStore.getState().addComponent(makeComponent());
        useComponentStore
            .getState()
            .updateComponent("comp-1", { quantity: 77 });
        const raw = localStorage.getItem("esp32-components");
        const parsed = JSON.parse(raw!);
        expect(parsed.state.components[0].quantity).toBe(77);
    });

    it("clears entry from localStorage after deleteComponent", () => {
        useComponentStore.getState().addComponent(makeComponent({ id: "bye" }));
        useComponentStore.getState().deleteComponent("bye");
        const raw = localStorage.getItem("esp32-components");
        const parsed = JSON.parse(raw!);
        expect(parsed.state.components).toHaveLength(0);
    });
});
