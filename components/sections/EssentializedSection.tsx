"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useColorTheme } from "../providers/ColorContext";
import AnimatedWave from "../features/AnimatedWave";
import ClothingCarousel from "../features/ClothingCarousel";
import { TEES, JEANS } from "../data/products";

export default function EssentializedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-50px" });
  const { setCustomTheme } = useColorTheme();

  const [currentTee, setCurrentTee] = useState(TEES[0]);
  const [currentJeans, setCurrentJeans] = useState(JEANS[0]);
  const [comboKey, setComboKey] = useState(0);

  const handleNextCombo = () => {
    setCurrentTee(TEES[Math.floor(Math.random() * TEES.length)]);
    setCurrentJeans(JEANS[Math.floor(Math.random() * JEANS.length)]);
    setComboKey((prev) => prev + 1);
  };

  const handlePrevCombo = () => {
    setCurrentTee(TEES[Math.floor(Math.random() * TEES.length)]);
    setCurrentJeans(JEANS[Math.floor(Math.random() * JEANS.length)]);
    setComboKey((prev) => prev - 1);
  };

  useEffect(() => {
    if (setCustomTheme) {
      setCustomTheme({
        name: "custom",
        primary: currentTee.color,
        secondary: currentJeans.color,
        tertiary: "#161616",
        accent: currentTee.color,
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
      {/* Navbar - we leave the dummy nav links here for styling or use the layout Navbar if preferred, 
          but usually this section had its own embedded navbar in the design. I'll keep the HTML structure. */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="main-navbar">
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <Link href="#">Male</Link>
            <Link href="/about">About Us</Link>
          </div>
          <Link href="/" className="brand">
            Novure
          </Link>
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <Link href="#">Wishlist</Link>
            <Link href="#">My Cart</Link>
          </div>
        </div>
      </motion.div>

      {/* Wrapper for absolute alignment masking */}
      <div style={{ position: "relative", width: "100%", paddingBottom: "5vw" }}>
        {/* Giant Typography OUTER */}
        <motion.div ref={titleRef} style={{ y: yTitle, position: "absolute", top: "2vw", left: 0, right: 0, zIndex: 1 }}>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
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
          <motion.div style={{ y: yInnerTitle, position: "absolute", top: "-8vw", left: 0, right: 0, zIndex: 1 }}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <h2
                className="essentialized-title"
                style={{
                  position: "relative",
                  zIndex: 2,
                  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${currentTee.color} 35%, white), color-mix(in srgb, ${currentJeans.color} 35%, white))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  opacity: 0.95,
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

          <AnimatedWave />

          <ClothingCarousel
            currentTee={currentTee}
            currentJeans={currentJeans}
            comboKey={comboKey}
            onNext={handleNextCombo}
            onPrev={handlePrevCombo}
            yCards={yCards}
          />
        </motion.div>
      </div>
    </section>
  );
}
