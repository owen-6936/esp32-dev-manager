// src/layouts/RootLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <main>
        {/* The Outlet component renders the child route's component here */}
        <Outlet />
      </main>
    </div>
  );
}
