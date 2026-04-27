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
const WAIST_SIZES = ["W28", "W30", "W32", "W34", "W36"];

const PRODUCTS_TO_SEED = [
  // --- TEES ---
  {
    name: "White Boxy Tee",
    description: "Heavyweight 280gsm cotton with a perfect boxy silhouette. Pre-shrunk and enzyme washed for a soft feel.",
    category: "tees",
    price: 250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees1.png",
    colors: ["#e8e8e8"],
  },
  {
    name: "Earth Brown Boxy Tee",
    description: "Earthy brown pigment-dyed tee. Features dropped shoulders and a slightly cropped length.",
    category: "tees",
    price: 280,
    rating: 4,
    sizes: "S - XXL",
    image: "/images/tees2.png",
    colors: ["#6b4423"],
  },
  {
    name: "Sage Green Boxy Tee",
    description: "A calming sage green hue on our signature boxy fit. Perfect for minimalist layering.",
    category: "tees",
    price: 250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees3.png",
    colors: ["#8da38a"],
  },
  {
    name: "Vintage Grey Oversized",
    description: "Lived-in vintage grey look. Oversized but structured, making it a versatile wardrobe staple.",
    category: "tees",
    price: 320,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees4.png",
    colors: ["#7a7a7a"],
  },
  {
    name: "Charcoal Boxy Tee",
    description: "Deep charcoal black. Heavyweight fabric that holds its shape wash after wash.",
    category: "tees",
    price: 350,
    rating: 4,
    sizes: "S - XXL",
    image: "/images/tees5.png",
    colors: ["#333333"],
  },
  {
    name: "Cream Heavyweight Tee",
    description: "Ultra-thick cream white jersey. Features a tight collar and wide sleeves for a modern look.",
    category: "tees",
    price: 300,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/tees6.png",
    colors: ["#f5f5dc"],
  },
  {
    name: "Olive Boxy Tee",
    description: "Structured olive green tee. Minimalist design with high-density construction.",
    category: "tees",
    price: 250,
    rating: 4,
    sizes: "S - XXL",
    image: "/images/tees7.png",
    colors: ["#556b2f"],
  },

  // --- JEANS ---
  {
    name: "Blue Baggy Denim",
    description: "Classic blue wash with a relaxed wide leg. Japanese selvedge denim inspired fit.",
    category: "jeans",
    price: 890,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans1.png",
    colors: ["#2b4c7e"],
  },
  {
    name: "Washed Black Denim",
    description: "Faded black denim with a soft, broken-in feel. Wide leg silhouette for maximum comfort.",
    category: "jeans",
    price: 950,
    rating: 4,
    sizes: "W28 - W36",
    image: "/images/jeans2.png",
    colors: ["#1a1a1a"],
  },
  {
    name: "Light Wash Straight Denim",
    description: "Bright light wash denim. Features a straight but wide cut that stacks perfectly over sneakers.",
    category: "jeans",
    price: 820,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans3.png",
    colors: ["#5b84b1"],
  },
  {
    name: "Deep Indigo Wide Jeans",
    description: "Raw-look deep indigo denim. Heavyweight and structured for a bold silhouette.",
    category: "jeans",
    price: 920,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans4.png",
    colors: ["#16213e"],
  },
  {
    name: "Faded Black Wide Jeans",
    description: "Heavily washed black denim. Wide leg with a slight taper for a modern aesthetic.",
    category: "jeans",
    price: 880,
    rating: 4,
    sizes: "W28 - W36",
    image: "/images/jeans5.png",
    colors: ["#2d2d2d"],
  },
  {
    name: "Raw Selvedge Baggy",
    description: "Premium raw selvedge denim. Baggy fit that develops unique fades with wear.",
    category: "jeans",
    price: 1200,
    rating: 5,
    sizes: "W28 - W36",
    image: "/images/jeans6.png",
    colors: ["#0f172a"],
  },

  // --- OUTERWEAR ---
  {
    name: "Black Canvas Field Jacket",
    description: "Rugged canvas outer with a warm lining. Cropped and boxy for a tactical aesthetic.",
    category: "outerwear",
    price: 1250,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/outerwear1.png",
    colors: ["#1a1a1a"],
  },
  {
    name: "Light Grey Boxy Puffer",
    description: "Warm but lightweight puffer jacket. Features a high collar and adjustable hem.",
    category: "outerwear",
    price: 1450,
    rating: 4,
    sizes: "S - XXL",
    image: "/images/outerwear2.png",
    colors: ["#d1d5db"],
  },
  {
    name: "Charcoal Wool Overshirt",
    description: "Heavyweight wool blend overshirt. Perfect for layering over our boxy tees.",
    category: "outerwear",
    price: 1100,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/outerwear3.png",
    colors: ["#374151"],
  },
  {
    name: "Washed Blue Denim Jacket",
    description: "Iconic trucker style but with a boxier, shorter fit. Vintage blue wash.",
    category: "outerwear",
    price: 980,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/outerwear4.png",
    colors: ["#4b6584"],
  },
  {
    name: "Navy Boxy Bomber",
    description: "Classic flight jacket redefined with a wider silhouette and premium hardware.",
    category: "outerwear",
    price: 1350,
    rating: 5,
    sizes: "S - XXL",
    image: "/images/outerwear5.png",
    colors: ["#1e3a8a"],
  },

  // --- ACCESSORIES ---
  {
    name: "Structured Twill Cap",
    description: "6-panel construction with a low profile. Adjustable strap with silver buckle.",
    category: "accessories",
    price: 190,
    rating: 5,
    sizes: "One Size",
    image: "/images/accessories1.png",
    colors: ["#374151"],
  },
  {
    name: "Minimalist Sling Bag",
    description: "Technical nylon crossbody bag. Compact but enough for your daily essentials.",
    category: "accessories",
    price: 450,
    rating: 5,
    sizes: "One Size",
    image: "/images/accessories2.png",
    colors: ["#1a1a1a"],
  },
  {
    name: "Premium Knit Beanie",
    description: "Heavyweight wool blend knit. Provides warmth and keeps its shape.",
    category: "accessories",
    price: 150,
    rating: 4,
    sizes: "One Size",
    image: "/images/accessories3.png",
    colors: ["#1e3a8a"],
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
  if (sizes.toLowerCase() === "one size") return ["One Size"];
  if (sizes.includes(",")) return sizes.split(",").map((s) => s.trim()).filter(Boolean);
  if (sizes.includes(" - ")) return expandSizeRange(sizes);
  return [sizes.trim()].filter(Boolean);
}

async function main() {
  console.log("🚀 Start seeding with NEW product structure...");

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
      password: "user_password", // In real app, hash this!
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
    const sizeStocks = finalSizes.map(() => Math.floor(Math.random() * 50) + 10); // Random stock between 10-60
    const totalStock = sizeStocks.reduce((sum, n) => sum + n, 0);

    const variantRows = finalSizes.map((size, idx) => ({
      size,
      color: p.colors[0], // Single color per product as requested
      stock: sizeStocks[idx],
    }));

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
      } as any
    });
    console.log(`Created: ${p.name} with ${finalSizes.length} variants.`);
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
