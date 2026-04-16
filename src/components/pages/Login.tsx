import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Cpu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GlassCard from "../ui/glass/GlassCard";
import GlassInput from "../ui/glass/GlassInput";

type Mode = "login" | "signup";

export default function Login() {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);

    const { signInWithEmail, signUpWithEmail, signInWithGoogle } =
        useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "login") {
                await signInWithEmail(email, password);
                navigate("/");
            } else {
                await signUpWithEmail(email, password, displayName);
                setConfirmationSent(true);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (confirmationSent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <GlassCard variant="strong" className="max-w-md w-full text-center">
                    <Mail className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Check your email
                    </h2>
                    <p className="text-blue-200/70">
                        We sent a confirmation link to{" "}
                        <span className="text-white font-medium">{email}</span>.
                        Click the link to activate your account.
                    </p>
                    <button
                        onClick={() => {
                            setConfirmationSent(false);
                            setMode("login");
                        }}
                        className="mt-6 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                        Back to login
                    </button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <GlassCard variant="strong" className="overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25">
                            <Cpu className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-blue-200/60 text-sm mt-1">
                            {mode === "login"
                                ? "Sign in to your ESP32 Dev Manager"
                                : "Start tracking your ESP32 projects"}
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            type="button"
                            onClick={async () => {
                                setError(null);
                                setLoading(true);
                                try {
                                    await signInWithGoogle();
                                } catch (err: unknown) {
                                    const msg =
                                        err instanceof Error
                                            ? err.message
                                            : "Something went wrong";
                                    if (
                                        /already registered|already exists|conflict/i.test(
                                            msg,
                                        )
                                    ) {
                                        setError(
                                            "An account with this email already exists. Sign in with your password, then link Google under Account → Security.",
                                        );
                                    } else {
                                        setError(msg);
                                    }
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-blue-200/40 uppercase tracking-wider">
                            or
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <GlassInput
                                icon={<User className="w-4 h-4" />}
                                type="text"
                                placeholder="Display name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                autoComplete="name"
                            />
                        )}
                        <GlassInput
                            icon={<Mail className="w-4 h-4" />}
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <GlassInput
                            icon={<Lock className="w-4 h-4" />}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete={
                                mode === "login" ? "current-password" : "new-password"
                            }
                        />

                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === "login" ? "Sign in" : "Create account"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <p className="text-center text-sm text-blue-200/50 mt-6">
                        {mode === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "login" ? "signup" : "login");
                                setError(null);
                            }}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            {mode === "login" ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
