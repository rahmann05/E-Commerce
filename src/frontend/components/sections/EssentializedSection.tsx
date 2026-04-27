"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useColorTheme } from "@/context/ColorContext";
import AnimatedWave from "../features/AnimatedWave";
import ClothingCarousel from "../features/ClothingCarousel";
import { getTees, getJeans } from "@/frontend/lib/actions/catalogue";

export default function EssentializedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { setCustomTheme } = useColorTheme();

  const [tees, setTees] = useState<any[]>([]);
  const [jeans, setJeans] = useState<any[]>([]);
  const [currentTee, setCurrentTee] = useState<any>(null);
  const [currentJeans, setCurrentJeans] = useState<any>(null);
  const [comboKey, setComboKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      const teesData = await getTees();
      const jeansData = await getJeans();
      
      setTees(teesData);
      setJeans(jeansData);
      
      if (teesData.length > 0) setCurrentTee(teesData[0]);
      if (jeansData.length > 0) setCurrentJeans(jeansData[0]);
    }
    loadData();
  }, []);

  const handleNextCombo = () => {
    if (tees.length === 0 || jeans.length === 0) return;
    setCurrentTee(tees[Math.floor(Math.random() * tees.length)]);
    setCurrentJeans(jeans[Math.floor(Math.random() * jeans.length)]);
    setComboKey((prev) => prev + 1);
  };

  const handlePrevCombo = () => {
    if (tees.length === 0 || jeans.length === 0) return;
    setCurrentTee(tees[Math.floor(Math.random() * tees.length)]);
    setCurrentJeans(jeans[Math.floor(Math.random() * jeans.length)]);
    setComboKey((prev) => prev - 1);
  };

  useEffect(() => {
    if (setCustomTheme && currentTee && currentJeans) {
      setCustomTheme({
        name: "custom",
        primary: currentTee.colors?.[0] || "#111",
        secondary: currentJeans.colors?.[0] || "#111",
        tertiary: "#161616",
        accent: currentTee.colors?.[0] || "#111",
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
  const yInnerTitle = useTransform([yTitle, yWave], (latest) => {
    const [title, wave] = latest as [number, number];
    return title - wave;
  });

  const title = "Essentialized";
  const letters = title.split("");

  return (
    <section ref={containerRef} className="essentialized-section">
      {!currentTee || !currentJeans ? (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
           <p style={{ opacity: 0.5 }}>Loading Essentials...</p>
        </div>
      ) : (
        <>
          <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="main-navbar" style={{ color: "#111" }}>
          <div style={{ display: "flex", gap: "2.5rem" }}>
            <Link href="/catalogue" style={{ color: "inherit" }}>Male</Link>
            <Link href="/about" style={{ color: "inherit" }}>About Us</Link>
          </div>
          <Link href="/" className="brand" style={{ color: "inherit" }}>
            Novure
          </Link>
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            <Link href="/profile" style={{ color: "inherit" }}>Profile</Link>
            <Link href="/cart" style={{ color: "inherit" }}>Cart</Link>
          </div>
        </div>
      </motion.div>

      <div style={{ position: "relative", width: "100%", paddingBottom: "5vw" }}>
        <motion.div ref={titleRef} style={{ y: yTitle, position: "absolute", top: "2vw", left: 0, right: 0, zIndex: 6 }}>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <h2
              className="essentialized-title"
              style={{
                position: "relative",
                zIndex: 2,
                backgroundImage: `linear-gradient(90deg, ${currentTee.colors?.[0] || "#111"}, ${currentJeans.colors?.[0] || "#111"})`,
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
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </motion.div>

        <motion.div
          className="wave-image-container"
          style={{ y: yWave, position: "relative", zIndex: 2, marginTop: "10vw" }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div style={{ y: yInnerTitle, position: "absolute", top: "-8vw", left: 0, right: 0, zIndex: 1 }}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <h2
                className="essentialized-title"
                style={{
                  position: "relative",
                  zIndex: 2,
                  backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${currentTee.colors?.[0] || "#111"} 35%, white), color-mix(in srgb, ${currentJeans.colors?.[0] || "#111"} 35%, white))`,
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
                    animate={{ y: 0, opacity: 1 }}
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
      </>
      )}
    </section>
  );
}
