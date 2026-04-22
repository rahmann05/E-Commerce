"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// High-quality native MP4 stock videos from Mixkit (Trusted provider)
const VIDEOS = [
  { url: "https://assets.mixkit.co/videos/preview/mixkit-urban-fashion-video-of-a-man-with-a-red-cap-34138-large.mp4", category: "SOFTWEAR" }, // Left large
  { url: "https://assets.mixkit.co/videos/preview/mixkit-shoes-of-a-skateboarder-doing-tricks-41686-large.mp4", category: "SKENA CORE" }, // Right top
  { url: "https://assets.mixkit.co/videos/preview/mixkit-man-training-on-the-stairs-of-a-stadium-14282-large.mp4", category: "ACTIVEWEAR" }  // Right bottom
];

export default function StyleOutlookSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activePill, setActivePill] = useState("Active");

  // Setup parallax scroll values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Left column moves slightly faster/differently than right column
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  const pills = ["Classic", "Everyday", "Soft", "Foundation", "Active", "Essential"];

  return (
    <section 
      ref={containerRef} 
      className="style-outlook-section"
      style={{ backgroundColor: "#0a0a0a", color: "#ffffff", padding: "8vw 3rem 5vw", position: "relative", overflow: "hidden" }}
    >
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4vw" }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 500, opacity: 0.8 }}>/04</span>
        </div>
        
        <div style={{ flex: 2, textAlign: "center" }}>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            Style Outlook
          </motion.h2>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ maxWidth: "250px", fontSize: "0.95rem", lineHeight: 1.5, opacity: 0.8, textAlign: "right" }}
          >
            Make simplicity your boldest statement, experience crafted essentials with a excellent purpose.
          </motion.p>
        </div>
      </div>

      {/* Parallax Bento Grid */}
      <div className="bento-grid-container">
        
        {/* Left Column (Large) */}
        <motion.div className="bento-col-left" style={{ y: leftColumnY }}>
          <div className="bento-card large-card">
            <video 
              src={VIDEOS[0].url}
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />
          </div>
          <p className="bento-category">{VIDEOS[0].category}</p>
        </motion.div>

        {/* Right Column (Stacked) */}
        <motion.div className="bento-col-right" style={{ y: rightColumnY }}>
          
          <div className="bento-item">
            <div className="bento-card small-card">
              <video 
                src={VIDEOS[1].url}
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />
            </div>
            <p className="bento-category right-align">{VIDEOS[1].category}</p>
          </div>

          <div className="bento-item">
            <div className="bento-card small-card">
              <video 
                src={VIDEOS[2].url}
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />
            </div>
            <p className="bento-category right-align">{VIDEOS[2].category}</p>
          </div>

        </motion.div>
      </div>

      {/* Navigation Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pill-nav-container"
      >
        {pills.map((pill) => (
          <button
            key={pill}
            onClick={() => setActivePill(pill)}
            className={`pill-btn ${activePill === pill ? 'active' : ''}`}
          >
            {pill}
          </button>
        ))}
      </motion.div>

    </section>
  );
}
