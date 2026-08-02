"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { MediaAsset } from "@/types";

export async function createMediaAsset(asset: MediaAsset) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("media_assets").insert({
    id: asset.id,
    project_id: asset.projectId,
    title: asset.title,
    url: asset.url,
    note: asset.note ?? "",
  });
  if (error) console.error("createMediaAsset failed", error);
}

export async function updateMediaAsset(id: string, patch: Partial<Omit<MediaAsset, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.url !== undefined) row.url = patch.url;
  if (patch.note !== undefined) row.note = patch.note;

  const { error } = await supabase.from("media_assets").update(row).eq("id", id);
  if (error) console.error("updateMediaAsset failed", error);
}

export async function deleteMediaAsset(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) console.error("deleteMediaAsset failed", error);
}
