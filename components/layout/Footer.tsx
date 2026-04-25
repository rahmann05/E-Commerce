"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

interface FooterProps {
  noAnimation?: boolean;
}

export default function Footer({ noAnimation = false }: FooterProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const scale = useSpring(rawScale, { stiffness: 60, damping: 20 });

  const links = [
    {
      title: "Shop",
      items: [
        { label: "Catalogue", href: "/catalogue" },
        { label: "Cart", href: "/cart" },
        { label: "Profile", href: "/profile" },
        { label: "Login", href: "/login" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Home", href: "/" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "FAQ", href: "/about" },
        { label: "Returns", href: "/about" },
        { label: "Shipping", href: "/about" },
        { label: "Contact", href: "/about" },
      ],
    },
  ];

  return (
    <motion.footer
      ref={ref}
      style={{ scale: noAnimation ? 1 : scale }}
      className="site-footer"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "3rem",
          textAlign: "left",
          maxWidth: "1000px",
          margin: "0 auto 4rem",
        }}
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            Novure
          </div>
          <p style={{ lineHeight: 1.7, maxWidth: 220 }}>
            Essentialized daily wear for the modern man. Designed with purpose.
          </p>
        </motion.div>

        {/* Link columns */}
        {links.map((col, ci) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + ci * 0.1 }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "1rem",
                letterSpacing: "0.03em",
              }}
            >
              {col.title}
            </div>

            {col.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  marginBottom: "0.6rem",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  fontSize: "0.82rem",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
                }
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          margin: "0 auto 2rem",
          transformOrigin: "center",
        }}
      />

      <p>© 2026 Novure. All rights reserved.</p>
    </motion.footer>
  );
}
