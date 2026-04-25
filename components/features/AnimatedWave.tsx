"use client";

import { motion } from "framer-motion";
import { useColorTheme } from "../providers/ColorContext";
import { useMemo } from "react";
import styles from "./AnimatedWave.module.css";

export default function AnimatedWave() {
  const { activeTheme } = useColorTheme();

  // Create smooth fluid gradient blobs
  const colors = useMemo(() => {
    return [
      activeTheme.primary,
      activeTheme.secondary,
      activeTheme.tertiary,
      activeTheme.accent || activeTheme.primary,
      activeTheme.secondary,
    ];
  }, [activeTheme]);

  return (
    <motion.div
      className={styles.animatedWaveContainer}
      animate={{ backgroundColor: activeTheme.tertiary }}
      transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.animatedWaveInner}>
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: ["0%", "25%", "-15%", "0%"],
            y: ["0%", "-35%", "25%", "0%"],
            scale: [1, 1.25, 0.85, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: colors[0],
            transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            mixBlendMode: "screen",
            opacity: 0.8,
          }}
        />

        {/* Blob 2 */}
        <motion.div
          animate={{
            x: ["0%", "-30%", "20%", "0%"],
            y: ["0%", "30%", "-20%", "0%"],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            top: "15%",
            right: "5%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: colors[1],
            transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            mixBlendMode: "screen",
            opacity: 0.7,
          }}
        />

        {/* Blob 3 */}
        <motion.div
          animate={{
            x: ["0%", "35%", "-25%", "0%"],
            y: ["0%", "-15%", "35%", "0%"],
            scale: [1, 1.4, 0.75, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "5%",
            left: "15%",
            width: "75%",
            height: "75%",
            borderRadius: "50%",
            background: colors[2],
            transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            mixBlendMode: "multiply",
            opacity: 0.6,
          }}
        />

        {/* Blob 4 */}
        <motion.div
          animate={{
            x: ["0%", "-20%", "30%", "0%"],
            y: ["0%", "40%", "-15%", "0%"],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            position: "absolute",
            bottom: "15%",
            right: "15%",
            width: "55%",
            height: "55%",
            borderRadius: "45%",
            background: colors[3],
            transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Dynamic scanline/shimmer overlay */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
            "linear-gradient(to bottom, transparent 100%, rgba(255,255,255,0.03) 150%, transparent 200%)"
          ],
          y: ["-100%", "100%"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Subtle grain/noise overlay */}
      <div className={styles.waveGrain} />
    </motion.div>
  );
}
