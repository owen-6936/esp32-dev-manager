import { Download, Fingerprint, Trash2 } from "lucide-react";
import Card from "../../Card";

export default function DataAndPrivacy() {
    return (
        <Card bg="transparent" padding="p-2" className="space-y-6">
            <Card.Header
                title="Data & Privacy"
                icon={<Fingerprint className="w-5 h-5" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Management Section */}
                <Card>
                    <Card.Header title="Data Management" />
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
                            onClick={() =>
                                console.log("Confirm delete account...")
                            }
                            aria-label="Permanently delete my account"
                            className="w-full bg-red-500/20 text-red-200 p-3 rounded-lg hover:bg-red-500/30 transition-all flex items-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete My Account</span>
                        </button>
                    </div>
                </Card>

                {/* Privacy Settings Section */}
                <Card>
                    <Card.Header title="Privacy Settings" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-white font-medium">
                                Allow Usage Data
                            </p>
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
                </Card>
            </div>
        </Card>
    );
}
