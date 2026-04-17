import { type Dispatch, type RefObject, useMemo } from "react";
import { LogOut } from "lucide-react";
import { getAccountTabs } from "../../../constants/account";
import { useAuth } from "../../../contexts/AuthContext";
import useProjectStore from "../../../store/project";

export default function AccountContent({
    isMobile,
    activeSection,
    setActiveSection,
    accountTabsRefs,
}: {
    isMobile: boolean;
    activeSection: string;
    setActiveSection: Dispatch<React.SetStateAction<string>>;
    accountTabsRefs: RefObject<HTMLDetailsElement | null>[];
}) {
    const { user, profile, signOut } = useAuth();
    const projects = useProjectStore((s) => s.projects);

    const accountTabs = useMemo(
        () =>
            getAccountTabs(
                {
                    name: profile?.display_name ?? user?.user_metadata?.full_name ?? "",
                    jobTitle: profile?.job_title ?? "",
                    company: profile?.company ?? "",
                    bio: profile?.bio ?? "",
                    email: user?.email ?? "",
                    phone: profile?.phone ?? "",
                    location: profile?.location ?? "",
                    website: profile?.website ?? "",
                    github: profile?.github_username ?? "",
                    joinDate: user?.created_at ?? "",
                },
                {
                    totalProjects: projects.length,
                    completedProjects: projects.filter((p) => p.status === "completed").length,
                    timeSpent: 0,
                    streakDays: 0,
                    achievements: 0,
                },
            ),
        [user, profile, projects],
    );

    return (
        <div
            className={isMobile ? "" : "grid grid-cols-1 lg:grid-cols-4 gap-8"}
        >
            {/* Sidebar (desktop only) */}
            {!isMobile && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 sticky top-6">
                    {accountTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveSection(tab.key)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === tab.key
                                ? "bg-blue-500 text-white shadow-lg"
                                : "text-blue-200 hover:bg-white/10"
                                }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                    <hr className="border-white/10 my-2" />
                    <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {accountTabs.map((tab, index) => (
                    <section key={tab.key}>
                        {isMobile ? (
                            <details
                                open={activeSection === tab.key}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                                ref={accountTabsRefs[index]}
                            >
                                <summary className="text-xl font-bold text-white mb-2">
                                    {tab.title}
                                </summary>
                                {tab.panel}
                            </details>
                        ) : (
                            activeSection === tab.key && (
                                <div className="space-y-6">{tab.panel}</div>
                            )
                        )}
                    </section>
                ))}
                {/* Mobile sign-out */}
                {isMobile && (
                    <button
                        onClick={() => signOut()}
                        className="w-full mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                )}
            </div>
        </div>
    );
}
