import { motion } from "framer-motion";
import { Code, FileText, Package } from "lucide-react";
import { useState } from "react";

export default function QuickActions(cardVariants: any) {
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  return (
    <motion.div
      className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] w-full hover:scale-105 transition-transform duration-300 mt-5"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={() => setShowAddJournal(true)}
          className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Add Journal Entry</span>
        </button>
        <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer">
          <Package className="w-4 h-4" />
          <span>Manage Inventory</span>
        </button>
        <button
          onClick={() => setShowCodeEditor(true)}
          className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Code className="w-4 h-4" />
          <span>Code Snippets</span>
        </button>
      </div>
    </motion.div>
  );
}
