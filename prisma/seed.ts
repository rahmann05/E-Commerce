import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const PRODUCTS_TO_SEED = [
  {
    name: "Boxy Sage Green Tee",
    description: "Ultra-soft modal blend with a relaxed boxy silhouette. Perfect for layering or wearing solo.",
    category: "tees",
    price: 250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/model1.jpg",
    colors: ["#8da38a", "#e8e8e8", "#333333"],
  },
  {
    name: "Charcoal Heavyweight Tee",
    description: "Dense 280gsm cotton for a structured look that keeps its shape wash after wash.",
    category: "tees",
    price: 350,
    rating: 4,
    sizes: "M - XXL",
    image: "/images/model2.jpg",
    colors: ["#333333", "#7a7a7a"],
  },
  {
    name: "Classic White Boxy Fit",
    description: "The essential wardrobe anchor. Enzyme-washed for instant softness.",
    category: "tees",
    price: 500,
    rating: 5,
    sizes: "S - L",
    image: "/images/model3.jpg",
    colors: ["#e8e8e8", "#f5f5f3"],
  },
  {
    name: "Earth Brown Loose Tee",
    description: "Earthy pigment-dyed cotton that deepens in colour with every wash.",
    category: "tees",
    price: 280,
    rating: 4,
    sizes: "S - XL",
    image: "/images/tees2.png",
    colors: ["#6b4423", "#8d6240"],
  },
  {
    name: "Vintage Grey Oversized",
    description: "Pre-distressed for that lived-in look straight out of the box.",
    category: "tees",
    price: 320,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees4.png",
    colors: ["#7a7a7a", "#555555"],
  },
  {
    name: "Blue Baggy Denim",
    description: "Japanese selvedge denim with a relaxed baggy cut. Sanforized for minimal shrinkage.",
    category: "jeans",
    price: 890,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans1.png",
    colors: ["#2b4c7e", "#5b84b1"],
  },
  {
    name: "Washed Black Denim",
    description: "Raw black denim pre-washed to a rich, deep fade. Tapered leg, full comfort waistband.",
    category: "jeans",
    price: 950,
    rating: 4,
    sizes: "W28 - W34",
    image: "/images/jeans2.png",
    colors: ["#1a1a1a", "#2d2d2d"],
  },
  {
    name: "Light Wash Straight Denim",
    description: "Cloud-washed straight leg for an easy, effortless everyday look.",
    category: "jeans",
    price: 820,
    rating: 5,
    sizes: "W30 - W36",
    image: "/images/jeans3.png",
    colors: ["#5b84b1", "#8aaed4"],
  },
  {
    name: "Canvas Field Jacket",
    description: "Rugged canvas outer with a warm flannel lining. Built for the elements, designed for the city.",
    category: "outerwear",
    price: 1250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/model4.png",
    colors: ["#555555", "#333333"],
  },
  {
    name: "Everyday Essential Beanie",
    description: "Soft merino wool blend that provides warmth without the itch. Minimalist branding.",
    category: "accessories",
    price: 150,
    rating: 4,
    sizes: "One Size",
    image: "/images/tees5.png",
    colors: ["#333333", "#7a7a7a"],
  },
  {
    name: "Structured Twill Cap",
    description: "Classic 6-panel construction with an adjustable leather strap. Low profile fit.",
    category: "accessories",
    price: 190,
    rating: 5,
    sizes: "One Size",
    image: "/images/tees3.png",
    colors: ["#8da38a", "#e8e8e8"],
  },
  {
    name: "Tech Performance Parka",
    description: "Waterproof, breathable, and built for the urban explorer. Features multiple utility pockets.",
    category: "outerwear",
    price: 1550,
    rating: 5,
    sizes: "M - XXL",
    image: "/images/model1.jpg",
    colors: ["#333333", "#2b4c7e"],
  },
  {
    name: "Cloud-Knit Hoodie",
    description: "Double-faced jersey knit for a weightless feel and maximum warmth. The peak of Softwear.",
    category: "tees",
    price: 650,
    rating: 5,
    sizes: "S - XXXL",
    image: "/images/tees2.png",
    colors: ["#6b4423", "#7a7a7a"],
  },
];

