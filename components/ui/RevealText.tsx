"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
}

export default function RevealText({ text, className, style, delay = 0, once = true }: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: "110%",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },

  };

  return (
    <motion.div
      ref={ref}
      style={{ display: "flex", flexWrap: "wrap", ...style }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} style={{ overflow: "hidden", display: "inline-block", marginRight: "0.4em", paddingBottom: "0.15em", marginBottom: "-0.15em" }}>
          <motion.span
            variants={childVariants}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}

    </motion.div>
  );
}
