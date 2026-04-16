/**
 * usePrivacyPrefs
 *
 * Manages user privacy preferences persisted in localStorage.
 *
 * Defaults:
 *  - allowUsageData: true   (opted-in by default so analytics data is collected
 *                            unless the user explicitly turns it off)
 *  - receiveEmails:  true
 */
import { useCallback, useEffect, useState } from "react";

const LS_KEY = "esp32-privacy-prefs";

export interface PrivacyPrefs {
    /** Whether the user consents to anonymous usage analytics. Default: true */
    allowUsageData: boolean;
    /** Whether the user wants to receive promotional / newsletter emails. Default: true */
    receiveEmails: boolean;
}

const DEFAULTS: PrivacyPrefs = {
    allowUsageData: true,
    receiveEmails: true,
};

function readPrefs(): PrivacyPrefs {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return { ...DEFAULTS };
        return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<PrivacyPrefs>) };
    } catch {
        return { ...DEFAULTS };
    }
}

function writePrefs(prefs: PrivacyPrefs): void {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(prefs));
    } catch {
        /* localStorage unavailable — ignore */
    }
}

export function usePrivacyPrefs() {
    const [prefs, setPrefsState] = useState<PrivacyPrefs>(readPrefs);

    // Keep in sync across tabs/windows
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === LS_KEY) setPrefsState(readPrefs());
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const update = useCallback((patch: Partial<PrivacyPrefs>) => {
        setPrefsState((prev) => {
            const next = { ...prev, ...patch };
            writePrefs(next);
            return next;
        });
    }, []);

    const setAllowUsageData = useCallback(
        (val: boolean) => update({ allowUsageData: val }),
        [update],
    );

    const setReceiveEmails = useCallback(
        (val: boolean) => update({ receiveEmails: val }),
        [update],
    );

    return { prefs, setAllowUsageData, setReceiveEmails };
}

/** Read the pref synchronously (outside of React, e.g. in services). */
export function getAllowUsageData(): boolean {
    return readPrefs().allowUsageData;
}
