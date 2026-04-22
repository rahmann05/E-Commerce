"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show navbar only after scrolling past hero
    setVisible(latest > window.innerHeight * 0.85);
    setScrolled(latest > window.innerHeight);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(245,245,243,0.92)" : "rgba(245,245,243,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="main-navbar">
        <div style={{ display: "flex", gap: "2.5rem" }}>
          <a href="#">Male</a>
          <a href="/about">About Us</a>
        </div>
        <a href="#" className="brand">Novure</a>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          <a href="#">Wishlist</a>
          <a href="#">My Cart</a>
        </div>
      </div>
    </motion.nav>
  );
}
