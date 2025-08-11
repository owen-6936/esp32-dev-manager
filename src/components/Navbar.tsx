import { Cpu } from "lucide-react";
import navbarItems from "../constants/navbar";
import { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  type activeTabType =
    | ""
    | "project"
    | "analytics"
    | "learning"
    | "inventory"
    | "journal"
    | "account";
  const [activeTab, setActiveTab] = useState<activeTabType>("");

  useEffect(() => {
    const tab = location.pathname.split("/")[1] as activeTabType;
    setActiveTab(tab);
    console.log("Active tab set to:", tab);
  }, []);
  return (
    <nav className="navbar">
      <div className="cpu-container">
        <Cpu className="cpu-icon" />
      </div>
      <div className="heading-container">
        <h2 className="heading">ESP32 S3 Journey</h2>
        <p className="subheading">
          Complete embedded systems development tracker
        </p>
      </div>
      {/* Navbar items for larger screens */}
      <div className="flex-none hidden sm:block">
        <ul className="menu menu-horizontal px-1">
          {navbarItems.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              to={`/${key}`}
              onClick={() => setActiveTab(key as activeTabType)}
              className={`navbar-items ${
                activeTab === key ? "active" : "unactive"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </ul>
      </div>
      {/* Mobile drawer for smaller screens */}
      <div className="drawer sm:hidden relative h-10 z-50">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-primary drawer-button absolute right-0 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>{" "}
            </svg>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-gradient text-base-content min-h-full w-[70%] p-4 border-l border-white/20">
            <div className="cpu-container m-2">
              <Cpu className="cpu-icon" />
            </div>
            {/* Sidebar content here */}
            {navbarItems.map(({ key, label, icon: Icon }) => (
              <Link
                to={`/${key}`}
                key={key}
                onClick={() => setActiveTab(key as activeTabType)}
                className={`navbar-items ${
                  activeTab === key ? "active" : "unactive"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="lg:inline">{label}</span>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
