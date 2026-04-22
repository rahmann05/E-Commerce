"use client";

import { motion } from "framer-motion";

interface PillButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  delay?: number;
}

export default function PillButton({ label, active = false, onClick, delay = 0 }: PillButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`pill-btn ${active ? "active" : ""}`}
    >
      {label}
    </motion.button>
  );
}
