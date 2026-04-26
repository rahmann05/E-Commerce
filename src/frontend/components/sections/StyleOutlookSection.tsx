"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import SectionLabel from "../ui/SectionLabel";
import PillButton from "../ui/PillButton";
import VideoCard from "../ui/VideoCard";
import { STYLE_VIDEOS } from "../data/videos";
import { STYLE_PILLS } from "../data/navigation";

export default function StyleOutlookSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activePill, setActivePill] = useState("Active");

  // Setup parallax scroll values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Left column moves slightly faster/differently than right column
  const leftColumnY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rightColumnY = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  return (
    <section
      ref={containerRef}
      className="style-outlook-section"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        padding: "8vw 3rem 5vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4vw" }}>
        <div style={{ flex: 1 }}>
          <SectionLabel number="04" color="rgba(255,255,255,0.8)" />
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
          <VideoCard src={STYLE_VIDEOS[0].url} className="large-card" />
          <p className="bento-category">{STYLE_VIDEOS[0].category}</p>
        </motion.div>

        {/* Right Column (Stacked) */}
        <motion.div className="bento-col-right" style={{ y: rightColumnY }}>
          <div className="bento-item">
            <VideoCard src={STYLE_VIDEOS[1].url} className="small-card" />
            <p className="bento-category right-align">{STYLE_VIDEOS[1].category}</p>
          </div>

          <div className="bento-item">
            <VideoCard src={STYLE_VIDEOS[2].url} className="small-card" />
            <p className="bento-category right-align">{STYLE_VIDEOS[2].category}</p>
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
        {STYLE_PILLS.map((pill) => (
          <PillButton
            key={pill}
            label={pill}
            active={activePill === pill}
            onClick={() => setActivePill(pill)}
          />
        ))}
      </motion.div>
    </section>
  );
}
