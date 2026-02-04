import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await db.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
