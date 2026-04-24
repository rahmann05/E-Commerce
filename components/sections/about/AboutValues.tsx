"use client";

import { motion } from "framer-motion";
import SectionLabel from "../../ui/SectionLabel";
import { VALUES } from "../../data/team";

export default function AboutValues() {


  return (
    <section
      style={{
        position: "relative",
        zIndex: 10,
        padding: "15vh 2rem",
        background: "#0a0a0a",
        color: "#fff",
        overflow: "hidden"
      }}
    >
      {/* Background Accent Grid - Same as Style Outlook */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header - Aligned with Style Outlook */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "6rem" }}>
          <div style={{ flex: 1 }}>
            <SectionLabel number="04" label="Core Pillars" color="rgba(255,255,255,0.4)" />
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginTop: "1.5rem"
              }}
            >
              What<br />Defines Us
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ flex: 1, textAlign: "right" }}
          >
            <p style={{ maxWidth: "350px", marginLeft: "auto", fontSize: "1rem", lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>
              At Novure, we believe that the best products are born from a balance
              of heritage, ethics, and modern engineering.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(200px, auto)",
          gap: "1.5rem"
        }}>

          {/* Item 1: Wide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              gridColumn: "span 8",
              gridRow: "span 1",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2rem",
              padding: "3.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>{VALUES[0].icon}</span>
            <h3 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>{VALUES[0].title}</h3>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "500px" }}>{VALUES[0].desc}</p>
          </motion.div>

          {/* Item 2: Tall */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              gridColumn: "span 4",
              gridRow: "span 2",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "2rem",
              padding: "3.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Subtle Decorative Circle */}
            <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(155,81,224,0.05) 0%, transparent 70%)" }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: "2.5rem", marginBottom: "2rem", display: "block" }}>{VALUES[1].icon}</span>
              <h3 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>{VALUES[1].title}</h3>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{VALUES[1].desc}</p>
            </div>
          </motion.div>

          {/* Item 3: Square */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              gridColumn: "span 4",
              gridRow: "span 1",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2rem",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "2rem", marginBottom: "1.2rem" }}>{VALUES[2].icon}</span>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.8rem" }}>{VALUES[2].title}</h3>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{VALUES[2].desc}</p>
          </motion.div>

          {/* Item 4: Square */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              gridColumn: "span 4",
              gridRow: "span 1",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "2rem",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "2rem", marginBottom: "1.2rem" }}>{VALUES[3].icon}</span>
            <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.8rem" }}>{VALUES[3].title}</h3>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{VALUES[3].desc}</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
