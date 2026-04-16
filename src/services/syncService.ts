/* ═══════════════════════════════════════════════════════════════════════════════
   Sync Service — Downloads code files from GitHub into Supabase Storage,
   and provides Supabase connectivity diagnostics.

   Data (kits, categories, learning paths, projects) lives in Supabase.
   This service never seeds from hardcoded source-code data.
   ═══════════════════════════════════════════════════════════════════════════════ */

import { getSupabaseClient } from "../lib/supabase";
import { invalidateCache } from "./tutorialService";
import {
    SEED_KITS,
    SEED_CATEGORIES,
    SEED_LEARNING_PATHS,
    CHAPTER_CATEGORY,
    chapterDifficulty,
} from "./seedContent";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SyncProgress {
    phase:
        | "idle"
        | "kits"
        | "categories"
        | "projects"
        | "paths"
        | "files"
        | "done"
        | "error";
    current: number;
    total: number;
    message: string;
}

export type SyncProgressCallback = (progress: SyncProgress) => void;

// ─── GitHub Config for Freenove Repos ────────────────────────────────────────

const FREENOVE_REPOS = {
    basic: {
        owner: "Freenove",
        repo: "Freenove_Basic_Starter_Kit_for_ESP32_S3",
        branch: "main",
    },
    super: {
        owner: "Freenove",
        repo: "Freenove_Super_Starter_Kit_for_ESP32_S3",
        branch: "main",
    },
    ultimate: {
        owner: "Freenove",
        repo: "Freenove_Ultimate_Starter_Kit_for_ESP32_S3",
        branch: "main",
    },
} as const;

function githubRawUrl(
    owner: string,
    repo: string,
    branch: string,
    path: string,
): string {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERIFY — Check Supabase connectivity and report table row counts
// (replaces the old seedStaticData which pushed hardcoded source-code data)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── GitHub Contents API helper ──────────────────────────────────────────────

interface GHEntry {
    name: string;
    type: "file" | "dir";
}

async function fetchGitHubDirContents(
    owner: string,
    repo: string,
    path: string,
): Promise<GHEntry[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const resp = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!resp.ok) throw new Error(`GitHub API ${resp.status}: ${url}`);
    return resp.json() as Promise<GHEntry[]>;
}

// ─── Parse sketch folder name → project metadata ─────────────────────────────

