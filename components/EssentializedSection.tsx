"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useColorTheme, COLOR_THEMES } from "./ColorContext";
import AnimatedWave from "./AnimatedWave";

const TEES = [
  { name: "White Boxy Tee", image: "/images/tees1.png", color: "#e8e8e8" },
  { name: "Earth Brown", image: "/images/tees2.png", color: "#6b4423" },
  { name: "Sage Boxy Tee", image: "/images/tees3.png", color: "#8da38a" },
  { name: "Vintage Grey", image: "/images/tees4.png", color: "#7a7a7a" },
  { name: "Charcoal Boxy", image: "/images/tees5.png", color: "#333333" },
];

const JEANS = [
  { name: "Blue Baggy Denim", image: "/images/jeans1.png", color: "#2b4c7e" },
  { name: "Washed Black", image: "/images/jeans2.png", color: "#1a1a1a" },
  { name: "Light Wash", image: "/images/jeans3.png", color: "#5b84b1" },
];

export default function EssentializedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-50px" });
  const { activeTheme, activeIndex, setActiveIndex, setCustomTheme } = useColorTheme();
  
  const [currentTee, setCurrentTee] = useState(TEES[0]);
  const [currentJeans, setCurrentJeans] = useState(JEANS[0]);
  const [comboKey, setComboKey] = useState(0);

  const handleNextCombo = () => {
    setCurrentTee(TEES[Math.floor(Math.random() * TEES.length)]);
    setCurrentJeans(JEANS[Math.floor(Math.random() * JEANS.length)]);
    setComboKey(prev => prev + 1);
  };

  const handlePrevCombo = () => {
    setCurrentTee(TEES[Math.floor(Math.random() * TEES.length)]);
    setCurrentJeans(JEANS[Math.floor(Math.random() * JEANS.length)]);
    setComboKey(prev => prev - 1);
  };

  useEffect(() => {
    if (setCustomTheme) {
      setCustomTheme({
        name: "custom",
        primary: currentTee.color,
        secondary: currentJeans.color,
        tertiary: "#161616", 
        accent: currentTee.color
      });
    }
  }, [currentTee, currentJeans, setCustomTheme]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawYTitle = useTransform(scrollYProgress, [0, 1], [60, -50]);
  const rawYWave = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [40, -20]);

  const yTitle = useSpring(rawYTitle, { stiffness: 60, damping: 20 });
  const yWave = useSpring(rawYWave, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });
  const yInnerTitle = useTransform([yTitle, yWave], ([title, wave]: any) => title - wave);

  const title = "Essentialized";
  const letters = title.split("");

  return (
    <section ref={containerRef} className="essentialized-section">
      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="main-navbar">
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <a href="#">Male</a>
            <a href="#">Female</a>
          </div>
          <a href="#" className="brand">
            Novure
          </a>
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <a href="#">Wishlist</a>
            <a href="#">My Cart</a>
          </div>
        </div>
      </motion.div>

      {/* Wrapper for absolute alignment masking */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "5vw" }}>
        {/* Giant Typography OUTER */}
        <motion.div
          ref={titleRef}
          style={{ y: yTitle, position: "absolute", top: "2vw", left: 0, right: 0, zIndex: 1 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <h2
              className="essentialized-title"
              style={{
                position: "relative",
                zIndex: 2,
                backgroundImage: `linear-gradient(90deg, ${currentTee.color}, ${currentJeans.color})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                opacity: 0.9,
              }}
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 200, opacity: 0 }}
                  animate={titleInView ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
                  transition={{ duration: 1, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </motion.div>

        {/* Animated Wave Area */}
        <motion.div
          className="wave-image-container"
          style={{ y: yWave, position: "relative", zIndex: 2, marginTop: "10vw" }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Giant Typography INNER (MASKED) */}
          <motion.div
            style={{ y: yInnerTitle, position: "absolute", top: "-8vw", left: 0, right: 0, zIndex: 1 }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <h2
                className="essentialized-title"
                style={{
                  position: "relative",
                  zIndex: 2,
                  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${currentTee.color} 35%, white), color-mix(in srgb, ${currentJeans.color} 35%, white))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  opacity: 0.95
                }}
              >
                {letters.map((letter, i) => (
                  <motion.span
                    key={`inner-${i}`}
                    initial={{ y: 200, opacity: 0 }}
                    animate={titleInView ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
                    transition={{ duration: 1, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: "inline-block" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h2>
            </motion.div>
          </motion.div>

          {/* Canvas animated wave */}
          <AnimatedWave />

        {/* Centered Carousel & Buy Now Button */}
        <motion.div 
          style={{ 
            y: yCards,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "10%",
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            gap: "1.2rem",
            zIndex: 30,
            width: "100%"
          }}
        >
          {/* Controls + Cards */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={handlePrevCombo}
              style={{
                width: 54, height: 54, borderRadius: "50%", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
              }}
            >
              <ChevronLeft size={28} color="#111" />
            </button>

            <div style={{ width: 640, position: "relative" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={comboKey}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: "flex", gap: "2rem", width: "100%", margin: 0 }}
                >
                  <div className="floating-product-card" style={{ flex: 1, padding: "2rem", width: "auto", height: "300px" }}>
                    <span className="card-label" style={{ fontSize: "1.1rem" }}>{currentTee.name}</span>
                    <div className="card-image" style={{ height: "220px" }}>
                      <Image
                        src={currentTee.image}
                        alt={currentTee.name}
                        fill
                        className="object-contain"
                        style={{ mixBlendMode: "darken", transition: "all 0.6s ease" }}
                      />
                    </div>
                  </div>
                  <div className="floating-product-card" style={{ flex: 1, padding: "2rem", width: "auto", height: "300px" }}>
                    <span className="card-label" style={{ fontSize: "1.1rem" }}>{currentJeans.name}</span>
                    <div className="card-image" style={{ height: "220px" }}>
                      <Image
                        src={currentJeans.image}
                        alt={currentJeans.name}
                        fill
                        className="object-contain"
                        style={{ mixBlendMode: "darken", transition: "all 0.6s ease" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={handleNextCombo}
              style={{
                width: 54, height: 54, borderRadius: "50%", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
              }}
            >
              <ChevronRight size={28} color="#111" />
            </button>
          </div>

          {/* Centered Buy Now Button */}
          <motion.button
            className="buy-now-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ position: "relative" }}
          >
            Buy Now
            <span className="arrow-circle">
              <ArrowUpRight size={14} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
