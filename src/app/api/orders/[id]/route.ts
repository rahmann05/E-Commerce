import { NextResponse } from "next/server";
import prisma from '@/backend/prisma/client';

function getAuthenticatedUserId(request: Request): string | null {
  const userId = request.headers.get("x-user-id");
  if (!userId) return null;
  return userId.trim() || null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
        address: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch Order API Error:", msg);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal mengambil data pesanan.",
      details: msg 
    }, { status: 500 });
  }
}
