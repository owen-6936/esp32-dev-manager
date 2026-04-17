import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/supabase", () => ({
    getSupabaseClient: () => null,
    isSupabaseConfigured: () => false,
}));

import { normalizeKitsToSupabase } from "../services/kitScannerService";

describe("normalizeKitsToSupabase — unconfigured", () => {
    it("returns error when Supabase is not configured", async () => {
        const cb = vi.fn();
        const result = await normalizeKitsToSupabase(["FNK0082"], cb);
        expect(result.success).toBe(false);
        expect(result.error).toContain("not configured");
    });
});
