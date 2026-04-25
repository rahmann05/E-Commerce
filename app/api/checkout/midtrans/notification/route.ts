import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const notificationJson = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    const core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
    });

    // Verify the notification signature for security
    const statusResponse = await core.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

    let newStatus: "AWAITING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" = "AWAITING_PAYMENT";

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

    // Update the database
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, message: "Notification handled successfully" });

  } catch (error: any) {
    console.error("Midtrans Notification Error:", error.message || error);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal memproses notifikasi.",
      details: error.message 
    }, { status: 500 });
  }
}
