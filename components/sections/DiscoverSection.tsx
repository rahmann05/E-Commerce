"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchProductsAction } from "@/lib/actions/product-actions";
import type { DiscoverProduct } from "@/components/data/products";

import FilterBar from "../ui/FilterBar";
import ProductCard from "../ui/ProductCard";
import AnimatedText from "../ui/AnimatedText";
import SectionLabel from "../ui/SectionLabel";

export default function DiscoverSection() {
  const [products, setProducts] = useState<DiscoverProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProductsAction();
      setProducts(data);
      // Start in the middle of the triple-list for infinite feel
      setCurrentIndex(data.length > 0 ? data.length : 0);
    }
    loadProducts();
  }, []);

  const totalItems = products.length;
  const displayProducts = [...products, ...products, ...products];

  const handleNext = useCallback(() => {
    if (isAnimating || totalItems === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating, totalItems]);

  const handlePrev = useCallback(() => {
    if (isAnimating || totalItems === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating, totalItems]);

  // Handle wrap-around for infinite loop
  useEffect(() => {
    if (totalItems === 0) return;

    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
    if (currentIndex < totalItems) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(totalItems * 2 - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawYLeft = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const rawYCards = useTransform(scrollYProgress, [0, 1], [60, -30]);

  const yLeft = useSpring(rawYLeft, { stiffness: 60, damping: 20 });
  const yCards = useSpring(rawYCards, { stiffness: 60, damping: 20 });

  // Calculate X offset: card width (300px) + gap (2rem = 32px) = 332px
  const cardWidthWithGap = 332;

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
            onClick={() => router.push("/catalogue")}
          >
            Explore All
            <span className="arrow-circle">
              <ArrowUpRight size={14} />
            </span>
          </motion.button>

          {/* Slider Controls */}
          <div className="slider-controls">
            <motion.button
              className="slider-nav-btn"
              onClick={handlePrev}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              className="slider-nav-btn"
              onClick={handleNext}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Right: Product Cards Slider */}
        <div className="discover-right-container">
          <motion.div 
            className="discover-right" 
            style={{ y: yCards }}
            animate={{ x: -currentIndex * cardWidthWithGap }}
            transition={isAnimating ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <ProductCard 
                  key={`${product.id}-${index}`} 
                  product={product} 
                  index={index % totalItems} 
                />
              ))
            ) : (
              <p className="loading-text">Loading products...</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
