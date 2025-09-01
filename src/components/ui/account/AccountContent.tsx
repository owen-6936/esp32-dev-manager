import { type Dispatch, type RefObject } from "react";
import { accountTabs } from "../../../constants/account";

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
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                activeSection === tab.key
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "text-blue-200 hover:bg-white/10"
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
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
            </div>
        </div>
    );
}
