"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { FILTER_OPTIONS } from "../data/navigation";

export default function FilterBar() {
  return (
    <motion.div
      className="discover-filter-bar"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2>Filter by</h2>

      <div className="filter-pills">
        {FILTER_OPTIONS.map((filter, i) => (
          <motion.button
            key={filter}
            className="filter-pill"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
  );
}
