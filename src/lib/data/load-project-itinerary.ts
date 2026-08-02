import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { BudgetItem, ItineraryStop, Project } from "@/types";

export interface ProjectItineraryState {
  project: Project | null;
  stops: ItineraryStop[];
  budgetItems: BudgetItem[];
}

/** Server-only loader for a single project's page: its metadata, stops, and budget. */
export async function loadProjectItinerary(projectId: string): Promise<ProjectItineraryState> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { project: null, stops: [], budgetItems: [] };
  }

  const supabase = getSupabaseServerClient();

  const [projectRes, stopsRes, budgetRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
    supabase.from("itinerary_stops").select("*").eq("project_id", projectId).order("date").order("position"),
    supabase.from("budget_items").select("*").eq("project_id", projectId),
  ]);

  for (const [label, res] of [
    ["projects", projectRes],
    ["itinerary_stops", stopsRes],
    ["budget_items", budgetRes],
  ] as const) {
    if (res.error) console.error(`loadProjectItinerary: ${label} failed`, res.error);
  }

  const project: Project | null = projectRes.data
    ? {
        id: projectRes.data.id,
        prefectureId: projectRes.data.prefecture_id,
        name: projectRes.data.name,
        assignees: projectRes.data.assignees ?? [],
        notes: projectRes.data.notes || undefined,
      }
    : null;

  const stops: ItineraryStop[] = (stopsRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    date: row.date,
    spotName: row.spot_name,
    note: row.note,
    locationId: row.location_id,
    transport: row.transport ?? undefined,
    contentFocus: row.content_focus ?? undefined,
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
  }));

  const budgetItems: BudgetItem[] = (budgetRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    category: row.category,
    amount: row.amount,
    note: row.note,
  }));

  return { project, stops, budgetItems };
}
