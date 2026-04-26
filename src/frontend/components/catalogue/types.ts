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
  imageUrl?: string;
  category?: string;
  variants?: ProductVariant[];
}

export interface CatalogueProduct extends Product {
  rating?: number;
  sizes?: string;
  image?: string;
  colors?: string[];
  inStock?: boolean;
}
