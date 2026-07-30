import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BudgetItem,
  ContentItem,
  ContentProposal,
  CoveragePlan,
  ItineraryStop,
} from "@/types";

export interface InitialState {
  contentItems: ContentItem[];
  proposals: ContentProposal[];
  coveragePlans: CoveragePlan[];
  stops: ItineraryStop[];
  budgetItems: BudgetItem[];
}

const empty: InitialState = {
  contentItems: [],
  proposals: [],
  coveragePlans: [],
  stops: [],
  budgetItems: [],
};

export async function loadInitialState(): Promise<InitialState> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Lets the app still run (e.g. in CI or before Supabase is wired up)
    // instead of crashing every page load.
    return empty;
  }

  const supabase = getSupabaseServerClient();

  const [contentItemsRes, proposalsRes, coveragePlansRes, checklistRes, stopsRes, budgetRes] =
    await Promise.all([
      supabase.from("content_items").select("*"),
      supabase.from("content_proposals").select("*"),
      supabase.from("coverage_plans").select("*").order("date", { ascending: true }),
      supabase.from("coverage_checklist_items").select("*"),
      supabase.from("itinerary_stops").select("*").order("day").order("position"),
      supabase.from("budget_items").select("*"),
    ]);

  for (const [label, res] of [
    ["content_items", contentItemsRes],
    ["content_proposals", proposalsRes],
    ["coverage_plans", coveragePlansRes],
    ["coverage_checklist_items", checklistRes],
    ["itinerary_stops", stopsRes],
    ["budget_items", budgetRes],
  ] as const) {
    if (res.error) console.error(`loadInitialState: ${label} failed`, res.error);
  }

  const contentItems: ContentItem[] = (contentItemsRes.data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    url: row.url,
    publishDate: row.publish_date ?? "",
    status: row.status,
    locationId: row.location_id,
  }));

  const proposals: ContentProposal[] = (proposalsRes.data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    prefectureId: row.prefecture_id,
    relatedPrefectureIds: row.related_prefecture_ids?.length ? row.related_prefecture_ids : undefined,
    title: row.title,
    summary: row.summary,
    outline: row.outline?.length ? row.outline : undefined,
    keywords: { primary: row.keywords_primary ?? [], secondary: row.keywords_secondary ?? [] },
    titleAlternatives: row.title_alternatives?.length ? row.title_alternatives : undefined,
    format: row.format ?? undefined,
    status: row.status,
  }));

  const checklistByPlan = new Map<string, CoveragePlan["checklist"]>();
  for (const row of checklistRes.data ?? []) {
    const list = checklistByPlan.get(row.plan_id) ?? [];
    list.push({ id: row.id, label: row.label, done: row.done });
    checklistByPlan.set(row.plan_id, list);
  }

  const coveragePlans: CoveragePlan[] = (coveragePlansRes.data ?? []).map((row) => ({
    id: row.id,
    prefectureId: row.prefecture_id,
    spot: row.spot,
    date: row.date ?? "",
    time: row.time,
    address: row.address,
    referenceUrl: row.reference_url ?? undefined,
    notes: row.notes,
    status: row.status,
    checklist: checklistByPlan.get(row.id) ?? [],
  }));

  const stops: ItineraryStop[] = (stopsRes.data ?? []).map((row) => ({
    id: row.id,
    day: row.day,
    spotName: row.spot_name,
    note: row.note,
    locationId: row.location_id,
    transport: row.transport ?? undefined,
    contentFocus: row.content_focus ?? undefined,
  }));

  const budgetItems: BudgetItem[] = (budgetRes.data ?? []).map((row) => ({
    id: row.id,
    category: row.category,
    amount: row.amount,
    note: row.note,
  }));

  return { contentItems, proposals, coveragePlans, stops, budgetItems };
}
