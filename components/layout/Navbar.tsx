"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarAuthStatus from "@/components/auth/NavbarAuthStatus";
import { useCart } from "@/components/providers/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // On non-home pages the navbar is always visible
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isHome) return;
    setVisible(latest > window.innerHeight * 0.85);
    setScrolled(latest > window.innerHeight);
  });

  // Always show on sub-pages
  const shouldShow = !isHome || visible;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: shouldShow ? 0 : -100,
        opacity: shouldShow ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(245,245,243,0.95)"
          : "rgba(245,245,243,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="main-navbar">
        <div style={{ display: "flex", gap: "2.5rem" }}>
          <Link href="/">Home</Link>
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/about">About Us</Link>
        </div>
        <Link href="/" className="brand">
          Novure
        </Link>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <CartLink />
          <NavbarAuthStatus />
        </div>
      </div>
    </motion.nav>
  );
}

function CartLink() {
  const { cartCount } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <Link href="/cart" style={{ display: "flex", alignItems: "center", gap: "0.4rem", textDecoration: "none", color: "inherit" }}>
      Cart
      {isMounted && cartCount > 0 && (
        <span style={{ 
          background: "#111", 
          color: "#fff", 
          fontSize: "0.65rem", 
          fontWeight: 700, 
          padding: "0.1rem 0.4rem", 
          borderRadius: "1rem" 
        }}>
          {cartCount}
        </span>
      )}
    </Link>
  );
}
