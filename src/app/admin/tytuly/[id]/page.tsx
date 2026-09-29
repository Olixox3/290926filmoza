import { notFound } from "next/navigation";
import { MediaForm } from "@/components/admin/MediaForm";
import { getMediaById } from "@/lib/catalog";

export default async function EditTitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();
  const data = await getMediaById(numericId);
  if (!data) notFound();
  return <MediaForm media={data.media} episodes={data.episodes} />;
}
