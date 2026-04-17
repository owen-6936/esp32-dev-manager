/* ═══════════════════════════════════════════════════════════════════════════════
   Tutorial Data Service

   Single source of truth: Supabase.
   A short-lived localStorage cache is used to serve the last known cloud state
   while a fresh fetch is in flight — it contains only what Supabase returned,
   never hardcoded data.
   ═══════════════════════════════════════════════════════════════════════════════ */

import { getSupabaseClient } from "../lib/supabase";
import type {
    TutorialProject,
    FreenoveKit,
    CategoryMeta,
    LearningPath,
    TutorialCategory,
    DifficultyLevel,
    KitTier,
} from "../types/tutorial";

// ─── Runtime Cache (Supabase responses only — no hardcoded data) ─────────────

const CACHE_PREFIX = "esp32_svc_";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — stale after this, but still served while refetching

function cacheRead<T>(key: string): { data: T; stale: boolean } | null {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
        return { data, stale: Date.now() - ts > CACHE_TTL_MS };
    } catch {
        return null;
    }
}

function cacheWrite<T>(key: string, data: T): void {
    try {
        localStorage.setItem(
            CACHE_PREFIX + key,
            JSON.stringify({ data, ts: Date.now() }),
        );
    } catch {
        // Quota exceeded — cache is best-effort
    }
}

