import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query params
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const admin = searchParams.get("admin");

    // Build where clause
    const where: any = {};
    
    // Only filter by isActive for non-admin requests
    if (admin !== "true") {
      where.isActive = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      categoryId,
      image,
      images = [],
      price,
      comparePrice,
      costPrice,
      hsnCode,
      gstRate = 18,
      sku,
      stock = 0,
      lowStockThreshold = 5,
      specifications,
      isFeatured = false,
      weight,
      length,
      width,
      height,
      metaTitle,
      metaDescription,
    } = body;

    // Validation
    if (!name || !categoryId || !image || !price || !sku) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingSku = await db.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json(
        { success: false, error: "SKU already exists" },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await db.product.findUnique({ where: { slug } })) {
      slug = baseSlug + "-" + counter;
      counter++;
    }

    // Create product
    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        image,
        images,
        price,
        comparePrice,
        sku,
        stock,
        specifications,
        isFeatured,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
