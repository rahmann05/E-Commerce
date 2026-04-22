"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ScienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });

  const title = "THE SCIENCE OF EVERYDAY COMFORT";

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "6rem 2rem",
      }}
    >
      {/* Decorative gradient blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(155,81,224,0.2), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <motion.div style={{ y }} className="relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "800px",
          }}
        >
          {title.split(" ").map((word, wi) => (
            <motion.span
              key={wi}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: wi * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ display: "inline-block", marginRight: "0.3em" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.95rem",
            maxWidth: "500px",
            margin: "2rem auto 0",
            lineHeight: 1.7,
          }}
        >
          We obsess over fabric technology and modern construction so you can 
          focus on living your best life.
        </motion.p>
      </motion.div>

      {/* Infinite Looping Carousel */}
      <div 
        style={{ 
          position: "relative", 
          width: "100%", 
          marginTop: "4rem", 
          overflow: "hidden",
          padding: "2rem 0"
        }}
      >

        <motion.div
          style={{ display: "flex", gap: "3rem", width: "max-content" }}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[
            "/images/tees1.png",
            "/images/jeans1.png",
            "/images/tees2.png",
            "/images/jeans2.png",
            "/images/tees3.png",
            "/images/jeans3.png",
            "/images/tees4.png",
            "/images/tees5.png",
            // Duplicate for seamless loop
            "/images/tees1.png",
            "/images/jeans1.png",
            "/images/tees2.png",
            "/images/jeans2.png",
            "/images/tees3.png",
            "/images/jeans3.png",
            "/images/tees4.png",
            "/images/tees5.png",
          ].map((src, idx) => (
            <div 
              key={idx} 
              style={{ 
                width: "320px", 
                height: "380px", 
                flexShrink: 0, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center" 
              }}
            >
              <img 
                src={src} 
                alt="Clothing" 
                style={{ width: "90%", height: "90%", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }} 
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Promotional Footer Bar */}
      <div 
        style={{ 
          width: "100%", 
          borderTop: "1px solid rgba(255,255,255,0.1)", 
          borderBottom: "1px solid rgba(255,255,255,0.1)", 
          padding: "1.5rem 0", 
          marginTop: "4rem",
          textAlign: "center"
        }}
      >
        <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.8)" }}>
          USE ORMAS25 NOW, GET 25% OFF YOUR FIRST FIT
        </span>
      </div>
    </section>
  );
}
