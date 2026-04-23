"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import type { CatalogueProduct } from "./types";

interface Props {
  product: CatalogueProduct;
  onClick: () => void;
}

/** Format price as Indonesian thousand-separator without toLocaleString (avoids hydration mismatch) */
function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function CatalogueProductCard({ product, onClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cat-product-card neo-glow-ring"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Image container */}
      <div className="cat-product-image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Hover shine */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Quick View button — appears on hover via CSS */}
        <button
          type="button"
          className="cat-quick-add"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Quick View
        </button>
      </div>

      {/* Product info */}
      <div className="cat-product-info">
        <div className="cat-product-category">{product.category}</div>
        <div className="cat-product-name">{product.name}</div>

        {/* Star rating */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < product.rating ? "#111" : "#ddd"}
              color={i < product.rating ? "#111" : "#ddd"}
            />
          ))}
        </div>

        <div className="cat-product-footer">
          <span className="cat-product-price">Rp{formatPrice(product.price)}</span>
          <div className="cat-color-dots">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="cat-color-dot"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
