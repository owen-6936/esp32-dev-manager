import { useRef, useState, type RefObject } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import SettingsSheet from "../ui/account/SettingsSheet";
import BottomTabBar from "../ui/account/BottomTabBar";
import AccountContent from "../ui/account/AccountContent";

export default function Account() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [activeSection, setActiveSection] = useState("profile");
    const [sheetOpen, setSheetOpen] = useState(false);
    const accountTabsRefs: RefObject<HTMLDetailsElement | null>[] = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {isMobile && (
                <>
                    <BottomTabBar
                        setActiveSection={setActiveSection}
                        onSettingsClick={() => setSheetOpen(true)}
                        accountTabsRefs={accountTabsRefs}
                    />
                    <SettingsSheet
                        isOpen={sheetOpen}
                        onClose={() => setSheetOpen(false)}
                        setActiveSection={setActiveSection}
                        accountTabsRefs={accountTabsRefs}
                    />
                </>
            )}
            <div
                className={`p-4 ${isMobile ? "pb-16" : "max-w-7xl mx-auto p-6"}`}
            >
                <AccountContent
                    isMobile={isMobile}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    accountTabsRefs={accountTabsRefs}
                />
            </div>
        </div>
    );
}
