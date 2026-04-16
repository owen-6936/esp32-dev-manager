import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock import.meta.env before importing the module
const envMock: Record<string, string | undefined> = {};

vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => ({ from: vi.fn(), storage: { from: vi.fn() } })),
}));

describe("supabase client", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("isSupabaseConfigured returns false when env vars are missing", async () => {
        vi.stubEnv("VITE_SUPABASE_URL", "");
        vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
        const { isSupabaseConfigured } = await import("../lib/supabase");
        expect(isSupabaseConfigured()).toBe(false);
        vi.unstubAllEnvs();
    });

    it("getSupabaseClient returns null when env vars are missing", async () => {
        vi.stubEnv("VITE_SUPABASE_URL", "");
        vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
        const { getSupabaseClient } = await import("../lib/supabase");
        expect(getSupabaseClient()).toBeNull();
        vi.unstubAllEnvs();
    });

    it("isSupabaseConfigured returns true when env vars are set", async () => {
        vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
        vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-key");
        const { isSupabaseConfigured } = await import("../lib/supabase");
        expect(isSupabaseConfigured()).toBe(true);
        vi.unstubAllEnvs();
    });

    it("getSupabaseClient returns a client when env vars are set", async () => {
        vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
        vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-key");
        const { getSupabaseClient } = await import("../lib/supabase");
        const client = getSupabaseClient();
        expect(client).not.toBeNull();
        vi.unstubAllEnvs();
    });
});
