import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadMediaAsset, type UploadFolder } from "@/lib/supabase-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FOLDERS = new Set(["posters", "backdrops", "videos", "episodes"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") ?? "posters");
  const folder = (FOLDERS.has(folderRaw) ? folderRaw : "posters") as UploadFolder;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
  }
  try {
    const url = await uploadMediaAsset(file, folder);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload nie powiódł się";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
