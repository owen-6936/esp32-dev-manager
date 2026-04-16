import {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { ProfileRow } from "../types/database";
import { isSupabaseConfigured } from "../lib/supabase";
import * as auth from "../lib/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthState {
    user: User | null;
    profile: ProfileRow | null;
    session: Session | null;
    loading: boolean;
}

interface AuthContextValue extends AuthState {
    isAdmin: boolean;
    /** Providers the current user has linked (e.g. ["google", "email"]) */
    linkedProviders: string[];
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (
        email: string,
        password: string,
        displayName?: string,
    ) => Promise<void>;
    /**
     * If already signed in: links Google to the current account.
     * If not signed in: starts Google OAuth sign-in.
     */
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    unlinkGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        session: null,
        loading: true,
    });

    // Fetch profile for a given user
    const fetchProfile = async (userId: string) => {
        try {
            return await auth.getProfile(userId);
        } catch {
            return null;
        }
    };

    // Bootstrap: check existing session
    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setState((s) => ({ ...s, loading: false }));
            return;
        }

        let cancelled = false;

        auth.getSession().then(async (session) => {
            if (cancelled) return;
            const user = session?.user ?? null;
            const profile = user ? await fetchProfile(user.id) : null;
            setState({ user, profile, session, loading: false });
        });

        const subscription = auth.onAuthStateChange(async (session, user) => {
            if (cancelled) return;
            const profile = user ? await fetchProfile(user.id) : null;
            setState({ user, profile, session, loading: false });
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    // ── Actions ──────────────────────────────────────────────────────────────

    const signInWithEmail = async (email: string, password: string) => {
        await auth.signInWithEmail(email, password);
    };

    const signUpWithEmail = async (
        email: string,
        password: string,
        displayName?: string,
    ) => {
        await auth.signUpWithEmail(email, password, displayName);
    };

    const signInWithGoogle = async () => {
        // If already signed in, link Google to the existing account instead
        if (state.user) {
            await auth.linkIdentity("google");
        } else {
            await auth.signInWithOAuth("google");
        }
    };

    const signInWithGitHub = async () => {
        if (state.user) {
            await auth.linkIdentity("github");
        } else {
            await auth.signInWithOAuth("github");
        }
    };

    const unlinkGoogle = async () => {
        if (!state.user) return;
        const googleIdentity = state.user.identities?.find(
            (i) => i.provider === "google",
        );
        if (!googleIdentity) throw new Error("Google account not linked");
        await auth.unlinkIdentity(googleIdentity.id);
        // Refresh user after unlinking
        const session = await auth.getSession();
        setState((s) => ({ ...s, user: session?.user ?? s.user }));
    };

    const signOut = async () => {
        await auth.signOut();
        setState({ user: null, profile: null, session: null, loading: false });
    };

    const refreshProfile = async () => {
        if (!state.user) return;
        const profile = await fetchProfile(state.user.id);
        setState((s) => ({ ...s, profile }));
    };

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
    const isAdmin =
        !!state.user?.email &&
        state.user.email.toLowerCase() === adminEmail;

    const linkedProviders = useMemo(
        () => state.user?.identities?.map((i) => i.provider) ?? [],
        [state.user],
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            ...state,
            isAdmin,
            linkedProviders,
            signInWithEmail,
            signUpWithEmail,
            signInWithGoogle,
            signInWithGitHub,
            unlinkGoogle,
            signOut,
            refreshProfile,
        }),
        [state, isAdmin, linkedProviders],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
