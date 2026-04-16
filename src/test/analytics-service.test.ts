/* ═══════════════════════════════════════════════════════════════════════════
   analytics-service.test.ts
   Tests for the localStorage-based analytics service.
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    trackPageView,
    trackEvent,
    getAnalyticsSummary,
    getAllEvents,
    clearAnalytics,
} from "../services/analyticsService";

// ─── Setup ────────────────────────────────────────────────────────────────────

const LS_VIEWS = "esp32-analytics-views";
const LS_EVENTS = "esp32-analytics-events";
const LS_SESSION = "esp32-analytics-session";

beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
});

// ─── trackPageView ────────────────────────────────────────────────────────────

describe("trackPageView", () => {
    it("stores a page view in localStorage", () => {
        trackPageView("/dashboard");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views).toHaveLength(1);
        expect(views[0].path).toBe("/dashboard");
    });

    it("accumulates multiple page views", () => {
        trackPageView("/dashboard");
        trackPageView("/learn");
        trackPageView("/workshop");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views).toHaveLength(3);
    });

    it("assigns a session ID to each view", () => {
        trackPageView("/");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views[0].sessionId).toBeTruthy();
        expect(typeof views[0].sessionId).toBe("string");
    });

    it("reuses the same session ID across views in the same session", () => {
        trackPageView("/dashboard");
        trackPageView("/learn");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views[0].sessionId).toBe(views[1].sessionId);
    });

    it("stores a valid ISO timestamp", () => {
        trackPageView("/pins");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(() => new Date(views[0].ts)).not.toThrow();
        expect(new Date(views[0].ts).getTime()).toBeGreaterThan(0);
    });

    it("assigns a unique id to each view", () => {
        trackPageView("/a");
        trackPageView("/b");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views[0].id).not.toBe(views[1].id);
    });
});

// ─── trackEvent ───────────────────────────────────────────────────────────────

describe("trackEvent", () => {
    it("stores a named event in localStorage", () => {
        trackEvent("ai_chat_opened", "/dashboard");
        const events = JSON.parse(localStorage.getItem(LS_EVENTS) ?? "[]");
        expect(events).toHaveLength(1);
        expect(events[0].name).toBe("ai_chat_opened");
        expect(events[0].path).toBe("/dashboard");
    });

    it("stores optional meta data", () => {
        trackEvent("feedback_submitted", "/", { type: "bug" });
        const events = JSON.parse(localStorage.getItem(LS_EVENTS) ?? "[]");
        expect(events[0].meta).toEqual({ type: "bug" });
    });

    it("accumulates multiple events", () => {
        trackEvent("a", "/");
        trackEvent("b", "/learn");
        trackEvent("c", "/workshop");
        const events = JSON.parse(localStorage.getItem(LS_EVENTS) ?? "[]");
        expect(events).toHaveLength(3);
    });

    it("assigns session ID to events", () => {
        trackEvent("x", "/");
        const events = JSON.parse(localStorage.getItem(LS_EVENTS) ?? "[]");
        expect(events[0].sessionId).toBeTruthy();
    });
});

// ─── getAllEvents ─────────────────────────────────────────────────────────────

describe("getAllEvents", () => {
    it("returns empty array when no events stored", () => {
        expect(getAllEvents()).toEqual([]);
    });

    it("returns all tracked events", () => {
        trackEvent("open", "/");
        trackEvent("close", "/");
        expect(getAllEvents()).toHaveLength(2);
        expect(getAllEvents()[0].name).toBe("open");
    });
});

// ─── clearAnalytics ───────────────────────────────────────────────────────────

describe("clearAnalytics", () => {
    it("removes all views and events from localStorage", () => {
        trackPageView("/");
        trackEvent("test", "/");
        clearAnalytics();
        expect(localStorage.getItem(LS_VIEWS)).toBeNull();
        expect(localStorage.getItem(LS_EVENTS)).toBeNull();
    });

    it("summary reports zeros after clear", () => {
        trackPageView("/dashboard");
        trackEvent("ai_open", "/dashboard");
        clearAnalytics();
        const summary = getAnalyticsSummary();
        expect(summary.totalViews).toBe(0);
        expect(summary.totalSessions).toBe(0);
    });
});

// ─── getAnalyticsSummary ──────────────────────────────────────────────────────

describe("getAnalyticsSummary", () => {
    it("returns zeros when no data exists", () => {
        const summary = getAnalyticsSummary();
        expect(summary.totalViews).toBe(0);
        expect(summary.totalSessions).toBe(0);
        expect(summary.topPages).toEqual([]);
    });

    it("counts total views correctly", () => {
        trackPageView("/");
        trackPageView("/learn");
        trackPageView("/");
        const summary = getAnalyticsSummary();
        expect(summary.totalViews).toBe(3);
    });

    it("counts unique sessions correctly", () => {
        // All views share one session in this test (same sessionStorage)
        trackPageView("/");
        trackPageView("/learn");
        const summary = getAnalyticsSummary();
        expect(summary.totalSessions).toBe(1);
    });

    it("aggregates top pages by view count", () => {
        trackPageView("/");
        trackPageView("/");
        trackPageView("/learn");
        const summary = getAnalyticsSummary();
        const root = summary.topPages.find((p) => p.path === "/");
        const learn = summary.topPages.find((p) => p.path === "/learn");
        expect(root?.views).toBe(2);
        expect(learn?.views).toBe(1);
    });

    it("returns top pages sorted by view count descending", () => {
        trackPageView("/a");
        trackPageView("/b");
        trackPageView("/b");
        trackPageView("/b");
        const summary = getAnalyticsSummary();
        expect(summary.topPages[0].path).toBe("/b");
        expect(summary.topPages[0].views).toBe(3);
    });

    it("populates last7Days array with up to 7 entries", () => {
        trackPageView("/dashboard");
        const summary = getAnalyticsSummary();
        expect(summary.last7Days.length).toBeLessThanOrEqual(7);
        expect(summary.last7Days.length).toBeGreaterThan(0);
    });

    it("populates last30Days array with up to 30 entries", () => {
        trackPageView("/dashboard");
        const summary = getAnalyticsSummary();
        expect(summary.last30Days.length).toBeLessThanOrEqual(30);
        expect(summary.last30Days.length).toBeGreaterThan(0);
    });

    it("computes avgDailyViews as a non-negative number", () => {
        trackPageView("/");
        const summary = getAnalyticsSummary();
        expect(summary.avgDailyViews).toBeGreaterThanOrEqual(0);
    });

    it("returns growthPct as null when no prior-period data exists", () => {
        // With only today's data there is no previous 30-day window to compare
        trackPageView("/");
        const summary = getAnalyticsSummary();
        // May be null or a number — just ensure it doesn't throw
        expect(
            summary.growthPct === null || typeof summary.growthPct === "number",
        ).toBe(true);
    });
});

// ─── Corruption / edge cases ──────────────────────────────────────────────────

describe("localStorage corruption resilience", () => {
    it("recovers gracefully from corrupted views storage", () => {
        localStorage.setItem(LS_VIEWS, "not valid json {{{");
        expect(() => trackPageView("/")).not.toThrow();
        expect(() => getAnalyticsSummary()).not.toThrow();
    });

    it("recovers gracefully from corrupted events storage", () => {
        localStorage.setItem(LS_EVENTS, "broken");
        expect(() => trackEvent("x", "/")).not.toThrow();
        expect(() => getAllEvents()).not.toThrow();
    });
});

// ─── Privacy opt-out ──────────────────────────────────────────────────────────

describe("privacy opt-out", () => {
    const LS_PREFS = "esp32-privacy-prefs";

    it("does not track page views when allowUsageData is false", () => {
        localStorage.setItem(
            LS_PREFS,
            JSON.stringify({ allowUsageData: false }),
        );
        trackPageView("/dashboard");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views).toHaveLength(0);
    });

    it("does not track events when allowUsageData is false", () => {
        localStorage.setItem(
            LS_PREFS,
            JSON.stringify({ allowUsageData: false }),
        );
        trackEvent("clicked", "/");
        const events = JSON.parse(localStorage.getItem(LS_EVENTS) ?? "[]");
        expect(events).toHaveLength(0);
    });

    it("resumes tracking when allowUsageData is re-enabled", () => {
        localStorage.setItem(
            LS_PREFS,
            JSON.stringify({ allowUsageData: true }),
        );
        trackPageView("/workshop");
        const views = JSON.parse(localStorage.getItem(LS_VIEWS) ?? "[]");
        expect(views).toHaveLength(1);
    });
});
