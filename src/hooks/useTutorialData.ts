/* ═══════════════════════════════════════════════════════════════════════════════
   useTutorialData — React hooks for tutorial data with Supabase + static fallback
   ═══════════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from "react";
import type {
    TutorialProject,
    FreenoveKit,
    CategoryMeta,
    LearningPath,
} from "../types/tutorial";
import {
    fetchProjects,
    fetchProjectById,
    fetchKits,
    fetchCategories,
    fetchLearningPaths,
    fetchSearchProjects,
    getDataSource,
    type DataSource,
} from "../services/tutorialService";

// ─── Generic async data hook ─────────────────────────────────────────────────

interface AsyncState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    source: DataSource;
    refetch: () => void;
}

function useAsyncData<T>(
    fetcher: () => Promise<T>,
    fallback: T,
    deps: unknown[] = [],
): AsyncState<T> {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<DataSource>("empty");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
            setSource(getDataSource());
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load data",
            );
            setData(fallback);
            setSource("empty");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        load();
    }, [load]);

    return { data, loading, error, source, refetch: load };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/** All projects */
export function useProjects(): AsyncState<TutorialProject[]> {
    return useAsyncData(fetchProjects, []);
}

/** Single project by ID */
export function useProject(
    id: string,
): AsyncState<TutorialProject | undefined> {
    return useAsyncData(() => fetchProjectById(id), undefined, [id]);
}

/** Search projects */
export function useSearchProjects(
    query: string,
): AsyncState<TutorialProject[]> {
    return useAsyncData(
        () => (query.trim() ? fetchSearchProjects(query) : fetchProjects()),
        [],
        [query],
    );
}

/** All kits */
export function useKits(): AsyncState<FreenoveKit[]> {
    return useAsyncData(fetchKits, []);
}

/** All categories */
export function useCategories(): AsyncState<CategoryMeta[]> {
    return useAsyncData(fetchCategories, []);
}

/** All learning paths */
export function useLearningPaths(): AsyncState<LearningPath[]> {
    return useAsyncData(fetchLearningPaths, []);
}
