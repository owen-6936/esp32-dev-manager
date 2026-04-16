import { Key, Link2, Link2Off, Lock, Shield } from "lucide-react";
import { useState } from "react";
import Card from "../../Card";
import ChangePassword from "../Modals/ChangePassword";
import { useAuth } from "../../../contexts/AuthContext";

export default function Security() {
    const [showChangePassword, setShowChangePassword] =
        useState<boolean>(false);
    const [linkingGoogle, setLinkingGoogle] = useState(false);
    const [linkedError, setLinkedError] = useState<string | null>(null);

    const { session, linkedProviders, signInWithGoogle, unlinkGoogle } =
        useAuth();

    const isGoogleLinked = linkedProviders.includes("google");
    const hasEmailLogin = linkedProviders.includes("email");

    const handleLinkGoogle = async () => {
        setLinkedError(null);
        setLinkingGoogle(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            setLinkedError(
                err instanceof Error ? err.message : "Failed to link Google",
            );
        } finally {
            setLinkingGoogle(false);
        }
    };

    const handleUnlinkGoogle = async () => {
        if (!hasEmailLogin) {
            setLinkedError(
                "Add a password to your account before unlinking Google, or you'll lose access.",
            );
            return;
        }
        setLinkedError(null);
        setLinkingGoogle(true);
        try {
            await unlinkGoogle();
        } catch (err) {
            setLinkedError(
                err instanceof Error ? err.message : "Failed to unlink Google",
            );
        } finally {
            setLinkingGoogle(false);
        }
    };

    return (
        <Card className="space-y-6" bg="transparent" padding="p-2">
            <Card.Header
                title="Security"
                icon={<Lock className="w-5 h-5 text-yellow-500" />}
            />
            {showChangePassword && (
                <ChangePassword setShowChangePassword={setShowChangePassword} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <Card.Header title="Password & Authentication" />
                    <div className="space-y-4">
                        <button
                            onClick={() => setShowChangePassword(true)}
                            aria-label="Change your password"
                            className="w-full bg-blue-500/20 text-blue-200 p-3 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
                        >
                            <Key className="w-4 h-4" />
                            <span>Change Password</span>
                        </button>
                        <button
                            aria-label="Enable Two-Factor Authentication"
                            disabled
                            className="w-full bg-green-500/20 text-green-200 p-3 rounded-lg transition-all flex items-center space-x-2 opacity-50 cursor-not-allowed"
                        >
                            <Shield className="w-4 h-4" />
                            <span>Enable 2FA</span>
                            <span className="ml-auto text-xs text-green-200/50">Coming soon</span>
                        </button>
                    </div>
                </Card>

                {/* Connected Accounts */}
                <Card>
                    <Card.Header title="Connected Accounts" />
                    <div className="space-y-4">
                        {linkedError && (
                            <p className="text-red-400 text-xs px-3 py-2 bg-red-500/10 rounded-lg">
                                {linkedError}
                            </p>
                        )}
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                                {/* Google logo */}
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <div>
                                    <p className="text-white text-sm font-medium">Google</p>
                                    <p className="text-blue-200/50 text-xs">
                                        {isGoogleLinked ? "Linked" : "Not linked"}
                                    </p>
                                </div>
                            </div>
                            {isGoogleLinked ? (
                                <button
                                    onClick={handleUnlinkGoogle}
                                    disabled={linkingGoogle || !hasEmailLogin}
                                    title={
                                        !hasEmailLogin
                                            ? "Set a password before unlinking"
                                            : "Unlink Google"
                                    }
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Link2Off className="w-3.5 h-3.5" />
                                    {linkingGoogle ? "Unlinking…" : "Unlink"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleLinkGoogle}
                                    disabled={linkingGoogle}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Link2 className="w-3.5 h-3.5" />
                                    {linkingGoogle ? "Linking…" : "Link"}
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <Card.Header title="Current Session" />
                    <div className="space-y-3">
                        {session ? (
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">
                                        Active Session
                                    </p>
                                    <p className="text-blue-200 text-sm">
                                        Signed in as {session.user.email}
                                    </p>
                                </div>
                                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                    Active
                                </span>
                            </div>
                        ) : (
                            <p className="text-white/40 text-sm p-3">
                                No active session
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </Card>
    );
}
