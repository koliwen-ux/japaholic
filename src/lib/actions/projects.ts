"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export async function createProject(project: Project) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("projects").insert({
    id: project.id,
    prefecture_id: project.prefectureId,
    name: project.name,
    assignees: project.assignees,
    notes: project.notes ?? "",
  });
  if (error) console.error("createProject failed", error);
}

export async function updateProject(id: string, patch: Partial<Omit<Project, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.prefectureId !== undefined) row.prefecture_id = patch.prefectureId;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.assignees !== undefined) row.assignees = patch.assignees;
  if (patch.notes !== undefined) row.notes = patch.notes ?? "";

  const { error } = await supabase.from("projects").update(row).eq("id", id);
  if (error) console.error("updateProject failed", error);
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) console.error("deleteProject failed", error);
}
