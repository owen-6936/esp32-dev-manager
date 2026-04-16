import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthProvider } from "../contexts/AuthContext";
import AIChat from "../components/ui/AIChat";
import SplashScreen from "../components/SplashScreen";
import BuyMeCoffee from "../components/ui/BuyMeCoffee";
import FeedbackModal from "../components/ui/Modals/FeedbackModal";
import CookieBanner from "../components/CookieBanner";
import { useState, useEffect } from "react";
import { trackPageView } from "../services/analyticsService";

function AppContent() {
    const location = useLocation();
    const [splashDone, setSplashDone] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Track page views on every route change
    useEffect(() => {
        trackPageView(location.pathname);
    }, [location.pathname]);

    // Listen for AI tool "open_feedback" event
    useEffect(() => {
        const handler = () => setShowFeedback(true);
        window.addEventListener("open-feedback", handler);
        return () => window.removeEventListener("open-feedback", handler);
    }, []);

    return (
        <>
            <AnimatePresence>
                {!splashDone && (
                    <motion.div
                        key="splash"
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.45, ease: "easeIn" }}
                    >
                        <SplashScreen onReady={() => setSplashDone(true)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative min-h-screen bg-gradient overflow-hidden">
                {/* Ambient background orbs */}
                <div className="bg-orb-1" aria-hidden="true" />
                <div className="bg-orb-2" aria-hidden="true" />
                <div className="bg-orb-3" aria-hidden="true" />

                {/* Noise overlay */}
                <div className="noise-overlay" aria-hidden="true" />

                <div className="relative z-10">
                    <Navbar />
                    <main>
                        <ErrorBoundary resetKey={location.pathname}>
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
                        </ErrorBoundary>
                    </main>
                </div>
            </div>

            <AIChat />
            <BuyMeCoffee />
            <CookieBanner />

            {/* Feedback button — fixed bottom-left */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3, duration: 0.4 }}
                onClick={() => setShowFeedback(true)}
                title="Send feedback or report a bug"
                className="fixed bottom-6 left-5 z-40 px-3 py-2 rounded-full bg-white/8 border border-white/12 hover:bg-white/15 text-white/50 hover:text-white text-xs font-medium transition-all backdrop-blur-sm flex items-center gap-1.5"
            >
                <span className="text-sm leading-none">💬</span>
                Feedback
            </motion.button>

            <AnimatePresence>
                {showFeedback && (
                    <FeedbackModal onClose={() => setShowFeedback(false)} />
                )}
            </AnimatePresence>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
