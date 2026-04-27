import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/backend/prisma/client";

function getAuthenticatedUserId(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/novure_uid=([^;]+)/);
  const userId = match ? match[1] : null;
  return userId?.trim() || null;
}

export async function GET(request: Request) {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });
    }

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured in .env");
    }

    const core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
    });

    const statusResponse = await core.transaction.status(orderId);

    // Sync status to database to support localhost where webhooks cannot reach
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = undefined; // Use undefined so we only update if we have a valid mapping

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        newStatus = "AWAITING_PAYMENT";
      } else if (fraudStatus === "accept") {
        newStatus = "PROCESSING";
      }
    } else if (transactionStatus === "settlement") {
      newStatus = "PROCESSING";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      newStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      newStatus = "AWAITING_PAYMENT";
    }

    if (newStatus) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus as any },
      });
    }

    return NextResponse.json({
      success: true,
      ...statusResponse
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Midtrans Status API Error:", msg);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal mengambil status pembayaran.",
      details: msg
    }, { status: 500 });
  }
}
