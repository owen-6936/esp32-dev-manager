/**
 * CookieBanner
 *
 * Shown on first visit if the user hasn't yet acknowledged cookie usage.
 * Persists consent in localStorage under "esp32-cookie-consent".
 *
 * Consent model:
 *  - "essential" cookies are always on (authentication session, local store).
 *  - "analytics" tracks page views / events — respects usePrivacyPrefs.
 *
 * The banner disappears once the user clicks "Accept all" or "Essential only".
 */
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { usePrivacyPrefs } from "../hooks/usePrivacyPrefs";

const LS_KEY = "esp32-cookie-consent";

type ConsentLevel = "all" | "essential";

function readConsent(): ConsentLevel | null {
    try {
        const raw = localStorage.getItem(LS_KEY) as ConsentLevel | null;
        if (raw === "all" || raw === "essential") return raw;
        return null;
    } catch {
        return null;
    }
}

function writeConsent(level: ConsentLevel): void {
    try {
        localStorage.setItem(LS_KEY, level);
    } catch {
        /* ignore */
    }
}

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const { setAllowUsageData } = usePrivacyPrefs();

    // Only show after hydration to avoid SSR flicker
    useEffect(() => {
        if (readConsent() === null) setVisible(true);
    }, []);

    if (!visible) return null;

    const accept = (level: ConsentLevel) => {
        writeConsent(level);
        setAllowUsageData(level === "all");
        setVisible(false);
    };

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-label="Cookie consent"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
        >
            <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-start gap-3 mb-4">
                    <Cookie className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">
                            Cookies &amp; Privacy
                        </p>
                        <p className="text-blue-200/60 text-xs mt-1 leading-relaxed">
                            We use{" "}
                            <strong className="text-blue-200/80">
                                essential cookies
                            </strong>{" "}
                            to keep you signed in, and optional{" "}
                            <strong className="text-blue-200/80">
                                analytics cookies
                            </strong>{" "}
                            to understand how the app is used and improve it.
                            You can change this any time in{" "}
                            <span className="text-blue-400">
                                Account → Data &amp; Privacy
                            </span>
                            .
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => accept("all")}
                        className="flex-1 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                    >
                        Accept all
                    </button>
                    <button
                        onClick={() => accept("essential")}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 text-sm py-2 px-4 rounded-xl transition-colors"
                    >
                        Essential only
                    </button>
                </div>
            </div>
        </div>
    );
}
