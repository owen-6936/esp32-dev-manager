import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ChevronRight } from "lucide-react";

const TIPS: { text: string; tag: string }[] = [
    { text: "Use deep sleep to cut ESP32-S3 power draw from ~240 mA to under 20 µA — extend battery life by 100×.", tag: "Power" },
    { text: "debounce() your button interrupts with a 50 ms check — skip hardware capacitors for quick prototypes.", tag: "GPIO" },
    { text: "WS2812B LEDs are 5 V but tolerate 3.3 V data lines from ESP32-S3 without a level shifter in most cases.", tag: "LEDs" },
    { text: "Set `CONFIG_ESP32S3_DEFAULT_CPU_FREQ_MHZ` to 80 instead of 240 when Wi-Fi is idle to save power.", tag: "Power" },
    { text: "Use `psramInit()` then `ps_malloc()` for large buffers — the S3 has up to 8 MB PSRAM.", tag: "Memory" },
    { text: "The I2S peripheral on ESP32-S3 can drive WS2812 LEDs with zero CPU overhead using DMA.", tag: "DMA" },
    { text: "Prefer HTTPS for all API calls — `WiFiClientSecure` with `client.setInsecure()` is OK for dev but add a root CA in production.", tag: "Security" },
    { text: "Use `millis()` instead of `delay()` to keep your loop non-blocking and responsive.", tag: "Timing" },
    { text: "The ESP32-S3's USB OTG port can act as a HID device — build a custom USB game-pad without extra ICs.", tag: "USB" },
    { text: "Store Wi-Fi credentials in NVS, not hardcoded strings — use `Preferences` library for key-value storage.", tag: "Security" },
    { text: "Sketch_04.1 BreathingLight uses `analogWrite` PWM — try varying the `analogWriteFrequency` for different LED feels.", tag: "Tutorial" },
    { text: "The `esp_task_wdt` watchdog timer will reset your device if a task hangs — call `esp_task_wdt_reset()` in long loops.", tag: "Stability" },
];

const STORAGE_KEY = "esp32-daily-tip";

function getTodayIndex(): number {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored) as { date: string; index: number };
            if (parsed.date === today) return parsed.index;
        } catch {
            /* ignore */
        }
    }
    const index = Math.floor(Math.random() * TIPS.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, index }));
    return index;
}

export default function DailyTip() {
    const [visible, setVisible] = useState(false);
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const idx = getTodayIndex();
        setTipIndex(idx);
        // Only show if not dismissed today
        const dismissed = localStorage.getItem(`${STORAGE_KEY}-dismissed`);
        if (dismissed !== new Date().toISOString().slice(0, 10)) {
            setVisible(true);
        }
    }, []);

    function dismiss() {
        setVisible(false);
        localStorage.setItem(
            `${STORAGE_KEY}-dismissed`,
            new Date().toISOString().slice(0, 10),
        );
    }

    function nextTip() {
        const next = (tipIndex + 1) % TIPS.length;
        setTipIndex(next);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: new Date().toISOString().slice(0, 10), index: next }),
        );
    }

    const tip = TIPS[tipIndex];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="daily-tip"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                >
                    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-amber-400 text-xs font-semibold uppercase tracking-wide">
                                    Daily Tip
                                </span>
                                <span className="text-amber-300/50 text-xs bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                                    {tip.tag}
                                </span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">{tip.text}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={nextTip}
                                title="Next tip"
                                className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={dismiss}
                                title="Dismiss"
                                className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