export function invalidateCache(key?: string): void {
    if (key) {
        localStorage.removeItem(CACHE_PREFIX + key);
    } else {
        for (const k of Object.keys(localStorage)) {
            if (k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
        }
    }
}

// ─── Source Tracking ─────────────────────────────────────────────────────────

export type DataSource = "supabase" | "cache" | "empty";

const sources: Record<string, DataSource> = {
    projects: "empty",
    kits: "empty",
    categories: "empty",
    paths: "empty",
};

/** Overall data source */
export function getDataSource(): DataSource {
    if (Object.values(sources).some((s) => s === "supabase")) return "supabase";
    if (Object.values(sources).some((s) => s === "cache")) return "cache";
    return "empty";
}

/** Per-table source map for diagnostics */
export function getDataSources(): Readonly<Record<string, DataSource>> {
    return sources;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Safe accessor for the Supabase client; returns null if unconfigured */
function db() {
    return getSupabaseClient();
}

/** Map a Supabase project row to our TutorialProject type */
function mapProjectRow(row: Record<string, unknown>): TutorialProject {
    const sketchId = row.sketch_id as string;
    return {
        id: sketchId,
        sketchId,
        displayId: sketchId.replace(/^[a-z]+-/, ""),
        name: row.name as string,
        fullName: row.full_name as string,
        category: row.category as TutorialCategory,
        difficulty: row.difficulty as DifficultyLevel,
        description: row.description as string,
        concepts: row.concepts as string[],
        components: (row.components as TutorialProject["components"]) ?? [],
        pinsUsed: (row.pins_used as TutorialProject["pinsUsed"]) ?? [],
        libraries: row.libraries as string[],
        prerequisites: row.prerequisites as string[],
        arduinoPath: row.arduino_path as string,
        pythonPath: (row.python_path as string) ?? undefined,
        timeEstimate: row.time_estimate as number,
        learningObjectives: row.learning_objectives as string[],
        kitTier: row.kit_tier as KitTier,
        tags: row.tags as string[],
        language: row.language as TutorialProject["language"],
        arduinoStoragePath: (row.arduino_storage_path as string) ?? undefined,
        pythonStoragePath: (row.python_storage_path as string) ?? undefined,
    };
}

function mapKitRow(row: Record<string, unknown>): FreenoveKit {
    return {
        sku: row.sku as string,
        name: row.name as string,
        tier: row.tier as KitTier,
        board: row.board as FreenoveKit["board"],
        description: row.description as string,
        tutorialUrl: row.tutorial_url as string,
        downloadUrl: row.download_url as string,
        projectCount: row.project_count as number,
        componentCount: row.component_count as number,
        imageUrl: (row.image_url as string) ?? undefined,
        color: (row.color as string) ?? undefined,
        tierOrder: (row.tier_order as number) ?? undefined,
    };
}

function mapCategoryRow(row: Record<string, unknown>): CategoryMeta {
    return {
        id: row.id as TutorialCategory,
        name: row.name as string,
        description: row.description as string,
        icon: row.icon as string,
        color: row.color as string,
        projectCount: row.project_count as number,
    };
}

function mapLearningPathRow(row: Record<string, unknown>): LearningPath {
    return {
        id: row.id as string,
        name: row.name as string,
        description: row.description as string,
        icon: row.icon as string,
        color: row.color as string,
        categories: row.categories as TutorialCategory[],
        projects: row.projects as string[],
        estimatedHours: row.estimated_hours as number,
        difficulty: row.difficulty as DifficultyLevel,
        skills: row.skills as string[],
        prerequisites: row.prerequisites as string[],
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Projects ────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<TutorialProject[]> {
    const cached = cacheRead<TutorialProject[]>("projects");
    const client = db();

    if (!client) {
        if (cached) {
            sources.projects = "cache";
            return cached.data;
        }
        sources.projects = "empty";
        return [];
    }

    try {
        const { data, error } = await client
            .from("projects")
            .select("*")
            .order("sketch_id");

        if (error) throw error;

        const result = data.map(mapProjectRow);
        cacheWrite("projects", result);
        sources.projects = "supabase";
        return result;
    } catch (err) {
        console.warn("[tutorialService] fetchProjects failed:", err);
        if (cached) {
            sources.projects = "cache";
            return cached.data;
        }
        sources.projects = "empty";
        return [];
    }
}

export async function fetchProjectById(
    id: string,
): Promise<TutorialProject | undefined> {
    const client = db();
    if (!client) {
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.find((p) => p.id === id);
    }

    try {
        const { data, error } = await client
            .from("projects")
            .select("*")
            .eq("sketch_id", id)
            .single();

        if (error || !data) {
            const cached = cacheRead<TutorialProject[]>("projects");
            return cached?.data.find((p) => p.id === id);
        }

        sources.projects = "supabase";
        return mapProjectRow(data);
    } catch (err) {
        console.warn("[tutorialService] fetchProjectById error:", err);
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.find((p) => p.id === id);
    }
}

export async function fetchProjectsByCategory(
    category: TutorialCategory,
): Promise<TutorialProject[]> {
    const client = db();
    if (!client) {
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.filter((p) => p.category === category) ?? [];
    }

    try {
        const { data, error } = await client
            .from("projects")
            .select("*")
            .eq("category", category)
            .order("sketch_id");

        if (error) throw error;

        sources.projects = "supabase";
        return data.map(mapProjectRow);
    } catch (err) {
        console.warn("[tutorialService] fetchProjectsByCategory failed:", err);
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.filter((p) => p.category === category) ?? [];
    }
}

export async function fetchProjectsByDifficulty(
    level: DifficultyLevel,
): Promise<TutorialProject[]> {
    const client = db();
    if (!client) {
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.filter((p) => p.difficulty === level) ?? [];
    }

    try {
        const { data, error } = await client
            .from("projects")
            .select("*")
            .eq("difficulty", level)
            .order("sketch_id");

        if (error) throw error;

        sources.projects = "supabase";
        return data.map(mapProjectRow);
    } catch (err) {
        console.warn(
            "[tutorialService] fetchProjectsByDifficulty failed:",
            err,
        );
        const cached = cacheRead<TutorialProject[]>("projects");
        return cached?.data.filter((p) => p.difficulty === level) ?? [];
    }
}

export async function fetchSearchProjects(
    query: string,
): Promise<TutorialProject[]> {
    const client = db();
    if (!client) {
        const cached = cacheRead<TutorialProject[]>("projects");
        if (!cached) return [];
        const q = query.toLowerCase();
        return cached.data.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.fullName.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q),
        );
    }

    try {
        const q = `%${query}%`;
        const { data, error } = await client
            .from("projects")
            .select("*")
            .or(`name.ilike.${q},full_name.ilike.${q},description.ilike.${q}`)
            .order("sketch_id");

        if (error) throw error;

        sources.projects = "supabase";
        return data.map(mapProjectRow);
    } catch (err) {
        console.warn("[tutorialService] fetchSearchProjects failed:", err);
        const cached = cacheRead<TutorialProject[]>("projects");
        if (!cached) return [];
        const q = query.toLowerCase();
        return cached.data.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.fullName.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q),
        );
    }
}

