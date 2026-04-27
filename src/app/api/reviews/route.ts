import { NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";

function getAuthenticatedUserId(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/novure_uid=([^;]+)/);
  const userId = match ? match[1] : null;
  return userId?.trim() || null;
}

export async function POST(request: Request) {
  const userId = getAuthenticatedUserId(request);
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, orderId, rating, comment } = body;

    if (!productId || !orderId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Invalid data provided." }, { status: 400 });
    }

    // Verify that the user actually purchased this product in this order
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    const hasPurchasedItem = order.items.some(item => item.productId === productId);
    if (!hasPurchasedItem) {
      return NextResponse.json({ success: false, error: "You did not purchase this product in this order." }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId_orderId: {
          userId,
          productId,
          orderId
        }
      }
    });

    if (existingReview) {
      // Update existing review
      const review = await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment }
      });
      return NextResponse.json({ success: true, review });
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        orderId,
        rating,
        comment
      }
    });

    return NextResponse.json({ success: true, review });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Review API Error:", msg);
    return NextResponse.json({ success: false, error: "Gagal memproses ulasan." }, { status: 500 });
  }
}
