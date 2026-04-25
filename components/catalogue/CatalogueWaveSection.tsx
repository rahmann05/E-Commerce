"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./CatalogueWaveSection.module.css";

const RANDOM_POOL = [
  "#7a7a7a", // Vintage Grey
  "#333333", // Charcoal
  "#2b4c7e", // Blue
  "#1a1a1a", // Washed Black
  "#5b84b1", // Light Wash
];

const WHITE = "#e8e8e8"; // White

export default function CatalogueWaveSection() {
  const [blobColors, setBlobColors] = useState([WHITE, WHITE, "#7a7a7a", "#333333"]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...RANDOM_POOL].sort(() => 0.5 - Math.random());
      // 2 White + 2 Random
      setBlobColors([WHITE, WHITE, shuffled[0], shuffled[1]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`catalogue-wave-section ${styles.catalogueWaveSection}`}>
      <div className={`wave-image-container ${styles.catalogueWaveImageContainer}`}>
        
        {/* Animated Wave Logic Embedded (Exact Replica of AnimatedWave.tsx logic) */}
        <div className={styles.catalogueWaveBackdrop}>
          <div className={styles.catalogueWaveInner}>
            {/* Blob 1 - White 1 */}
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
                background: blobColors[0],
                transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                mixBlendMode: "screen",
                opacity: 0.8,
              }}
            />

            {/* Blob 2 - White 2 */}
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
                background: blobColors[1],
                transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                mixBlendMode: "screen",
                opacity: 0.7,
              }}
            />

            {/* Blob 3 - Random 1 */}
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
                background: blobColors[2],
                transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                mixBlendMode: "multiply",
                opacity: 0.6,
              }}
            />

            {/* Blob 4 - Random 2 */}
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
                background: blobColors[3],
                transition: "background 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                opacity: 0.7,
              }}
            />
          </div>

          {/* Shimmer Overlay */}
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

          {/* Noise Overlay */}
          <div className={styles.catalogueWaveNoise} />
        </div>

        {/* Immersion: Giant Background Text */}
        <div className={styles.catalogueWaveTextLayer}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.07, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "25vw",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            ESSENTIALS
          </motion.h1>
        </div>

        {/* Content Overlay */}
        <div className={styles.catalogueWaveContent}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "1.2rem",
            }}
          >
            Featured Drop
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#fff",
              lineHeight: 1,
              marginBottom: "1.5rem",
            }}
          >
            The Essentials Edit
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "500px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Curated pieces that anchor every wardrobe — built for the everyday, designed to last.
          </motion.p>

          <motion.button
            className={styles.catalogueWaveButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document.getElementById("catalogue-grid")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Shop Now
            <span className={styles.catalogueWaveArrowCircle}>
              <ArrowUpRight size={14} color="#111" />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
