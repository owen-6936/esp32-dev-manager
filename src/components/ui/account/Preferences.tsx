import { useState } from "react";

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "english",
    timezone: "GMT",
    notifications: {
      projectDeadlines: true,
      componentLowStock: true,
      newAchievements: true,
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Preferences</h2>

      {/* General Preferences */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) =>
                setPreferences({ ...preferences, theme: e.target.value })
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
                setPreferences({ ...preferences, language: e.target.value })
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
                setPreferences({ ...preferences, timezone: e.target.value })
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
        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-blue-200 text-sm">
                  {key === "projectDeadlines" &&
                    "Get reminded about upcoming project deadlines"}
                  {key === "componentLowStock" &&
                    "Alerts when component quantities are low"}
                  {key === "newAchievements" &&
                    "Celebrate when you unlock new achievements"}
                  {key === "weeklyReports" &&
                    "Weekly summary of your development progress"}
                  {key === "securityAlerts" &&
                    "Important security and account notifications"}
                  {key === "marketingEmails" &&
                    "Product updates and feature announcements"}
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
                  value ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
