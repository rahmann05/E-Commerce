import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
  }

  try {
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

    return NextResponse.json({
      success: true,
      ...statusResponse
    });

  } catch (error: any) {
    console.error("Midtrans Status API Error:", error.message || error);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal mengambil status pembayaran.",
      details: error.message 
    }, { status: 500 });
  }
}
