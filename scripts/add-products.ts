import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Product data for each category - 5 products per category
const productsByCategory: Record<
  string,
  Array<{
    name: string;
    description: string;
    image: string;
    price: number;
    comparePrice?: number;
    sku: string;
    stock: number;
    isFeatured?: boolean;
    specifications: Record<string, string>;
  }>
> = {
  brass: [
    {
      name: "Brass Sheet 1mm",
      description:
        "Premium quality 1mm thick brass sheet with smooth finish. Ideal for decorative panels, nameplates, and precision engineering applications. Easy to cut, bend, and machine.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      price: 2499,
      comparePrice: 2999,
      sku: "BRS-SHT-001",
      stock: 50,
      isFeatured: true,
      specifications: {
        Thickness: "1mm",
        Dimensions: "300x300mm",
        Grade: "C26000",
        Finish: "Mill Finish",
      },
    },
    {
      name: "Brass Round Rod 12mm",
      description:
        "Solid brass rod with 12mm diameter, perfect for machining, turning, and custom fabrication. Excellent machinability and corrosion resistance.",
      image:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600",
      price: 899,
      comparePrice: 1099,
      sku: "BRS-ROD-012",
      stock: 100,
      specifications: {
        Diameter: "12mm",
        Length: "1 meter",
        Grade: "C36000 Free Cutting Brass",
      },
    },
    {
      name: "Brass Pipe Fittings Set",
      description:
        "Complete 25-piece brass pipe fittings set for plumbing applications. Includes elbows, tees, couplings, and reducers. Chrome-plated finish for durability.",
      image:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
      price: 1599,
      sku: "BRS-FIT-025",
      stock: 75,
      specifications: {
        Pieces: "25",
        Type: "Plumbing Fittings",
        Finish: "Chrome Plated",
        Sizes: "1/2 inch to 1 inch",
      },
    },
    {
      name: "Brass Hex Bar 20mm",
      description:
        "Hexagonal brass bar stock for manufacturing nuts, bolts, and precision components. High tensile strength with excellent corrosion resistance.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      price: 1199,
      sku: "BRS-HEX-020",
      stock: 60,
      specifications: {
        "Size Across Flats": "20mm",
        Length: "1 meter",
        Grade: "CZ121 Leaded Brass",
      },
    },
    {
      name: "Brass Wire 2mm Coil",
      description:
        "Soft annealed brass wire in 2mm diameter, 10-meter coil. Perfect for jewelry making, crafts, electrical applications, and wire art projects.",
      image:
        "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600",
      price: 649,
      comparePrice: 799,
      sku: "BRS-WIR-002",
      stock: 120,
      specifications: {
        Diameter: "2mm",
        Length: "10 meters",
        Temper: "Soft Annealed",
        Purity: "CuZn37",
      },
    },
  ],
  copper: [
    {
      name: "Copper Wire 2.5mm ISI Certified",
      description:
        "Premium quality 2.5mm gauge electrical copper wire with 99.9% purity. ISI certified for safe electrical installations. High conductivity and flexibility.",
      image:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
      price: 3499,
      comparePrice: 3999,
      sku: "COP-WIR-025",
      stock: 200,
      isFeatured: true,
      specifications: {
        Gauge: "2.5mm",
        Length: "100 meters",
        Purity: "99.9% Pure Copper",
        Certification: "ISI Certified",
      },
    },
    {
      name: "Copper Pipe 25mm Seamless",
      description:
        "Seamless copper pipe for plumbing and HVAC applications. Type L rating with excellent corrosion resistance. Easy to solder and install.",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
      price: 1899,
      sku: "COP-PIP-025",
      stock: 60,
      specifications: {
        "Outer Diameter": "25mm",
        "Wall Thickness": "1mm",
        Length: "3 meters",
        Type: "Type L Seamless",
      },
    },
    {
      name: "Copper Sheet 0.5mm",
      description:
        "Thin copper sheet perfect for craft work, electronics shielding, and decorative applications. Easy to cut with scissors and shape by hand.",
      image:
        "https://images.unsplash.com/photo-1609252925148-b0f1b515e111?w=600",
      price: 1299,
      comparePrice: 1499,
      sku: "COP-SHT-005",
      stock: 80,
      specifications: {
        Thickness: "0.5mm",
        Dimensions: "300x300mm",
        Purity: "99.5% ETP Copper",
      },
    },
    {
      name: "Copper Busbar 10x50mm",
      description:
        "Electrical grade copper busbar for power distribution panels and switchgear. High conductivity with excellent current carrying capacity.",
      image:
        "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
      price: 2899,
      sku: "COP-BUS-1050",
      stock: 40,
      isFeatured: true,
      specifications: {
        Dimensions: "10mm x 50mm",
        Length: "1 meter",
        Grade: "Electrolytic Grade (EC)",
        Conductivity: "101% IACS",
      },
    },
    {
      name: "Copper Flat Bar 6x25mm",
      description:
        "Copper flat bar for earthing, grounding, and electrical connections. Tinned finish for better corrosion resistance and solderability.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      price: 799,
      sku: "COP-FLT-0625",
      stock: 90,
      specifications: {
        Dimensions: "6mm x 25mm",
        Length: "1 meter",
        Finish: "Tinned",
        Application: "Earthing & Grounding",
      },
    },
  ],
  aluminum: [
    {
      name: "Aluminum T-Slot Profile 40x40",
      description:
        "Industrial grade T-slot aluminum extrusion for building frames, workbenches, and machine enclosures. Compatible with standard T-slot accessories.",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600",
      price: 799,
      sku: "ALU-TSL-4040",
      stock: 150,
      isFeatured: true,
      specifications: {
        Profile: "40x40mm",
        Type: "T-Slot 8mm",
        Length: "1 meter",
        Alloy: "6063-T5",
      },
    },
    {
      name: "Aluminum Sheet 2mm 6061",
      description:
        "Lightweight 6061-T6 aluminum sheet for fabrication, signage, and construction. Excellent strength-to-weight ratio and corrosion resistance.",
      image:
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600",
      price: 1499,
      comparePrice: 1799,
      sku: "ALU-SHT-2MM",
      stock: 45,
      specifications: {
        Thickness: "2mm",
        Dimensions: "500x500mm",
        Alloy: "6061-T6",
        Finish: "Mill Finish",
      },
    },
    {
      name: "Aluminum Round Bar 25mm",
      description:
        "Precision aluminum round bar for machining and turning applications. 6061-T6 alloy with excellent machinability and surface finish.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      price: 699,
      sku: "ALU-ROD-025",
      stock: 80,
      specifications: {
        Diameter: "25mm",
        Length: "1 meter",
        Alloy: "6061-T6",
        Tolerance: "h9",
      },
    },
    {
      name: "Aluminum Angle 50x50x3mm",
      description:
        "Equal angle aluminum section for structural applications, frames, and supports. Lightweight yet strong with good corrosion resistance.",
      image:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600",
      price: 549,
      sku: "ALU-ANG-5050",
      stock: 100,
      specifications: {
        Dimensions: "50x50x3mm",
        Length: "3 meters",
        Alloy: "6063-T5",
      },
    },
    {
      name: "Aluminum Square Tube 40x40x2mm",
      description:
        "Aluminum square tube for furniture, railings, and structural applications. Anodized finish for enhanced durability and aesthetics.",
      image:
        "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600",
      price: 899,
      comparePrice: 1049,
      sku: "ALU-SQT-4040",
      stock: 65,
      specifications: {
        "Outer Dimensions": "40x40mm",
        "Wall Thickness": "2mm",
        Length: "3 meters",
        Finish: "Natural Anodized",
      },
    },
  ],
  bronze: [
    {
      name: "Bronze Bushing Set Self-Lubricating",
      description:
        "Set of 10 self-lubricating bronze bushings for industrial machinery. Oil-impregnated for maintenance-free operation. Excellent wear resistance.",
      image:
        "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600",
      price: 2199,
      sku: "BRZ-BSH-SET",
      stock: 30,
      isFeatured: true,
      specifications: {
        Pieces: "10 (Assorted Sizes)",
        Type: "SAE 660 Bearing Bronze",
        Feature: "Oil Impregnated",
        Application: "Bearings & Sleeves",
      },
    },
    {
      name: "Bronze Round Bar 30mm",
      description:
        "Solid phosphor bronze round bar for manufacturing bearings, gears, and bushings. High strength and excellent resistance to wear and fatigue.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      price: 3499,
      comparePrice: 3999,
      sku: "BRZ-ROD-030",
      stock: 25,
      specifications: {
        Diameter: "30mm",
        Length: "1 meter",
        Grade: "CuSn8 Phosphor Bronze",
      },
    },
    {
      name: "Bronze Statue Base Square",
      description:
        "Decorative bronze base for statues, trophies, and awards. Polished finish with elegant design. Perfect for mounting sculptures and memorabilia.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      price: 4999,
      comparePrice: 5999,
      sku: "BRZ-BAS-SQ",
      stock: 15,
      specifications: {
        Dimensions: "15x15x5cm",
        Weight: "2kg",
        Finish: "Mirror Polished",
        Mounting: "4 holes included",
      },
    },
    {
      name: "Bronze Flat Bar 10x40mm",
      description:
        "High-quality bronze flat bar for wear strips, thrust washers, and slide plates. Excellent dimensional accuracy and surface finish.",
      image:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600",
      price: 1899,
      sku: "BRZ-FLT-1040",
      stock: 35,
      specifications: {
        Dimensions: "10mm x 40mm",
        Length: "500mm",
        Grade: "C93200 Bearing Bronze",
      },
    },
    {
      name: "Bronze Washer Set Assorted",
      description:
        "Premium bronze washer assortment for marine, automotive, and industrial use. Superior corrosion resistance in harsh environments.",
      image:
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
      price: 899,
      sku: "BRZ-WSH-AST",
      stock: 50,
      specifications: {
        Quantity: "100 pieces",
        Sizes: "M6 to M16",
        Type: "Silicon Bronze",
        Application: "Marine & Industrial",
      },
    },
  ],
  "stainless-steel": [
    {
      name: "SS 304 Sheet 1.5mm Food Grade",
      description:
        "Food-grade 304 stainless steel sheet for kitchen countertops, appliances, and food processing equipment. 2B finish with excellent hygiene properties.",
      image:
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600",
      price: 3299,
      sku: "SS-SHT-304-15",
      stock: 40,
      isFeatured: true,
      specifications: {
        Thickness: "1.5mm",
        Dimensions: "600x600mm",
        Grade: "SS 304 (18/8)",
        Finish: "2B (Mill Finish)",
      },
    },
    {
      name: "SS Pipe 32mm Mirror Finish",
      description:
        "Polished stainless steel pipe for handrails, furniture, and architectural applications. Mirror finish for premium aesthetics.",
      image:
        "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600",
      price: 1199,
      sku: "SS-PIP-032",
      stock: 70,
      specifications: {
        "Outer Diameter": "32mm",
        "Wall Thickness": "1.5mm",
        Length: "3 meters",
        Finish: "Mirror Polish (No. 8)",
      },
    },
    {
      name: "SS 316 Round Bar 20mm",
      description:
        "Marine grade 316 stainless steel round bar for coastal and chemical environments. Superior corrosion resistance with excellent strength.",
      image:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600",
      price: 1899,
      comparePrice: 2199,
      sku: "SS-ROD-316-20",
      stock: 55,
      specifications: {
        Diameter: "20mm",
        Length: "1 meter",
        Grade: "SS 316 Marine Grade",
        Finish: "Bright Drawn",
      },
    },
    {
      name: "SS Wire Mesh 304 Fine",
      description:
        "Woven stainless steel wire mesh for filtration, screening, and ventilation. Rust-proof and easy to clean. Multiple applications.",
      image:
        "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600",
      price: 749,
      sku: "SS-MSH-304",
      stock: 85,
      specifications: {
        "Mesh Size": "30 mesh (0.5mm opening)",
        Dimensions: "1m x 1m",
        Grade: "SS 304",
        "Wire Diameter": "0.3mm",
      },
    },
    {
      name: "SS Angle 40x40x4mm 304",
      description:
        "Stainless steel equal angle for structural and architectural applications. Clean edges with consistent dimensions throughout.",
      image:
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600",
      price: 1449,
      sku: "SS-ANG-4040",
      stock: 45,
      specifications: {
        Dimensions: "40x40x4mm",
        Length: "3 meters",
        Grade: "SS 304",
        Finish: "Mill Finish",
      },
    },
  ],
};

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("🗑️  Deleting all existing products and related data...");

  // Delete related records first (foreign key constraints)
  console.log("   Deleting order items...");
  await prisma.orderItem.deleteMany({});

  console.log("   Deleting cart items...");
  await prisma.cartItem.deleteMany({});

  console.log("   Deleting wishlist items...");
  await prisma.wishlistItem.deleteMany({});

  console.log("   Deleting reviews...");
  await prisma.review.deleteMany({});

  console.log("   Deleting orders...");
  await prisma.order.deleteMany({});

  // Now delete products
  const deleteResult = await prisma.product.deleteMany({});
  console.log(`✅ Deleted ${deleteResult.count} existing products`);

  // Get all categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });
  console.log(`📂 Found ${categories.length} categories`);

  let totalProducts = 0;

  for (const category of categories) {
    console.log(`\n📦 Adding products for category: ${category.name}`);

    const products = productsByCategory[category.slug];
    if (!products) {
      console.log(`   ⚠️  No products defined for ${category.slug}`);
      continue;
    }

    for (const product of products) {
      const slug = generateSlug(product.name);

      try {
        await prisma.product.create({
          data: {
            name: product.name,
            slug: slug,
            description: product.description,
            image: product.image,
            images: [product.image],
            price: product.price,
            comparePrice: product.comparePrice || null,
            sku: product.sku,
            stock: product.stock,
            categoryId: category.id,
            isFeatured: product.isFeatured || false,
            isActive: true,
            specifications: product.specifications,
          },
        });
        console.log(`   ✅ Created: ${product.name}`);
        totalProducts++;
      } catch (error: any) {
        console.error(`   ❌ Error creating ${product.name}:`, error.message);
      }
    }
  }

  console.log(`\n🎉 Successfully created ${totalProducts} products!`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
