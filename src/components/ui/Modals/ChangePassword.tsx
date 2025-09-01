import type { Dispatch } from "react";
import Card from "../../Card";
import { X } from "lucide-react";

export default function ChangePassword({
    setShowChangePassword,
}: {
    setShowChangePassword: Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Card className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 relative">
            <Card.Header title="Password & Authentication" />
            <button
                onClick={() => setShowChangePassword(false)}
                aria-label="Close change password modal"
                className="absolute top-4 right-4 text-white hover:text-red-400"
            >
                <X className="w-5 h-5" />
            </button>
            <form
                className="space-y-4 mt-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: handle password change logic here
                    setShowChangePassword(false);
                }}
            >
                <div>
                    <label
                        className="block text-sm text-white mb-1"
                        htmlFor="current-password"
                    >
                        Current Password
                    </label>
                    <input
                        id="current-password"
                        type="password"
                        className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm text-white mb-1"
                        htmlFor="new-password"
                    >
                        New Password
                    </label>
                    <input
                        id="new-password"
                        type="password"
                        className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm text-white mb-1"
                        htmlFor="confirm-password"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        className="w-full p-2 rounded bg-white/20 text-white focus:outline-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500/80 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                    Change Password
                </button>
            </form>
        </Card>
    );
}
