import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Connecting to:", connectionString?.split("@")[1]); // Mask password

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.product.count();
    console.log("Success! Product count:", count);
  } catch (err) {
    console.error("Database connection failed:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
