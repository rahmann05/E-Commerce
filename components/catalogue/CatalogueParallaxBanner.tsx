"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlowOrb from "@/components/ui/GlowOrb";

export default function CatalogueParallaxBanner() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawBgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const rawTextY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const bgY = useSpring(rawBgY, { stiffness: 50, damping: 18 });
  const textY = useSpring(rawTextY, { stiffness: 50, damping: 18 });

  return (
    <div ref={ref} className="catalogue-banner">
      {/* Parallax abstract background */}
      <motion.div
        style={{
          y: bgY,
          position: "absolute",
          inset: "-20%",
          backgroundImage: "url(/images/abstract-wave.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          filter: "saturate(0) brightness(2)",
        }}
      />

      {/* Glow orbs */}
      <GlowOrb color="rgba(155,81,224,0.2)" size={300} top="10%" left="5%"  duration={10} blur={80} />
      <GlowOrb color="rgba(255,140,0,0.15)"  size={350} bottom="5%" right="5%" duration={14} delay={2} blur={90} />

      {/* Animated dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,10,0.85), rgba(10,10,10,0.6))",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <motion.div className="catalogue-banner-content" style={{ y: textY, zIndex: 5 }}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "1.2rem",
            display: "block",
          }}
        >
          Featured Drop
        </motion.span>

        <motion.h2
          className="catalogue-banner-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          The Essentials Edit
        </motion.h2>

        <motion.p
          className="catalogue-banner-sub"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Curated pieces that anchor every wardrobe — built for the everyday, designed to last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ marginTop: "2rem" }}
        >
          <Link
            href="#catalogue-grid"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.8rem",
              padding: "0.75rem 2rem",
              borderRadius: "3rem",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            Shop Now
            <span style={{ display: "flex" }}>
              <ArrowUpRight size={15} />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
