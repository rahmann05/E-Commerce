"use client";

import { motion } from "framer-motion";

interface GlowOrbProps {
  color: string;
  size?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  duration?: number;
  delay?: number;
  blur?: number;
}

export default function GlowOrb({
  color,
  size = 300,
  top,
  bottom,
  left,
  right,
  duration = 8,
  delay = 0,
  blur = 50,
}: GlowOrbProps) {
  return (
    <motion.div
      animate={{
        x: [0, 20, -15, 0],
        y: [0, -25, 15, 0],
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
