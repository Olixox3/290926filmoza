import { NextResponse } from "next/server";
import { registerUser } from "@/lib/actions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; password?: string };
    await registerUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nie udało się założyć konta";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
