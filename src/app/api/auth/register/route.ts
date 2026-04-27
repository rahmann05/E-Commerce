import { NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";
import { hashPassword } from "@/backend/auth/password";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "").trim();
    const normalizedName = String(name ?? "").trim();

    if (!normalizedEmail || !normalizedPassword || !normalizedName) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(normalizedPassword);
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: normalizedName,
        role: "USER",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Akun berhasil dibuat. Silakan login.",
    });
  } catch (error: any) {
    console.error("[API] Register error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat akun. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