// ─── Kits ────────────────────────────────────────────────────────────────────

export async function fetchKits(): Promise<FreenoveKit[]> {
    const cached = cacheRead<FreenoveKit[]>("kits");
    const client = db();

    if (!client) {
        if (cached) {
            sources.kits = "cache";
            return cached.data;
        }
        sources.kits = "empty";
        return [];
    }

    // Serve stale cache immediately, revalidate in background
    if (cached && !cached.stale) {
        sources.kits = "cache";
        return cached.data;
    }

    try {
        const { data, error } = await client
            .from("kits")
            .select("*")
            .order("sku");

        if (error) throw error;

        const result = data.map(mapKitRow);
        cacheWrite("kits", result);
        sources.kits = "supabase";
        return result;
    } catch (err) {
        console.warn("[tutorialService] fetchKits failed:", err);
        if (cached) {
            sources.kits = "cache";
            return cached.data;
        }
        sources.kits = "empty";
        return [];
    }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<CategoryMeta[]> {
    const cached = cacheRead<CategoryMeta[]>("categories");
    const client = db();

    if (!client) {
        if (cached) {
            sources.categories = "cache";
            return cached.data;
        }
        sources.categories = "empty";
        return [];
    }

    if (cached && !cached.stale) {
        sources.categories = "cache";
        return cached.data;
    }

    try {
        const { data, error } = await client
            .from("categories")
            .select("*")
            .order("name");

        if (error) throw error;

        const result = data.map(mapCategoryRow);
        cacheWrite("categories", result);
        sources.categories = "supabase";
        return result;
    } catch (err) {
        console.warn("[tutorialService] fetchCategories failed:", err);
        if (cached) {
            sources.categories = "cache";
            return cached.data;
        }
        sources.categories = "empty";
        return [];
    }
}

// ─── Learning Paths ──────────────────────────────────────────────────────────

export async function fetchLearningPaths(): Promise<LearningPath[]> {
    const cached = cacheRead<LearningPath[]>("paths");
    const client = db();

    if (!client) {
        if (cached) {
            sources.paths = "cache";
            return cached.data;
        }
        sources.paths = "empty";
        return [];
    }

    if (cached && !cached.stale) {
        sources.paths = "cache";
        return cached.data;
    }

    try {
        const { data, error } = await client
            .from("learning_paths")
            .select("*")
            .order("difficulty");

        if (error) throw error;

        const result = data.map(mapLearningPathRow);
        cacheWrite("paths", result);
        sources.paths = "supabase";
        return result;
    } catch (err) {
        console.warn("[tutorialService] fetchLearningPaths failed:", err);
        if (cached) {
            sources.paths = "cache";
            return cached.data;
        }
        sources.paths = "empty";
        return [];
    }
}

// ─── Code Files from Storage ─────────────────────────────────────────────────

export async function fetchCodeFile(
    storagePath: string,
): Promise<string | null> {
    const client = db();
    if (!client) return null;

    try {
        const { data, error } = await client.storage
            .from("code-files")
            .download(storagePath);

        if (error || !data) return null;
        return await data.text();
    } catch {
        return null;
    }
}

/**
 * Get a public URL for a code file in Supabase Storage.
 * Falls back to the local path relative to the repo root.
 */
export function getCodeFileUrl(
    storagePath: string | null | undefined,
    localPath: string,
): string {
    const client = db();
    if (storagePath && client) {
        const { data } = client.storage
            .from("code-files")
            .getPublicUrl(storagePath);
        return data.publicUrl;
    }
    // Fall back to local path served by Vite's public directory
    return `/${localPath}`;
}
