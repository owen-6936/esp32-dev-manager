// AccountPageContent.tsx
import React, { useState } from "react";
import Profile from "../components/ui/account/Profile";
import Stats from "../components/ui/account/Stats";
import Achievements from "../components/ui/account/Achievements";
import Preferences from "../components/ui/account/Preferences";
import Security from "../components/ui/account/Security";
import DataAndPrivacy from "../components/ui/account/data-and-privacy";
import Activity from "../components/ui/account/Activity";

interface Props {
  isMobile: boolean;
}

const stats = {
  totalProjects: 23,
  completedProjects: 18,
  totalComponents: 127,
  timeSpent: 156,
  streakDays: 12,
  achievements: 8,
};

const AccountPageContent: React.FC<Props> = ({ isMobile }) => {
  const [active, setActive] = useState("profile");

  const userProfile = {
    name: "Owen Erhabor",
    email: "owen.erhabor@example.com",
    bio: "Passionate about web development, software dev & engineering, abit in Gaming and Embedded Systems. Always eager to learn and share knowledge, especially in the areas of React and TypeScript.",
    location: "London, UK",
    website: "https://portfolio.owenlibrary.com",
    github: "owen-6936",
    joinDate: "2025-01-15",
    phone: "+44 7438782177",
    company: "Nexicore Digital",
    jobTitle: "Full Stack Developer",
  };

  const sections = [
    {
      key: "profile",
      title: "Profile",
      panel: <Profile {...userProfile} />,
    },
    {
      key: "stats",
      title: "Statistics",
      panel: <Stats {...stats} />,
    },
    {
      key: "activity",
      title: "Activities",
      panel: <Activity />,
    },
    {
      key: "achievements",
      title: "Achievements",
      panel: <Achievements />,
    },
    {
      key: "preferences",
      title: "Preferences",
      panel: <Preferences />,
    },
    {
      key: "security",
      title: "Security",
      panel: <Security />,
    },
    {
      key: "data",
      title: "Data & Privacy",
      panel: <DataAndPrivacy />,
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
