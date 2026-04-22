"use client";

import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const TEAM = [
  {
    name: "Fifin Agustiana",
    role: "Creative Director & Co-Founder",
    bio: "A visionary in modern fashion aesthetics, Fifin brings an eye for minimalist elegance and textile innovation that defines every Novure piece.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    accent: "#9b51e0",
  },
  {
    name: "I Gede Bayu Pamungkas",
    role: "Chief Executive Officer",
    bio: "With a strategic mind and passion for disrupting fast fashion, Bayu drives Novure's mission to make premium essentials accessible to everyone.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    accent: "#ff8c00",
  },
  {
    name: "Zilal Afwu Rahman",
    role: "Head of Product Design",
    bio: "Zilal is the architect behind Novure's signature silhouettes. Every cut, stitch, and drape is meticulously crafted under his watchful design philosophy.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    accent: "#27ae60",
  },
  {
    name: "Safdar Rahman",
    role: "Chief Technology Officer",
    bio: "Safdar bridges the gap between fashion and technology, building the digital infrastructure that powers Novure's seamless e-commerce experience.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    accent: "#e05177",
  },
];

const VALUES = [
  { icon: "✦", title: "Craftsmanship", desc: "Every piece is engineered with precision — from the first thread to the final press." },
  { icon: "◆", title: "Sustainability", desc: "Conscious production meets modern design, built to last beyond a single season." },
  { icon: "●", title: "Innovation", desc: "We push boundaries in fabric technology, fit science, and the way you shop." },
  { icon: "▲", title: "Community", desc: "Novure isn't a brand — it's a culture of people who refuse to settle for ordinary." },
];

