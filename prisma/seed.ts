import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin User
  const hashedPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sabarishmetals.com" },
    update: {},
    create: {
      email: "admin@sabarishmetals.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "brass" },
      update: {},
      create: {
        name: "Brass",
        slug: "brass",
        description: "Premium quality brass products for industrial and decorative uses",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        isActive: true,
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "copper" },
      update: {},
      create: {
        name: "Copper",
        slug: "copper",
        description: "High-grade copper materials for electrical and construction applications",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400",
        isActive: true,
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "aluminum" },
      update: {},
      create: {
        name: "Aluminum",
        slug: "aluminum",
        description: "Lightweight aluminum products for various industrial needs",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
        isActive: true,
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bronze" },
      update: {},
      create: {
        name: "Bronze",
        slug: "bronze",
        description: "Durable bronze items for heavy-duty industrial applications",
        image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400",
        isActive: true,
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "stainless-steel" },
      update: {},
      create: {
        name: "Stainless Steel",
        slug: "stainless-steel",
        description: "Corrosion-resistant stainless steel for kitchens and industries",
        image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400",
        isActive: true,
        order: 5,
      },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Create Products
  const products = [
    // Brass Products
    {
      name: "Brass Sheet 1mm",
      slug: "brass-sheet-1mm",
      description: "High-quality 1mm thick brass sheet, perfect for decorative work and industrial applications. Smooth finish with excellent workability.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      price: 2499,
      comparePrice: 2999,
      stock: 50,
      sku: "BRS-001",
      categoryId: categories[0].id,
      isFeatured: true,
      specifications: { thickness: "1mm", dimensions: "300x300mm", grade: "C26000" },
    },
    {
      name: "Brass Rod 12mm",
      slug: "brass-rod-12mm",
      description: "Solid brass rod, 12mm diameter, ideal for machining and custom fabrication projects.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      price: 899,
      comparePrice: 1199,
      stock: 100,
      sku: "BRS-002",
      categoryId: categories[0].id,
      specifications: { diameter: "12mm", length: "1m", grade: "C36000" },
    },
    {
      name: "Brass Fittings Set",
      slug: "brass-fittings-set",
      description: "Complete set of brass fittings for plumbing applications. Includes elbows, tees, and couplings.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      price: 1599,
      stock: 75,
      sku: "BRS-003",
      categoryId: categories[0].id,
      specifications: { pieces: "25", type: "Plumbing", finish: "Chrome" },
    },
    // Copper Products
    {
      name: "Copper Wire 2.5mm",
      slug: "copper-wire-2-5mm",
      description: "Pure copper electrical wire, 2.5mm gauge. Excellent conductivity for electrical installations.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
      price: 3499,
      comparePrice: 3999,
      stock: 200,
      sku: "COP-001",
      categoryId: categories[1].id,
      isFeatured: true,
      specifications: { gauge: "2.5mm", length: "100m", purity: "99.9%" },
    },
    {
      name: "Copper Pipe 25mm",
      slug: "copper-pipe-25mm",
      description: "Seamless copper pipe for plumbing and HVAC applications. Highly corrosion-resistant.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
      price: 1899,
      stock: 60,
      sku: "COP-002",
      categoryId: categories[1].id,
      specifications: { diameter: "25mm", wall: "1mm", length: "3m" },
    },
    {
      name: "Copper Sheet 0.5mm",
      slug: "copper-sheet-0-5mm",
      description: "Thin copper sheet perfect for craft work, electronics, and decorative applications.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
      price: 1299,
      comparePrice: 1499,
      stock: 80,
      sku: "COP-003",
      categoryId: categories[1].id,
      specifications: { thickness: "0.5mm", dimensions: "300x300mm", purity: "99.5%" },
    },
    // Aluminum Products
    {
      name: "Aluminum Profile 40x40",
      slug: "aluminum-profile-40x40",
      description: "T-slot aluminum extrusion profile for building frames, workbenches, and machine enclosures.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
      price: 799,
      stock: 150,
      sku: "ALU-001",
      categoryId: categories[2].id,
      isFeatured: true,
      specifications: { profile: "40x40mm", type: "T-slot", length: "1m" },
    },
    {
      name: "Aluminum Sheet 2mm",
      slug: "aluminum-sheet-2mm",
      description: "Lightweight aluminum sheet for fabrication, signage, and construction projects.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
      price: 1499,
      comparePrice: 1799,
      stock: 45,
      sku: "ALU-002",
      categoryId: categories[2].id,
      specifications: { thickness: "2mm", dimensions: "500x500mm", alloy: "6061" },
    },
    // Bronze Products
    {
      name: "Bronze Bushing Set",
      slug: "bronze-bushing-set",
      description: "Self-lubricating bronze bushings for industrial machinery. Long-lasting and maintenance-free.",
      image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600",
      price: 2199,
      stock: 30,
      sku: "BRZ-001",
      categoryId: categories[3].id,
      isFeatured: true,
      specifications: { pieces: "10", type: "Self-lubricating", sizes: "Assorted" },
    },
    {
      name: "Bronze Statue Base",
      slug: "bronze-statue-base",
      description: "Decorative bronze base for statues and trophies. Polished finish with elegant design.",
      image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600",
      price: 4999,
      comparePrice: 5999,
      stock: 15,
      sku: "BRZ-002",
      categoryId: categories[3].id,
      specifications: { dimensions: "15x15x5cm", weight: "2kg", finish: "Polished" },
    },
    // Stainless Steel Products
    {
      name: "SS Sheet 1.5mm 304",
      slug: "ss-sheet-1-5mm-304",
      description: "Food-grade 304 stainless steel sheet for kitchen countertops and industrial applications.",
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600",
      price: 3299,
      stock: 40,
      sku: "SS-001",
      categoryId: categories[4].id,
      isFeatured: true,
      specifications: { thickness: "1.5mm", grade: "304", dimensions: "600x600mm" },
    },
    {
      name: "SS Pipe 32mm",
      slug: "ss-pipe-32mm",
      description: "Polished stainless steel pipe for handrails, furniture, and decorative applications.",
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600",
      price: 1199,
      stock: 70,
      sku: "SS-002",
      categoryId: categories[4].id,
      specifications: { diameter: "32mm", wall: "1.5mm", length: "3m", finish: "Mirror" },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.image,
        images: [],
        price: product.price,
        comparePrice: product.comparePrice || null,
        stock: product.stock,
        sku: product.sku,
        categoryId: product.categoryId,
        isFeatured: product.isFeatured || false,
        isActive: true,
        specifications: product.specifications || {},
      },
    });
  }
  console.log("✅ Products created:", products.length);

  // Create a coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off on your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 1000,
      maxUses: 100,
      isActive: true,
    },
  });
  console.log("✅ Welcome coupon created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
