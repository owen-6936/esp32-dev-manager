import type { Provider, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";
import type { ProfileRow } from "../types/database";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function client() {
    const c = getSupabaseClient();
    if (!c) throw new Error("Supabase is not configured");
    return c;
}

// ─── Auth Methods ────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await client().auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
) {
    const { data, error } = await client().auth.signUp({
        email,
        password,
        options: {
            data: { full_name: displayName ?? "" },
        },
    });
    if (error) throw error;
    return data;
}

export async function signInWithOAuth(provider: Provider) {
    const { data, error } = await client().auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            // Request email scope so Supabase can detect existing accounts
            queryParams:
                provider === "google"
                    ? { access_type: "offline", prompt: "select_account" }
                    : {},
        },
    });
    if (error) throw error;
    return data;
}

/**
 * Links an OAuth provider identity to the currently signed-in account.
 * Use this instead of signInWithOAuth when the user is already authenticated
 * and wants to add Google sign-in to an existing email/password account.
 */
export async function linkIdentity(provider: Provider) {
    const { data, error } = await client().auth.linkIdentity({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return data;
}

/**
 * Unlinks an OAuth provider from the current account.
 * The user must have at least one other sign-in method.
 */
export async function unlinkIdentity(identityId: string) {
    // Supabase requires the full identity object
    const { data: userData } = await client().auth.getUser();
    const identity = userData?.user?.identities?.find(
        (i) => i.id === identityId,
    );
    if (!identity) throw new Error("Identity not found");
    const { error } = await client().auth.unlinkIdentity(identity);
    if (error) throw error;
}

export async function signOut() {
    const { error } = await client().auth.signOut();
    if (error) throw error;
}

/**
 * Permanently deletes the current user's account.
 *
 * Steps:
 *  1. Deletes all rows the user owns in `profiles`, `projects`, `journal_entries`,
 *     `components`, `kit_items`, and `page_views` (via individual deletes so
 *     RLS policies are respected by the anon key).
 *  2. Calls the `delete_own_account` Postgres RPC (must be created in Supabase:
 *     see README) which calls `auth.users` DELETE — this requires a
 *     `SECURITY DEFINER` function because the anon key cannot delete from auth.
 *  3. Signs the user out locally so the session is cleared.
 *
 * If the RPC does not exist the function still deletes profile data and signs
 * out, leaving the auth row for an admin to clean up.
 */
export async function deleteAccount(userId: string): Promise<void> {
    const c = client();

    // 1. Delete all user-owned data rows (RLS allows owners to delete own rows)
    const tables = [
        "projects",
        "journal_entries",
        "components",
        "kit_items",
        "page_views",
    ] as const;

    for (const table of tables) {
        await c.from(table).delete().eq("user_id", userId).throwOnError();
    }

    // profiles PK is `id`, not `user_id`
    await c.from("profiles").delete().eq("id", userId).throwOnError();

    // 2. Delete the auth user via a SECURITY DEFINER RPC
    //    (fails silently if the function hasn't been created yet)
    await c
        .rpc("delete_own_account")
        .throwOnError()
        .catch(() => {
            /* RPC not yet created — admin must clear auth row manually */
        });

    // 3. Clear local session
    await c.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
    const { data, error } = await client().auth.getSession();
    if (error) throw error;
    return data.session;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await client()
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
    return data;
}

export async function updateProfile(
    userId: string,
    fields: Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>,
) {
    const { data, error } = await client()
        .from("profiles")
        .update(fields)
        .eq("id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ─── Listener ────────────────────────────────────────────────────────────────

export function onAuthStateChange(
    callback: (session: Session | null, user: User | null) => void,
) {
    const {
        data: { subscription },
    } = client().auth.onAuthStateChange((_event, session) => {
        callback(session, session?.user ?? null);
    });
    return subscription;
}
