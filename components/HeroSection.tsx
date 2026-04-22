"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const CLOTHING_ITEMS = [
  { src: "/images/tees1.png", width: 120, height: 120 },
  { src: "/images/jeans1.png", width: 100, height: 140 },
  { src: "/images/tees2.png", width: 110, height: 110 },
  { src: "/images/jeans2.png", width: 110, height: 130 },
  { src: "/images/tees3.png", width: 90, height: 90 },
  { src: "/images/tees4.png", width: 130, height: 130 },
  { src: "/images/jeans3.png", width: 100, height: 140 },
  { src: "/images/tees5.png", width: 110, height: 110 },
];

interface TrailItem {
  id: number;
  x: number;
  y: number;
  clothingIndex: number;
  rotation: number;
  scale: number;
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const trailIdRef = useRef(0);
  const lastSpawnTime = useRef(0);
  const clothingCycleRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax
  const rawYTitle = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yTitle = useSpring(rawYTitle, { stiffness: 80, damping: 20 });
  const opacityContent = useSpring(rawOpacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 5000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setLoadProgress(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setShowContent(true);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const now = Date.now();
      if (now - lastSpawnTime.current < 150) return;
      lastSpawnTime.current = now;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newItem: TrailItem = {
        id: trailIdRef.current++,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        clothingIndex: clothingCycleRef.current % CLOTHING_ITEMS.length,
        rotation: (Math.random() - 0.5) * 40,
        scale: 0.6 + Math.random() * 0.5,
      };

      clothingCycleRef.current++;

      setTrail((prev) => {
        // Keep max 12 items
        const next = [...prev, newItem];
        if (next.length > 12) return next.slice(-12);
        return next;
      });

      // Auto-remove after 1.8s
      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 1800);
    },
    []
  );

  return (
    <section
      ref={containerRef}
      className="hero-section"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          zIndex: 1,
        }}
      />

      {/* Corner labels */}
      {[
        { text: "Classic", cls: "top-left", delay: 0.5 },
        { text: "Essential", cls: "top-right", delay: 0.6 },
        { text: "Foundation", cls: "bottom-left", delay: 0.7 },
        { text: "Active", cls: "bottom-right", delay: 0.8 },
      ].map((label) => (
        <motion.span
          key={label.cls}
          className={`hero-corner-label ${label.cls}`}
          initial={{ opacity: 0, y: label.cls.includes("top") ? -15 : 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: label.delay }}
        >
          {label.text}
        </motion.span>
      ))}

      {/* Cursor-following clothing trail */}
      <AnimatePresence>
        {trail.map((item) => {
          const clothing = CLOTHING_ITEMS[item.clothingIndex];
          return (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                scale: 0.3,
                x: item.x - clothing.width / 2,
                y: item.y - clothing.height / 2,
                rotate: item.rotation - 20,
              }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                scale: [0.3, item.scale, item.scale * 0.9, 0.2],
                y: item.y - clothing.height / 2 - 30,
                rotate: item.rotation,
              }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{
                duration: 1.8,
                ease: [0.16, 1, 0.3, 1],
                opacity: { times: [0, 0.15, 0.7, 1] },
                scale: { times: [0, 0.15, 0.7, 1] },
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: clothing.width,
                height: clothing.height,
                zIndex: 10,
                pointerEvents: "none",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))",
                mixBlendMode: "lighten",
              }}
            >
              <img
                src={`${clothing.src}?v=3`}
                alt=""
                className="object-contain"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Ambient glow orbs */}
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -25, 15, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "25%",
          left: "15%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,81,224,0.12) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <motion.div
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 15, -20, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Center hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.3 : 0 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        move your cursor to explore
      </motion.p>

      {/* Main title with parallax */}
      <motion.div
        style={{
          y: yTitle,
          opacity: opacityContent,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
          position: "absolute",
          bottom: "18%",
          left: 0,
          right: 0,
        }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Novure
        </motion.h1>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <div className="hero-progress-bar">
            <motion.div
              className="hero-progress-fill"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="hero-progress-text">{loadProgress}%</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.6 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 22,
            height: 34,
            borderRadius: 11,
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex",
            justifyContent: "center",
            paddingTop: 7,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1], y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 3,
              height: 7,
              borderRadius: 2,
              background: "rgba(255,255,255,0.4)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
