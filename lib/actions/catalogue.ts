/**
 * lib/actions/catalogue.ts
 * Server Actions for the catalogue page.
 * All functions run on the server — safe to query MySQL directly.
 */

"use server";

import pool from "@/lib/db";
import type { CatalogueProduct } from "@/components/catalogue/types";
import { CATALOGUE_PRODUCTS_FALLBACK } from "@/components/data/products";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CategoryFilter = "all" | "tees" | "jeans" | "accessories" | "outerwear";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseColors(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  return [];
}

function rowToProduct(row: Record<string, unknown>): CatalogueProduct {
  return {
    id:          Number(row.id),
    name:        String(row.name),
    description: String(row.description ?? ""),
    category:    String(row.category) as CatalogueProduct["category"],
    price:       Number(row.price),
    rating:      Number(row.rating),
    sizes:       String(row.sizes ?? "S - XXL"),
    image:       String(row.image),
    colors:      parseColors(row.colors),
    inStock:     Boolean(row.in_stock),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch products from MySQL.
 * Falls back to static data if the DB is unreachable.
 */
export async function getProducts(
  category: CategoryFilter = "all"
): Promise<CatalogueProduct[]> {
  try {
    const sql =
      category === "all"
        ? "SELECT * FROM products WHERE in_stock = 1 ORDER BY created_at DESC"
        : "SELECT * FROM products WHERE in_stock = 1 AND category = ? ORDER BY created_at DESC";

    const params = category === "all" ? [] : [category];
    const [rows] = await pool.execute(sql, params);

    return (rows as Record<string, unknown>[]).map(rowToProduct);
  } catch (err) {
    console.error("[DB] getProducts failed — using static fallback:", err);
    if (category === "all") return CATALOGUE_PRODUCTS_FALLBACK;
    return CATALOGUE_PRODUCTS_FALLBACK.filter((p) => p.category === category);
  }
}

/**
 * Fetch a single product by ID.
 * Returns null if not found or DB unreachable.
 */
export async function getProductById(
  id: number
): Promise<CatalogueProduct | null> {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );
    const arr = rows as Record<string, unknown>[];
    if (arr.length === 0) return null;
    return rowToProduct(arr[0]);
  } catch (err) {
    console.error("[DB] getProductById failed:", err);
    return CATALOGUE_PRODUCTS_FALLBACK.find((p) => p.id === id) ?? null;
  }
}
