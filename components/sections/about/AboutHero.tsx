"use client";

import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import ScrollIndicator from "../../ui/ScrollIndicator";
import GlowOrb from "../../ui/GlowOrb";

interface AboutHeroProps {
  scrollYProgress: MotionValue<number>;
}

export default function AboutHero({ scrollYProgress }: AboutHeroProps) {
  // Parallax effects
  const yTitle = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, -100]), { stiffness: 80, damping: 20 });
  const opacityContent = useSpring(useTransform(scrollYProgress, [0, 0.15], [1, 0]), { stiffness: 80, damping: 20 });
  const scaleTitle = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <section 
      style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
        background: "#0a0a0a",
        overflow: "hidden"
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.01) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 1,
        }}
      />

      {/* Ambient Glows */}
      <GlowOrb color="rgba(155,81,224,0.08)" size={600} top="10%" left="5%" duration={15} blur={80} />
      <GlowOrb color="rgba(255,140,0,0.06)" size={700} bottom="10%" right="5%" duration={20} delay={3} blur={100} />

      {/* Navigation Helper */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ position: "absolute", top: "2.5rem", left: "3rem", zIndex: 20 }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          ← BACK TO SHOP
        </Link>
      </motion.div>

      {/* Main Content - Centered but Editorial Style */}
      <motion.div
        style={{
          y: yTitle,
          opacity: opacityContent,
          scale: scaleTitle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
          textAlign: "center",
          maxWidth: "900px",
          padding: "0 2rem"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ marginBottom: "2rem" }}
        >
          <span style={{ 
            fontSize: "0.75rem", 
            letterSpacing: "0.4em", 
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.5rem 1.2rem",
            borderRadius: "2rem"
          }}>
            The Heritage & Vision
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontSize: "clamp(4.5rem, 11vw, 9rem)", 
            fontWeight: 800, 
            letterSpacing: "-0.04em", 
            lineHeight: 0.9,
            margin: 0,
            color: "#fff",
          }}
        >
          Essence Of<br />
          <span style={{ 
            background: "linear-gradient(to right, #fff, rgba(255,255,255,0.5))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Novure.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          style={{ 
            marginTop: "3rem",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.8,
            maxWidth: "500px",
            fontWeight: 300,
            letterSpacing: "0.01em"
          }}
        >
          Born from a singular vision to redefine the modern wardrobe. 
          We craft essentials that transcend time, engineering comfort 
          into every stitch.
        </motion.p>
      </motion.div>

      {/* Decorative Corner Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        style={{ position: "absolute", bottom: "3.5rem", left: "3rem", zIndex: 20, display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>EST. 2024</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>TOKYO / MILAN</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.7 }}
        style={{ position: "absolute", bottom: "3.5rem", right: "3rem", zIndex: 20 }}
      >
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.1em", writingMode: "vertical-rl" }}>
          / ARCHIVE 01
        </span>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: opacityContent, position: "absolute", bottom: "3.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
      >
        <ScrollIndicator delay={2} />
      </motion.div>
    </section>
  );
}
