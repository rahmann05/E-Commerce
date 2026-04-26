import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/backend/prisma/client";

function toNumber(value: unknown): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, customer_details, payment_type, bank } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: "order_id wajib diisi." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: String(order_id) },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order tidak ditemukan." }, { status: 404 });
    }

    if (order.items.length === 0) {
      return NextResponse.json({ success: false, error: "Order tidak memiliki item." }, { status: 400 });
    }

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

    const grossAmount = toNumber(order.totalAmount);
    const shippingFee = toNumber(order.shippingFee);

    const dbItemDetails = order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: toNumber(item.price),
      quantity: item.quantity,
    }));

    const itemPlusShipping = [
      ...dbItemDetails,
      ...(shippingFee > 0
        ? [
            {
              id: `shipping-${order.id}`,
              name: "Ongkos Kirim",
              price: shippingFee,
              quantity: 1,
            },
          ]
        : []),
    ];

    const computedTotal = itemPlusShipping.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemDetails =
      computedTotal === grossAmount
        ? itemPlusShipping
        : [
            {
              id: `order-${order.id}`,
              name: `Order ${order.id}`,
              price: grossAmount,
              quantity: 1,
            },
          ];

    const customerDetailsPayload = {
      first_name: customer_details?.first_name || order.user?.name || "Customer",
      email: customer_details?.email || order.user?.email || "",
    };

    const transaction_details = {
      order_id: String(order.id),
      gross_amount: grossAmount,
    };

    // If payment_type is provided, try Core API first for direct charge
    if (payment_type) {
      try {
        const parameter = {
          payment_type,
          transaction_details,
          item_details: itemDetails,
          customer_details: customerDetailsPayload,
        } as Record<string, unknown>; // Using Record here because Midtrans payload is dynamic

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
      } catch (coreError: unknown) {
        const msg = coreError instanceof Error ? coreError.message : "Unknown error";
        console.warn("Core API Charge failed, falling back to Snap:", msg);
        // If Core API fails (e.g. channel not activated), we fall back to Snap below
      }
    }

    // Fallback to Snap (Generic Popup)
    const payload = {
      transaction_details,
      item_details: itemDetails,
      customer_details: customerDetailsPayload,
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

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Midtrans API Error:", msg);
    return NextResponse.json({ 
      success: false,
      error: "Gagal memproses pembayaran.", 
      details: msg,
      key_prefix: (process.env.MIDTRANS_SERVER_KEY || "").substring(0, 7) + "..."
    }, { status: 500 });
  }
}
