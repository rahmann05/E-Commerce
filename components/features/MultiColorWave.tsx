"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const CLOTHING_COLORS = [
  "#e8e8e8", // White
  "#6b4423", // Earth Brown
  "#8da38a", // Sage
  "#7a7a7a", // Vintage Grey
  "#333333", // Charcoal
  "#2b4c7e", // Blue
  "#1a1a1a", // Washed Black
  "#5b84b1", // Light Wash
];

export default function MultiColorWave() {
  const [currentColors, setCurrentColors] = useState([CLOTHING_COLORS[0], CLOTHING_COLORS[2], CLOTHING_COLORS[5], CLOTHING_COLORS[7]]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...CLOTHING_COLORS].sort(() => 0.5 - Math.random());
      setCurrentColors(shuffled.slice(0, 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: currentColors[0],
        transition: "background-color 3s ease-in-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          width: "140%",
          height: "140%",
          filter: "blur(100px) saturate(150%)",
          transform: "translateZ(0)",
        }}
      >
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: ["0%", "20%", "-10%", "0%"],
            y: ["0%", "-30%", "20%", "0%"],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: currentColors[0],
            transition: "background 3s ease-in-out",
            mixBlendMode: "screen",
            opacity: 0.6,
          }}
        />

        {/* Blob 2 */}
        <motion.div
          animate={{
            x: ["0%", "-20%", "15%", "0%"],
            y: ["0%", "25%", "-15%", "0%"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background: currentColors[1],
            transition: "background 3s ease-in-out",
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        />

        {/* Blob 3 */}
        <motion.div
          animate={{
            x: ["0%", "30%", "-20%", "0%"],
            y: ["0%", "-10%", "30%", "0%"],
            scale: [1, 1.5, 0.7, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "20%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: currentColors[2],
            transition: "background 3s ease-in-out",
            mixBlendMode: "multiply",
            opacity: 0.4,
          }}
        />

        {/* Blob 4 */}
        <motion.div
          animate={{
            x: ["0%", "-15%", "25%", "0%"],
            y: ["0%", "35%", "-10%", "0%"],
            scale: [1, 0.9, 1.4, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            width: "45%",
            height: "45%",
            borderRadius: "50%",
            background: currentColors[3],
            transition: "background 3s ease-in-out",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Noise Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
