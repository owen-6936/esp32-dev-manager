import { Cpu } from "lucide-react";
import navbarItems from "../constants/navbar";
import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "projects"
    | "analytics"
    | "learning"
    | "inventory"
    | "journal"
    | "community"
  >("dashboard");

  return (
    <nav className="navbar">
      <div className="cpu-container">
        <Cpu className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 text-white">
        <h2 className="text-2xl font-bold whitespace-nowrap">
          ESP32 S3 Journey
        </h2>
        <p className="text-blue-200 text-sm">
          Complete embedded systems development tracker
        </p>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {navbarItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`navbar-items ${
                activeTab === key ? "active" : "unactive"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </ul>
      </div>
    </nav>
  );
}
