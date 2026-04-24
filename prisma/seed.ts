import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { TEES, JEANS, DISCOVER_PRODUCTS } from '../components/data/products'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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

  const categoryOuterwear = await prisma.category.create({
    data: { name: 'Outerwear' },
  })

  console.log('Categories created.')

  // Create Products from DISCOVER_PRODUCTS
  for (const p of DISCOVER_PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: `High-quality ${p.name} with premium fabric. Size: ${p.sizes}`,
        price: p.price,
        stock: 50,
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
        description: `Premium ${t.name} in custom color ${t.color}`,
        price: 250,
        stock: 100,
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
        description: `Durable ${j.name} with modern fit.`,
        price: 450,
        stock: 40,
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
