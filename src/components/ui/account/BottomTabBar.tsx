import { Settings } from "lucide-react";
import type { Dispatch, RefObject } from "react";

export default function BottomTabBar({
    setActiveSection,
    onSettingsClick,
    accountTabsRefs,
}: {
    setActiveSection: Dispatch<React.SetStateAction<string>>;
    onSettingsClick: () => void;
    accountTabsRefs: RefObject<HTMLDetailsElement | null>[];
}) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm flex justify-around py-3 z-50 border-t border-gray-700">
            {["profile", "stats", "achievements"].map((key, index) => (
                <button
                    key={key}
                    className="text-blue-200 text-sm cursor-pointer px-4 py-1 rounded"
                    onClick={() => {
                        // Handle navigation to the selected tab
                        setActiveSection(key);
                        // Scroll to the corresponding section if the ref exists
                        const ref = accountTabsRefs[index];
                        setTimeout(() => {
                            if (ref && ref.current) {
                                const offset = ref.current.offsetTop - 100;
                                window.scrollTo({
                                    top: offset,
                                    behavior: "smooth",
                                });
                            }
                        }, 100);
                    }}
                >
                    {/* Replace with actual icons & labels */}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
            ))}
            <button
                onClick={onSettingsClick}
                className="text-blue-200 text-sm flex items-center space-x-1 cursor-pointer"
            >
                <Settings className="w-5 h-5" />
                <span>More</span>
            </button>
        </nav>
    );
}
