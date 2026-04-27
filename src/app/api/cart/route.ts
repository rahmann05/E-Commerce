import { NextResponse } from "next/server";
import { cartService } from "@/backend/services/cartService";

function getAuthenticatedUserId(req: Request): string | null {
  const userId = req.headers.get("x-user-id");
  if (!userId) return null;
  return userId.trim() || null;
}

export async function GET(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await cartService.getCart(userId);
    return NextResponse.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId, quantity } = await req.json();
    const cart = await cartService.addToCart(userId, productId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, quantity } = await req.json();
    const cart = await cartService.updateQuantity(userId, itemId, quantity);
    return NextResponse.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    if (!itemId) throw new Error("Item ID is required");
    const cart = await cartService.removeFromCart(userId, itemId);
    return NextResponse.json(cart);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
