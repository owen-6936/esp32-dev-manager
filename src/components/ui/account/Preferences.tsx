import { useState } from "react";
import Card from "../../Card";
import { Settings } from "lucide-react";

export default function Preferences() {
    const [preferences, setPreferences] = useState({
        theme: "dark",
        language: "english",
        timezone: "PST",
        notifications: {
            projectDeadlines: true,
            componentLowStock: true,
            newAchievements: true,
            weeklyReports: false,
            securityAlerts: true,
            marketingEmails: false,
        },
        privacy: {
            profilePublic: true,
            projectsPublic: false,
            showEmail: false,
            showPhone: false,
            allowMessages: true,
        },
    });

    return (
        <Card bg="transparent" padding="p-2" className="space-y-6">
            <Card.Header
                title="Customize Your Experience"
                icon={<Settings className="w-5 h-5 text-gray-500" />}
                subtitle="Adjust settings to match your workflow and style"
            />

            {/* General Preferences */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">
                    General Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Theme
                        </label>
                        <select
                            value={preferences.theme}
                            onChange={(e) =>
                                setPreferences({
                                    ...preferences,
                                    theme: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Language
                        </label>
                        <select
                            value={preferences.language}
                            onChange={(e) =>
                                setPreferences({
                                    ...preferences,
                                    language: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Timezone
                        </label>
                        <select
                            value={preferences.timezone}
                            onChange={(e) =>
                                setPreferences({
                                    ...preferences,
                                    timezone: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        >
                            <option value="PST">Pacific (PST)</option>
                            <option value="EST">Eastern (EST)</option>
                            <option value="GMT">Greenwich (GMT)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">
                    Notifications
                </h3>
                <div className="space-y-4">
                    {(() => {
                        const notificationLabels: Record<
                            string,
                            { label: string; description: string }
                        > = {
                            projectDeadlines: {
                                label: "Project Deadlines",
                                description:
                                    "Get reminded about upcoming project deadlines",
                            },
                            componentLowStock: {
                                label: "Component Low Stock",
                                description:
                                    "Alerts when component quantities are low",
                            },
                            newAchievements: {
                                label: "New Achievements",
                                description:
                                    "Celebrate when you unlock new achievements",
                            },
                            weeklyReports: {
                                label: "Weekly Reports",
                                description:
                                    "Weekly summary of your development progress",
                            },
                            securityAlerts: {
                                label: "Security Alerts",
                                description:
                                    "Important security and account notifications",
                            },
                            marketingEmails: {
                                label: "Marketing Emails",
                                description:
                                    "Product updates and feature announcements",
                            },
                        };
                        return Object.entries(preferences.notifications).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-white font-medium">
                                            {notificationLabels[key]?.label ||
                                                key}
                                        </p>
                                        <p className="text-blue-200 text-sm">
                                            {notificationLabels[key]
                                                ?.description || ""}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setPreferences({
                                                ...preferences,
                                                notifications: {
                                                    ...preferences.notifications,
                                                    [key]: !value,
                                                },
                                            })
                                        }
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            value
                                                ? "bg-blue-500"
                                                : "bg-gray-600"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                value
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            ),
                        );
                    })()}
                </div>
            </div>
        </Card>
    );
}
