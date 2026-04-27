import { NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    return NextResponse.json({ 
      success: true, 
      reviews,
      summary: {
        total: totalReviews,
        average: Number(averageRating.toFixed(1))
      }
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch Reviews API Error:", msg);
    return NextResponse.json({ success: false, error: "Gagal mengambil ulasan." }, { status: 500 });
  }
}
