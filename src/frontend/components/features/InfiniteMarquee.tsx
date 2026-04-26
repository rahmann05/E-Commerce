"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCarouselImages } from "@/frontend/lib/actions/catalogue";

interface InfiniteMarqueeProps {
  /** Animation duration in seconds */
  speed?: number;
  /** Height of each item */
  itemHeight?: number;
}

export default function InfiniteMarquee({ speed = 25, itemHeight = 380 }: InfiniteMarqueeProps) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      const data = await getCarouselImages();
      setImages([...data, ...data]); // duplicate for seamless loop
    }
    loadImages();
  }, []);

  if (images.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", padding: "2rem 0" }}>
      <motion.div
        style={{ display: "flex", gap: "3rem", width: "max-content" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{
              width: "320px",
              height: `${itemHeight}px`,
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={src || "/images/model1.jpg"}
              alt="Clothing"
              style={{
                width: "90%",
                height: "90%",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
