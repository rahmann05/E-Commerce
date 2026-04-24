"use client";

import { ColorProvider } from "@/components/providers/ColorContext";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import EssentializedSection from "@/components/sections/EssentializedSection";
import DiscoverSection from "@/components/sections/DiscoverSection";
import StyleOutlookSection from "@/components/sections/StyleOutlookSection";
import ScienceSection from "@/components/sections/ScienceSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <ColorProvider>
      <main style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Sticky navbar appears after scroll */}
        <Navbar />

        {/* Section 1: Dark hero with cursor-following clothes */}
        <HeroSection />

        {/* Section 2: Essentialized - */}
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
