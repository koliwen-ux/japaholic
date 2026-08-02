"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CalendarProgress } from "@/types";

export async function createCalendarTask(task: CalendarProgress) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("calendar_progress").insert({
    id: task.id,
    project_id: task.projectId,
    date: task.date || null,
    task: task.task,
    completed: task.completed,
  });
  if (error) console.error("createCalendarTask failed", error);
}

export async function updateCalendarTask(id: string, patch: Partial<Omit<CalendarProgress, "id">>) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.projectId !== undefined) row.project_id = patch.projectId;
  if (patch.date !== undefined) row.date = patch.date || null;
  if (patch.task !== undefined) row.task = patch.task;
  if (patch.completed !== undefined) row.completed = patch.completed;

  const { error } = await supabase.from("calendar_progress").update(row).eq("id", id);
  if (error) console.error("updateCalendarTask failed", error);
}

export async function deleteCalendarTask(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("calendar_progress").delete().eq("id", id);
  if (error) console.error("deleteCalendarTask failed", error);
}
