import {
  Cpu,
  Activity,
  Code,
  ChartColumn,
  BookOpen,
  Package,
  FileText,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  type ActiveTabType =
    | "dashboard"
    | "project"
    | "analytics"
    | "learning"
    | "inventory"
    | "journal"
    | "account";

  const [activeTab, setActiveTab] = useState<ActiveTabType>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const toggleDrawer = () => {
    setTimeout(() => {
      if (!drawerOpen) {
        setDrawerOpen(true);
        setShowOverlay(true);
      } else {
        setDrawerOpen(false);
      }
    }, 150); // delay for smoother animation
  };
  const location = useLocation();

  useEffect(() => {
    const tab = (location.pathname.split("/")[1] ||
      "dashboard") as ActiveTabType;
    setActiveTab(tab);
    setDrawerOpen(false); // close drawer on route change
  }, [location]);

  useEffect(() => {
    if (!drawerOpen) setShowOverlay(false);
  }, [drawerOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setDrawerOpen(false); // close drawer on desktop
        setShowOverlay(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: Activity },
    { key: "project", label: "Projects", icon: Code },
    { key: "analytics", label: "Analytics", icon: ChartColumn },
    { key: "learning", label: "Learning", icon: BookOpen },
    { key: "inventory", label: "Inventory", icon: Package },
    { key: "journal", label: "Journal", icon: FileText },
    { key: "account", label: "Account", icon: User },
  ];

  return (
    <nav className="bg-gradient flex gap-3 items-center p-4 shadow-lg h-20 sticky top-0 z-50">
      {/* Logo */}
      <div className="bg-gradient-btn p-2 md:p-4 rounded-lg shadow-lg w-max">
        <Cpu className="w-6 h-6 text-white" />
      </div>

      {/* Heading */}
      <div className="flex-1 text-white">
        <h2 className="text-2xl font-bold whitespace-nowrap text-left">
          ESP32 S3 Journey
        </h2>
        <p className="text-blue-200 text-sm hidden sm:block text-left">
          Complete embedded systems development tracker
        </p>
      </div>

      {/* Desktop menu */}
      <div className="hidden sm:flex space-x-2">
        {menuItems.map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            to={`/${key === "dashboard" ? "" : key}`}
            onClick={() => setActiveTab(key as ActiveTabType)}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 whitespace-nowrap transition-all ${
              activeTab === key
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-200 hover:bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        ))}
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={() => toggleDrawer()}
        className="sm:hidden p-2.5 bg-indigo-500 text-white rounded-md shadow-lg cursor-pointer hover:bg-indigo-500/80 active:translate-y-[1px] active:scale-[0.98] transition-transform duration-75"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={"M4 6h16M4 12h16M4 18h16"}
          ></path>
        </svg>
      </button>

      {/* Mobile Drawer */}
      {toggleDrawer && (
        <div
          className={`fixed inset-0 z-50 sm:hidden transition-opacity duration-200 ${
            drawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => toggleDrawer()}
        >
          {/* Overlay */}
          <div
            onClick={toggleDrawer}
            className={`fixed inset-0 bg-black/40 transition-opacity duration-75 ${
              drawerOpen ? "opacity-100" : "opacity-0"
            } ${showOverlay ? "pointer-events-auto" : "pointer-events-none"}`}
          ></div>

          {/* Drawer Panel */}

          <div
            className={`fixed top-0 left-0 bg-gradient text-white w-[70%] h-full shadow-lg p-4 border-l border-white/20 transform transition-transform duration-[300ms] ${
              drawerOpen ? "translate-x-0" : "translate-x-[-100%]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => toggleDrawer()}
              className="scale-120 absolute top-6 right-6 text-white cursor-pointer active:translate-y-[1px] active:scale-[0.98] transition-transform duration-75"
            >
              ✕
            </button>

            {/* Logo */}
            <div className="bg-gradient-btn p-2 md:p-4 rounded-lg shadow-lg w-max m-2">
              <Cpu className="w-6 h-6 text-white" />
            </div>

            {/* Menu */}
            <div className="flex flex-col space-y-2 mt-8">
              {menuItems.map(({ key, label, icon: Icon }) => (
                <Link
                  key={key}
                  to={`/${key === "dashboard" ? "" : key}`}
                  onClick={() => setActiveTab(key as ActiveTabType)}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1 whitespace-nowrap transition-all duration-150 active:translate-y-[1px] active:scale-[0.98] ${
                    activeTab === key
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-blue-200 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="lg:inline">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
