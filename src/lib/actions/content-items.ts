"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentItem } from "@/types";

export async function createContentItem(item: ContentItem) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_items").insert({
    id: item.id,
    project_id: item.projectId,
    type: item.type,
    title: item.title,
    url: item.url ?? "",
    publish_date: item.publishDate || null,
    draft_due_date: item.draftDueDate || null,
    status: item.status,
    location_id: item.locationId,
    summary: item.summary ?? "",
    outline: item.outline ?? [],
    keywords_primary: item.keywords?.primary ?? [],
    keywords_secondary: item.keywords?.secondary ?? [],
    title_alternatives: item.titleAlternatives ?? [],
    format: item.format ?? null,
    related_prefecture_ids: item.relatedPrefectureIds ?? [],
    position: item.position,
  });
  if (error) console.error("createContentItem failed", error);
}

export async function reorderContentItems(orderedIds: string[]) {
  const supabase = getSupabaseServerClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from("content_items").update({ position: index }).eq("id", id))
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) console.error("reorderContentItems failed", failed.error);
}

export async function updateContentItem(id: string, patch: Partial<Omit<ContentItem, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.url !== undefined) row.url = patch.url ?? "";
  if (patch.publishDate !== undefined) row.publish_date = patch.publishDate || null;
  if (patch.draftDueDate !== undefined) row.draft_due_date = patch.draftDueDate || null;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.locationId !== undefined) row.location_id = patch.locationId;
  if (patch.summary !== undefined) row.summary = patch.summary;
  if (patch.outline !== undefined) row.outline = patch.outline;
  if (patch.keywords !== undefined) {
    row.keywords_primary = patch.keywords.primary;
    row.keywords_secondary = patch.keywords.secondary;
  }
  if (patch.titleAlternatives !== undefined) row.title_alternatives = patch.titleAlternatives;
  if (patch.format !== undefined) row.format = patch.format ?? null;
  if (patch.relatedPrefectureIds !== undefined) row.related_prefecture_ids = patch.relatedPrefectureIds;

  const { error } = await supabase.from("content_items").update(row).eq("id", id);
  if (error) console.error("updateContentItem failed", error);
}

export async function deleteContentItem(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) console.error("deleteContentItem failed", error);
}
