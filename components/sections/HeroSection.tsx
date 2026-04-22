"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import CursorTrail from "../features/CursorTrail";
import GlowOrb from "../ui/GlowOrb";
import ScrollIndicator from "../ui/ScrollIndicator";
import { HERO_CORNER_LABELS } from "../data/navigation";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax
  const rawYTitle = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yTitle = useSpring(rawYTitle, { stiffness: 80, damping: 20 });
  const opacityContent = useSpring(rawOpacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 5000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setLoadProgress(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setShowContent(true);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={containerRef} className="hero-section">
      {/* Subtle background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          zIndex: 1,
        }}
      />

      {/* Corner labels */}
      {HERO_CORNER_LABELS.map((label) => (
        <motion.span
          key={label.cls}
          className={`hero-corner-label ${label.cls}`}
          initial={{ opacity: 0, y: label.cls.includes("top") ? -15 : 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: label.delay }}
        >
          {label.text}
        </motion.span>
      ))}

      {/* Cursor-following clothing trail */}
      <CursorTrail containerRef={containerRef} />

      {/* Ambient glow orbs */}
      <GlowOrb color="rgba(155,81,224,0.12)" size={200} top="25%" left="15%" duration={8} blur={30} />
      <GlowOrb color="rgba(255,140,0,0.1)" size={250} bottom="20%" right="20%" duration={10} delay={2} blur={35} />

      {/* Center hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.3 : 0 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        move your cursor to explore
      </motion.p>

      {/* Main title with parallax */}
      <motion.div
        style={{
          y: yTitle,
          opacity: opacityContent,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
          position: "absolute",
          bottom: "18%",
          left: 0,
          right: 0,
        }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Novure
        </motion.h1>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}
        >
          <div className="hero-progress-bar">
            <motion.div className="hero-progress-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="hero-progress-text">{loadProgress}%</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.6 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
      >
        <ScrollIndicator delay={0} />
      </motion.div>
    </section>
  );
}
