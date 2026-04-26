"use client";

import { motion } from "framer-motion";
import type { CatalogueProduct } from "./types";
import CatalogueProductCard from "./CatalogueProductCard";

interface Props {
  products: CatalogueProduct[];
  onSelectProduct: (product: CatalogueProduct) => void;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function CatalogueGrid({ products, onSelectProduct }: Props) {
  return (
    <div className="catalogue-grid-area">
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "6rem 2rem",
            color: "#bbb",
            fontSize: "1.1rem",
          }}>
          No products found.
        </motion.div>
      ) : (
        <motion.div
          key={products.map((p) => p.id).join("-")}
          className="catalogue-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <CatalogueProductCard product={product} onClick={() => onSelectProduct(product)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
