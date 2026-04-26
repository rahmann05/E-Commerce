"use client";

import { motion } from "framer-motion";
import RevealText from "../../ui/RevealText";

interface AboutEthosProps {
  studioModel2: string;
}

export default function AboutEthos({ studioModel2 }: AboutEthosProps) {
  return (
    <section style={{ padding: "10vh 2rem 20vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8rem", alignItems: "center" }}>
         <div>
            <RevealText 
              text="Fashion is temporary. Comfort is essential." 
              style={{ 
                fontSize: "clamp(2.5rem, 5vw, 4rem)", 
                fontWeight: 800, 
                lineHeight: 1.1, 
                letterSpacing: "-0.04em",
                color: "#111",
                marginBottom: "2rem"
              }} 
            />
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#777", maxWidth: "450px" }}>
              Every piece we create is a response to the fast-fashion cycle. 
              We build garments that last, in styles that never fade.
            </p>
         </div>

         <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            style={{ 
              width: "100%", 
              aspectRatio: "1/1", 
              borderRadius: "50%", 
              overflow: "hidden",
              boxShadow: "20px 20px 60px rgba(0,0,0,0.08), -20px -20px 60px rgba(255,255,255,0.8)",
              border: "15px solid #f5f5f3"
            }}
          >
            <img src={studioModel2} alt="Studio Ethics" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
      </div>
    </section>
  );
}
