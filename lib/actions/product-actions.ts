'use server'

import { getProducts } from '../api/products'

export async function fetchProductsAction() {
  const products = await getProducts()
  // Transform DB products to match UI expectations if necessary
  return products.map(p => ({
    id: Number.parseInt(String(p.id), 10) || 0,
    name: p.name,
    sizes: 'S - XXL', // Placeholder as it's not in DB yet (could be added to schema)
    price: Number(p.price),
    rating: 5,
    image: p.images[0] || '/images/placeholder.jpg',
  }))
}
