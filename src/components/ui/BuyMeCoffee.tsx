/**
 * Buy Me a Coffee floating button
 * Unobtrusive heart/coffee icon that floats above the AI chat button.
 * Low-pressure — no modal, just a direct link.
 */
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

const BMC_URL = "https://buymeacoffee.com/nexicore";

export default function BuyMeCoffee() {
    return (
        <motion.a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Buy me a coffee ☕"
            aria-label="Support this project on Buy Me a Coffee"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg
                       bg-yellow-500/90 hover:bg-yellow-400 transition-colors text-slate-900 text-sm font-medium
                       border border-yellow-400/60 backdrop-blur-sm group"
        >
            <Coffee className="w-4 h-4 shrink-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs">
                Buy me a coffee
            </span>
        </motion.a>
    );
}
