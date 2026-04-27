import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/backend/prisma/client";

function normalizePrice(price: unknown): number {
  const n = Number(price ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n < 10000 ? n * 1000 : n;
}

async function getAuthenticatedUserId(_req?: Request): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("novure_uid")?.value;
  return userId?.trim() || null;
}

function ensureString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

async function buildAccountData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: {
        orderBy: { isPrimary: "desc" },
      },
      paymentMethods: {
        orderBy: { isPrimary: "desc" },
      },
      orders: {
        include: {
          items: true,
          address: true,
        },
        orderBy: { createdAt: "desc" },
      },
      wishlistItems: {
        include: {
          product: true,
        },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
      },
      vouchers: {
        include: {
          voucher: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    phone: user.phone || "",
    addresses: user.addresses.map((address) => ({
      id: address.id,
      label: address.label,
      recipient: address.recipient || "",
      phone: address.phone || "",
      line1: address.line1,
      district: address.district || "",
      city: address.city || "",
      province: address.province || "",
      postalCode: address.postalCode || "",
      latitude: address.latitude ?? undefined,
      longitude: address.longitude ?? undefined,
      isPrimary: address.isPrimary,
    })),
    paymentMethods: user.paymentMethods.map((paymentMethod) => ({
      id: paymentMethod.id,
      label: paymentMethod.label,
      details: paymentMethod.accountNumber || paymentMethod.accountName || paymentMethod.label,
      accountNumber: paymentMethod.accountNumber || "",
      accountName: paymentMethod.accountName || "",
      isPrimary: paymentMethod.isPrimary,
    })),
    orders: user.orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      status: order.status.toLowerCase(),
      total: Number(order.totalAmount),
      shipping: Number(order.shippingFee),
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size || "",
        color: item.color || "",
        quantity: item.quantity,
        unitPrice: Number(item.price),
        imageUrl: item.imageUrl || "",
      })),
      address: order.address
        ? {
          id: order.address.id,
          label: order.address.label,
          recipient: order.address.recipient || "",
          phone: order.address.phone || "",
          line1: order.address.line1,
          district: order.address.district || "",
          city: order.address.city || "",
          province: order.address.province || "",
          postalCode: order.address.postalCode || "",
          isPrimary: order.address.isPrimary,
        }
        : undefined,
    })),
    wishlist: user.wishlistItems.map((wishlistItem) => ({
      productId: wishlistItem.productId,
      name: wishlistItem.product.name,
      image: wishlistItem.product.images[0] || "",
      price: Number(wishlistItem.product.price),
      category: wishlistItem.product.categoryId,
    })),
    vouchers: user.vouchers.map((userVoucher) => ({
      id: userVoucher.voucher.id,
      code: userVoucher.voucher.code,
      title: userVoucher.voucher.title,
      expiresAt: userVoucher.voucher.expiresAt ? userVoucher.voucher.expiresAt.toISOString() : "",
    })),
    notifications: user.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      isRead: notification.isRead,
    })),
  };
}

