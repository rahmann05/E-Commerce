import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma/client';

function normalizePrice(price: unknown): number {
  const n = Number(price ?? 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n < 10000 ? n * 1000 : n;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { isPrimary: 'desc' }
        },
        paymentMethods: {
          orderBy: { isPrimary: 'desc' }
        },
        orders: {
          include: {
            items: true,
            address: true
          },
          orderBy: { createdAt: 'desc' }
        },
        wishlistItems: {
          include: {
            product: true
          }
        },
        notifications: {
          orderBy: { createdAt: 'desc' }
        },
        vouchers: {
          include: {
            voucher: true
          }
        }
      }
    }) as any;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Map DB objects to ProfileData format
    const formattedData = {
      phone: user.phone || "",
      addresses: user.addresses.map((a: any) => ({
        id: a.id,
        label: a.label,
        recipient: a.recipient,
        phone: a.phone || "",
        line1: a.line1,
        district: a.district || "",
        city: a.city,
        province: a.province,
        postalCode: a.postalCode || "",
        latitude: a.latitude || undefined,
        longitude: a.longitude || undefined,
        isPrimary: a.isPrimary
      })),
      paymentMethods: user.paymentMethods.map((pm: any) => ({
        id: pm.id,
        label: pm.label,
        details: pm.accountNumber || pm.accountName || pm.label,
        accountNumber: pm.accountNumber || "",
        accountName: pm.accountName || "",
        isPrimary: pm.isPrimary
      })),
      orders: user.orders.map((o: any) => ({
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        status: o.status.toLowerCase(),
        total: Number(o.totalAmount),
        shipping: Number(o.shippingFee),
        items: o.items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          size: item.size || "",
          color: item.color || "",
          quantity: item.quantity,
          unitPrice: Number(item.price),
          imageUrl: item.imageUrl || ""
        })),
        address: o.address ? {
          id: o.address.id,
          label: o.address.label,
          recipient: o.address.recipient,
          phone: o.address.phone || "",
          line1: o.address.line1,
          district: o.address.district || "",
          city: o.address.city,
          province: o.address.province,
          postalCode: o.address.postalCode || "",
          isPrimary: o.address.isPrimary
        } : undefined
      })),
      wishlist: user.wishlistItems.map((w: any) => ({
        productId: w.productId,
        name: w.product.name,
        image: w.product.images[0] || "",
        price: Number(w.product.price),
        category: "tees" // Fallback
      })),
      vouchers: user.vouchers.map((v: any) => ({
        id: v.voucher.id,
        code: v.voucher.code,
        title: v.voucher.title,
        expiresAt: v.expiresAt ? v.expiresAt.toISOString() : ""
      })),
      notifications: user.notifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
        isRead: n.isRead
      }))
    };

    return NextResponse.json({ data: formattedData });
  } catch (err: any) {
    console.error("[API] GET /account failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, ...payload } = body;

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    switch (action) {
      case "saveProfileInfo":
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: payload.name,
            phone: payload.phone
          }
        });
        break;

      case "addAddress":
        await prisma.address.create({
          data: {
            userId,
            label: payload.label,
            recipient: payload.recipient,
            phone: payload.phone,
            line1: payload.line1,
            district: payload.district,
            city: payload.city,
            province: payload.province,
            postalCode: payload.postalCode,
            latitude: payload.latitude,
            longitude: payload.longitude,
            isPrimary: payload.isPrimary || false
          }
        });
        break;

      case "updateAddress":
        await prisma.address.update({
          where: { id: payload.id },
          data: payload.payload
        });
        break;

      case "removeAddress":
        await prisma.address.delete({
          where: { id: payload.id }
        });
        break;

      case "addPaymentMethod":
        await prisma.paymentMethod.create({
          data: {
            userId,
            label: payload.label,
            accountNumber: payload.accountNumber,
            accountName: payload.accountName,
            isPrimary: false
          }
        });
        break;

      case "removePaymentMethod":
        await prisma.paymentMethod.delete({
          where: { id: payload.id }
        });
        break;

      case "toggleWishlistItem":
        const existing = await prisma.wishlistItem.findFirst({
          where: { userId, productId: payload.item.productId }
        });
        if (existing) {
          await prisma.wishlistItem.delete({ where: { id: existing.id } });
        } else {
          await prisma.wishlistItem.create({
            data: { userId, productId: payload.item.productId }
          });
        }
        break;

      case "markNotificationRead":
        await prisma.notification.update({
          where: { id: payload.id },
          data: { isRead: true }
        });
        break;

      case "createOrder":
        await prisma.$transaction(async (tx) => {
          const items = Array.isArray(payload.items) ? payload.items : [];
          if (items.length === 0) {
            throw new Error("Item checkout kosong.");
          }

          const totalAmount = normalizePrice(payload.total);
          const shippingFee = normalizePrice(payload.shipping);

          if (totalAmount <= 0) {
            throw new Error("Total checkout tidak valid.");
          }

          const variantUpdates: Array<{
            variantId: string;
            productId: string;
            size: string;
            quantity: number;
          }> = [];

          const orderItems = [] as Array<{
            productId: string;
            name: string;
            quantity: number;
            price: number;
            size: string;
            color: string;
            imageUrl: string;
          }>;

          for (const rawItem of items) {
            const item = rawItem as any;
            const productId = String(item.productId || item.product?.id || "");
            const variantId = String(item.productVariantId || item.variant?.id || "");
            const quantity = Number(item.quantity || 0);

            if (!productId || !variantId || quantity <= 0) {
              throw new Error("Data item checkout tidak valid.");
            }

            const variant = await tx.productVariant.findUnique({
              where: { id: variantId },
              include: { product: true },
            });

            if (!variant || variant.productId !== productId) {
              throw new Error("Variant produk tidak ditemukan atau tidak cocok.");
            }

            if (variant.stock < quantity) {
              throw new Error(`Stok ${variant.size} tidak cukup. Sisa: ${variant.stock}.`);
            }

            const unitPrice = normalizePrice(item.product?.price ?? item.price ?? variant.product.price);
            if (unitPrice <= 0) {
              throw new Error(`Harga item ${variant.product.name} tidak valid.`);
            }

            orderItems.push({
              productId,
              name: item.product?.name || item.name || variant.product.name,
              quantity,
              price: unitPrice,
              size: item.variant?.size || item.size || variant.size,
              color: item.variant?.color || item.color || variant.color || "",
              imageUrl: item.product?.imageUrl || item.imageUrl || item.image || variant.product.images?.[0] || "",
            });

            variantUpdates.push({
              variantId,
              productId,
              size: variant.size,
              quantity,
            });
          }

          const createdOrder = await tx.order.create({
            data: {
              userId,
              status: "AWAITING_PAYMENT",
              totalAmount,
              shippingFee,
              addressId: payload.addressId,
              courier: payload.courier || "JNE Regular",
              notes: payload.notes || null,
              promoCode: payload.promoCode || null,
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
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) continue;

            const productRecord = product as any;
            const sizeOptions = Array.isArray(productRecord.sizeOptions) ? productRecord.sizeOptions : [];
            const currentSizeStocks = Array.isArray(productRecord.sizeStocks) ? productRecord.sizeStocks : [];

            const nextSizeStocks = [...currentSizeStocks];
            for (const row of sizeRows) {
              const idx = sizeOptions.findIndex((s: string) => s === row.size);
              if (idx >= 0) {
                nextSizeStocks[idx] = Math.max(0, (nextSizeStocks[idx] ?? 0) - row.quantity);
              }
            }

            const nextTotalStock = Math.max(0, nextSizeStocks.reduce((sum, n) => sum + (n || 0), 0));
            await tx.product.update({
              where: { id: productId },
              data: {
                sizeStocks: nextSizeStocks,
                stock: nextTotalStock,
                inStock: nextTotalStock > 0,
              },
            });
          }

          const cart = await tx.cart.findUnique({ where: { userId } });
          if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          }

          return createdOrder;
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // After any mutation, return the full updated data
    const updatedRes = await fetch(`${new URL(req.url).origin}/api/account?userId=${userId}`);
    const updatedPayload = await updatedRes.json();
    return NextResponse.json(updatedPayload, { status: updatedRes.status });
  } catch (err: any) {
    console.error("[API] POST /account failed:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
