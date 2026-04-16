/* ═══════════════════════════════════════════════════════════════════════════
   privacy-prefs.test.ts
   Tests for the usePrivacyPrefs hook and getAllowUsageData helper.
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePrivacyPrefs, getAllowUsageData } from "../hooks/usePrivacyPrefs";

const LS_KEY = "esp32-privacy-prefs";

beforeEach(() => {
    localStorage.clear();
});

// ─── defaults ────────────────────────────────────────────────────────────────

describe("defaults", () => {
    it("allows usage data by default (opted-in)", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        expect(result.current.prefs.allowUsageData).toBe(true);
    });

    it("receives emails by default", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        expect(result.current.prefs.receiveEmails).toBe(true);
    });
});

// ─── setAllowUsageData ────────────────────────────────────────────────────────

describe("setAllowUsageData", () => {
    it("turns off usage data tracking", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        act(() => result.current.setAllowUsageData(false));
        expect(result.current.prefs.allowUsageData).toBe(false);
    });

    it("persists the preference to localStorage", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        act(() => result.current.setAllowUsageData(false));
        const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
        expect(stored.allowUsageData).toBe(false);
    });

    it("can be toggled back on", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        act(() => result.current.setAllowUsageData(false));
        act(() => result.current.setAllowUsageData(true));
        expect(result.current.prefs.allowUsageData).toBe(true);
    });
});

// ─── setReceiveEmails ─────────────────────────────────────────────────────────

describe("setReceiveEmails", () => {
    it("turns off email preference", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        act(() => result.current.setReceiveEmails(false));
        expect(result.current.prefs.receiveEmails).toBe(false);
    });

    it("persists email preference to localStorage", () => {
        const { result } = renderHook(() => usePrivacyPrefs());
        act(() => result.current.setReceiveEmails(false));
        const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
        expect(stored.receiveEmails).toBe(false);
    });
});

// ─── persistence across remounts ─────────────────────────────────────────────

describe("persistence", () => {
    it("reads persisted prefs on remount", () => {
        localStorage.setItem(
            LS_KEY,
            JSON.stringify({ allowUsageData: false, receiveEmails: false }),
        );
        const { result } = renderHook(() => usePrivacyPrefs());
        expect(result.current.prefs.allowUsageData).toBe(false);
        expect(result.current.prefs.receiveEmails).toBe(false);
    });

    it("falls back to defaults when localStorage is corrupted", () => {
        localStorage.setItem(LS_KEY, "not-json{{{");
        const { result } = renderHook(() => usePrivacyPrefs());
        expect(result.current.prefs.allowUsageData).toBe(true);
    });
});

// ─── getAllowUsageData ────────────────────────────────────────────────────────

describe("getAllowUsageData", () => {
    it("returns true when no pref stored", () => {
        expect(getAllowUsageData()).toBe(true);
    });

    it("returns false when opted out", () => {
        localStorage.setItem(LS_KEY, JSON.stringify({ allowUsageData: false }));
        expect(getAllowUsageData()).toBe(false);
    });
});
