import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.vapi.ai/api/v1/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "ephemeral" }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch ephemeral token:", err);
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 500 }
    );
  }
}
