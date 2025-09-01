import type { Dispatch, RefObject } from "react";

export default function SettingsSheet({
    isOpen,
    onClose,
    setActiveSection,
    accountTabsRefs,
}: {
    isOpen: boolean;
    onClose: () => void;
    setActiveSection: Dispatch<React.SetStateAction<string>>;
    accountTabsRefs: RefObject<HTMLDetailsElement | null>[];
}) {
    if (!isOpen) return null;
    const STARTING_INDEX = 3; // Index where "Preferences" starts
    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-end">
            <div className="bg-white/90 w-full max-h-3/4 rounded-t-lg p-4 overflow-y-auto touch-none">
                <div className="w-10 h-1.5 bg-gray-500 rounded mx-auto mb-4"></div>
                <button
                    className="text-blue-700 font-semibold text-lg mb-4"
                    onClick={onClose}
                >
                    Close
                </button>
                <nav className="space-y-4">
                    {["Preferences", "Security", "Data & Privacy"].map(
                        (section, index) => (
                            <button
                                key={section}
                                className="w-full text-left p-3 bg-slate-400 rounded-2xl cursor-pointer"
                                onClick={() => {
                                    const key = section
                                        .split(" ")[0]
                                        .toLowerCase();
                                    onClose();
                                    setTimeout(() => {
                                        // Set the active section
                                        setActiveSection(key);
                                        // Scroll to the corresponding section if the ref exists
                                        const ref =
                                            accountTabsRefs[
                                                index + STARTING_INDEX
                                            ];
                                        setTimeout(() => {
                                            if (ref && ref.current) {
                                                const offset =
                                                    ref.current.offsetTop - 100;
                                                window.scrollTo({
                                                    top: offset,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }, 100);
                                    }, 100);
                                }}
                            >
                                {section}
                            </button>
                        ),
                    )}
                </nav>
            </div>
        </div>
    );
}
