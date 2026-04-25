"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import GlowOrb from "@/components/ui/GlowOrb";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

export default function CatalogueHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useSpring(rawY, { stiffness: 80, damping: 20 });
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 20 });

  return (
    <div ref={containerRef} className="catalogue-hero">
      {/* Radial dot grid — same as hero section */}
      <div className="catalogue-hero-radial-grid" />

      {/* Ambient glow orbs */}
      <GlowOrb
        color="rgba(155,81,224,0.15)"
        size={350}
        top="20%"
        left="10%"
        duration={10}
        blur={60}
      />
      <GlowOrb
        color="rgba(255,140,0,0.1)"
        size={400}
        bottom="15%"
        right="8%"
        duration={13}
        delay={2}
        blur={70}
      />

      {/* Slow rotating ring accent */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.03)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ position: "absolute", top: "2.5rem", left: "2.5rem", zIndex: 20 }}
      >
        <Link
          href="/"
          style={{
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          ← Novure
        </Link>
      </motion.div>

      {/* Corner label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{
          position: "absolute",
          top: "2rem",
          right: "2.5rem",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          zIndex: 20,
        }}
      >
        {new Date().getFullYear()} Collection
      </motion.span>

      {/* Main title with parallax */}
      <motion.div
        style={{ y, opacity, position: "relative", zIndex: 10 }}
      >
        <motion.h1
          className="catalogue-hero-title"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Catalogue
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "1.5rem",
          }}
        >
          Essentialized daily wear — crafted for purpose
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
        style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
      >
        <ScrollIndicator delay={0} />
      </motion.div>
    </div>
  );
}
