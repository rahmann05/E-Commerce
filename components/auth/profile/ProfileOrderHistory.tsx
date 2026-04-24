"use client";

/**
 * components/auth/profile/ProfileOrderHistory.tsx
 * Order history section with editorial section label /04.
 */

import type { MockOrder } from "./ProfileOrderCard";
import ProfileOrderCard from "./ProfileOrderCard";

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "NVR-2048",
    date: "20 Apr 2026",
    productName: "Boxy Sage Green Tee",
    details: "Size: L · Color: Sage Green · Qty: 1",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
    total: "Rp1.140.000",
    status: "delivered",
  },
  {
    id: "NVR-1997",
    date: "5 Mar 2026",
    productName: "Charcoal Heavyweight Hoodie",
    details: "Size: XL · Color: Charcoal · Qty: 2",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    total: "Rp700.000",
    status: "delivered",
  },
  {
    id: "NVR-2061",
    date: "22 Apr 2026",
    productName: "Classic White Boxy Fit",
    details: "Size: M · Color: White · Qty: 1",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600",
    total: "Rp500.000",
    status: "processing",
  },
];

export default function ProfileOrderHistory() {
  return (
    <section>
      <p className="profile-section-title">
        Riwayat Pesanan
      </p>
      {MOCK_ORDERS.map((order, i) => (
        <ProfileOrderCard key={order.id} order={order} delay={i * 0.1} />
      ))}
    </section>
  );
}
