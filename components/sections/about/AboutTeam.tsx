"use client";

import SectionLabel from "../../ui/SectionLabel";
import ImmersiveSlider3D from "../../features/ImmersiveSlider3D";
import { TEAM } from "../../data/team";

export default function AboutTeam() {
  return (
    <section style={{ 
      position: "relative", 
      zIndex: 10, 
      padding: "15vh 0", 
      background: "linear-gradient(to bottom, #f5f5f3, #ffffff)",
      borderTop: "1px solid rgba(0,0,0,0.03)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "6rem" }}>
        <SectionLabel number="03" label="Our Team" color="#bbb" />
        <h2 style={{ 
          fontSize: "clamp(3rem, 5vw, 4.5rem)", 
          fontWeight: 800, 
          letterSpacing: "-0.04em", 
          marginTop: "1.5rem", 
          color: "#111",
          lineHeight: 1
        }}>
          The Creative Collective
        </h2>
        <p style={{ marginTop: "1.5rem", color: "#888", fontSize: "1.1rem", fontWeight: 400 }}>
          Meet the minds engineering the future of daily wear.
        </p>
      </div>

      <ImmersiveSlider3D items={TEAM.map(m => ({ ...m, id: m.name }))} />
    </section>
  );
}
