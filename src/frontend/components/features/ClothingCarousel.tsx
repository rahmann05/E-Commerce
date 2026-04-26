"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
type ClothingItem = any;

interface ClothingCarouselProps {
  currentTee: ClothingItem;
  currentJeans: ClothingItem;
  comboKey: number;
  onNext: () => void;
  onPrev: () => void;
  yCards: MotionValue<number>;
}

export default function ClothingCarousel({
  currentTee,
  currentJeans,
  comboKey,
  onNext,
  onPrev,
  yCards,
}: ClothingCarouselProps) {
  const router = useRouter();

  return (
    <motion.div
      style={{
        y: yCards,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "10%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.2rem",
        zIndex: 30,
        width: "100%",
      }}
    >
      {/* Controls + Cards */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <button
          onClick={onPrev}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <ChevronLeft size={28} color="#111" />
        </button>

        <div style={{ width: 640, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={comboKey}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{ display: "flex", gap: "2rem", width: "100%", margin: 0 }}
            >
              <div
                className="floating-product-card"
                style={{ flex: 1, padding: "2rem", width: "auto", height: "300px" }}
              >
                <span className="card-label" style={{ fontSize: "1.1rem" }}>
                  {currentTee.name}
                </span>
                <div className="card-image" style={{ height: "220px" }}>
                  <Image
                    src={currentTee.image || "/images/model1.jpg"}
                    alt={currentTee.name || "Clothing Item"}
                    fill
                    className="object-contain"
                    style={{ mixBlendMode: "darken", transition: "all 0.6s ease" }}
                  />
                </div>
              </div>
              <div
                className="floating-product-card"
                style={{ flex: 1, padding: "2rem", width: "auto", height: "300px" }}
              >
                <span className="card-label" style={{ fontSize: "1.1rem" }}>
                  {currentJeans.name}
                </span>
                <div className="card-image" style={{ height: "220px" }}>
                  <Image
                    src={currentJeans.image || "/images/model1.jpg"}
                    alt={currentJeans.name || "Clothing Item"}
                    fill
                    className="object-contain"
                    style={{ mixBlendMode: "darken", transition: "all 0.6s ease" }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={onNext}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <ChevronRight size={28} color="#111" />
        </button>
      </div>

      {/* Centered Buy Now Button */}
      <motion.button
        className="buy-now-btn"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/catalogue")}
        style={{ position: "relative" }}
      >
        Buy Now
        <span className="arrow-circle">
          <ArrowUpRight size={14} />
        </span>
      </motion.button>
    </motion.div>
  );
}
