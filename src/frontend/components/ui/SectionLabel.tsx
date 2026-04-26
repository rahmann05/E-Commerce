"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  number: string;
  label?: string;
  color?: string;
}

export default function SectionLabel({ number, label, color = "rgba(255,255,255,0.4)" }: SectionLabelProps) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 0.5, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontSize: "0.8rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color,
        display: "block",
      }}
    >
      /{number}{label ? ` — ${label}` : ""}
    </motion.span>
  );
}
