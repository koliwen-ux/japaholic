"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentItem } from "@/types";

export async function createContentItem(item: ContentItem) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_items").insert({
    id: item.id,
    type: item.type,
    title: item.title,
    url: item.url,
    publish_date: item.publishDate || null,
    status: item.status,
    location_id: item.locationId,
  });
  if (error) console.error("createContentItem failed", error);
}

export async function updateContentItem(id: string, patch: Partial<Omit<ContentItem, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.url !== undefined) row.url = patch.url;
  if (patch.publishDate !== undefined) row.publish_date = patch.publishDate || null;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.locationId !== undefined) row.location_id = patch.locationId;

  const { error } = await supabase.from("content_items").update(row).eq("id", id);
  if (error) console.error("updateContentItem failed", error);
}

export async function deleteContentItem(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) console.error("deleteContentItem failed", error);
}