function parseSketchFolder(
    folderName: string,
    _index: number,
    _total: number,
    tier: "basic" | "super" | "ultimate" = "ultimate",
) {
    // e.g. "Sketch_01.1_Blink" or "Sketch_16.2_4_Digit_7-Segment_Display"
    const m = folderName.match(/^Sketch_(\d+)\.(\d+)_(.+)$/);
    if (!m) return null;

    const chapter = parseInt(m[1], 10);
    const sub = parseInt(m[2], 10);
    const numericId = `${String(chapter).padStart(2, "0")}.${sub}`;
    const sketchId = `${tier}-${numericId}`;
    const namePart = m[3].replace(/_/g, " ");

    const category = CHAPTER_CATEGORY[chapter] ?? "analog_sensors";
    const difficulty = chapterDifficulty(chapter);

    // Determine language — Python codes exist for most projects
    const language = "both";

    const arduinoPath = `C/Sketches/${folderName}`;
    // Python folder naming: Python_01.1_Blink (matches Sketch chapter/sub)
    const pythonFolderName = `Python_${String(chapter).padStart(2, "0")}.${sub}_${m[3]}`;
    const pythonPath = `Python/Python_Codes/${pythonFolderName}`;

    const timeEstimate = 15 + difficulty * 10 + (sub > 1 ? 10 : 0);

    const description = `${namePart} — ${
        difficulty === 1
            ? "beginner"
            : difficulty === 2
              ? "easy"
              : difficulty === 3
                ? "intermediate"
                : difficulty === 4
                  ? "advanced"
                  : "expert"
    } project using the ESP32-S3 ${category.replace(/_/g, " ")} features.`;

    return {
        sketch_id: sketchId,
        name: namePart,
        full_name: `Sketch ${numericId}: ${namePart}`,
        category,
        difficulty,
        description,
        concepts: [] as string[],
        components: [] as unknown[],
        pins_used: [] as unknown[],
        libraries: [] as string[],
        prerequisites: [] as string[],
        arduino_path: arduinoPath,
        python_path: pythonPath,
        time_estimate: timeEstimate,
        learning_objectives: [
            `Complete ${namePart} using Arduino C++`,
            `Understand ${category.replace(/_/g, " ")} on ESP32-S3`,
        ],
        kit_tier: tier,
        tags: [category, `chapter-${chapter}`, "freenove", "esp32-s3"],
        language,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEED — Populate empty Supabase tables from known config + GitHub sketch list
// ═══════════════════════════════════════════════════════════════════════════════

export async function seedStaticData(
    onProgress?: SyncProgressCallback,
): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
        return {
            success: false,
            error: "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        };
    }

    let itemsProcessed = 0;

    try {
        // ── Phase 1: Kits ────────────────────────────────────────────
        onProgress?.({
            phase: "kits",
            current: 0,
            total: 4,
            message: "Seeding kits…",
        });
        const { error: kitsErr } = await client
            .from("kits")
            // Strip client-only 'color' field before upserting
            .upsert(
                [...SEED_KITS].map(
                    ({ color: _c, tier_order: _to, ...k }) => k,
                ) as never[],
                {
                    onConflict: "sku",
                },
            );
        if (kitsErr) throw new Error(`kits: ${kitsErr.message}`);
        itemsProcessed += SEED_KITS.length;
        onProgress?.({
            phase: "kits",
            current: 1,
            total: 4,
            message: `Kits: ${SEED_KITS.length} upserted`,
        });

        // ── Phase 2: Categories ──────────────────────────────────────
        onProgress?.({
            phase: "categories",
            current: 1,
            total: 4,
            message: "Seeding categories…",
        });
        const { error: catErr } = await client
            .from("categories")
            .upsert([...SEED_CATEGORIES], { onConflict: "id" });
        if (catErr) throw new Error(`categories: ${catErr.message}`);
        itemsProcessed += SEED_CATEGORIES.length;
        onProgress?.({
            phase: "categories",
            current: 2,
            total: 4,
            message: `Categories: ${SEED_CATEGORIES.length} upserted`,
        });

        // ── Phase 3: Projects from GitHub ────────────────────────────
        onProgress?.({
            phase: "projects",
            current: 2,
            total: 4,
            message: "Fetching project list from GitHub…",
        });

        const { owner, repo } = FREENOVE_REPOS.ultimate;
        let projectsSeeded = 0;

        try {
            for (const [tier, config] of Object.entries(FREENOVE_REPOS) as [
                "basic" | "super" | "ultimate",
                (typeof FREENOVE_REPOS)[keyof typeof FREENOVE_REPOS],
            ][]) {
                const entries = await fetchGitHubDirContents(
                    config.owner,
                    config.repo,
                    "C/Sketches",
                );
                const sketchDirs = entries
                    .filter(
                        (e) => e.type === "dir" && e.name.startsWith("Sketch_"),
                    )
                    .map((e) => e.name)
                    .sort();

                const total = sketchDirs.length;
                const projectRows = sketchDirs
                    .map((name, i) => parseSketchFolder(name, i, total, tier))
                    .filter(Boolean);

                // Upsert in batches of 20 (Supabase has row limits per request)
                const BATCH = 20;
                for (let b = 0; b < projectRows.length; b += BATCH) {
                    const batch = projectRows.slice(b, b + BATCH);
                    const { error: projErr } = await client
                        .from("projects")
                        .upsert(batch as never[], {
                            onConflict: "sketch_id",
                        });
                    if (projErr)
                        throw new Error(
                            `projects batch ${b}: ${projErr.message}`,
                        );
                    projectsSeeded += batch.length;
                    onProgress?.({
                        phase: "projects",
                        current: 2,
                        total: 4,
                        message: `Projects (${tier}): ${projectsSeeded} seeded`,
                    });
                }
            }
            itemsProcessed += projectsSeeded;
        } catch (ghErr) {
            // GitHub API failed — skip projects, log warning
            const msg = ghErr instanceof Error ? ghErr.message : String(ghErr);
            console.warn(
                "[seedStaticData] GitHub fetch failed — projects skipped:",
                msg,
            );
            onProgress?.({
                phase: "projects",
                current: 2,
                total: 4,
                message: `Projects skipped (GitHub unreachable): ${msg}`,
            });
        }

        // ── Phase 4: Learning Paths ──────────────────────────────────
        onProgress?.({
            phase: "paths",
            current: 3,
            total: 4,
            message: "Seeding learning paths…",
        });

        // Populate each path's `projects` array from the DB (category-based)
        const { data: dbProjects } = await client
            .from("projects")
            .select("sketch_id, category, kit_tier")
            .order("sketch_id");

        const allProjects = (dbProjects ?? []) as {
            sketch_id: string;
            category: string;
            kit_tier: string;
        }[];

        const pathRows = SEED_LEARNING_PATHS.map((path) => {
            const isComplete = path.id === "complete-journey";
            const projects = isComplete
                ? allProjects.map((p) => p.sketch_id)
                : allProjects
                      .filter((p) =>
                          (path.categories as readonly string[]).includes(
                              p.category,
                          ),
                      )
                      .map((p) => p.sketch_id);

            return {
                id: path.id,
                name: path.name,
                description: path.description,
                icon: path.icon,
                color: path.color,
                categories: path.categories as string[],
                projects,
                estimated_hours: path.estimated_hours,
                difficulty: path.difficulty,
                skills: path.skills as string[],
                prerequisites: path.prerequisites as string[],
            };
        });

        const { error: pathsErr } = await client
            .from("learning_paths")
            .upsert(pathRows, { onConflict: "id" });
        if (pathsErr) throw new Error(`learning_paths: ${pathsErr.message}`);
        itemsProcessed += pathRows.length;
        onProgress?.({
            phase: "paths",
            current: 4,
            total: 4,
            message: `Learning Paths: ${pathRows.length} upserted`,
        });

        // Update category project_count
        for (const cat of SEED_CATEGORIES) {
            const count = allProjects.filter(
                (p) => p.category === cat.id,
            ).length;
            if (count > 0) {
                await client
                    .from("categories")
                    .update({ project_count: count })
                    .eq("id", cat.id);
            }
        }

        // Update kit project_count from actual DB rows
        for (const kit of SEED_KITS) {
            const tiers =
                kit.tier === "ultimate"
                    ? ["basic", "super", "ultimate"]
                    : kit.tier === "super"
                      ? ["basic", "super"]
                      : ["basic"];
            const count = allProjects.filter((p) =>
                tiers.includes(p.kit_tier),
            ).length;
            if (count > 0) {
                await client
                    .from("kits")
                    .update({ project_count: count })
                    .eq("sku", kit.sku);
            }
        }

        invalidateCache();

        onProgress?.({
            phase: "done",
            current: 1,
            total: 1,
            message: `Done — ${itemsProcessed} records seeded`,
        });

        await recordSyncLog({
            type: "seed",
            status: "completed",
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            itemsProcessed,
            errorMessage: null,
        });

        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        onProgress?.({ phase: "error", current: 0, total: 0, message });
        await recordSyncLog({
            type: "seed",
            status: "failed",
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            itemsProcessed,
            errorMessage: message,
        });
        return { success: false, error: message };
    }
}

export async function syncCodeFiles(
    onProgress?: SyncProgressCallback,
): Promise<{ success: boolean; filesStored: number; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
        return {
            success: false,
            filesStored: 0,
            error: "Supabase not configured",
        };
    }

    const _defaultRepo = FREENOVE_REPOS.ultimate;
    let filesStored = 0;

    /** Resolve the repo config for a kit-scoped sketch_id (e.g. "basic-01.1") */
    function repoForProject(sketchId: string) {
        const tier = sketchId.split("-")[0] as keyof typeof FREENOVE_REPOS;
        return FREENOVE_REPOS[tier] ?? FREENOVE_REPOS.ultimate;
    }

    try {
        const { data: projectRows } = await client
            .from("projects")
            .select("sketch_id, name, arduino_path, python_path")
            .order("sketch_id");

        const projects = projectRows ?? [];

        onProgress?.({
            phase: "files",
            current: 0,
            total: projects.length,
            message: "Downloading code files...",
        });

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i] as {
                sketch_id: string;
                name: string;
                arduino_path: string | null;
                python_path: string | null;
            };

            // Arduino file
            if (project.arduino_path) {
                const { owner, repo, branch } = repoForProject(
                    project.sketch_id,
                );
                const inoFile = `${project.arduino_path}/${project.arduino_path.split("/").pop()}.ino`;
                const url = githubRawUrl(owner, repo, branch, inoFile);

                try {
                    const resp = await fetch(url);
                    if (resp.ok) {
                        const text = await resp.text();
                        const storagePath = `arduino/${project.sketch_id}/${project.sketch_id}.ino`;
                        const blob = new Blob([text], { type: "text/plain" });

                        const { error: uploadErr } = await client.storage
                            .from("code-files")
                            .upload(storagePath, blob, { upsert: true });

                        if (!uploadErr) {
                            await client
                                .from("projects")
                                .update({ arduino_storage_path: storagePath })
                                .eq("sketch_id", project.sketch_id);
                            filesStored++;
                        }
                    }
                } catch {
                    // Skip individual file failures
                }
            }

            // Python file
            if (project.python_path) {
                const { owner, repo, branch } = repoForProject(
                    project.sketch_id,
                );
                const pyFileName = project.python_path.split("/").pop();
                const url = githubRawUrl(
                    owner,
                    repo,
                    branch,
                    `${project.python_path}/${pyFileName}.py`,
                );

                try {
                    const resp = await fetch(url);
                    if (resp.ok) {
                        const text = await resp.text();
                        const storagePath = `python/${project.sketch_id}/${project.sketch_id}.py`;
                        const blob = new Blob([text], { type: "text/plain" });

                        const { error: uploadErr } = await client.storage
                            .from("code-files")
                            .upload(storagePath, blob, { upsert: true });

                        if (!uploadErr) {
                            await client
                                .from("projects")
                                .update({ python_storage_path: storagePath })
                                .eq("sketch_id", project.sketch_id);
                            filesStored++;
                        }
                    }
                } catch {
                    // Skip individual file failures
                }
            }

            onProgress?.({
                phase: "files",
                current: i + 1,
                total: projects.length,
                message: `Files: ${project.name} (${filesStored} stored)`,
            });
        }

        onProgress?.({
            phase: "done",
            current: 1,
            total: 1,
            message: `Done! ${filesStored} files stored.`,
        });

        await recordSyncLog({
            type: "files",
            status: "completed",
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            itemsProcessed: filesStored,
            errorMessage: null,
        });

        return { success: true, filesStored };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        onProgress?.({ phase: "error", current: 0, total: 0, message });

        await recordSyncLog({
            type: "files",
            status: "failed",
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            itemsProcessed: filesStored,
            errorMessage: message,
        });

        return { success: false, filesStored, error: message };
    }
}

