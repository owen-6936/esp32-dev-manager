import {
    Download,
    Fingerprint,
    Trash2,
    Loader2,
    AlertTriangle,
    ShieldCheck,
    FileJson,
} from "lucide-react";
import { useState } from "react";
import Card from "../../Card";
import { useAuth } from "../../../contexts/AuthContext";
import * as auth from "../../../lib/auth";
import useProjectStore from "../../../store/project";
import useJournalStore from "../../../store/journal";
import useComponentStore from "../../../store/component";
import useKitStore from "../../../store/kit";
import { usePrivacyPrefs } from "../../../hooks/usePrivacyPrefs";
import {
    getAnalyticsSummary,
    getStoredEvents,
} from "../../../services/analyticsService";

// ─── Export helpers ───────────────────────────────────────────────────────────

function buildExportPayload(
    user: ReturnType<typeof useAuth>["user"],
    projects: ReturnType<typeof useProjectStore>,
    journalEntries: ReturnType<typeof useJournalStore>,
    components: ReturnType<typeof useComponentStore>,
    ownedSkus: string[],
) {
    return {
        meta: {
            exportedAt: new Date().toISOString(),
            appVersion: "1.0.0",
            format: "esp32-dev-manager-v1",
        },
        account: {
            id: user?.id ?? null,
            email: user?.email ?? null,
            createdAt: user?.created_at ?? null,
            providers: user?.identities?.map((i) => i.provider) ?? [],
        },
        projects,
        journalEntries,
        components,
        kit: { ownedSkus },
        analytics: {
            summary: getAnalyticsSummary(),
            recentEvents: getStoredEvents().slice(-100),
        },
    };
}

function triggerDownload(payload: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DataAndPrivacy() {
    const { user, signOut } = useAuth();
    const projects = useProjectStore((s) => s.projects);
    const journalEntries = useJournalStore((s) => s.journalEntries);
    const components = useComponentStore((s) => s.components);
    const ownedSkus = useKitStore((s) => s.ownedSkus);

    const { prefs, setAllowUsageData, setReceiveEmails } = usePrivacyPrefs();

    const [exporting, setExporting] = useState(false);
    const [exportDone, setExportDone] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // ── Export ───────────────────────────────────────────────────────────────

    const handleExportData = async () => {
        setExporting(true);
        setExportDone(false);
        try {
            const payload = buildExportPayload(
                user,
                projects,
                journalEntries,
                components,
                ownedSkus,
            );
            const date = new Date().toISOString().slice(0, 10);
            triggerDownload(payload, `esp32-dev-manager-export-${date}.json`);
            setExportDone(true);
            setTimeout(() => setExportDone(false), 3000);
        } finally {
            setExporting(false);
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────

    const CONFIRM_PHRASE = "delete my account";
    const deleteInputValid =
        deleteInput.trim().toLowerCase() === CONFIRM_PHRASE;

    const handleDeleteAccount = async () => {
        if (!deleteInputValid || !user) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await auth.deleteAccount(user.id);
            // Clear all local stores
            useProjectStore.setState({ projects: [] });
            useJournalStore.setState({ journalEntries: [] });
            useComponentStore.setState({ components: [] });
            useKitStore.setState({ ownedSkus: [] });
            await signOut();
        } catch (err) {
            setDeleteError(
                err instanceof Error ? err.message : "Failed to delete account",
            );
            setDeleting(false);
        }
    };

    return (
        <Card bg="transparent" padding="p-2" className="space-y-6">
            <Card.Header
                title="Data & Privacy"
                icon={<Fingerprint className="w-5 h-5" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── Data Management ── */}
                <Card>
                    <Card.Header title="Data Management" />
                    <div className="space-y-4">
                        <button
                            onClick={handleExportData}
                            disabled={exporting}
                            aria-label="Export all of my data as JSON"
                            className="w-full bg-blue-500/20 text-blue-200 p-3 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? (
                                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            ) : exportDone ? (
                                <FileJson className="w-4 h-4 shrink-0 text-green-400" />
                            ) : (
                                <Download className="w-4 h-4 shrink-0" />
                            )}
                            <span>
                                {exportDone
                                    ? "Downloaded!"
                                    : exporting
                                        ? "Preparing export…"
                                        : "Export All Data"}
                            </span>
                        </button>
                        <p className="text-blue-200/40 text-xs px-1">
                            Exports projects, journal entries, components, kit
                            inventory and analytics as a single JSON file.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                aria-label="Permanently delete my account"
                                className="w-full bg-red-500/20 text-red-200 p-3 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4 shrink-0" />
                                <span>Delete My Account</span>
                            </button>
                        ) : (
                            <div className="space-y-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-start gap-2 text-red-300 text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>
                                        This permanently deletes all your data —
                                        projects, journal entries, components,
                                        kit inventory and your account. This{" "}
                                        <strong>cannot be undone</strong>.
                                    </span>
                                </div>
                                <p className="text-red-200/60 text-xs">
                                    Type{" "}
                                    <span className="font-mono text-red-300">
                                        {CONFIRM_PHRASE}
                                    </span>{" "}
                                    to confirm.
                                </p>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={(e) =>
                                        setDeleteInput(e.target.value)
                                    }
                                    placeholder={CONFIRM_PHRASE}
                                    className="w-full bg-white/5 border border-red-500/30 text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-red-400 placeholder-white/20"
                                />
                                {deleteError && (
                                    <p className="text-red-400 text-xs">
                                        {deleteError}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleting || !deleteInputValid}
                                        className="flex-1 bg-red-500/30 text-red-200 p-2 rounded-lg hover:bg-red-500/40 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {deleting && (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        )}
                                        Yes, permanently delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeleteInput("");
                                            setDeleteError(null);
                                        }}
                                        className="flex-1 bg-white/10 text-white/70 p-2 rounded-lg hover:bg-white/15 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* ── Privacy Settings ── */}
                <Card>
                    <Card.Header
                        title="Privacy Settings"
                        icon={
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                        }
                    />
                    <div className="space-y-5">
                        <ToggleRow
                            label="Allow Usage Data"
                            description="Help improve the app by sharing anonymous usage analytics. Enabled by default — you can opt out at any time."
                            checked={prefs.allowUsageData}
                            onChange={setAllowUsageData}
                        />
                        <div className="h-px bg-white/10" />
                        <ToggleRow
                            label="Receive Promotional Emails"
                            description="Occasional emails about new features, tutorials and ESP32 tips."
                            checked={prefs.receiveEmails}
                            onChange={setReceiveEmails}
                        />
                    </div>
                </Card>
            </div>
        </Card>
    );
}

// ─── ToggleRow ────────────────────────────────────────────────────────────────

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5 flex-1">
                <p className="text-white text-sm font-medium">{label}</p>
                {description && (
                    <p className="text-blue-200/40 text-xs">{description}</p>
                )}
            </div>
            <button
                role="switch"
                aria-checked={checked}
                aria-label={`Toggle ${label}`}
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 shrink-0 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-white/20"
                    }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}
