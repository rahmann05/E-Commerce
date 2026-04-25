import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, items, customer_details, payment_type, bank } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured in .env");
    }

    console.log(`[Midtrans] Environment: ${isProduction ? "PRODUCTION" : "SANDBOX"}`);
    console.log(`[Midtrans] Key Prefix: ${serverKey.substring(0, 7)}`);

    // Initialize Midtrans clients
    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
    });

    const core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
    });

    const transaction_details = {
      order_id: order_id || `ORDER-${Date.now()}`,
      gross_amount: Math.round(gross_amount),
    };

    // If payment_type is provided, try Core API first for direct charge
    if (payment_type) {
      try {
        let parameter: any = {
          payment_type,
          transaction_details,
          item_details: items,
          customer_details,
        };

        if (payment_type === "bank_transfer") {
          parameter.bank_transfer = { bank: bank || "bca" };
        }

        if (payment_type === "qris") {
          parameter.qris = { acquirer: "gopay" };
        }

        console.log("Attempting Core API charge:", payment_type, bank);
        const chargeResponse = await core.charge(parameter);
        
        return NextResponse.json({
          success: true,
          method: "core",
          ...chargeResponse
        });
      } catch (coreError: any) {
        console.warn("Core API Charge failed, falling back to Snap:", coreError.message);
        // If Core API fails (e.g. channel not activated), we fall back to Snap below
      }
    }

    // Fallback to Snap (Generic Popup)
    const payload = {
      transaction_details,
      item_details: items,
      customer_details,
      usage_limit: 1,
    };

    console.log("Creating Snap transaction (Fallback)...");
    const transaction = await snap.createTransaction(payload);

    return NextResponse.json({
      success: true,
      method: "snap",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });

  } catch (error: any) {
    console.error("Midtrans API Error:", error.message || error);
    return NextResponse.json({ 
      success: false,
      error: "Gagal memproses pembayaran.", 
      details: error.message || "Unknown error",
      key_prefix: (process.env.MIDTRANS_SERVER_KEY || "").substring(0, 7) + "..."
    }, { status: 500 });
  }
}
