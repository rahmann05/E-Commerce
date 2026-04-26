import { NextResponse } from "next/server";
import prisma from "@/backend/prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // In a real app, verify credentials here. 
    // This is a mock login that always succeeds for the test user.
    return NextResponse.json({ 
      success: true, 
      token: "mock-jwt-token", 
      user: { id: "user_cln123456789", name: "Test User", email: email } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
