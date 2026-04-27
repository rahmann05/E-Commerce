export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Prisma compatibility
  image?: string;    // Fallback/Legacy
  images?: string[]; // Prisma Array
  category?: string;
  sizeOptions?: string[];
  sizeStocks?: number[];
  variants?: ProductVariant[];
}

export interface CatalogueProduct extends Product {
  rating?: number;
  sizes?: string;
  colors?: string[];
  inStock?: boolean;
}
