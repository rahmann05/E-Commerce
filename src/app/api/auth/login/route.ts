import { NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";
import { hashPassword, isPasswordHashed, verifyPassword } from "@/backend/auth/password";

const SESSION_COOKIE_NAME = "novure_uid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    let user = existingUser;
    if (!existingUser) {
      const hashedPassword = await hashPassword(normalizedPassword);
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          name: normalizedEmail.split("@")[0],
        },
      });
    } else {
      if (!existingUser.password) {
        const hashedPassword = await hashPassword(normalizedPassword);
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword },
        });
      }

      const isMatch = await verifyPassword(normalizedPassword, existingUser.password);
      if (!isMatch && existingUser.password) {
        return NextResponse.json(
          { success: false, error: "Email atau password salah." },
          { status: 401 }
        );
      }

      if (existingUser.password && !isPasswordHashed(existingUser.password)) {
        const hashedPassword = await hashPassword(normalizedPassword);
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User gagal diproses." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
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

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Request login tidak valid.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
