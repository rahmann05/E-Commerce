"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MultiColorWave from "../../features/MultiColorWave";
import styles from "./AboutCTA.module.css";

const MotionLink = motion.create(Link);

export default function AboutCTA() {
  return (
    <section className={styles.aboutCtaSection}>
      <MultiColorWave />
      <div className={styles.aboutCtaContent}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ 
            fontSize: "clamp(3.5rem, 9vw, 8rem)", 
            fontWeight: 900, 
            letterSpacing: "-0.05em", 
            color: "#fff",
            textShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >
          Craft Your Essential.
        </motion.h2>
        
        <p className={styles.aboutCtaDescription}>
          Join the community of those who value quality over quantity. 
          Your perfect wardrobe starts here.
        </p>

        <MotionLink
          href="/"
          whileHover={{ scale: 1.05, background: "#111", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "inline-block",
            marginTop: "4rem",
            padding: "1.5rem 4.5rem",
            borderRadius: "4rem",
            background: "#fff",
            color: "#111",
            fontWeight: 800,
            textDecoration: "none",
            fontSize: "1rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            transition: "all 0.4s ease"
          }}
        >
          Explore Collection
        </MotionLink>
      </div>
    </section>
  );
}
