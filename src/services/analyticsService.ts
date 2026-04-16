/**
 * Analytics Service
 *
 * Tracks page views and custom events entirely in localStorage (works offline /
 * without Supabase). If Supabase is configured, events are also sent to the
 * `page_views` table so the admin can see real-time usage across all devices.
 *
 * Data stored locally: rolling 90-day window, capped at 5 000 entries.
 */

import { getSupabaseClient } from "../lib/supabase";
import { generateId } from "../utils/utils";
import { getAllowUsageData } from "../hooks/usePrivacyPrefs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageView {
    id: string;
    path: string;
    /** ISO-8601 timestamp */
    ts: string;
    /** Opaque session id (random UUID per browser tab/session) */
    sessionId: string;
    referrer?: string;
}

export interface AnalyticsEvent {
    id: string;
    name: string;
    path: string;
    ts: string;
    sessionId: string;
    meta?: Record<string, string | number | boolean>;
}

export interface DailyVisit {
    date: string; // "YYYY-MM-DD"
    views: number;
    sessions: number;
}

export interface TopPage {
    path: string;
    views: number;
}

export interface AnalyticsSummary {
    totalViews: number;
    totalSessions: number;
    last7Days: DailyVisit[];
    last30Days: DailyVisit[];
    topPages: TopPage[];
    /** Average daily views over the last 30 days */
    avgDailyViews: number;
    /** % change vs the previous 30-day period */
    growthPct: number | null;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const LS_VIEWS = "esp32-analytics-views";
const LS_EVENTS = "esp32-analytics-events";
const LS_SESSION = "esp32-analytics-session";
const MAX_ENTRIES = 5_000;
const RETENTION_DAYS = 90;

// ─── Session management ───────────────────────────────────────────────────────

function getSessionId(): string {
    let id = sessionStorage.getItem(LS_SESSION);
    if (!id) {
        id = generateId();
        sessionStorage.setItem(LS_SESSION, id);
    }
    return id;
}

// ─── Low-level helpers ────────────────────────────────────────────────────────

function readViews(): PageView[] {
    try {
        return JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]") as PageView[];
    } catch {
        return [];
    }
}

function writeViews(views: PageView[]): void {
    const cutoff = Date.now() - RETENTION_DAYS * 86_400_000;
    const pruned = views
        .filter((v) => new Date(v.ts).getTime() > cutoff)
        .slice(-MAX_ENTRIES);
    try {
        localStorage.setItem(LS_VIEWS, JSON.stringify(pruned));
    } catch {
        // localStorage quota exceeded — clear half and retry
        localStorage.setItem(
            LS_VIEWS,
            JSON.stringify(pruned.slice(-Math.floor(MAX_ENTRIES / 2))),
        );
    }
}

function readEvents(): AnalyticsEvent[] {
    try {
        return JSON.parse(
            localStorage.getItem(LS_EVENTS) ?? "[]",
        ) as AnalyticsEvent[];
    } catch {
        return [];
    }
}

function writeEvents(events: AnalyticsEvent[]): void {
    const cutoff = Date.now() - RETENTION_DAYS * 86_400_000;
    const pruned = events
        .filter((e) => new Date(e.ts).getTime() > cutoff)
        .slice(-MAX_ENTRIES);
    try {
        localStorage.setItem(LS_EVENTS, JSON.stringify(pruned));
    } catch {
        localStorage.setItem(
            LS_EVENTS,
            JSON.stringify(pruned.slice(-Math.floor(MAX_ENTRIES / 2))),
        );
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Record a page view. Call this once per route change.
 * Also attempts to persist to Supabase if configured.
 */
export function trackPageView(path: string): void {
    if (!getAllowUsageData()) return;
    const view: PageView = {
        id: generateId(),
        path,
        ts: new Date().toISOString(),
        sessionId: getSessionId(),
        referrer: document.referrer || undefined,
    };

    const views = readViews();
    views.push(view);
    writeViews(views);

    // Fire-and-forget to Supabase
    const sb = getSupabaseClient();
    if (sb) {
        sb.from("page_views")
            .insert({
                id: view.id,
                path: view.path,
                session_id: view.sessionId,
                referrer: view.referrer ?? null,
                created_at: view.ts,
            })
            .then(() => {
                /* silent */
            })
            .catch(() => {
                /* offline-safe */
            });
    }
}

/**
 * Record a named analytics event (e.g. "ai_chat_opened", "feedback_submitted").
 */
export function trackEvent(
    name: string,
    path: string,
    meta?: Record<string, string | number | boolean>,
): void {
    if (!getAllowUsageData()) return;
    const event: AnalyticsEvent = {
        id: generateId(),
        name,
        path,
        ts: new Date().toISOString(),
        sessionId: getSessionId(),
        meta,
    };

    const events = readEvents();
    events.push(event);
    writeEvents(events);
}

/**
 * Returns aggregated analytics data from localStorage.
 */
export function getAnalyticsSummary(): AnalyticsSummary {
    const views = readViews();

    const now = Date.now();
    const MS_DAY = 86_400_000;
    const last30Start = now - 30 * MS_DAY;
    const last60Start = now - 60 * MS_DAY;

    const recent30 = views.filter(
        (v) => new Date(v.ts).getTime() > last30Start,
    );
    const prev30 = views.filter(
        (v) =>
            new Date(v.ts).getTime() > last60Start &&
            new Date(v.ts).getTime() <= last30Start,
    );

    // Build daily buckets for the last N days
    function buildDailyBuckets(n: number): DailyVisit[] {
        const buckets: Record<
            string,
            { views: Set<string>; sessions: Set<string> }
        > = {};
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now - i * MS_DAY);
            const key = d.toISOString().slice(0, 10);
            buckets[key] = { views: new Set(), sessions: new Set() };
        }
        views.forEach((v) => {
            const key = v.ts.slice(0, 10);
            if (buckets[key]) {
                buckets[key].views.add(v.id);
                buckets[key].sessions.add(v.sessionId);
            }
        });
        return Object.entries(buckets).map(([date, b]) => ({
            date,
            views: b.views.size,
            sessions: b.sessions.size,
        }));
    }

    const last30Days = buildDailyBuckets(30);
    const last7Days = last30Days.slice(-7);

    // Top pages
    const pageCounts: Record<string, number> = {};
    views.forEach((v) => {
        pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1;
    });
    const topPages: TopPage[] = Object.entries(pageCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    const totalViews = views.length;
    const totalSessions = new Set(views.map((v) => v.sessionId)).size;
    const avgDailyViews = last30Days.reduce((s, d) => s + d.views, 0) / 30;

    const growthPct =
        prev30.length > 0
            ? Math.round(
                  ((recent30.length - prev30.length) / prev30.length) * 100,
              )
            : null;

    return {
        totalViews,
        totalSessions,
        last7Days,
        last30Days,
        topPages,
        avgDailyViews: Math.round(avgDailyViews * 10) / 10,
        growthPct,
    };
}

/**
 * Return all stored events (for admin debugging).
 */
export function getAllEvents(): AnalyticsEvent[] {
    return readEvents();
}

/** Alias for getAllEvents — used by the data-export flow. */
export const getStoredEvents = getAllEvents;

/**
 * Clear all local analytics data.
 */
export function clearAnalytics(): void {
    localStorage.removeItem(LS_VIEWS);
    localStorage.removeItem(LS_EVENTS);
}
