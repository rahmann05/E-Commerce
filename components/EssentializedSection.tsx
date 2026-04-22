"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useColorTheme, COLOR_THEMES } from "./ColorContext";
import AnimatedWave from "./AnimatedWave";

export default function EssentializedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-50px" });
  const { activeTheme, activeIndex, setActiveIndex } = useColorTheme();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawYTitle = useTransform(scrollYProgress, [0, 1], [60, -50]);
  const rawYWave = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [80, -40]);

  const yTitle = useSpring(rawYTitle, { stiffness: 60, damping: 20 });
  const yWave = useSpring(rawYWave, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });

  const title = "Essentialized";
  const letters = title.split("");

  // Calculate natural color filters based on active theme to recolor the base amber images
  let colorFilter = "hue-rotate(0deg) saturate(1.1) brightness(1.05)"; // Amber (Base)
  if (activeTheme.name === "olive") {
    colorFilter = "hue-rotate(60deg) saturate(0.6) brightness(0.9)";
  } else if (activeTheme.name === "lavender") {
    colorFilter = "hue-rotate(220deg) saturate(0.75) brightness(1.1)";
  }

  const quickProducts = [
    { name: "Tees", image: "/images/base-tee.png" },
    { name: "Hoodie", image: "/images/base-hoodie.png" },
    { name: "Pants", image: "/images/base-pants.png" },
  ];

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

    {/* Giant Typography - positioned to clip with wave below */}
    <motion.div
      ref={titleRef}
      style={{ y: yTitle, position: "relative", zIndex: 10 }}
    >
      <h2
        className="essentialized-title"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: 200, opacity: 0 }}
            animate={
              titleInView ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }
            }
            transition={{
              duration: 1,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {letter}
          </motion.span>
        ))}
      </h2>
    </motion.div>

    {/* Subtitle Row */}
    <motion.div
      className="essentialized-subtitle-row"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative", zIndex: 10 }}
    >
      <p style={{ maxWidth: 260 }}>
        Feel confident in every layer, we
        <br />
        engineered comfort you can trust
      </p>
      <p style={{ maxWidth: 260, textAlign: "right" }}>
        Smart comfort for daily living,
        <br />
        with style that simplifies your life
      </p>
    </motion.div>

    {/* Animated Wave Area */}
    <motion.div
      className="wave-image-container"
      style={{ y: yWave }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Canvas animated wave */}
      <AnimatedWave />

      {/* Floating Quick Shop Overlay */}
      <motion.div
        style={{ y: yCards }}
        className="wave-overlay-controls"
      >
        {/* Buy Now Button */}
        <motion.button
          className="buy-now-btn"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Buy Now
          <span className="arrow-circle">
            <ArrowUpRight size={14} />
          </span>
        </motion.button>

        {/* Product Quick Cards with Color Dots */}
        <div style={{ display: "flex", gap: "0.8rem" }}>
          {quickProducts.map((item, index) => (
            <motion.div
              key={item.name}
              className="floating-product-card"
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.8 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <span className="card-label">{item.name}</span>
              <div className="card-image">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  style={{
                    mixBlendMode: "darken",
                    filter: colorFilter,
                    transition: "all 0.6s ease",
                  }}
                />
              </div>
              {/* Color selector dots */}
              <div className="card-colors">
                {COLOR_THEMES.map((theme, ti) => (
                  <motion.div
                    key={theme.name}
                    className="dot"
                    style={{
                      backgroundColor: theme.primary,
                      border:
                        activeIndex === ti
                          ? "2px solid #111"
                          : "2px solid transparent",
                      width: 10,
                      height: 10,
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveIndex(ti)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
);
}
