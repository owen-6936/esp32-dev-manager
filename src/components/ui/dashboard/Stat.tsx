import { motion } from "framer-motion";
import type { StatProps } from "../../../types/ui/stat";

export default function Stat(statProps: StatProps, cardVariants: any) {
  return (
    <motion.div
      key={statProps.index}
      className="bg-white/10 rounded-xl p-8 border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer w-[90%] sm:w-[45%]"
      variants={cardVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      initial="hidden"
      transition={{ duration: 0.5, delay: statProps.index * 0.1 }}
      custom={statProps.index}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-200">{statProps.title}</p>
          <p className={`text-3xl font-bold ${statProps.valueColor}`}>
            {statProps.value}
          </p>
          <p
            className={`text-xs flex items-center mt-1 ${statProps.subtitleColor}`}
          >
            {statProps.subtitleIcon}
            {statProps.subtitle}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${statProps.iconBg}`}>
          {statProps.icon}
        </div>
      </div>
    </motion.div>
  );
}
