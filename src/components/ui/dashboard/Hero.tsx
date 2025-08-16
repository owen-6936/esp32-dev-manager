import { motion } from "framer-motion";
import { Calculator, MapPin, Plus } from "lucide-react";
import Button from "../../Button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 p-8 mt-4">
      {/* --- Background Layers --- */}

      {/* Circuit Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="circuit"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20 20h40v40h-40z M0 40h20 M60 40h20 M40 0v20 M40 60v20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#circuit)"
            className="text-blue-400"
          />
        </svg>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700" />

      {/* ESP32 Chip Silhouette */}
      <div className="absolute right-6 bottom-6 opacity-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-32 h-32 text-blue-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="20" y="10" width="60" height="80" rx="6" />
          <rect x="35" y="25" width="30" height="50" rx="3" />
          <path d="M20 20h-8M20 40h-8M20 60h-8M20 80h-8M80 20h8M80 40h8M80 60h8M80 80h8" />
        </svg>
      </div>

      {/* --- Foreground Content --- */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative text-center pt-6"
      >
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 
               text-gradient animate-gradient drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        >
          Welcome to Your ESP32 S3 Adventure{" "}
          <span className="text-blue-300">🚀</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Complete project management, component tracking, learning analytics,
          and community features for your ESP32 S3 development journey.
        </p>
        <div className="flex justify-center flex-wrap gap-4 items-center">
          <Button variant="gradient" className="py-5 px-8">
            <Plus className="w-5 h-5" />
            <span>Start New Project</span>
          </Button>
          <Button variant="classic" className="py-5 px-8">
            <MapPin className="w-5 h-5" />
            <span>Pin Mapper</span>
          </Button>
          <Button variant="classic" className="py-5 px-8">
            <Calculator className="w-5 h-5" />
            <span>Power Calculator</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
