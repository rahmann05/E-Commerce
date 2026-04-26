"use client";

import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  /** Light (white) or dark style */
  variant?: "light" | "dark";
  delay?: number;
}

export default function ScrollIndicator({ variant = "light", delay = 1.5 }: ScrollIndicatorProps) {
  const borderColor = variant === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  const dotColor = variant === "light" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 22,
          height: 34,
          borderRadius: 11,
          border: `1.5px solid ${borderColor}`,
          display: "flex",
          justifyContent: "center",
          paddingTop: 7,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 3,
            height: 7,
            borderRadius: 2,
            background: dotColor,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
