import { Download, Trash2 } from "lucide-react";

export default function DataAndPrivacy() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Data & Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Management Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
          <div className="space-y-4">
            <button
              onClick={() => console.log("Exporting data...")}
              aria-label="Export all of my data"
              className="w-full bg-blue-500/20 text-blue-200 p-3 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </button>
            <button
              onClick={() => console.log("Confirm delete account...")}
              aria-label="Permanently delete my account"
              className="w-full bg-red-500/20 text-red-200 p-3 rounded-lg hover:bg-red-500/30 transition-all flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">
            Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">Allow Usage Data</p>
              <label className="switch">
                <input
                  type="checkbox"
                  aria-label="Toggle usage data collection"
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">
                Receive Promotional Emails
              </p>
              <label className="switch">
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label="Toggle promotional emails"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
