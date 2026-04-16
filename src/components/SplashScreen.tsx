import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
    fetchKits,
    fetchProjects,
} from "../services/tutorialService";

// ── Loading steps ─────────────────────────────────────────────────────────────
const STEPS = [
    { label: "Establishing session…", color: "#38bdf8" },
    { label: "Loading kit data…", color: "#818cf8" },
    { label: "Loading tutorials…", color: "#34d399" },
    { label: "All systems Ready!", color: "#f59e0b" },
] as const;

// Number of pins to animate on each side of the chip (visual only)
const PINS_PER_SIDE = 9;
const TOTAL_PINS = PINS_PER_SIDE * 4; // top + right + bottom + left

// ── Chip pin positions (SVG, 200×120 chip body at 100,80) ────────────────────
function buildPinPositions() {
    const pins: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const cx = 100;
    const cy = 80;
    const hw = 80; // half-width
    const hh = 50; // half-height
    const pinLen = 14;
    const gap = (hw * 2 - 10) / (PINS_PER_SIDE - 1);

    // Top
    for (let i = 0; i < PINS_PER_SIDE; i++) {
        const x = cx - hw + 5 + i * gap;
        pins.push({ x1: x, y1: cy - hh, x2: x, y2: cy - hh - pinLen });
    }
    // Right
    const rgap = (hh * 2 - 10) / (PINS_PER_SIDE - 1);
    for (let i = 0; i < PINS_PER_SIDE; i++) {
        const y = cy - hh + 5 + i * rgap;
        pins.push({ x1: cx + hw, y1: y, x2: cx + hw + pinLen, y2: y });
    }
    // Bottom (right-to-left)
    for (let i = PINS_PER_SIDE - 1; i >= 0; i--) {
        const x = cx - hw + 5 + i * gap;
        pins.push({ x1: x, y1: cy + hh, x2: x, y2: cy + hh + pinLen });
    }
    // Left (bottom-to-top)
    for (let i = PINS_PER_SIDE - 1; i >= 0; i--) {
        const y = cy - hh + 5 + i * rgap;
        pins.push({ x1: cx - hw, y1: y, x2: cx - hw - pinLen, y2: y });
    }
    return pins;
}

const PIN_POSITIONS = buildPinPositions();

// ── Component ─────────────────────────────────────────────────────────────────
interface SplashScreenProps {
    onReady: () => void;
}

