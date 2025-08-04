import { Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="cpu-container">
        <Cpu className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 text-white">
        <h2 className="text-2xl font-bold">ESP32 S3 Journey</h2>
        <p className="text-blue-200 text-sm">
          Complete embedded systems development tracker
        </p>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Link</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </nav>
  );
}
