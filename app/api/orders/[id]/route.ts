import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
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
