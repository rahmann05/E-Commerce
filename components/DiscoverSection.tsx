"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Search, ChevronDown, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const products = [
  {
    id: 1,
    name: "Amber Blaze Classic Tee",
    sizes: "XS - XXXL",
    price: 250,
    rating: 5,
    image: "/images/model-1.png",
  },
  {
    id: 2,
    name: "Mystic Mauve Everyday Crew",
    sizes: "S - XXL",
    price: 350,
    rating: 4,
    image: "/images/model-2.png",
  },
  {
    id: 3,
    name: "Amber Blaze Diffuser Coat",
    sizes: "S - L",
    price: 500,
    rating: 5,
    image: "/images/model-3.png",
    blurred: true,
  },
];

export default function DiscoverSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawYLeft = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [60, -30]);

  const yLeft = useSpring(rawYLeft, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });

  // Letter animation for heading
  const heading1 = "Discover";
  const heading2 = "Reimagined";

  return (
    <section ref={sectionRef} className="discover-section">
      {/* Filter Bar */}
      <motion.div
        className="discover-filter-bar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>Filter by</h2>

        <div className="filter-pills">
          {["Category", "Size", "Color", "Price"].map((filter, i) => (
            <motion.button
              key={filter}
              className="filter-pill"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {filter} <ChevronDown size={14} />
            </motion.button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <motion.div
            className="search-input-container"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <input type="text" placeholder="search" />
            <Search size={14} className="search-icon" />
          </motion.div>
          <motion.span
            className="search-text"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ cursor: "pointer" }}
          >
            Search
          </motion.span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="discover-content">
        {/* Left sticky panel */}
        <motion.div className="discover-left" style={{ y: yLeft }}>
          <motion.span
            className="section-num"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            /02
          </motion.span>

          <div ref={headingRef} style={{ overflow: "hidden" }}>
            <h3>
              {heading1.split("").map((letter, i) => (
                <motion.span
                  key={`h1-${i}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={
                    headingInView
                      ? { y: 0, opacity: 1 }
                      : { y: 100, opacity: 0 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: i * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
              <br />
              {heading2.split("").map((letter, i) => (
                <motion.span
                  key={`h2-${i}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={
                    headingInView
                      ? { y: 0, opacity: 1 }
                      : { y: 100, opacity: 0 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + i * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </h3>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            From tees to hoodies, every piece is crafted with next-gen fabric
            innovation and future-forward comfort.
          </motion.p>

          <motion.button
            className="explore-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore All
            <span className="arrow-circle">
              <ArrowUpRight size={14} />
            </span>
          </motion.button>
        </motion.div>

        {/* Right: Product Cards with horizontal scroll */}
        <motion.div className="discover-right" style={{ y: yCards }}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 80, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              onHoverStart={() => setHoveredCard(product.id)}
              onHoverEnd={() => setHoveredCard(null)}
              style={{
                opacity: product.blurred ? 0.45 : 1,
                filter: product.blurred ? "blur(1.5px)" : "none",
              }}
            >
              <div className="product-card-image">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                />

                {/* Hover overlay shine effect */}
                <motion.div
                  animate={{
                    opacity: hoveredCard === product.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </div>

              <div className="product-card-info">
                <div>
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-sizes">{product.sizes}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="product-card-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < product.rating ? "#111" : "#ddd"}
                        color={i < product.rating ? "#111" : "#ddd"}
                      />
                    ))}
                  </div>
                  <div className="product-card-price">${product.price}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
