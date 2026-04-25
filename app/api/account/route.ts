import { NextRequest, NextResponse } from "next/server";
import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-users";

function mapStatus(status: string): "awaiting_payment" | "processing" | "shipped" | "delivered" | "cancelled" {
  if (status === "AWAITING_PAYMENT") return "awaiting_payment";
  if (status === "SHIPPED") return "shipped";
  if (status === "DELIVERED") return "delivered";
  if (status === "CANCELLED") return "cancelled";
  return "processing";
}

async function ensureUserExists(userId: string): Promise<void> {
  const mock = MOCK_USERS.find((u) => u.id === userId);
  if (mock) {
    await prisma.user.upsert({
      where: { id: mock.id },
      update: {
        name: mock.name,
        email: mock.email,
        password: mock.password,
        phone: mock.phone ?? null,
        address: mock.address ?? null,
        paymentPreference: mock.paymentPreference ?? null,
        role: mock.role === "admin" ? "ADMIN" : "USER",
      },
      create: {
        id: mock.id,
        name: mock.name,
        email: mock.email,
        password: mock.password,
        phone: mock.phone ?? null,
        address: mock.address ?? null,
        paymentPreference: mock.paymentPreference ?? null,
        role: mock.role === "admin" ? "ADMIN" : "USER",
      },
    });
  }
}

async function ensureVoucherSeed(userId: string): Promise<void> {
  const voucher = await prisma.voucher.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      title: "Diskon 10% untuk pembelian berikutnya",
      discountPct: 10,
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      isActive: true,
    },
  });
  await prisma.userVoucher.upsert({
    where: {
      userId_voucherId: { userId, voucherId: voucher.id },
    },
    update: {},
    create: { userId, voucherId: voucher.id },
  });
}

