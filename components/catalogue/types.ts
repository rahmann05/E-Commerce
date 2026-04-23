/**
 * components/catalogue/types.ts
 * Shared TypeScript types for the catalogue feature.
 */

export interface CatalogueProduct {
  id: number;
  name: string;
  description: string;
  category: "tees" | "jeans" | "accessories";
  price: number;
  rating: number;
  sizes: string;
  image: string;
  colors: string[];
  inStock: boolean;
}
