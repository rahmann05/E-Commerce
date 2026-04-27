// Product data used across Essentialized, Hero, Science sections

export interface ClothingItem {
  name: string;
  image: string;
  color: string;
}

export interface HeroClothing {
  src: string;
  width: number;
  height: number;
}

export interface DiscoverProduct {
  id: string;
  name: string;
  sizes: string;
  price: number;
  rating: number;
  image: string;
  blurred?: boolean;
}

export const TEES: ClothingItem[] = [
  { name: "White Boxy Tee", image: "/images/tees1.png", color: "#e8e8e8" },
  { name: "Earth Brown", image: "/images/tees2.png", color: "#6b4423" },
  { name: "Sage Boxy Tee", image: "/images/tees3.png", color: "#8da38a" },
  { name: "Vintage Grey", image: "/images/tees4.png", color: "#7a7a7a" },
  { name: "Charcoal Boxy", image: "/images/tees5.png", color: "#333333" },
  { name: "Cream Heavy", image: "/images/tees6.png", color: "#f5f5dc" },
  { name: "Olive Boxy", image: "/images/tees7.png", color: "#556b2f" },
];

export const JEANS: ClothingItem[] = [
  { name: "Blue Baggy", image: "/images/jeans1.png", color: "#2b4c7e" },
  { name: "Washed Black", image: "/images/jeans2.png", color: "#1a1a1a" },
  { name: "Light Wash", image: "/images/jeans3.png", color: "#5b84b1" },
  { name: "Deep Indigo", image: "/images/jeans4.png", color: "#16213e" },
  { name: "Faded Black", image: "/images/jeans5.png", color: "#2d2d2d" },
  { name: "Raw Selvedge", image: "/images/jeans6.png", color: "#0f172a" },
];

export const HERO_CLOTHING: HeroClothing[] = [
  { src: "/images/tees1.png", width: 120, height: 120 },
  { src: "/images/jeans1.png", width: 100, height: 140 },
  { src: "/images/tees3.png", width: 110, height: 110 },
  { src: "/images/jeans2.png", width: 110, height: 130 },
  { src: "/images/tees6.png", width: 90, height: 90 },
  { src: "/images/tees4.png", width: 130, height: 130 },
  { src: "/images/jeans6.png", width: 100, height: 140 },
  { src: "/images/tees5.png", width: 110, height: 110 },
];

export const DISCOVER_PRODUCTS: DiscoverProduct[] = [
  { id: "1", name: "Sage Green Boxy Tee", sizes: "S - XXL", price: 250, rating: 5, image: "/images/tees3.png" },
  { id: "2", name: "Charcoal Boxy Tee", sizes: "S - XXL", price: 350, rating: 4, image: "/images/tees5.png" },
  { id: "3", name: "White Boxy Tee", sizes: "S - XXL", price: 250, rating: 5, image: "/images/tees1.png", blurred: true },
];

export const CAROUSEL_IMAGES = [
  "/images/tees1.png",
  "/images/jeans1.png",
  "/images/tees3.png",
  "/images/jeans2.png",
  "/images/tees6.png",
  "/images/jeans6.png",
  "/images/tees4.png",
  "/images/tees5.png",
];

// ── Catalogue fallback (used when DB is unreachable) ──────────────────────────
import type { CatalogueProduct } from "@/components/catalogue/types";

export const CATALOGUE_PRODUCTS_FALLBACK: CatalogueProduct[] = [
  {
    id: "f1",
    name: "White Boxy Tee",
    description: "Heavyweight 280gsm cotton with a perfect boxy silhouette.",
    category: "tees",
    price: 250,
    rating: 5,
    sizes: "S - XXL",
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    sizeStocks: [12, 45, 30, 10, 5],
    image: "/images/tees1.png",
    colors: ["#e8e8e8"],
    inStock: true,
  },
  {
    id: "f2",
    name: "Earth Brown Boxy Tee",
    description: "Earthy brown pigment-dyed tee. Features dropped shoulders.",
    category: "tees",
    price: 280,
    rating: 4,
    sizes: "S - XXL",
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    sizeStocks: [20, 15, 40, 22, 10],
    image: "/images/tees2.png",
    colors: ["#6b4423"],
    inStock: true,
  },
  {
    id: "f3",
    name: "Blue Baggy Denim",
    description: "Classic blue wash with a relaxed wide leg.",
    category: "jeans",
    price: 890,
    rating: 5,
    sizes: "W28 - W36",
    sizeOptions: ["W28", "W30", "W32", "W34", "W36"],
    sizeStocks: [8, 12, 25, 18, 10],
    image: "/images/jeans1.png",
    colors: ["#2b4c7e"],
    inStock: true,
  },
  {
    id: "f4",
    name: "Washed Black Denim",
    description: "Faded black denim with a soft, broken-in feel.",
    category: "jeans",
    price: 950,
    rating: 4,
    sizes: "W28 - W36",
    sizeOptions: ["W28", "W30", "W32", "W34", "W36"],
    sizeStocks: [5, 10, 15, 12, 8],
    image: "/images/jeans2.png",
    colors: ["#1a1a1a"],
    inStock: true,
  },
  {
    id: "f5",
    name: "Black Canvas Field Jacket",
    description: "Rugged canvas outer with a warm lining. Cropped and boxy.",
    category: "outerwear",
    price: 1250,
    rating: 5,
    sizes: "S - XXL",
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    sizeStocks: [10, 15, 12, 8, 4],
    image: "/images/outerwear1.png",
    colors: ["#1a1a1a"],
    inStock: true,
  },
  {
    id: "f6",
    name: "Minimalist Sling Bag",
    description: "Technical nylon crossbody bag. Compact and essential.",
    category: "accessories",
    price: 450,
    rating: 5,
    sizes: "One Size",
    sizeOptions: ["One Size"],
    sizeStocks: [50],
    image: "/images/accessories2.png",
    colors: ["#1a1a1a"],
    inStock: true,
  },
];