function expandSizeRange(range: string): string[] {
  const parts = range.split(" - ").map((s) => s.trim());
  if (parts.length < 2) return [range.trim()];
  const [start, end] = parts;

  if (start.startsWith("W") && end.startsWith("W")) {
    const s = parseInt(start.slice(1), 10);
    const e = parseInt(end.slice(1), 10);
    if (!Number.isNaN(s) && !Number.isNaN(e) && e >= s) {
      const result: string[] = [];
      for (let i = s; i <= e; i += 2) result.push(`W${i}`);
      return result;
    }
  }

  const si = LETTER_SIZES.indexOf(start);
  const ei = LETTER_SIZES.indexOf(end);
  if (si !== -1 && ei !== -1 && ei >= si) return LETTER_SIZES.slice(si, ei + 1);

  return [start, end].filter(Boolean);
}

function parseSizes(sizes: string): string[] {
  if (sizes.includes(",")) return sizes.split(",").map((s) => s.trim()).filter(Boolean);
  if (sizes.includes(" - ")) return expandSizeRange(sizes);
  return [sizes.trim()].filter(Boolean);
}

async function main() {
  console.log("🚀 Start seeding with ALL products...");

  // 1. Cleanup
  console.log("🧹 Cleaning up old data...");
  await prisma.userVoucher.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Categories
  console.log("📁 Creating categories...");
  const categoryNames = ["tees", "jeans", "accessories", "outerwear"];
  const categories: Record<string, any> = {};
  for (const name of categoryNames) {
    categories[name] = await prisma.category.create({ data: { name: name.charAt(0).toUpperCase() + name.slice(1) } });
  }

  // 3. Create Users
  console.log("👤 Creating users...");
  await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Budi Santoso",
      role: "USER",
      password: "user_password",
      addresses: {
        create: {
          label: "Rumah",
          recipient: "Budi Santoso",
          line1: "Jl. Melati No. 12",
          city: "Bandung",
          province: "Jawa Barat",
          isPrimary: true
        }
      }
    }
  });

  // 4. Create Products & Variants
  console.log("👕 Creating products and variants...");
  for (const p of PRODUCTS_TO_SEED) {
    const slug = p.name.toLowerCase().replace(/ /g, "-");
    const finalSizes = parseSizes(p.sizes);
    const sizeStocks = finalSizes.map((_, idx) => Math.max(8, 40 - idx * 6));

    if (finalSizes.length === 0) {
      throw new Error(`Invalid seed product ${p.name}: ukuran tidak boleh kosong.`);
    }

    if (finalSizes.length !== sizeStocks.length) {
      throw new Error(
        `Invalid seed product ${p.name}: sizeOptions (${finalSizes.length}) != sizeStocks (${sizeStocks.length}).`
      );
    }

    if (sizeStocks.some((n) => n < 0)) {
      throw new Error(`Invalid seed product ${p.name}: sizeStocks tidak boleh negatif.`);
    }

    const sizeStockMap = new Map(finalSizes.map((size, idx) => [size, sizeStocks[idx]]));
    const variantColors = p.colors.length > 0 ? p.colors : [null];
    const variantRows = variantColors.flatMap((color) =>
      finalSizes.map((size) => ({
        size,
        color,
        stock: sizeStockMap.get(size) ?? 20,
      }))
    );
    const totalStock = sizeStocks.reduce((sum, n) => sum + n, 0);

    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug,
        description: p.description,
        price: p.price,
        rating: p.rating,
        categoryId: categories[p.category].id,
        images: [p.image],
        colors: p.colors,
        sizes: p.sizes,
        sizeOptions: finalSizes,
        sizeStocks,
        stock: totalStock,
        inStock: totalStock > 0,
        variants: {
          create: variantRows,
        }
      }
    });
    console.log(`Created: ${p.name}`);
  }

  // 5. Create Vouchers
  console.log("🎟️ Creating vouchers...");
  await prisma.voucher.createMany({
    data: [
      { code: "NOVURENEW", title: "Welcome Discount", discountFix: 50000, isActive: true },
      { code: "FASHION10", title: "Flash Sale 10%", discountPct: 10, isActive: true }
    ]
  });

  console.log("✅ Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