export default function SplashScreen({ onReady }: SplashScreenProps) {
    const { loading: authLoading } = useAuth();
    const [authDone, setAuthDone] = useState(false);
    const [kitsDone, setKitsDone] = useState(false);
    const [tutsDone, setTutsDone] = useState(false);
    const [activePins, setActivePins] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);

    // Resolve auth
    useEffect(() => {
        if (!authLoading) setAuthDone(true);
    }, [authLoading]);

    // Prefetch data (caches results so later hook calls are instant)
    useEffect(() => {
        fetchKits()
            .then(() => setKitsDone(true))
            .catch(() => setKitsDone(true));
        fetchProjects()
            .then(() => setTutsDone(true))
            .catch(() => setTutsDone(true));
    }, []);

    // Guard: dismiss after 8 s maximum to avoid blocking the app
    useEffect(() => {
        const t = setTimeout(onReady, 8000);
        return () => clearTimeout(t);
    }, [onReady]);

    // Advance steps
    useEffect(() => {
        if (authDone && stepIndex === 0) setStepIndex(1);
    }, [authDone, stepIndex]);

    useEffect(() => {
        if (kitsDone && stepIndex === 1) setStepIndex(2);
    }, [kitsDone, stepIndex]);

    useEffect(() => {
        if (tutsDone && stepIndex === 2) {
            setStepIndex(3);
            const t = setTimeout(onReady, 900);
            return () => clearTimeout(t);
        }
    }, [tutsDone, stepIndex, onReady]);

    // Animate pins in sync with progress
    useEffect(() => {
        const target = Math.round((stepIndex / 3) * TOTAL_PINS);
        if (activePins >= target) return;
        const t = setInterval(() => {
            setActivePins((n) => {
                if (n >= target) {
                    clearInterval(t);
                    return n;
                }
                return n + 1;
            });
        }, 28);
        return () => clearInterval(t);
    }, [stepIndex, activePins]);

    const progress = stepIndex / 3; // 0 → 1

    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 select-none">
            {/* Ambient orbs */}
            <div
                className="pointer-events-none absolute -top-40 -left-40 h-120 w-120 rounded-full opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -bottom-32 -right-32 h-100 w-100 rounded-full opacity-15 blur-3xl"
                style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
                aria-hidden="true"
            />

            {/* ESP32 chip SVG */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
            >
                <svg
                    viewBox="0 0 200 160"
                    width={220}
                    height={176}
                    aria-label="ESP32 chip loading animation"
                >
                    {/* Pulse glow behind chip */}
                    <motion.ellipse
                        cx={100}
                        cy={80}
                        rx={72}
                        ry={44}
                        fill="none"
                        stroke={stepIndex >= 3 ? "#f59e0b" : "#38bdf8"}
                        strokeWidth={1.5}
                        opacity={0.3}
                        animate={{ rx: [72, 85, 72], ry: [44, 54, 44], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Chip body */}
                    <rect
                        x={20}
                        y={30}
                        width={160}
                        height={100}
                        rx={8}
                        ry={8}
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth={1.5}
                    />
                    {/* Inner chip detail lines */}
                    <rect x={34} y={44} width={132} height={72} rx={4} fill="#0f172a" stroke="#1d4ed8" strokeWidth={0.8} strokeDasharray="3 2" />
                    <rect x={44} y={54} width={112} height={52} rx={3} fill="#0a0f1e" />

                    {/* Chip label */}
                    <text x={100} y={77} textAnchor="middle" fill="#38bdf8" fontSize={10} fontFamily="monospace" fontWeight="bold">
                        ESP32-S3
                    </text>
                    <text x={100} y={91} textAnchor="middle" fill="#64748b" fontSize={7} fontFamily="monospace">
                        WROOM-1
                    </text>
                    {/* Notch (pin-1 indicator) */}
                    <circle cx={28} cy={38} r={4} fill="#0f172a" stroke="#334155" strokeWidth={1} />

                    {/* Pins — light up sequentially */}
                    {PIN_POSITIONS.map((p, i) => {
                        const active = i < activePins;
                        const color = active
                            ? stepIndex >= 3
                                ? "#f59e0b"
                                : stepIndex >= 2
                                    ? "#34d399"
                                    : stepIndex >= 1
                                        ? "#818cf8"
                                        : "#38bdf8"
                            : "#1e3a5f";
                        return (
                            <motion.line
                                key={i}
                                x1={p.x1}
                                y1={p.y1}
                                x2={p.x2}
                                y2={p.y2}
                                stroke={color}
                                strokeWidth={active ? 2 : 1.4}
                                strokeLinecap="round"
                                animate={active ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                                transition={
                                    active
                                        ? { duration: 1.4, repeat: Infinity, delay: (i % 6) * 0.15 }
                                        : {}
                                }
                            />
                        );
                    })}
                </svg>
            </motion.div>

            {/* App name */}
            <motion.h1
                className="mb-2 text-2xl font-bold tracking-tight text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                ESP32 Dev{" "}
                <span
                    style={{
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)",
                    }}
                >
                    Manager
                </span>
            </motion.h1>

            {/* Step label */}
            <div className="mb-6 h-6">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={stepIndex}
                        className="text-sm font-medium"
                        style={{ color: STEPS[stepIndex]?.color ?? "#94a3b8" }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        {STEPS[stepIndex]?.label}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-56 overflow-hidden rounded-full bg-slate-800/60 h-1.5">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: "linear-gradient(to right, #38bdf8, #818cf8)",
                    }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Dots loader */}
            {stepIndex < 3 && (
                <div className="mt-4 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-slate-500"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.18,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
