export default function SettingsSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

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
          {["Preferences", "Security", "Data & Privacy"].map((section) => (
            <button
              key={section}
              className="w-full text-left p-3 bg-slate-200 rounded"
            >
              {section}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
