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
  id: number;
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
];

export const JEANS: ClothingItem[] = [
  { name: "Blue Baggy Denim", image: "/images/jeans1.png", color: "#2b4c7e" },
  { name: "Washed Black", image: "/images/jeans2.png", color: "#1a1a1a" },
  { name: "Light Wash", image: "/images/jeans3.png", color: "#5b84b1" },
];

export const HERO_CLOTHING: HeroClothing[] = [
  { src: "/images/tees1.png", width: 120, height: 120 },
  { src: "/images/jeans1.png", width: 100, height: 140 },
  { src: "/images/tees2.png", width: 110, height: 110 },
  { src: "/images/jeans2.png", width: 110, height: 130 },
  { src: "/images/tees3.png", width: 90, height: 90 },
  { src: "/images/tees4.png", width: 130, height: 130 },
  { src: "/images/jeans3.png", width: 100, height: 140 },
  { src: "/images/tees5.png", width: 110, height: 110 },
];

export const DISCOVER_PRODUCTS: DiscoverProduct[] = [
  { id: 1, name: "Boxy Sage Green Tee", sizes: "S - XXL", price: 250, rating: 5, image: "/images/model1.jpg" },
  { id: 2, name: "Charcoal Heavyweight Tee", sizes: "M - XXL", price: 350, rating: 4, image: "/images/model2.jpg" },
  { id: 3, name: "Classic White Boxy Fit", sizes: "S - L", price: 500, rating: 5, image: "/images/model3.jpg", blurred: true },
];

export const CAROUSEL_IMAGES = [
  "/images/tees1.png",
  "/images/jeans1.png",
  "/images/tees2.png",
  "/images/jeans2.png",
  "/images/tees3.png",
  "/images/jeans3.png",
  "/images/tees4.png",
  "/images/tees5.png",
];

// ── Catalogue fallback (used when DB is unreachable) ──────────────────────────
import type { CatalogueProduct } from "@/components/catalogue/types";

export const CATALOGUE_PRODUCTS_FALLBACK: CatalogueProduct[] = [
  {
    id: 1,
    name: "Boxy Sage Green Tee",
    description: "Ultra-soft modal blend with a relaxed boxy silhouette. Perfect for layering or wearing solo.",
    category: "tees",
    price: 250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/model1.jpg",
    colors: ["#8da38a", "#e8e8e8", "#333333"],
    inStock: true,
  },
  {
    id: 2,
    name: "Charcoal Heavyweight Tee",
    description: "Dense 280gsm cotton for a structured look that keeps its shape wash after wash.",
    category: "tees",
    price: 350,
    rating: 4,
    sizes: "M - XXL",
    image: "/images/model2.jpg",
    colors: ["#333333", "#7a7a7a"],
    inStock: true,
  },
  {
    id: 3,
    name: "Classic White Boxy Fit",
    description: "The essential wardrobe anchor. Enzyme-washed for instant softness.",
    category: "tees",
    price: 500,
    rating: 5,
    sizes: "S - L",
    image: "/images/model3.jpg",
    colors: ["#e8e8e8", "#f5f5f3"],
    inStock: true,
  },
  {
    id: 4,
    name: "Earth Brown Loose Tee",
    description: "Earthy pigment-dyed cotton that deepens in colour with every wash.",
    category: "tees",
    price: 280,
    rating: 4,
    sizes: "S - XL",
    image: "/images/tees2.png",
    colors: ["#6b4423", "#8d6240"],
    inStock: true,
  },
  {
    id: 5,
    name: "Vintage Grey Oversized",
    description: "Pre-distressed for that lived-in look straight out of the box.",
    category: "tees",
    price: 320,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees4.png",
    colors: ["#7a7a7a", "#555555"],
    inStock: true,
  },
  {
    id: 6,
    name: "Blue Baggy Denim",
    description: "Japanese selvedge denim with a relaxed baggy cut. Sanforized for minimal shrinkage.",
    category: "jeans",
    price: 890,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans1.png",
    colors: ["#2b4c7e", "#5b84b1"],
    inStock: true,
  },
  {
    id: 7,
    name: "Washed Black Denim",
    description: "Raw black denim pre-washed to a rich, deep fade. Tapered leg, full comfort waistband.",
    category: "jeans",
    price: 950,
    rating: 4,
    sizes: "W28 - W34",
    image: "/images/jeans2.png",
    colors: ["#1a1a1a", "#2d2d2d"],
    inStock: true,
  },
  {
    id: 8,
    name: "Light Wash Straight Denim",
    description: "Cloud-washed straight leg for an easy, effortless everyday look.",
    category: "jeans",
    price: 820,
    rating: 5,
    sizes: "W30 - W36",
    image: "/images/jeans3.png",
    colors: ["#5b84b1", "#8aaed4"],
    inStock: true,
  },
  {
    id: 9,
    name: "Canvas Field Jacket",
    description: "Rugged canvas outer with a warm flannel lining. Built for the elements, designed for the city.",
    category: "outerwear",
    price: 1250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/model4.png",
    colors: ["#555555", "#333333"],
    inStock: true,
  },
  {
    id: 10,
    name: "Everyday Essential Beanie",
    description: "Soft merino wool blend that provides warmth without the itch. Minimalist branding.",
    category: "accessories",
    price: 150,
    rating: 4,
    sizes: "One Size",
    image: "/images/tees5.png",
    colors: ["#333333", "#7a7a7a"],
    inStock: true,
  },
  {
    id: 11,
    name: "Structured Twill Cap",
    description: "Classic 6-panel construction with an adjustable leather strap. Low profile fit.",
    category: "accessories",
    price: 190,
    rating: 5,
    sizes: "One Size",
    image: "/images/tees3.png",
    colors: ["#8da38a", "#e8e8e8"],
    inStock: true,
  },
  {
    id: 12,
    name: "Tech Performance Parka",
    description: "Waterproof, breathable, and built for the urban explorer. Features multiple utility pockets.",
    category: "outerwear",
    price: 1550,
    rating: 5,
    sizes: "M - XXL",
    image: "/images/model1.jpg",
    colors: ["#333333", "#2b4c7e"],
    inStock: true,
  },
  {
    id: 13,
    name: "Cloud-Knit Hoodie",
    description: "Double-faced jersey knit for a weightless feel and maximum warmth. The peak of Softwear.",
    category: "tees",
    price: 650,
    rating: 5,
    sizes: "S - XXXL",
    image: "/images/tees2.png",
    colors: ["#6b4423", "#7a7a7a"],
    inStock: true,
  },
];
