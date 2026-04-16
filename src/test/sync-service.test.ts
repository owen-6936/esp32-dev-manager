import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/supabase", () => ({
    getSupabaseClient: () => null,
    isSupabaseConfigured: () => false,
}));

import {
    seedStaticData,
    syncCodeFiles,
    getLastSync,
} from "../services/syncService";

describe("syncService — unconfigured", () => {
    it("seedStaticData returns error when Supabase is not configured", async () => {
        const result = await seedStaticData();
        expect(result.success).toBe(false);
        expect(result.error).toContain("not configured");
    });

    it("syncCodeFiles returns error when Supabase is not configured", async () => {
        const result = await syncCodeFiles();
        expect(result.success).toBe(false);
        expect(result.filesStored).toBe(0);
    });

    it("getLastSync returns null when Supabase is not configured", async () => {
        const result = await getLastSync();
        expect(result).toBeNull();
    });

    it("seedStaticData reports progress callback on error path", async () => {
        const cb = vi.fn();
        await seedStaticData(cb);
        // Should NOT have called progress — returns early before any progress
        expect(cb).not.toHaveBeenCalled();
    });
});
