import { getSupabaseClient } from "../lib/supabase";
import { getRank } from "../store/progress";

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    totalXp: number;
    projectsCompleted: number;
    rankName: string;
    rankColor: string;
    rankIcon: string;
}

// ─── Sync user progress row to Supabase ──────────────────────────────────────

export async function syncProgressToSupabase(
    userId: string,
    projectId: string,
    status: "not_started" | "in_progress" | "completed",
    checkpoint: number,
    xpAwarded: boolean,
): Promise<void> {
    const client = getSupabaseClient();
    if (!client || !userId) return;
    try {
        await client.from("user_progress").upsert(
            {
                user_id: userId,
                project_id: projectId,
                status,
                checkpoint,
                xp_awarded: xpAwarded,
                updated_at: new Date().toISOString(),
                ...(status === "in_progress" && {
                    started_at: new Date().toISOString(),
                }),
                ...(status === "completed" && {
                    completed_at: new Date().toISOString(),
                }),
            },
            { onConflict: "user_id,project_id" },
        );
    } catch {
        // Table may not exist yet — silent fail, localStorage is the fallback
    }
}

// ─── Sync XP totals to Supabase ───────────────────────────────────────────────

export async function syncXpToSupabase(
    userId: string,
    totalXp: number,
    projectsCompleted: number,
): Promise<void> {
    const client = getSupabaseClient();
    if (!client || !userId) return;
    try {
        await client.from("user_xp").upsert(
            {
                user_id: userId,
                total_xp: totalXp,
                projects_completed: projectsCompleted,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
        );
    } catch {
        // Table may not exist yet
    }
}

// ─── Fetch leaderboard ────────────────────────────────────────────────────────

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const client = getSupabaseClient();
    if (!client) return [];
    try {
        const { data, error } = await client
            .from("user_xp")
            .select("user_id, total_xp, projects_completed")
            .order("total_xp", { ascending: false })
            .limit(50);

        if (error || !data) return [];

        // Fetch display names in parallel
        const entries = await Promise.all(
            data.map(async (row, i) => {
                let displayName = "Anonymous";
                let avatarUrl: string | null = null;
                try {
                    const { data: profile } = await client
                        .from("profiles")
                        .select("display_name, avatar_url")
                        .eq("id", row.user_id)
                        .single();
                    if (profile) {
                        displayName = profile.display_name ?? "Anonymous";
                        avatarUrl = profile.avatar_url ?? null;
                    }
                } catch {
                    // Profile may not exist
                }
                const rankInfo = getRank(row.total_xp as number);
                return {
                    rank: i + 1,
                    userId: row.user_id as string,
                    displayName,
                    avatarUrl,
                    totalXp: row.total_xp as number,
                    projectsCompleted: row.projects_completed as number,
                    rankName: rankInfo.rank,
                    rankColor: rankInfo.color,
                    rankIcon: rankInfo.icon,
                };
            }),
        );
        return entries;
    } catch {
        return [];
    }
}

// ─── Load user's cloud progress on login ─────────────────────────────────────

export interface CloudProgressRow {
    projectId: string;
    status: "not_started" | "in_progress" | "completed";
    checkpoint: number;
    xpAwarded: boolean;
    startedAt: string | null;
    completedAt: string | null;
}

export async function fetchUserProgress(
    userId: string,
): Promise<CloudProgressRow[]> {
    const client = getSupabaseClient();
    if (!client || !userId) return [];
    try {
        const { data, error } = await client
            .from("user_progress")
            .select(
                "project_id, status, checkpoint, xp_awarded, started_at, completed_at",
            )
            .eq("user_id", userId);

        if (error || !data) return [];

        return data.map((row) => ({
            projectId: row.project_id as string,
            status: row.status as CloudProgressRow["status"],
            checkpoint: (row.checkpoint as number) ?? 0,
            xpAwarded: (row.xp_awarded as boolean) ?? false,
            startedAt: row.started_at as string | null,
            completedAt: row.completed_at as string | null,
        }));
    } catch {
        return [];
    }
}

export async function fetchUserXp(
    userId: string,
): Promise<{ totalXp: number; projectsCompleted: number } | null> {
    const client = getSupabaseClient();
    if (!client || !userId) return null;
    try {
        const { data } = await client
            .from("user_xp")
            .select("total_xp, projects_completed")
            .eq("user_id", userId)
            .single();
        if (!data) return null;
        return {
            totalXp: (data.total_xp as number) ?? 0,
            projectsCompleted: (data.projects_completed as number) ?? 0,
        };
    } catch {
        return null;
    }
}
