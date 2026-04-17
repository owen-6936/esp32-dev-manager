/**
 * Feedback / Bug Report Modal
 *
 * Lets users submit bugs, feature requests, or general messages.
 * - If Supabase is configured: saves to `feedback` table
 * - Always: pre-fills a mailto: link so the user can also send by email
 * Contact: dev.nexicore@gmail.com
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bug, Lightbulb, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { getSupabaseClient } from "../../../lib/supabase";
import { trackEvent } from "../../../services/analyticsService";
import { useAuth } from "../../../contexts/AuthContext";

const CONTACT_EMAIL = "dev.nexicore@gmail.com";

type FeedbackType = "bug" | "feature" | "general";

const TYPE_CONFIG: Record<FeedbackType, { label: string; icon: React.ElementType; color: string; placeholder: string }> = {
    bug: {
        label: "Bug Report",
        icon: Bug,
        color: "#ef4444",
        placeholder: "Describe the bug — what happened, what you expected, and steps to reproduce.",
    },
    feature: {
        label: "Feature Request",
        icon: Lightbulb,
        color: "#f59e0b",
        placeholder: "Describe the feature you'd like to see and why it would be useful.",
    },
    general: {
        label: "General Feedback",
        icon: MessageCircle,
        color: "#3b82f6",
        placeholder: "Share any thoughts, ideas, or praise — we read everything!",
    },
};

interface FeedbackModalProps {
    onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
    const { user } = useAuth();
    const [type, setType] = useState<FeedbackType>("general");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState(user?.email ?? "");
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const cfg = TYPE_CONFIG[type];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setStatus("sending");
        setErrorMsg("");

        // Try Supabase first
        const sb = getSupabaseClient();
        if (sb) {
            const { error } = await sb.from("feedback").insert({
                type,
                subject: subject.trim(),
                message: message.trim(),
                email: email.trim() || null,
                user_id: user?.id ?? null,
            });
            if (error) {
                // Fall through to mailto
                console.warn("Supabase feedback insert failed:", error.message);
            } else {
                trackEvent("feedback_submitted", window.location.pathname, { type });
                setStatus("done");
                return;
            }
        }

        // Fallback: open mailto in new tab (doesn't require a server)
        const mailtoBody = encodeURIComponent(
            `Type: ${type}\nSubject: ${subject}\n\n${message}\n\n---\nEmail: ${email || "not provided"}\nUser ID: ${user?.id ?? "anonymous"}`,
        );
        const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[ESP32 Dev Manager] ${subject}`)}&body=${mailtoBody}`;
        window.open(mailtoUrl, "_blank");

        trackEvent("feedback_submitted", window.location.pathname, { type, via: "mailto" });
        setStatus("done");
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-slate-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-white/15 flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Send Feedback</h2>
                        <p className="text-white/40 text-xs mt-0.5">Help us improve — we read everything!</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {status === "done" ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Thank you!</h3>
                                <p className="text-white/50 text-sm mt-1">
                                    Your {type === "bug" ? "bug report" : type === "feature" ? "feature request" : "feedback"} has been sent.
                                    We'll get back to you at <span className="text-blue-300">{CONTACT_EMAIL}</span>.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-2 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="flex flex-col flex-1 overflow-y-auto"
                        >
                            <div className="p-5 space-y-4">
                                {/* Type picker */}
                                <div className="grid grid-cols-3 gap-2">
                                    {(Object.entries(TYPE_CONFIG) as [FeedbackType, typeof TYPE_CONFIG[FeedbackType]][]).map(
                                        ([key, c]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setType(key)}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${type === key ? "text-white" : "text-white/40 border-white/10 hover:border-white/20"}`}
                                                style={
                                                    type === key
                                                        ? { background: `${c.color}18`, borderColor: `${c.color}50`, color: c.color }
                                                        : {}
                                                }
                                            >
                                                <c.icon className="w-4 h-4" />
                                                {c.label}
                                            </button>
                                        ),
                                    )}
                                </div>

                                {/* Subject */}
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    maxLength={120}
                                    required
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                                />

                                {/* Message */}
                                <textarea
                                    placeholder={cfg.placeholder}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    maxLength={2000}
                                    required
                                    className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
                                />

                                {/* Email */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email (optional, for follow-up)"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                    <p className="text-white/25 text-xs mt-1">
                                        Goes to <span className="text-white/40">{CONTACT_EMAIL}</span>
                                    </p>
                                </div>

                                {errorMsg && (
                                    <p className="text-red-400 text-xs">{errorMsg}</p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 pb-5 shrink-0">
                                <button
                                    type="submit"
                                    disabled={status === "sending" || !subject.trim() || !message.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
                                >
                                    {status === "sending" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
