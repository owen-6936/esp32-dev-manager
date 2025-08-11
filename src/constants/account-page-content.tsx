// AccountPageContent.tsx
import React, { useState } from "react";

interface Props {
  isMobile: boolean;
}

const AccountPageContent: React.FC<Props> = ({ isMobile }) => {
  const [active, setActive] = useState("profile");

  // ... state setup for profile, preferences, stats, achievements, activity, etc. (same as before)...

  const sections = [
    {
      key: "profile",
      title: "Profile",
      panel: <div>/* JSX for profile section */</div>,
    },
    {
      key: "stats",
      title: "Statistics",
      panel: <div>/* JSX for stats section */</div>,
    },
    {
      key: "achievements",
      title: "Achievements",
      panel: <div>/* JSX for achievements section */</div>,
    },
    {
      key: "preferences",
      title: "Preferences",
      panel: <div>/* JSX for preferences with toggles */</div>,
    },
    {
      key: "security",
      title: "Security",
      panel: <div>/* JSX for security including change password */</div>,
    },
    {
      key: "data",
      title: "Data & Privacy",
      panel: <div>/* JSX for export/import and privacy toggles */</div>,
    },
  ];

  return (
    <div className={isMobile ? "" : "grid grid-cols-1 lg:grid-cols-4 gap-8"}>
      {/* Sidebar (desktop only) */}
      {!isMobile && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 sticky top-6">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                active === s.key
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {sections.map((s) => (
          <section key={s.key}>
            {isMobile ? (
              <details
                open={active === s.key}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <summary className="text-xl font-bold text-white mb-2">
                  {s.title}
                </summary>
                {s.panel}
              </details>
            ) : (
              active === s.key && <div className="space-y-6">{s.panel}</div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default AccountPageContent;
