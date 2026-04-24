"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

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
          <Link href="#">Male</Link>
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/about">About Us</Link>
        </div>
        <Link href="#" className="brand">Novure</Link>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          <Link href="#">Wishlist</Link>
          <Link href="#">My Cart</Link>
        </div>
      </div>
    </motion.nav>
  );
}
