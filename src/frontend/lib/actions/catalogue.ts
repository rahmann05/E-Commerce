/**
 * lib/actions/catalogue.ts
 * Server Actions for the catalogue page.
 * All functions run on the server — safe to query MySQL directly.
 */

"use server";

import prisma from "@/backend/prisma/client";
import type { CatalogueProduct } from "@/components/catalogue/types";
import { CATALOGUE_PRODUCTS_FALLBACK } from "@/components/data/products";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CategoryFilter = "all" | "tees" | "jeans" | "accessories" | "outerwear";

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToProduct(
  row: {
    id: string;
    name: string;
    description: string;
    price: unknown;
    rating: number;
    sizes: string | null;
    images: string[];
    colors: string[];
    inStock: boolean;
    category: { name: string };
  },
  index: number
): CatalogueProduct {
  const categoryName = row.category.name.toLowerCase();
  const category = (["tees", "jeans", "accessories", "outerwear"].includes(categoryName)
    ? categoryName
    : "tees") as CatalogueProduct["category"];
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    category,
    price: Number(row.price),
    rating: row.rating ?? 5,
    sizes: row.sizes ?? "S - XXL",
    image: row.images?.[0] ?? "/images/model1.jpg",
    colors: row.colors ?? [],
    inStock: row.inStock,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch products from PostgreSQL via Prisma.
 * Falls back to static data if the DB is unreachable.
 */
export async function getProducts(
  category: CategoryFilter = "all"
): Promise<CatalogueProduct[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        inStock: true,
        ...(category === "all" ? {} : { category: { name: { equals: category, mode: "insensitive" } } }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(rowToProduct);
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
  id: string
): Promise<CatalogueProduct | null> {
  try {
    const all = await prisma.product.findMany({
      where: { inStock: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    const mapped = all.map((row, idx) => rowToProduct(row, idx));
    return mapped.find((item: CatalogueProduct) => item.id === id) ?? null;
  } catch (err) {
    console.error("[DB] getProductById failed:", err);
    return CATALOGUE_PRODUCTS_FALLBACK.find((p) => String(p.id) === String(id)) ?? null;
  }
}

export async function getTees(): Promise<CatalogueProduct[]> {
  return getProducts("tees");
}

export async function getJeans(): Promise<CatalogueProduct[]> {
  return getProducts("jeans");
}

export async function getCarouselImages(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      select: { images: true },
      take: 8,
    });
    return products.flatMap(p => p.images).filter((img): img is string => !!img);
  } catch (err) {
    console.error("[DB] getCarouselImages failed:", err);
    return CATALOGUE_PRODUCTS_FALLBACK.map(p => p.image);
  }
}
