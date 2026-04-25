import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-users";

async function ensureUsersSeeded(): Promise<void> {
  for (const user of MOCK_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        phone: user.phone ?? null,
        address: user.address ?? null,
        paymentPreference: user.paymentPreference ?? null,
        role: user.role === "admin" ? "ADMIN" : "USER",
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone ?? null,
        address: user.address ?? null,
        paymentPreference: user.paymentPreference ?? null,
        role: user.role === "admin" ? "ADMIN" : "USER",
      },
    });
  }
}

export async function POST(req: NextRequest) {
  await ensureUsersSeeded();
  const body = (await req.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { email, password },
  });
  if (!user) {
    return NextResponse.json({ error: "Email atau password salah. Silakan coba lagi." }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name ?? "User",
      email: user.email,
      phone: user.phone ?? undefined,
      address: user.address ?? undefined,
      paymentPreference: user.paymentPreference ?? undefined,
      role: user.role === "ADMIN" ? "admin" : "user",
      joinedAt: user.createdAt.toISOString().slice(0, 10),
    },
  });
}

