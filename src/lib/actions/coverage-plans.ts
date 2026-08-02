"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CoveragePlan, CoveragePlanChecklistItem } from "@/types";

export async function createCoveragePlan(plan: Omit<CoveragePlan, "checklist">) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("coverage_plans").insert({
    id: plan.id,
    project_id: plan.projectId,
    spot: plan.spot,
    date: plan.date || null,
    time: plan.time,
    address: plan.address,
    reference_url: plan.referenceUrl ?? null,
    notes: plan.notes,
    status: plan.status,
  });
  if (error) console.error("createCoveragePlan failed", error);
}

export async function updateCoveragePlan(
  id: string,
  patch: Partial<Omit<CoveragePlan, "id" | "checklist">>
) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  if (patch.spot !== undefined) row.spot = patch.spot;
  if (patch.date !== undefined) row.date = patch.date || null;
  if (patch.time !== undefined) row.time = patch.time;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.referenceUrl !== undefined) row.reference_url = patch.referenceUrl ?? null;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.status !== undefined) row.status = patch.status;

  const { error } = await supabase.from("coverage_plans").update(row).eq("id", id);
  if (error) console.error("updateCoveragePlan failed", error);
}

export async function deleteCoveragePlan(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("coverage_plans").delete().eq("id", id);
  if (error) console.error("deleteCoveragePlan failed", error);
}

export async function createChecklistItem(planId: string, item: CoveragePlanChecklistItem) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("coverage_checklist_items").insert({
    id: item.id,
    plan_id: planId,
    label: item.label,
    done: item.done,
  });
  if (error) console.error("createChecklistItem failed", error);
}

export async function toggleChecklistItem(itemId: string, done: boolean) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("coverage_checklist_items")
    .update({ done })
    .eq("id", itemId);
  if (error) console.error("toggleChecklistItem failed", error);
}

export async function deleteChecklistItem(itemId: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("coverage_checklist_items").delete().eq("id", itemId);
  if (error) console.error("deleteChecklistItem failed", error);
}
