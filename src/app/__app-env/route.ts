import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    VITE_AUTH_ENABLED: process.env.VITE_AUTH_ENABLED ?? "true",
  });
}
