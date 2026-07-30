"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentProposal } from "@/types";

export async function createProposal(proposal: ContentProposal) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_proposals").insert({
    id: proposal.id,
    type: proposal.type,
    prefecture_id: proposal.prefectureId,
    related_prefecture_ids: proposal.relatedPrefectureIds ?? [],
    title: proposal.title,
    summary: proposal.summary,
    outline: proposal.outline ?? [],
    keywords_primary: proposal.keywords.primary,
    keywords_secondary: proposal.keywords.secondary,
    title_alternatives: proposal.titleAlternatives ?? [],
    format: proposal.format ?? null,
    status: proposal.status,
  });
  if (error) console.error("createProposal failed", error);
}

export async function updateProposal(id: string, patch: Partial<Omit<ContentProposal, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.prefectureId !== undefined) row.prefecture_id = patch.prefectureId;
  if (patch.relatedPrefectureIds !== undefined) row.related_prefecture_ids = patch.relatedPrefectureIds;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.summary !== undefined) row.summary = patch.summary;
  if (patch.outline !== undefined) row.outline = patch.outline;
  if (patch.keywords !== undefined) {
    row.keywords_primary = patch.keywords.primary;
    row.keywords_secondary = patch.keywords.secondary;
  }
  if (patch.titleAlternatives !== undefined) row.title_alternatives = patch.titleAlternatives;
  if (patch.format !== undefined) row.format = patch.format ?? null;
  if (patch.status !== undefined) row.status = patch.status;

  const { error } = await supabase.from("content_proposals").update(row).eq("id", id);
  if (error) console.error("updateProposal failed", error);
}

export async function deleteProposal(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_proposals").delete().eq("id", id);
  if (error) console.error("deleteProposal failed", error);
}