export async function GET(req: Request) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    console.error("[API] GET /account: No userId found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await buildAccountData(userId);
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[API] GET /account failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    console.error("[API] POST /account: No userId found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = ensureString(body.action);
    const payload = body;

    switch (action) {
      case "saveProfileInfo": {
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: ensureString(payload.name),
            phone: ensureString(payload.phone) || null,
          },
        });
        break;
      }

      case "addAddress": {
        console.log("[API] Action: addAddress for user", userId);
        const currentCount = await prisma.address.count({ where: { userId } });
        const isPrimary = payload.isPrimary === true || currentCount === 0;
        
        if (isPrimary) {
          await prisma.address.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false },
          });
        }

        await prisma.address.create({
          data: {
            userId,
            label: ensureString(payload.label) || "Rumah",
            recipient: ensureString(payload.recipient) || null,
            phone: ensureString(payload.phone) || null,
            line1: ensureString(payload.line1),
            district: ensureString(payload.district) || null,
            city: ensureString(payload.city) || null,
            province: ensureString(payload.province) || null,
            postalCode: ensureString(payload.postalCode) || null,
            latitude: typeof payload.latitude === "number" ? payload.latitude : null,
            longitude: typeof payload.longitude === "number" ? payload.longitude : null,
            isPrimary,
          },
        });
        break;
      }

      case "updateAddress": {
        const addressId = ensureString(payload.id);
        const patch =
          payload.payload && typeof payload.payload === "object"
            ? (payload.payload as Record<string, unknown>)
            : {};

        const nextIsPrimary = typeof patch.isPrimary === "boolean" ? patch.isPrimary : undefined;
        if (nextIsPrimary) {
          await prisma.address.updateMany({
            where: { userId, isPrimary: true, NOT: { id: addressId } },
            data: { isPrimary: false },
          });
        }

        const result = await prisma.address.updateMany({
          where: {
            id: addressId,
            userId,
          },
          data: {
            label: typeof patch.label === "string" ? patch.label : undefined,
            recipient: typeof patch.recipient === "string" ? patch.recipient : undefined,
            phone: typeof patch.phone === "string" ? patch.phone : undefined,
            line1: typeof patch.line1 === "string" ? patch.line1 : undefined,
            district: typeof patch.district === "string" ? patch.district : undefined,
            city: typeof patch.city === "string" ? patch.city : undefined,
            province: typeof patch.province === "string" ? patch.province : undefined,
            postalCode: typeof patch.postalCode === "string" ? patch.postalCode : undefined,
            latitude: typeof patch.latitude === "number" ? patch.latitude : undefined,
            longitude: typeof patch.longitude === "number" ? patch.longitude : undefined,
            isPrimary: nextIsPrimary,
          },
        });

        if (result.count === 0) {
          return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }
        break;
      }

      case "removeAddress": {
        const result = await prisma.address.deleteMany({
          where: {
            id: ensureString(payload.id),
            userId,
          },
        });
        if (result.count === 0) {
          return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }
        break;
      }

      case "addPaymentMethod": {
        console.log("[API] Action: addPaymentMethod for user", userId);
        const currentCount = await prisma.paymentMethod.count({ where: { userId } });
        const isPrimary = currentCount === 0;

        if (isPrimary) {
          await prisma.paymentMethod.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false },
          });
        }

        await prisma.paymentMethod.create({
          data: {
            userId,
            label: ensureString(payload.label) || "Metode Pembayaran",
            accountNumber: ensureString(payload.accountNumber) || null,
            accountName: ensureString(payload.accountName) || null,
            isPrimary,
          },
        });
        break;
      }

      case "removePaymentMethod": {
        const paymentMethodId = ensureString(payload.id);
        const target = await prisma.paymentMethod.findFirst({
          where: {
            id: paymentMethodId,
            userId,
          },
          select: { id: true, isPrimary: true },
        });

        if (!target) {
          return NextResponse.json({ error: "Payment method not found" }, { status: 404 });
        }

        await prisma.paymentMethod.delete({ where: { id: paymentMethodId } });

        if (target.isPrimary) {
          const replacement = await prisma.paymentMethod.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { id: true },
          });
          if (replacement) {
            await prisma.paymentMethod.update({
              where: { id: replacement.id },
              data: { isPrimary: true },
            });
          }
        }
        break;
      }

      case "toggleWishlistItem": {
        const item =
          payload.item && typeof payload.item === "object"
            ? (payload.item as Record<string, unknown>)
            : null;
        const productId = ensureString(item?.productId);
        if (!productId) {
          return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const existing = await prisma.wishlistItem.findFirst({
          where: { userId, productId },
        });

        if (existing) {
          await prisma.wishlistItem.delete({ where: { id: existing.id } });
        } else {
          await prisma.wishlistItem.create({
            data: { userId, productId },
          });
        }
        break;
      }

      case "removeWishlistItem": {
        await prisma.wishlistItem.deleteMany({
          where: {
            userId,
            productId: ensureString(payload.productId),
          },
        });
        break;
      }

      case "markNotificationRead": {
        const result = await prisma.notification.updateMany({
          where: {
            id: ensureString(payload.id),
            userId,
          },
          data: { isRead: true },
        });
        if (result.count === 0) {
          return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }
        break;
      }

      case "createOrder": {
        await prisma.$transaction(async (tx) => {
          const items = Array.isArray(payload.items) ? payload.items : [];
          if (items.length === 0) {
            throw new Error("Item checkout kosong.");
          }

          const paymentMethodId = ensureString(payload.paymentMethodId);
          if (!paymentMethodId) {
            throw new Error("Metode pembayaran wajib dipilih.");
          }

          let paymentMethod = await tx.paymentMethod.findFirst({
            where: {
              id: paymentMethodId,
              userId,
            },
          });

          // Support for "Standard"/Ad-hoc payment methods (prefixed with std_)
          if (!paymentMethod && paymentMethodId.startsWith("std_")) {
            const label = paymentMethodId.replace("std_", "").toUpperCase();
            paymentMethod = {
              id: paymentMethodId,
              userId,
              label: label === "VA_OTHER" ? "Virtual Account (Lainnya)" : label,
              accountNumber: "",
              accountName: "",
              isPrimary: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as any;
          }

          if (!paymentMethod) {
            throw new Error("Metode pembayaran tidak ditemukan.");
          }

          const totalAmount = normalizePrice(payload.total);
          const shippingFee = normalizePrice(payload.shipping);

          if (totalAmount <= 0) {
            throw new Error("Total checkout tidak valid.");
          }

          const promoCode = ensureString(payload.promoCode).toUpperCase();
          if (promoCode) {
            const voucher = await tx.voucher.findFirst({
              where: {
                code: promoCode,
                isActive: true,
              },
            });

            if (!voucher) {
              throw new Error("Voucher tidak ditemukan atau tidak aktif.");
            }

            const now = new Date();
            if ((voucher.startsAt && voucher.startsAt > now) || (voucher.expiresAt && voucher.expiresAt < now)) {
              throw new Error("Voucher sudah tidak berlaku.");
            }

            const userVoucher = await tx.userVoucher.findFirst({
              where: {
                userId,
                voucherId: voucher.id,
              },
            });

            if (!userVoucher) {
              throw new Error("Voucher belum dimiliki akun ini.");
            }

            if (userVoucher.redeemedAt) {
              throw new Error("Voucher sudah pernah digunakan.");
            }

            await tx.userVoucher.update({
              where: { id: userVoucher.id },
              data: { redeemedAt: now },
            });
          }

          const variantUpdates: Array<{
            variantId: string;
            productId: string;
            size: string;
            quantity: number;
          }> = [];

          const orderItems: Array<{
            productId: string;
            name: string;
            quantity: number;
            price: number;
            size: string;
            color: string;
            imageUrl: string;
          }> = [];

          for (const rawItem of items) {
            const item = rawItem as Record<string, unknown>;
            const product = item.product && typeof item.product === "object" ? (item.product as Record<string, unknown>) : {};
            const variant = item.variant && typeof item.variant === "object" ? (item.variant as Record<string, unknown>) : {};

            const productId = ensureString(item.productId || product.id);
            const variantId = ensureString(item.productVariantId || variant.id);
            const quantity = Number(item.quantity || 0);

            if (!productId || !variantId || quantity <= 0) {
              throw new Error("Data item checkout tidak valid.");
            }

            const dbVariant = await tx.productVariant.findUnique({
              where: { id: variantId },
              include: { product: true },
            });

            if (!dbVariant || dbVariant.productId !== productId) {
              throw new Error("Variant produk tidak ditemukan atau tidak cocok.");
            }

            if (dbVariant.stock < quantity) {
              throw new Error(`Stok ${dbVariant.size} tidak cukup. Sisa: ${dbVariant.stock}.`);
            }

            const unitPrice = normalizePrice(product.price ?? item.price ?? dbVariant.product.price);
            if (unitPrice <= 0) {
              throw new Error(`Harga item ${dbVariant.product.name} tidak valid.`);
            }

            orderItems.push({
              productId,
              name: ensureString(product.name || item.name) || dbVariant.product.name,
              quantity,
              price: unitPrice,
              size: ensureString(variant.size || item.size) || dbVariant.size,
              color: ensureString(variant.color || item.color) || dbVariant.color || "",
              imageUrl: ensureString(product.imageUrl || item.imageUrl || item.image) || dbVariant.product.images?.[0] || "",
            });

            variantUpdates.push({
              variantId,
              productId,
              size: dbVariant.size,
              quantity,
            });
          }

          const notesPart = ensureString(payload.notes);
          const notes = [notesPart, `Payment: ${paymentMethod.label}`].filter(Boolean).join(" | ");

          const createdOrder = await tx.order.create({
            data: {
              userId,
              status: "AWAITING_PAYMENT",
              totalAmount,
              shippingFee,
              addressId: ensureString(payload.addressId) || null,
              courier: ensureString(payload.courier) || "JNE Regular",
              notes: notes || null,
              promoCode: promoCode || null,
              items: {
                create: orderItems,
              },
            },
          });

          const groupedByProduct = new Map<string, Array<{ size: string; quantity: number }>>();
          for (const upd of variantUpdates) {
            const current = groupedByProduct.get(upd.productId) || [];
            current.push({ size: upd.size, quantity: upd.quantity });
            groupedByProduct.set(upd.productId, current);
          }

          for (const upd of variantUpdates) {
            await tx.productVariant.update({
              where: { id: upd.variantId },
              data: {
                stock: {
                  decrement: upd.quantity,
                },
              },
            });
          }

          for (const [productId, sizeRows] of groupedByProduct.entries()) {
            const nextTotalStock = await tx.productVariant.aggregate({
              where: { productId },
              _sum: { stock: true },
            });

            const safeStock = Math.max(0, nextTotalStock._sum.stock ?? 0);
            await tx.product.update({
              where: { id: productId },
              data: {
                stock: safeStock,
                inStock: safeStock > 0,
              },
            });
          }

          const cart = await tx.cart.findUnique({ where: { userId } });
          if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          }

          await tx.notification.create({
            data: {
              userId,
              type: "ORDER",
              title: "Pesanan Berhasil Dibuat",
              message: `Pesanan ${createdOrder.id} menunggu pembayaran.`,
            },
          });
        });
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedData = await buildAccountData(userId);
    if (!updatedData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[API] POST /account failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
