import { prisma } from '../prisma'

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductsByCategory(categoryName: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      include: {
        category: true,
      },
    })
    return products
  } catch (error) {
    console.error(`Error fetching products for category ${categoryName}:`, error)
    return []
  }
}
