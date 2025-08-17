import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <AnimatePresence mode="sync">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
