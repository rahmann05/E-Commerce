import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;

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

  } catch (error: any) {
    console.error("Fetch Order API Error:", error.message || error);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal mengambil data pesanan.",
      details: error.message 
    }, { status: 500 });
  }
}
