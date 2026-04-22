"use client";

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import FilterBar from "../ui/FilterBar";
import ProductCard from "../ui/ProductCard";
import AnimatedText from "../ui/AnimatedText";
import SectionLabel from "../ui/SectionLabel";
import { DISCOVER_PRODUCTS } from "../data/products";

export default function DiscoverSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawYLeft = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [60, -30]);

  const yLeft = useSpring(rawYLeft, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });

  return (
    <section ref={sectionRef} className="discover-section">
      <FilterBar />

      {/* Content */}
      <div className="discover-content">
        {/* Left sticky panel */}
        <motion.div className="discover-left" style={{ y: yLeft }}>
          <SectionLabel number="02" color="#111" />

          <AnimatedText text="Discover" as="h3" baseDelay={0} />
          <AnimatedText text="Reimagined" as="h3" baseDelay={0.3} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            From tees to hoodies, every piece is crafted with next-gen fabric innovation and future-forward comfort.
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

        {/* Right: Product Cards */}
        <motion.div className="discover-right" style={{ y: yCards }}>
          {DISCOVER_PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
