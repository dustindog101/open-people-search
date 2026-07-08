import { NextRequest, NextResponse } from "next/server";

// In-memory opt-out requests (for Vercel serverless)
const optOutRequests: Array<{ id: string; fullName: string; email: string; reason?: string; status: string; createdAt: Date }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, reason } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    const id = `optout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optOut = { id, fullName: fullName.trim(), email: email.trim(), reason: reason?.trim() || undefined, status: "pending" as const, createdAt: new Date() };
    optOutRequests.push(optOut);

    return NextResponse.json({
      id: optOut.id,
      status: "pending",
      message: "Your opt-out request has been received. We will process it within 48 hours.",
    });
  } catch (error) {
    console.error("Opt-out error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}