"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Delay before the first letter starts animating */
  baseDelay?: number;
  /** Delay between each letter */
  letterDelay?: number;
  /** Tag to render: h1, h2, h3, p, span */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** If provided externally, uses this instead of internal inView */
  inView?: boolean;
}

export default function AnimatedText({
  text,
  className,
  style,
  baseDelay = 0,
  letterDelay = 0.03,
  as: Tag = "h2",
  inView: externalInView,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const internalInView = useInView(ref, { once: true, margin: "-80px" });
  const isInView = externalInView !== undefined ? externalInView : internalInView;

  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <Tag className={className} style={style}>
        {text.split("").map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: 100, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: baseDelay + i * letterDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}
