import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const MEDIA_BUCKET = "media-assets";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

function extFor(type: string, fallbackName: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/avif") return "avif";
  if (type === "video/mp4") return "mp4";
  if (type === "video/webm") return "webm";
  const fromName = fallbackName.split(".").pop()?.toLowerCase();
  return fromName && fromName.length <= 5 ? fromName : "bin";
}

export type UploadFolder = "posters" | "backdrops" | "videos" | "episodes";

async function ensurePublicBucket() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: "50MB",
    });
    if (error && !/already exists|duplicate/i.test(error.message)) {
      throw new Error(error.message);
    }
  }
}

/**
 * Upload a file from the admin panel to the public `media-assets` bucket
 * and return a public URL for media.poster_url / backdrop_url / video_url.
 *
 * When Supabase is not configured (local preview), small images fall back
 * to a data URL so the form still works.
 */
export async function uploadMediaAsset(
  file: File,
  folder: UploadFolder = "posters",
): Promise<string> {
  if (!file || file.size === 0) throw new Error("Pusty plik");
  if (file.size > 50 * 1024 * 1024) throw new Error("Plik jest za duży (max 50 MB)");
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type) && !type.startsWith("image/")) {
    throw new Error("Dozwolone są obrazy i wideo MP4/WebM");
  }

  if (!isSupabaseConfigured()) {
    if (!type.startsWith("image/") || file.size > 1_500_000) {
      throw new Error("Supabase Storage nie jest skonfigurowane — wklej publiczny URL albo ustaw klucze.");
    }
    const buf = Buffer.from(await file.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  }

  await ensurePublicBucket();
  const supabase = getSupabaseAdmin();

  const ext = extFor(type, file.name);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, buffer, {
    contentType: type,
    upsert: false,
    cacheControl: "3600",
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
