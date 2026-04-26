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

const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToProduct(
  row: {
    id: string;
    name: string;
    description: string;
    price: unknown;
    rating: number;
    sizes: string | null;
    sizeOptions: string[];
    sizeStocks: number[];
    images: string[];
    colors: string[];
    inStock: boolean;
    category: { name: string };
    stock: number;
    variants: Array<{
      id: string;
      size: string;
      color: string | null;
      stock: number;
    }>;
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
    sizes:
      row.sizes ??
      (row.sizeOptions.length > 0
        ? row.sizeOptions.length > 1
          ? `${row.sizeOptions[0]} - ${row.sizeOptions[row.sizeOptions.length - 1]}`
          : row.sizeOptions[0]
        : "S - XXL"),
    image: row.images?.[0] ?? "/images/model1.jpg",
    colors: row.colors ?? [],
    sizeOptions: row.sizeOptions ?? [],
    sizeStocks: row.sizeStocks ?? [],
    inStock: row.inStock && (row.variants.length === 0 || row.variants.some((v) => v.stock > 0)),
    variants: row.variants.map((v) => ({
      id: v.id,
      productId: row.id,
      size: v.size,
      color: v.color ?? undefined,
      stock: v.stock,
    })),
  };
}

function expandSizeRange(range: string): string[] {
  const parts = range.split(" - ").map((s) => s.trim());
  if (parts.length < 2) return [range.trim()];
  const [start, end] = parts;

  if (start.startsWith("W") && end.startsWith("W")) {
    const s = parseInt(start.slice(1), 10);
    const e = parseInt(end.slice(1), 10);
    if (!Number.isNaN(s) && !Number.isNaN(e) && e >= s) {
      const result: string[] = [];
      for (let i = s; i <= e; i += 2) result.push(`W${i}`);
      return result;
    }
  }

  const si = LETTER_SIZES.indexOf(start);
  const ei = LETTER_SIZES.indexOf(end);
  if (si !== -1 && ei !== -1 && ei >= si) return LETTER_SIZES.slice(si, ei + 1);

  return [start, end].filter(Boolean);
}

function parseSizes(sizes: string | null): string[] {
  if (!sizes) return [];
  if (sizes.includes(",")) return sizes.split(",").map((s) => s.trim()).filter(Boolean);
  if (sizes.includes(" - ")) return expandSizeRange(sizes);
  return [sizes.trim()].filter(Boolean);
}

function assertCorrelatedSizeStock(row: {
  id: string;
  sizes: string | null;
  sizeOptions: string[];
  sizeStocks: number[];
  stock: number;
}) {
  if (row.sizeOptions.length === 0 && row.sizes) {
    const parsed = parseSizes(row.sizes);
    if (parsed.length > 0) {
      throw new Error(
        `Product ${row.id} invalid: sizeOptions kosong padahal sizes terisi (${row.sizes}).`
      );
    }
  }

  if (row.sizeOptions.length !== row.sizeStocks.length) {
    throw new Error(
      `Product ${row.id} invalid: sizeOptions (${row.sizeOptions.length}) tidak sama dengan sizeStocks (${row.sizeStocks.length}).`
    );
  }

  if (row.sizeStocks.some((n) => n < 0)) {
    throw new Error(`Product ${row.id} invalid: sizeStocks tidak boleh negatif.`);
  }

  if (row.stock < 0) {
    throw new Error(`Product ${row.id} invalid: stock tidak boleh negatif.`);
  }
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
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
    });

    rows.forEach(assertCorrelatedSizeStock);

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
      where: { inStock: true, id },
      include: { category: true, variants: true },
      take: 1,
    });

    all.forEach(assertCorrelatedSizeStock);

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
