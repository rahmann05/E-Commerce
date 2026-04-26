import { NextResponse } from "next/server";
import { cartService } from "@/backend/services/cartService";
import prisma from "@/backend/prisma/client";

async function getOrCreateUserId() {
  // For demo/testing purposes, we ensure a user exists.
  const testEmail = "test@example.com";
  let user = await prisma.user.findUnique({ where: { email: testEmail } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test User",
        password: "hashed_password", // Placeholder
      },
    });
  }
  
  return user.id;
}

export async function GET() {
  try {
    const userId = await getOrCreateUserId();
    const cart = await cartService.getCart(userId);
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const { productId, variantId, quantity } = await req.json();
    const cart = await cartService.addToCart(userId, productId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const { itemId, quantity } = await req.json();
    const cart = await cartService.updateQuantity(userId, itemId, quantity);
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getOrCreateUserId();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    if (!itemId) throw new Error("Item ID is required");
    const cart = await cartService.removeFromCart(userId, itemId);
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
