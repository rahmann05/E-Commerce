import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, items, customer_details } = body;

    // Use Midtrans Client
    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production" && !!process.env.MIDTRANS_IS_PRODUCTION,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DUMMY", // Must replace with real Server Key from user's Midtrans dashboard
    });

    const payload = {
      transaction_details: {
        order_id: order_id || `ORDER-${Date.now()}`,
        gross_amount: Math.round(gross_amount),
      },
      item_details: items,
      customer_details: customer_details,
      // You can explicitly configure enabled payments here, or just let Midtrans decide from Dashboard settings:
      enabled_payments: [
        "credit_card",
        "gopay",
        "shopeepay",
        "permata_va",
        "bca_va",
        "bni_va",
        "bri_va",
        "other_va",
        "indomaret",
        "alfamart",
        "danamon_online",
        "akulaku"
      ]
    };

    const transaction = await snap.createTransaction(payload);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      is_mock: false
    });

  } catch (error: any) {
    console.error("Real Payment API error:", error.message || error);
    return NextResponse.json({ 
      error: "Sistem Pembayaran (Midtrans) Gagal. Pastikan MIDTRANS_SERVER_KEY valid di .env Anda.", 
      details: error.message 
    }, { status: 500 });
  }
}
