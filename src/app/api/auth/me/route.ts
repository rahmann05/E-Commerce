import { NextRequest, NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";

const SESSION_COOKIE_NAME = "novure_uid";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get(SESSION_COOKIE_NAME)?.value?.trim();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        paymentPreference: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name ?? user.email.split("@")[0],
        email: user.email,
        phone: user.phone,
        address: user.address,
        paymentPreference: user.paymentPreference,
        role: user.role === "ADMIN" ? "admin" : "user",
        joinedAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
