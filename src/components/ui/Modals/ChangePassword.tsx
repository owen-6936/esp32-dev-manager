import type { Dispatch } from "react";
import { useState } from "react";
import Card from "../../Card";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "../../../lib/supabase";

export default function ChangePassword({
    setShowChangePassword,
}: {
    setShowChangePassword: Dispatch<React.SetStateAction<boolean>>;
}) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const client = getSupabaseClient();
            if (!client) throw new Error("Supabase is not configured");

            const { error: updateError } = await client.auth.updateUser({
                password: newPassword,
            });
            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => setShowChangePassword(false), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 relative">
            <Card.Header title="Password & Authentication" />
            <button
                onClick={() => setShowChangePassword(false)}
                aria-label="Close change password modal"
                className="absolute top-4 right-4 text-white hover:text-red-400"
            >
                <X className="w-5 h-5" />
            </button>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div>
                    <label
                        className="block text-sm text-white mb-1"
                        htmlFor="new-password"
                    >
                        New Password
                    </label>
                    <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label
                        className="block text-sm text-white mb-1"
                        htmlFor="confirm-password"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-300 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-2 text-green-300 text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Password updated successfully!</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-blue-500/80 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {success ? "Done!" : "Change Password"}
                </button>
            </form>
        </Card>
    );
}
