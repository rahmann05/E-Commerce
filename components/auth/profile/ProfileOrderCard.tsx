"use client";

/**
 * components/auth/profile/ProfileOrderCard.tsx
 * Order card — clean white style with product image thumbnail and clothing-color status badges.
 */

import { motion } from "framer-motion";
import Image from "next/image";
import type { ProfileOrder } from "@/components/providers/ProfileDataContext";

const STATUS_LABELS: Record<ProfileOrder["status"], string> = {
  delivered: "Terkirim",
  processing: "Diproses",
  shipped: "Dikirim",
};

interface ProfileOrderCardProps {
  order: ProfileOrder;
  delay?: number;
}

function formatPrice(value: number): string {
  return `Rp${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ProfileOrderCard({ order, delay = 0 }: ProfileOrderCardProps) {
  const primaryItem = order.items[0];
  const itemCount = order.items.length;

  if (!primaryItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
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
            src={primaryItem.imageUrl}
            alt={primaryItem.name}
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
            Pesanan #{order.id} · {formatDate(order.createdAt)}
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#111", marginBottom: "0.3rem" }}>
            {primaryItem.name}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            Size: {primaryItem.size} · Color: {primaryItem.color} · Qty: {primaryItem.quantity}
            {itemCount > 1 ? ` · +${itemCount - 1} item lainnya` : ""}
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
          {formatPrice(order.total)}
        </div>
        <span className={`profile-order-status status-${order.status}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>
    </motion.div>
  );
}
