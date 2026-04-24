"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import GlowOrb from "../../components/ui/GlowOrb";

// Modular Sections
import AboutHero from "../../components/sections/about/AboutHero";
import AboutStory from "../../components/sections/about/AboutStory";
import AboutTeam from "../../components/sections/about/AboutTeam";
import AboutValues from "../../components/sections/about/AboutValues";
import AboutCTA from "../../components/sections/about/AboutCTA";
import Footer from "../../components/layout/Footer";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Assets
  const studioModel1 = "/images/about/model1.png";

  return (
    <div ref={containerRef} style={{ background: "#f5f5f3", color: "#111", minHeight: "100vh", overflow: "hidden" }}>
      
      {/* Subtle Background Glows */}
      <GlowOrb color="rgba(155,81,224,0.05)" size={800} top="-20%" left="-10%" duration={30} />
      <GlowOrb color="rgba(255,140,0,0.03)" size={600} bottom="10%" right="-5%" duration={35} delay={5} />

      <AboutHero scrollYProgress={scrollYProgress} />
      
      <AboutStory studioModel1={studioModel1} />
      
      <AboutTeam />
      
      <AboutValues />
      
      <AboutCTA />

      {/* Footer without scroll animation for About page as requested */}
      <Footer noAnimation={true} />
    </div>
  );
}
