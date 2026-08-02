import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CalendarProgress, ContentItem, CoveragePlan, MediaAsset, Project } from "@/types";

export interface InitialState {
  contentItems: ContentItem[];
  coveragePlans: CoveragePlan[];
  calendarProgress: CalendarProgress[];
  projects: Project[];
  mediaAssets: MediaAsset[];
}

const empty: InitialState = {
  contentItems: [],
  coveragePlans: [],
  calendarProgress: [],
  projects: [],
  mediaAssets: [],
};

export async function loadInitialState(): Promise<InitialState> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Lets the app still run (e.g. in CI or before Supabase is wired up)
    // instead of crashing every page load.
    return empty;
  }

  const supabase = getSupabaseServerClient();

  const [contentItemsRes, coveragePlansRes, checklistRes, calendarProgressRes, projectsRes, mediaAssetsRes] =
    await Promise.all([
      supabase.from("content_items").select("*"),
      supabase.from("coverage_plans").select("*").order("date", { ascending: true }),
      supabase.from("coverage_checklist_items").select("*"),
      supabase.from("calendar_progress").select("*").order("date", { ascending: true }),
      supabase.from("projects").select("*"),
      supabase.from("media_assets").select("*"),
    ]);

  for (const [label, res] of [
    ["content_items", contentItemsRes],
    ["coverage_plans", coveragePlansRes],
    ["coverage_checklist_items", checklistRes],
    ["calendar_progress", calendarProgressRes],
    ["projects", projectsRes],
    ["media_assets", mediaAssetsRes],
  ] as const) {
    if (res.error) console.error(`loadInitialState: ${label} failed`, res.error);
  }

  const contentItems: ContentItem[] = (contentItemsRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    type: row.type,
    title: row.title,
    status: row.status,
    locationId: row.location_id,
    url: row.url || undefined,
    publishDate: row.publish_date ?? undefined,
    draftDueDate: row.draft_due_date ?? undefined,
    summary: row.summary || undefined,
    outline: row.outline?.length ? row.outline : undefined,
    keywords:
      row.keywords_primary?.length || row.keywords_secondary?.length
        ? { primary: row.keywords_primary ?? [], secondary: row.keywords_secondary ?? [] }
        : undefined,
    titleAlternatives: row.title_alternatives?.length ? row.title_alternatives : undefined,
    format: row.format ?? undefined,
    relatedPrefectureIds: row.related_prefecture_ids?.length ? row.related_prefecture_ids : undefined,
  }));

  const checklistByPlan = new Map<string, CoveragePlan["checklist"]>();
  for (const row of checklistRes.data ?? []) {
    const list = checklistByPlan.get(row.plan_id) ?? [];
    list.push({ id: row.id, label: row.label, done: row.done });
    checklistByPlan.set(row.plan_id, list);
  }

  const coveragePlans: CoveragePlan[] = (coveragePlansRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    spot: row.spot,
    date: row.date ?? "",
    time: row.time,
    address: row.address,
    referenceUrl: row.reference_url ?? undefined,
    notes: row.notes,
    status: row.status,
    checklist: checklistByPlan.get(row.id) ?? [],
  }));

  const calendarProgress: CalendarProgress[] = (calendarProgressRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    date: row.date ?? "",
    task: row.task,
    completed: row.completed,
  }));

  const projects: Project[] = (projectsRes.data ?? []).map((row) => ({
    id: row.id,
    prefectureId: row.prefecture_id,
    name: row.name,
    assignees: row.assignees ?? [],
    notes: row.notes || undefined,
  }));

  const mediaAssets: MediaAsset[] = (mediaAssetsRes.data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    url: row.url,
    note: row.note || undefined,
  }));

  return { contentItems, coveragePlans, calendarProgress, projects, mediaAssets };
}
