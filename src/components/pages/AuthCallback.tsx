/**
 * AuthCallback
 *
 * Handles the redirect back from Supabase OAuth (PKCE flow).
 * Supabase appends ?code=<pkce_code> to this URL.
 * We exchange it for a session and navigate home.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabaseClient } from "../../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    // Guard against React Strict Mode double-invocation
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const supabase = getSupabaseClient();
        if (!supabase) {
            navigate("/", { replace: true });
            return;
        }

        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
            // No code — might be an implicit flow hash fragment; Supabase
            // onAuthStateChange will handle it. Just go home.
            navigate("/", { replace: true });
            return;
        }

        supabase.auth
            .exchangeCodeForSession(code)
            .then(async ({ error }) => {
                if (error) {
                    // The verifier may have already been consumed by Supabase's
                    // internal auto-detection. If a valid session exists, just
                    // navigate home rather than showing a spurious error.
                    const { data } = await supabase.auth.getSession();
                    if (data.session) {
                        navigate("/", { replace: true });
                    } else {
                        setError(error.message);
                    }
                } else {
                    navigate("/", { replace: true });
                }
            })
            .catch((e: unknown) => {
                setError(e instanceof Error ? e.message : "Authentication failed");
            });
    }, [navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
                    <p className="text-red-300 font-semibold">Sign-in failed</p>
                    <p className="text-red-300/70 text-sm">{error}</p>
                    <button
                        onClick={() => navigate("/login", { replace: true })}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                <p className="text-blue-300/60 text-sm">Completing sign-in…</p>
            </div>
        </div>
    );
}
