"use client";

import { motion } from "framer-motion";
import SectionLabel from "../../ui/SectionLabel";
import RevealText from "../../ui/RevealText";
import Image from "next/image";

interface AboutStoryProps {
  studioModel1: string;
}

export default function AboutStory({ studioModel1 }: AboutStoryProps) {
  return (
    <section style={{ position: "relative", zIndex: 10, padding: "20vh 2rem", background: "#f5f5f3", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8rem", alignItems: "center" }}>
        
        <div style={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              width: "100%", 
              aspectRatio: "4/5", 
              borderRadius: "1.5rem", 
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.06)",
              background: "#fff"
            }}
          >
            <Image src={studioModel1} alt="Studio Fashion" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>
          
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              bottom: "3rem",
              right: "-4rem",
              padding: "2.5rem",
              width: "320px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              borderRadius: "1rem",
              zIndex: 20
            }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.3em", color: "#999", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
              Our Philosophy
            </span>
            <p style={{ fontSize: "1.1rem", color: "#111", lineHeight: 1.5, fontWeight: 500, letterSpacing: "-0.01em" }}>
              &quot;Simplicity is the ultimate sophistication in every stitch.&quot;
            </p>
          </motion.div>
        </div>

        <div style={{ paddingLeft: "2rem" }}>
          <SectionLabel number="02" label="Origin Story" color="#aaa" />
          
          <div style={{ marginTop: "3rem", marginBottom: "4rem", overflow: "visible" }}>
            <RevealText 
              text="Engineered for the modern daily grind." 
              style={{ 
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)", 
                fontWeight: 800, 
                lineHeight: 1.1, 
                letterSpacing: "-0.04em",
                color: "#111"
              }} 
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#666", fontWeight: 400, maxWidth: "480px" }}
          >
            Novure was born in a small studio with a big vision: to create garments 
             that adapt to your life, not the other way around. We combine technical 
             fabrics with tailored silhouettes to deliver essentials that feel 
             as good as they look.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "80px", height: "3px", background: "#111", marginTop: "4rem", originX: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