// ─── Sync Log Helpers ────────────────────────────────────────────────────────

export interface SyncLogEntry {
    id?: string;
    type: "seed" | "files";
    status: "started" | "completed" | "failed";
    startedAt: string;
    completedAt: string | null;
    itemsProcessed: number;
    errorMessage: string | null;
}

// In-memory log for when Supabase tables aren't available
const localSyncLogs: SyncLogEntry[] = [];

export async function recordSyncLog(entry: SyncLogEntry): Promise<void> {
    const client = getSupabaseClient();
    if (client) {
        try {
            await client.from("sync_logs").insert({
                type: entry.type,
                status: entry.status,
                started_at: entry.startedAt,
                completed_at: entry.completedAt,
                items_processed: entry.itemsProcessed,
                error_message: entry.errorMessage,
            });
            return;
        } catch {
            // Fall through to local storage
        }
    }
    localSyncLogs.unshift(entry);
}

export async function getSyncLogs(): Promise<SyncLogEntry[]> {
    const client = getSupabaseClient();
    if (client) {
        try {
            const { data } = await client
                .from("sync_logs")
                .select("*")
                .order("started_at", { ascending: false })
                .limit(20);

            if (data && data.length > 0) {
                return data.map((row: Record<string, unknown>) => ({
                    id: row.id as string,
                    type: row.type as "seed" | "files",
                    status: row.status as "started" | "completed" | "failed",
                    startedAt: row.started_at as string,
                    completedAt: row.completed_at as string | null,
                    itemsProcessed: row.items_processed as number,
                    errorMessage: row.error_message as string | null,
                }));
            }
        } catch {
            // Fall through to local logs
        }
    }
    return localSyncLogs;
}

export async function getLastSync(): Promise<{
    status: string;
    completedAt: string | null;
} | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data } = await client
        .from("sync_logs")
        .select("status, completed_at")
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

    if (!data) return null;
    return { status: data.status, completedAt: data.completed_at };
}
