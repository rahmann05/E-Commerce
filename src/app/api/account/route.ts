import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma/client';

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
        details: pm.details,
        accountNumber: pm.accountNumber || "",
        accountName: pm.accountName || "",
        isPrimary: pm.isPrimary
      })),
      orders: user.orders.map((o: any) => ({
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        status: o.status.toLowerCase(),
        total: Number(o.total),
        shipping: Number(o.shipping),
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
          line1: o.address.line1,
          city: o.address.city,
          province: o.address.province,
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
        // This is complex, but for now we mock it or implement simply
        await prisma.order.create({
          data: {
            userId,
            status: "PROCESSING",
            totalAmount: payload.total,
            shippingFee: payload.shipping,
            addressId: payload.addressId,
            items: {
              create: payload.items.map((item: any) => ({
                productId: item.productId,
                name: item.name || "Unknown Product",
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
                imageUrl: item.image || ""
              }))
            }
          }
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // After any mutation, return the full updated data
    const updatedRes = await fetch(`${new URL(req.url).origin}/api/account?userId=${userId}`);
    return updatedRes;
  } catch (err: any) {
    console.error("[API] POST /account failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