function TeamCard({ member, index }: { member: typeof TEAM[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 1.2, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "2rem",
        overflow: "hidden",
        background: "#fff",
        boxShadow: hovered
          ? `0 30px 80px -20px ${member.accent}40, 0 10px 30px rgba(0,0,0,0.08)`
          : "0 4px 30px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Top accent band */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${member.accent}, ${member.accent}80)`,
          transformOrigin: "left",
          zIndex: 2,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "2.5rem 2rem" }}>
        {/* Avatar */}
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1, y: hovered ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 1.8rem",
            border: `3px solid ${hovered ? member.accent : "rgba(0,0,0,0.08)"}`,
            boxShadow: hovered ? `0 15px 40px ${member.accent}30` : "0 8px 20px rgba(0,0,0,0.06)",
            transition: "border-color 0.4s ease, box-shadow 0.5s ease",
          }}
        >
          <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, textAlign: "center", marginBottom: "0.3rem", letterSpacing: "-0.02em", color: "#111" }}>
          {member.name}
        </h3>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: member.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
          {member.role}
        </p>

        <p style={{ textAlign: "center", fontSize: "0.9rem", lineHeight: 1.7, color: "#777" }}>
          {member.bio}
        </p>

        {/* Hover reveal line */}
        <motion.div
          animate={{ width: hovered ? "60px" : "0px", opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ height: "3px", background: member.accent, borderRadius: "2px", margin: "1.5rem auto 0" }}
        />
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), { stiffness: 60, damping: 20 });

  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });

  const valuesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: vp } = useScroll({ target: valuesRef, offset: ["start end", "end start"] });
  const valuesY = useTransform(vp, [0, 1], [60, -60]);

  // Marquee text for the hero
  const marqueeText = "NOVURE · ESSENTIALIZED · DAILY WEAR · CRAFTED · COMFORT · ";

  return (
    <div style={{ background: "#f5f5f3", color: "#111", minHeight: "100vh" }}>

      {/* ===== HERO ===== */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
        <motion.div
          style={{ y: heroY, scale: heroScale, position: "absolute", inset: 0,
            backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)",
            backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.35) saturate(0.7)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, #0a0a0a 100%)" }} />

        {/* Animated floating orbs - matching landing page */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155,81,224,0.2), transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ x: [0, -25, 30, 0], y: [0, 20, -30, 0], scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", bottom: "25%", right: "15%", width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }}
        />

        {/* Infinite marquee strip */}
        <div style={{ position: "absolute", top: "18%", left: 0, width: "100%", overflow: "hidden", opacity: 0.06, pointerEvents: "none" }}>
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", whiteSpace: "nowrap", fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}
          >
            {[...Array(4)].map((_, i) => <span key={i}>{marqueeText}</span>)}
          </motion.div>
        </div>

        {/* Hero Content */}
        <motion.div style={{ y: textY, opacity: heroOpacity, position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 2rem" }}>
          {/* Back to home */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: -5 }}
            style={{ position: "absolute", top: "2.5rem", left: "2.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            ← Back to Novure
          </motion.a>

          <motion.span
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}
          >
            The People Behind The Brand
          </motion.span>

          {/* Giant animated title */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "120%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "clamp(4rem, 12vw, 11rem)", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9,
                background: "linear-gradient(180deg, #ffffff 20%, rgba(255,255,255,0.3) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              About Us
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: "2rem", maxWidth: "500px", textAlign: "center", fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}
          >
            Four individuals, one relentless vision — to redefine what everyday fashion should feel like.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2 }}
            style={{ position: "absolute", bottom: "3rem" }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 22, height: 34, borderRadius: 11, border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", paddingTop: 7 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.2, 1], y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 3, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.35)" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== OUR STORY (warm light section) ===== */}
      <section style={{ padding: "10rem 2rem 6rem", maxWidth: "900px", margin: "0 auto" }}>
        <div ref={storyRef}>
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={storyInView ? { opacity: 0.5, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999" }}
          >
            /01 — Our Story
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, marginTop: "1.5rem", marginBottom: "2rem", color: "#111" }}
          >
            Born from a belief that{" "}
            <span style={{ color: "#bbb" }}>everyday wear</span>{" "}deserves{" "}
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontStyle: "italic",
                backgroundSize: "200% 200%",
                background: "linear-gradient(90deg, #9b51e0, #ff8c00, #9b51e0)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              extraordinary care.
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "#777" }}>
              Novure was founded in 2024 by four friends who shared a singular frustration: why does comfortable, everyday clothing always have to compromise on style?
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "#777" }}>
              We started in a small studio, experimenting with fabrics, testing fits, and challenging every convention of fast fashion. Today, Novure stands as a testament to what happens when craftsmanship meets conscious design.
            </p>
          </motion.div>

          {/* Animated divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={storyInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)", marginTop: "5rem", transformOrigin: "left" }}
          />
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section style={{ padding: "4rem 2rem 8rem", background: "#f5f5f3" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", display: "block", marginBottom: "1rem" }}
          >
            /02 — The Team
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4rem", color: "#111" }}
          >
            Meet the minds behind <span style={{ fontStyle: "italic", color: "#bbb" }}>Novure.</span>
          </motion.h2>

          {/* Team Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES (dark section for contrast, like Science section) ===== */}
      <section ref={valuesRef} style={{ padding: "8rem 2rem 10rem", position: "relative", overflow: "hidden", background: "#0a0a0a", color: "#fff" }}>
        {/* Animated conic gradient bg */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "50%", left: "50%", width: "900px", height: "900px", transform: "translate(-50%, -50%)",
            background: "conic-gradient(from 0deg, rgba(155,81,224,0.08), rgba(255,140,0,0.08), rgba(39,174,96,0.08), rgba(224,81,119,0.08), rgba(155,81,224,0.08))",
            borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }}
        />

        <motion.div style={{ y: valuesY, position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "1rem" }}
          >
            /03 — Our Values
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4rem" }}
          >
            What we stand for.
          </motion.h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
                style={{
                  padding: "2.5rem 2rem", borderRadius: "1.5rem",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)", cursor: "default",
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  style={{ fontSize: "2rem", display: "block", marginBottom: "1.2rem" }}
                >
                  {v.icon}
                </motion.span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.8rem", letterSpacing: "-0.02em" }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CTA (warm light section) ===== */}
      <section style={{ padding: "8rem 2rem", textAlign: "center", background: "#f5f5f3" }}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "2rem", color: "#111" }}
        >
          Join the movement.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: "#999", fontSize: "1rem", maxWidth: "450px", margin: "0 auto 3rem", lineHeight: 1.7 }}
        >
          We&apos;re just getting started. Discover the collection and become part of the Novure story.
        </motion.p>

        <motion.a
          href="/"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(155,81,224,0.25)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-block", padding: "1.1rem 4rem", borderRadius: "3rem",
            background: "linear-gradient(135deg, #9b51e0, #ff8c00)", color: "#fff",
            fontWeight: 700, fontSize: "1rem", textDecoration: "none", letterSpacing: "-0.01em",
            boxShadow: "0 8px 30px rgba(155,81,224,0.15)",
          }}
        >
          Explore Collection
        </motion.a>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem", borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center", background: "#f5f5f3" }}>
        <p style={{ fontSize: "0.75rem", color: "#bbb" }}>© 2024 Novure. All rights reserved.</p>
      </footer>
    </div>
  );
}
