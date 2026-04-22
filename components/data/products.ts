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
