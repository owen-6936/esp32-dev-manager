import { motion } from "framer-motion";
import { features } from "../../../constants/ui/features";

export default function Features() {
  return (
    <motion.div
      className="bg-white/10 rounded-xl p-8 border border-white/20 sm:w-[73%] mt-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        ESP32 S3 Capabilities
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {item.icon}
            <div>
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-blue-200 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
