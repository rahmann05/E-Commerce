"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SliderItem {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  accent: string;
}

interface ImmersiveSlider3DProps {
  items: SliderItem[];
}

export default function ImmersiveSlider3D({ items }: ImmersiveSlider3DProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [isHovered, items.length]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        height: "600px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "2000px",
        overflow: "visible",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const isActive = i === index;
            const isPrev = (index - 1 + items.length) % items.length === i;
            const isNext = (index + 1) % items.length === i;

            if (!isActive && !isPrev && !isNext) return null;

            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 0;
            let scale = 0.9;

            if (isActive) {
              x = 0;
              z = 200;
              rotateY = 0;
              opacity = 1;
              scale = 1;
            } else if (isPrev) {
              x = -400;
              z = -300;
              rotateY = 25;
              opacity = 0.4;
            } else if (isNext) {
              x = 400;
              z = -300;
              rotateY = -25;
              opacity = 0.4;
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: x * 1.5, z: z - 400, rotateY }}
                animate={{ opacity, x, z, rotateY, scale }}
                exit={{ opacity: 0, x: x * 1.5, z: z - 400, rotateY }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  width: "360px",
                  height: "500px",
                  background: "#fff",
                  borderRadius: "1.5rem",
                  boxShadow: isActive 
                    ? "0 30px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)" 
                    : "0 10px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  padding: "3rem 2rem",
                  cursor: isActive ? "default" : "pointer",
                  zIndex: isActive ? 10 : 1,
                  overflow: "hidden"
                }}
                onClick={() => !isActive && setIndex(i)}
              >
                {/* Clean Image Holder */}
                <div style={{ 
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  marginBottom: "2rem",
                  background: "#f9f9f9",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(0,0,0,0.03)"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    borderRadius: "0.75rem", 
                    overflow: "hidden"
                  }}>
                    <img src={item.avatar} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>

                <div style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.6s ease", textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: "0.3rem", letterSpacing: "-0.02em" }}>
                    {item.name}
                  </h3>
                  
                  <p style={{ 
                    fontSize: "0.7rem", 
                    color: "#999", 
                    fontWeight: 700, 
                    textTransform: "uppercase", 
                    letterSpacing: "0.2em",
                    marginBottom: "1.2rem"
                  }}>
                    {item.role}
                  </p>

                  <p style={{ 
                    fontSize: "0.9rem", 
                    lineHeight: 1.6, 
                    color: "#666",
                    fontWeight: 400
                  }}>
                    {item.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation - Clean style */}
      <div style={{ position: "absolute", bottom: "0", display: "flex", gap: "1.5rem", zIndex: 20 }}>
        <button 
          onClick={prev}
          style={{ 
            background: "#fff", 
            border: "1px solid rgba(0,0,0,0.05)",
            color: "#111", 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%", 
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "#111";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#111";
          }}
        >
          ←
        </button>
        <button 
          onClick={next}
          style={{ 
            background: "#fff", 
            border: "1px solid rgba(0,0,0,0.05)",
            color: "#111", 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%", 
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "#111";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#111";
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
