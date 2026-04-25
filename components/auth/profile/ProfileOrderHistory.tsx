"use client";

/**
 * components/auth/profile/ProfileOrderHistory.tsx
 * Order history section with editorial section label /04.
 */

import ProfileOrderCard from "./ProfileOrderCard";
import { useProfileData } from "@/components/providers/ProfileDataContext";

export default function ProfileOrderHistory() {
  const { orders } = useProfileData();

  return (
    <section>
      <p className="profile-section-title">Riwayat Pesanan</p>

      {orders.length === 0 ? (
        <div
          style={{
            padding: "2rem 0",
            color: "#777",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            maxWidth: "600px",
          }}
        >
          Belum ada pesanan. Checkout dari halaman cart untuk melihat pesanan di sini.
        </div>
      ) : (
        orders.map((order, i) => (
          <ProfileOrderCard key={order.id} order={order} delay={i * 0.1} />
        ))
      )}
    </section>
  );
}