async function getSnapshot(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: { orderBy: { createdAt: "desc" } },
      paymentMethods: { orderBy: { createdAt: "desc" } },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      wishlistItems: { orderBy: { createdAt: "desc" } },
      vouchers: {
        include: { voucher: true },
      },
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  return {
    phone: user?.phone ?? "",
    addresses:
      user?.addresses.map((item) => ({
        id: item.id,
        label: item.label,
        recipient: item.recipient ?? "Penerima",
        phone: item.phone ?? "-",
        line1: item.line1,
        district: item.district ?? "",
        city: item.city ?? "",
        province: item.province ?? "",
        postalCode: item.postalCode ?? "",
        latitude: item.latitude ?? undefined,
        longitude: item.longitude ?? undefined,
        isPrimary: item.isDefault,
      })) ?? [],
    paymentMethods:
      user?.paymentMethods.map((item) => ({
        id: item.id,
        label: item.provider,
        details: item.accountMasked ?? item.type,
        accountNumber: item.accountNumber ?? "",
        accountName: item.accountName ?? "",
        isPrimary: item.isDefault,
      })) ?? [],
    orders:
      user?.orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt.toISOString(),
        status: mapStatus(order.status),
        total: Number(order.totalAmount),
        shipping: Number(order.shippingFee),
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.productName,
          size: item.size ?? "OS",
          color: item.color ?? "Default",
          quantity: item.quantity,
          unitPrice: Number(item.price),
          imageUrl: item.imageUrl ?? "/images/model1.jpg",
        })),
      })) ?? [],
    wishlist:
      user?.wishlistItems.map((item) => ({
        productId: Number(item.productId),
        name: item.productName,
        image: item.productImage,
        price: Number(item.productPrice),
        category: item.category,
      })) ?? [],
    vouchers:
      user?.vouchers.map((item) => ({
        id: item.voucher.id,
        code: item.voucher.code,
        title: item.voucher.title,
        expiresAt: item.voucher.expiresAt?.toISOString().slice(0, 10) ?? "",
      })) ?? [],
    notifications:
      user?.notifications.map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        isRead: Boolean(item.readAt),
        createdAt: item.createdAt.toISOString(),
      })) ?? [],
  };
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  await ensureUserExists(userId);
  await ensureVoucherSeed(userId);
  const data = await getSnapshot(userId);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    action: string;
    userId: string;
    [key: string]: unknown;
  };
  const { action, userId } = body;
  if (!action || !userId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await ensureUserExists(userId);
  await ensureVoucherSeed(userId);

  if (action === "saveProfileInfo") {
    await prisma.user.update({
      where: { id: userId },
      data: { name: String(body.name ?? ""), phone: String(body.phone ?? "") },
    });
  } else if (action === "addAddress") {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    await prisma.address.create({
      data: {
        userId,
        label: String(body.label ?? "Alamat"),
        recipient: String(body.recipient ?? "Penerima"),
        phone: String(body.phone ?? "-"),
        line1: String(body.line1 ?? ""),
        district: String(body.district ?? ""),
        city: String(body.city ?? ""),
        province: String(body.province ?? ""),
        postalCode: String(body.postalCode ?? ""),
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        isDefault: true,
      },
    });
  } else if (action === "updateAddress") {
    const payload = (body.payload ?? {}) as Record<string, unknown>;
    const isPrimary = Boolean(payload.isPrimary);
    if (isPrimary) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    await prisma.address.update({
      where: { id: String(body.id) },
      data: {
        label: payload.label ? String(payload.label) : undefined,
        recipient: payload.recipient ? String(payload.recipient) : undefined,
        phone: payload.phone ? String(payload.phone) : undefined,
        line1: payload.line1 ? String(payload.line1) : undefined,
        district: payload.district ? String(payload.district) : undefined,
        city: payload.city ? String(payload.city) : undefined,
        province: payload.province ? String(payload.province) : undefined,
        postalCode: payload.postalCode ? String(payload.postalCode) : undefined,
        latitude: payload.latitude ? Number(payload.latitude) : undefined,
        longitude: payload.longitude ? Number(payload.longitude) : undefined,
        isDefault: isPrimary || undefined,
      },
    });
  } else if (action === "removeAddress") {
    await prisma.address.deleteMany({ where: { id: String(body.id), userId } });
  } else if (action === "addPaymentMethod") {
    await prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    await prisma.paymentMethod.create({
      data: {
        userId,
        type: "VIRTUAL_ACCOUNT",
        provider: String(body.label ?? "Bank"),
        accountNumber: String(body.accountNumber ?? ""),
        accountName: String(body.accountName ?? ""),
        accountMasked: String(body.accountNumber ?? "").slice(-4),
        isDefault: true,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { paymentPreference: String(body.label ?? "") },
    });
  } else if (action === "removePaymentMethod") {
    await prisma.paymentMethod.deleteMany({ where: { id: String(body.id), userId } });
  } else if (action === "toggleWishlistItem") {
    const item = (body.item ?? {}) as Record<string, unknown>;
    const productId = String(item.productId ?? "");
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId,
          productId,
          productName: String(item.name ?? ""),
          productImage: String(item.image ?? ""),
          productPrice: new Prisma.Decimal(Number(item.price ?? 0)),
          category: String(item.category ?? ""),
        },
      });
    }
  } else if (action === "removeWishlistItem") {
    await prisma.wishlistItem.deleteMany({
      where: { userId, productId: String(body.productId ?? "") },
    });
  } else if (action === "markNotificationRead") {
    await prisma.notification.updateMany({
      where: { id: String(body.id), userId },
      data: { readAt: new Date() },
    });
  } else if (action === "createOrder") {
    try {
      const items = (body.items ?? []) as Record<string, unknown>[];
      const subtotal = items.reduce(
        (acc, item) => acc + Number(item.price ?? 0) * Number(item.quantity ?? 1),
        0
      );
      const shipping = Number(body.shipping ?? 0);
      const total = Number(body.total ?? subtotal + shipping);
      await prisma.order.create({
        data: {
          userId,
          status: OrderStatus.AWAITING_PAYMENT,
          shippingFee: new Prisma.Decimal(shipping),
          courier: String(body.courier ?? "JNE Regular"),
          notes: body.notes ? String(body.notes) : null,
          promoCode: body.promoCode ? String(body.promoCode) : null,
          totalAmount: new Prisma.Decimal(total),
          items: {
            create: items.map((item) => ({
              productId: String(item.productId ?? ""),
              productName: String(item.name ?? ""),
              size: item.size ? String(item.size) : null,
              color: item.color ? String(item.color) : null,
              imageUrl: item.imageUrl ? String(item.imageUrl) : null,
              quantity: Number(item.quantity ?? 1),
              price: new Prisma.Decimal(Number(item.price ?? 0)),
            })),
          },
        },
      });
      await prisma.notification.create({
        data: {
          userId,
          type: "ORDER",
          title: "Pesanan Menunggu Pembayaran",
          message: "Silakan selesaikan pembayaran Anda untuk memproses pesanan.",
        },
      });
    } catch (err: any) {
      console.error("CRITICAL ERROR in createOrder:", err);
      return NextResponse.json({ error: "Gagal membuat pesanan di database.", details: err.message }, { status: 500 });
    }
  }

  const data = await getSnapshot(userId);
  return NextResponse.json({ data });
}

