"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/frontend/lib/image-utils";
type DiscoverProduct = any;

interface ProductCardProps {
  product: DiscoverProduct;
  index: number;
}

function formatPrice(price: number): string {
  const finalPrice = price < 10000 ? price * 1000 : price;
  return finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 80, rotateY: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        opacity: product.blurred ? 0.45 : 1,
        filter: product.blurred ? "blur(1.5px)" : "none",
      }}
    >
      <div className="product-card-image">
        <Image
          src={getImageUrl(product.image || "model1.jpg")}
          alt={product.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        {/* Hover overlay shine effect */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
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
          <div className="product-card-price">Rp {formatPrice(product.price)}</div>
        </div>
      </div>
    </motion.div>
  );
}
