"use client";

import { motion } from "framer-motion";
import type { CategoryFilter } from "@/lib/actions/catalogue";

import AnimatedText from "@/components/ui/AnimatedText";

interface Props {
  activeCategory: CategoryFilter;
  counts: Record<string, number>;
  onCategoryChange: (cat: CategoryFilter) => void;
  sortOrder: "asc" | "desc" | "default";
  onSortChange: (sort: "asc" | "desc" | "default") => void;
}

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: "all",        label: "All Items"    },
  { key: "tees",       label: "Tees"         },
  { key: "jeans",      label: "Denim"        },
  { key: "outerwear",  label: "Outerwear"    },
  { key: "accessories",label: "Accessories"  },
];

const SORT_OPTIONS: { key: "default" | "asc" | "desc"; label: string }[] = [
  { key: "default", label: "Featured"     },
  { key: "asc",     label: "Price ↑ Low" },
  { key: "desc",    label: "Price ↓ High"},
];

export default function CatalogueFilterSidebar({
  activeCategory,
  counts,
  onCategoryChange,
  sortOrder,
  onSortChange,
}: Props) {
  return (
    <motion.aside
      className="catalogue-sidebar"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatedText text="Filter & Sort" as="p" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", marginBottom: "1.5rem" }} />

      {/* Category section */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Category</div>
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.key}
            className={`sidebar-pill ${activeCategory === cat.key ? "active" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            onClick={() => onCategoryChange(cat.key)}
            whileTap={{ scale: 0.97 }}
          >
            {cat.label}
            <span className="count-badge">
              {counts[cat.key] ?? 0}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          width: "100%",
          height: "1px",
          background: "rgba(0,0,0,0.07)",
          marginBottom: "2rem",
          transformOrigin: "left",
        }}
      />

      {/* Sort section */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Sort by</div>
        {SORT_OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.key}
            className={`sidebar-pill ${sortOrder === opt.key ? "active" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
            onClick={() => onSortChange(opt.key)}
            whileTap={{ scale: 0.97 }}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>

      {/* Decorative info card — neumorphism on light surface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="neo-card"
        style={{
          marginTop: "2rem",
          padding: "1.4rem 1.5rem",
        }}
      >
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", marginBottom: "0.6rem" }}>
          Free Shipping
        </div>
        <div style={{ fontSize: "0.82rem", color: "#777", lineHeight: 1.65 }}>
          On orders above Rp500k. Delivered in 2–4 business days.
        </div>
      </motion.div>
    </motion.aside>
  );
}
