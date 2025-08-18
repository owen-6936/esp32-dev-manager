import { Settings } from "lucide-react";

export default function BottomTabBar({
  onSettingsClick,
}: {
  onSettingsClick: () => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm flex justify-around py-3 z-50 border-t border-gray-700">
      {["profile", "stats", "achievements"].map((key) => (
        <button key={key} className="text-blue-200 text-sm">
          {/* Replace with actual icons & labels */}
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
      <button
        onClick={onSettingsClick}
        className="text-blue-200 text-sm flex items-center space-x-1"
      >
        <Settings className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
}
