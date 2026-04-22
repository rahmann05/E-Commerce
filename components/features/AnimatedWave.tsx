"use client";

import { motion } from "framer-motion";
import { useColorTheme } from "../providers/ColorContext";
import { useMemo } from "react";

export default function AnimatedWave() {
  const { activeTheme } = useColorTheme();

  // Create smooth fluid gradient blobs
  // We use the theme colors to color the blobs
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
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: activeTheme.tertiary,
        transition: "background-color 2s ease",
      }}
    >
      {/* 
        Heavy blur filter on the container makes the moving circles 
        blend together perfectly like a fluid mesh gradient or silk 
      */}
      <div
        style={{
          position: "absolute",
          inset: "-20%", // Bleed to prevent hard edges after blur
          width: "140%",
          height: "140%",
          filter: "blur(90px) saturate(150%)",
          transform: "translateZ(0)", // Hardware acceleration
        }}
      >
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: ["0%", "20%", "-10%", "0%"],
            y: ["0%", "-30%", "20%", "0%"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: colors[0],
            transition: "background 2s ease",
            mixBlendMode: "screen",
          }}
        />

        {/* Blob 2 */}
        <motion.div
          animate={{
            x: ["0%", "-25%", "15%", "0%"],
            y: ["0%", "25%", "-15%", "0%"],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background: colors[1],
            transition: "background 2s ease",
            mixBlendMode: "screen",
          }}
        />

        {/* Blob 3 */}
        <motion.div
          animate={{
            x: ["0%", "30%", "-20%", "0%"],
            y: ["0%", "-10%", "30%", "0%"],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "20%",
            width: "65%",
            height: "65%",
            borderRadius: "50%",
            background: colors[2],
            transition: "background 2s ease",
            mixBlendMode: "multiply",
          }}
        />

        {/* Blob 4 */}
        <motion.div
          animate={{
            x: ["0%", "-15%", "25%", "0%"],
            y: ["0%", "35%", "-10%", "0%"],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: "50%",
            height: "50%",
            borderRadius: "40%",
            background: colors[3],
            transition: "background 2s ease",
          }}
        />

        {/* Extra flow blob */}
        <motion.div
          animate={{
            x: ["-10%", "20%", "-30%", "-10%"],
            y: ["-20%", "10%", "30%", "-20%"],
            rotate: [0, 90, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "30%",
            left: "30%",
            width: "40%",
            height: "80%",
            borderRadius: "50% 30% 60% 40%",
            background: colors[4],
            transition: "background 2s ease",
            mixBlendMode: "overlay",
            opacity: 0.8,
          }}
        />
      </div>

      {/* Subtle grain/noise overlay for fabric/texture feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
