import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

// ─── Lazy singleton — never crashes if env vars are missing ──────────────────

let _client: SupabaseClient<Database> | null = null;

/** Returns true if Supabase credentials are configured */
export function isSupabaseConfigured(): boolean {
    return Boolean(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
}

/**
 * Returns the Supabase client, or `null` if credentials are not set.
 * The client is created lazily on first call and cached for the session.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
    if (_client) return _client;
    if (!isSupabaseConfigured()) return null;

    _client = createClient<Database>(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
            auth: {
                flowType: "pkce",
                // Disable automatic URL detection — AuthCallback handles the
                // code exchange explicitly to avoid double-exchange errors.
                detectSessionFromUrl: false,
            },
        },
    );
    return _client;
}
