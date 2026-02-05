import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET - Fetch dashboard stats (admin only)
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [products, categories, orders, users, recentOrders, lowStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      // Low stock products (stock <= 10)
      prisma.product.findMany({
        where: {
          stock: { lte: 10 },
          isActive: true,
        },
        take: 5,
        orderBy: { stock: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          stock: true,
          image: true,
        },
      }),
    ]);

    return NextResponse.json({
      products,
      categories,
      orders,
      users,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
