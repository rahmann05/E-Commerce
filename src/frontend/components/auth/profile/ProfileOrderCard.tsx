"use client";

/**
 * components/auth/profile/ProfileOrderCard.tsx
 * Order card — clean white style with product image thumbnail and status badges.
 */

import Image from "next/image";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export interface MockOrder {
  id: string;
  date: string;
  productName: string;
  details: string; // e.g., "Size: M · Color: Sage Green · Qty: 1"
  imageUrl: string;
  total: string;
  status: "delivered" | "processing" | "shipped" | "awaiting_payment" | "cancelled";
}

const STATUS_LABELS: Record<MockOrder["status"], string> = {
  delivered: "Terkirim",
  processing: "Diproses",
  shipped: "Dikirim",
  awaiting_payment: "Menunggu Pembayaran",
  cancelled: "Dibatalkan",
};

interface ProfileOrderCardProps {
  order: MockOrder;
  delay?: number;
}

export default function ProfileOrderCard({ order }: ProfileOrderCardProps) {
  return (
    <div
      style={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "1.5rem 0",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        maxWidth: "600px"
      }} 
    >
      {/* Left: image + info */}
      <div style={{ display: "flex", gap: "1.2rem", flex: 1 }}>
        <div
          style={{
            width: 72,
            height: 84,
            borderRadius: "0.8rem",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            background: "#f0f0ef"
          }}
        >
          <Image
            src={order.imageUrl}
            alt={order.productName}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#aaa",
              letterSpacing: "0.06em",
              marginBottom: "0.4rem",
              textTransform: "uppercase"
            }}
          >
            Pesanan #{order.id} · {order.date}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "0.3rem" }}>
            {order.productName}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            {order.details}
          </div>
        </div>
      </div>

      {/* Right: total + status */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", justifyContent: "center", height: "84px" }}>
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#111",
          }}
        >
          {order.total}
        </div>
        <span className={`profile-order-status status-${order.status}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
        {order.status === "awaiting_payment" && (
          <Link 
            href={`/checkout/payment/${order.id}`}
            className="repay-btn"
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#fff",
              background: "#111",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              textDecoration: "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <CreditCard size={14} />
            Bayar Sekarang
          </Link>
        )}
      </div>
    </div>
  );
}
