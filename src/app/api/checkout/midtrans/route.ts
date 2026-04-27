import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/backend/prisma/client";

function getAuthenticatedUserId(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/novure_uid=([^;]+)/);
  const userId = match ? match[1] : null;
  return userId?.trim() || null;
}

function toNumber(value: unknown): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export async function POST(request: Request) {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order_id, customer_details, payment_type, bank } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: "order_id wajib diisi." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: String(order_id),
        userId,
      },
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

    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured in .env");
    }

    console.log(`[Midtrans] Environment: ${isProduction ? "PRODUCTION" : "SANDBOX"}`);
    console.log(`[Midtrans] Key Prefix: ${serverKey.substring(0, 7)}`);

    const merchantId = process.env.MIDTRANS_MERCHANT_ID?.trim();

    // Initialize Midtrans clients
    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim(),
    });

    const core = new midtransClient.CoreApi({
      isProduction,
      serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim(),
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

        if (payment_type === "echannel") {
          parameter.echannel = {
            bill_info1: "Payment for Order",
            bill_info2: String(order_id),
          };
        }

        if (payment_type === "cstore") {
          parameter.cstore = {
            store: "alfamart",
            message: "Payment for Novure Order",
          };
        }

        if (payment_type === "gopay") {
          parameter.gopay = {
            enable_callback: true,
            callback_url: `${request.url.split("/api")[0]}/profile?tab=orders`,
          };
        }

        console.log("Attempting Core API charge:", payment_type, bank);
        const chargeResponse = await core.charge(parameter);
        
        return NextResponse.json({
          success: true,
          method: "core",
          ...chargeResponse
        });
      } catch (coreError: any) {
        console.error("Midtrans Core API Error Details:", {
          message: coreError.message,
          ApiResponse: coreError.ApiResponse,
          statusCode: coreError.statusCode
        });
        
        const msg = coreError.message || "Gagal memproses pembayaran.";
        
        return NextResponse.json({ 
          success: false, 
          error: msg,
          details: coreError.ApiResponse || coreError
        }, { status: 400 });
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
