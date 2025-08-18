import { Key, Lock, Shield, X } from "lucide-react";
import { useState } from "react";
import Card from "../../Card";
import ChangePassword from "../Modals/ChangePassword";

export default function Security() {
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  return (
    <Card className="space-y-6" bg="transparent" padding="p-2">
      <Card.Header
        title="Security"
        icon={<Lock className="w-5 h-5 text-yellow-500" />}
      />
      {showChangePassword && (
        <ChangePassword setShowChangePassword={setShowChangePassword} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header title="Password & Authentication" />
          <div className="space-y-4">
            <button
              onClick={() => setShowChangePassword(true)}
              aria-label="Change your password"
              className="w-full bg-blue-500/20 text-blue-200 p-3 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <button
              aria-label="Enable Two-Factor Authentication"
              className="w-full bg-green-500/20 text-green-200 p-3 rounded-lg hover:bg-green-500/30 transition-all flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Enable 2FA</span>
            </button>
          </div>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <Card.Header title="Active Sessions" />
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Current Session</p>
                <p className="text-blue-200 text-sm">Chrome on macOS</p>
              </div>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Mobile App</p>
                <p className="text-blue-200 text-sm">iPhone • 2 days ago</p>
              </div>
              <button
                aria-label="Log out mobile app session"
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
