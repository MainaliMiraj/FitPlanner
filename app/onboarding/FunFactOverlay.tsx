"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FunFactOverlayProps {
  fact: string;
}

export default function FunFactOverlay({ fact }: FunFactOverlayProps) {
  return (
    <AnimatePresence>
      {fact && (
        <motion.div
          key={fact}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="
            absolute top-10 left-1/2 -translate-x-1/2
            bg-white/15 backdrop-blur-md text-white
            px-6 py-3 rounded-xl shadow-lg border border-white/20
            text-center text-lg md:text-xl font-medium max-w-lg
          "
        >
          💡 {fact}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
