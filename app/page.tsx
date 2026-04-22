"use client";

import { ColorProvider } from "@/components/ColorContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EssentializedSection from "@/components/EssentializedSection";
import DiscoverSection from "@/components/DiscoverSection";
import StyleOutlookSection from "@/components/StyleOutlookSection";
import ScienceSection from "@/components/ScienceSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ColorProvider>
      <main style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Sticky navbar appears after scroll */}
        <Navbar />

        {/* Section 1: Dark hero with cursor-following clothes */}
        <HeroSection />

        {/* Section 2: Essentialized - giant text clipping into animated wave */}
        <EssentializedSection />

        {/* Section 3: Discover Reimagined - product grid */}
        <DiscoverSection />

        {/* Section 4: Style Outlook - Parallax Bento Grid */}
        <StyleOutlookSection />

        {/* Section 5: Science of Everyday Comfort */}
        <ScienceSection />

        {/* Footer */}
        <Footer />
      </main>
    </ColorProvider>
  );
}
