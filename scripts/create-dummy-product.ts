import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get the Copper category
  const copperCategory = await prisma.category.findUnique({
    where: { slug: "copper" },
  });

  if (!copperCategory) {
    console.error("❌ Copper category not found. Run seed first.");
    return;
  }

  // Create a dummy product
  const product = await prisma.product.create({
    data: {
      name: "Premium Copper Wire 2.5mm",
      slug: "premium-copper-wire-2-5mm",
      description:
        "High-conductivity copper wire, 2.5mm diameter. Perfect for electrical wiring and industrial applications. ISI certified with 99.9% pure copper content.",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
      images: [
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      ],
      price: 850,
      comparePrice: 999,
      sku: "COP-WIRE-25-001",
      stock: 100,
      category: { connect: { id: copperCategory.id } },
      isFeatured: true,
      isActive: true,
      specifications: {
        Material: "99.9% Pure Copper",
        Diameter: "2.5mm",
        Certification: "ISI Certified",
        "Conductivity Grade": "Electrical Grade",
        "Package Weight": "1 kg",
      },
    },
    include: {
      category: true,
    },
  });

  console.log("✅ Dummy product created successfully!");
  console.log("📦 Product Details:");
  console.log(`   Name: ${product.name}`);
  console.log(`   SKU: ${product.sku}`);
  console.log(`   Price: ₹${product.price}`);
  console.log(`   Category: ${product.category?.name}`);
  console.log(`   Stock: ${product.stock}`);
  console.log(`   URL: /products/${product.slug}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
