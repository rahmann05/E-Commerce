import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { TEES, JEANS, DISCOVER_PRODUCTS } from '../components/data/products'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log('Start seeding...')

  // Clean up existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories
  const categoryTees = await prisma.category.create({
    data: { name: 'Tees' },
  })

  const categoryJeans = await prisma.category.create({
    data: { name: 'Jeans' },
  })

  await prisma.category.create({
    data: { name: 'Outerwear' },
  })

  console.log('Categories created.')

  // Create Products from DISCOVER_PRODUCTS
  for (const p of DISCOVER_PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(`${p.name}-${p.id}`),
        description: `High-quality ${p.name} with premium fabric. Size: ${p.sizes}`,
        price: p.price,
        rating: p.rating,
        sizes: p.sizes,
        colors: ["#111111"],
        stock: 50,
        inStock: true,
        images: [p.image],
        categoryId: categoryTees.id, // Defaulting to Tees for now
      },
    })
  }

  // Add more from TEES
  for (const t of TEES) {
    await prisma.product.create({
      data: {
        name: t.name,
        slug: slugify(`${t.name}-${t.image}`),
        description: `Premium ${t.name} in custom color ${t.color}`,
        price: 250,
        rating: 5,
        sizes: "S - XXL",
        colors: [t.color],
        stock: 100,
        inStock: true,
        images: [t.image],
        categoryId: categoryTees.id,
      },
    })
  }

  // Add more from JEANS
  for (const j of JEANS) {
    await prisma.product.create({
      data: {
        name: j.name,
        slug: slugify(`${j.name}-${j.image}`),
        description: `Durable ${j.name} with modern fit.`,
        price: 450,
        rating: 5,
        sizes: "W28 - W36",
        colors: [j.color],
        stock: 40,
        inStock: true,
        images: [j.image],
        categoryId: categoryJeans.id,
      },
    })
  }

  console.log('Products created.')
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
