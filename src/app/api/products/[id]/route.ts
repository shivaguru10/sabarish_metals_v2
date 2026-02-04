import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find by ID or slug
    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        averageRating: avgRating,
        reviewCount: product.reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // If name changed, update slug
    let slug = existing.slug;
    if (body.name && body.name !== existing.name) {
      const baseSlug = generateSlug(body.name);
      slug = baseSlug;
      let counter = 1;
      
      while (await db.product.findFirst({ 
        where: { slug, id: { not: id } } 
      })) {
        slug = baseSlug + "-" + counter;
        counter++;
      }
    }

    // If SKU changed, check uniqueness
    if (body.sku && body.sku !== existing.sku) {
      const existingSku = await db.product.findFirst({
        where: { sku: body.sku, id: { not: id } },
      });
      if (existingSku) {
        return NextResponse.json(
          { success: false, error: "SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Update product
    const product = await db.product.update({
      where: { id },
      data: {
        ...body,
        slug,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
