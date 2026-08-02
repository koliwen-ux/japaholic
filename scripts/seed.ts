/**
 * One-time seed: pushes the existing mock data (already transcribed from the
 * trip planning deck) into Supabase. Run with:
 *
 *   npx tsx scripts/seed.ts
 *
 * Safe to re-run against an empty set of tables; re-running against tables
 * that already have these rows will fail on the primary key conflicts (by
 * design — this isn't meant to be idempotent, just a one-shot bootstrap).
 */
import { createClient } from "@supabase/supabase-js";
import {
  mockBudgetItems,
  mockCalendarProgress,
  mockContentItems,
  mockCoveragePlans,
  mockItineraryStops,
  mockMediaAssets,
  mockProjects,
} from "../src/data/mockData";

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local not present — assume env vars are already set in the shell.
}

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local first.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

async function seed() {
  const contentItemsRows = mockContentItems.map((item) => ({
    id: item.id,
    project_id: item.projectId,
    type: item.type,
    title: item.title,
    url: item.url ?? "",
    publish_date: item.publishDate || null,
    status: item.status,
    location_id: item.locationId,
    summary: item.summary ?? "",
    outline: item.outline ?? [],
    keywords_primary: item.keywords?.primary ?? [],
    keywords_secondary: item.keywords?.secondary ?? [],
    title_alternatives: item.titleAlternatives ?? [],
    format: item.format ?? null,
    related_prefecture_ids: item.relatedPrefectureIds ?? [],
  }));
  const { error: contentItemsError } = await supabase.from("content_items").insert(contentItemsRows);
  if (contentItemsError) throw contentItemsError;
  console.log(`content_items: inserted ${contentItemsRows.length}`);

  const coveragePlanRows = mockCoveragePlans.map((plan) => ({
    id: plan.id,
    project_id: plan.projectId,
    spot: plan.spot,
    date: plan.date || null,
    time: plan.time,
    address: plan.address,
    reference_url: plan.referenceUrl ?? null,
    notes: plan.notes,
    status: plan.status,
  }));
  const { error: coveragePlansError } = await supabase.from("coverage_plans").insert(coveragePlanRows);
  if (coveragePlansError) throw coveragePlansError;
  console.log(`coverage_plans: inserted ${coveragePlanRows.length}`);

  const checklistRows = mockCoveragePlans.flatMap((plan) =>
    plan.checklist.map((item) => ({
      id: item.id,
      plan_id: plan.id,
      label: item.label,
      done: item.done,
    }))
  );
  const { error: checklistError } = await supabase.from("coverage_checklist_items").insert(checklistRows);
  if (checklistError) throw checklistError;
  console.log(`coverage_checklist_items: inserted ${checklistRows.length}`);

  const projectRows = mockProjects.map((project) => ({
    id: project.id,
    prefecture_id: project.prefectureId,
    name: project.name,
    assignees: project.assignees,
    notes: project.notes ?? "",
  }));
  const { error: projectsError } = await supabase.from("projects").insert(projectRows);
  if (projectsError) throw projectsError;
  console.log(`projects: inserted ${projectRows.length}`);

  const stopsByDate = new Map<string, typeof mockItineraryStops>();
  for (const stop of mockItineraryStops) {
    const list = stopsByDate.get(stop.date) ?? [];
    list.push(stop);
    stopsByDate.set(stop.date, list);
  }
  const stopRows = mockItineraryStops.map((stop) => ({
    id: stop.id,
    project_id: stop.projectId,
    date: stop.date,
    position: stopsByDate.get(stop.date)!.indexOf(stop),
    spot_name: stop.spotName,
    note: stop.note,
    location_id: stop.locationId,
    transport: stop.transport ?? null,
    content_focus: stop.contentFocus ?? null,
    start_time: stop.startTime ?? null,
    end_time: stop.endTime ?? null,
  }));
  const { error: stopsError } = await supabase.from("itinerary_stops").insert(stopRows);
  if (stopsError) throw stopsError;
  console.log(`itinerary_stops: inserted ${stopRows.length}`);

  const budgetRows = mockBudgetItems.map((item) => ({
    id: item.id,
    project_id: item.projectId,
    category: item.category,
    amount: item.amount,
    note: item.note,
  }));
  const { error: budgetError } = await supabase.from("budget_items").insert(budgetRows);
  if (budgetError) throw budgetError;
  console.log(`budget_items: inserted ${budgetRows.length}`);

  const calendarProgressRows = mockCalendarProgress.map((task) => ({
    id: task.id,
    project_id: task.projectId,
    date: task.date || null,
    task: task.task,
    completed: task.completed,
  }));
  const { error: calendarProgressError } = await supabase.from("calendar_progress").insert(calendarProgressRows);
  if (calendarProgressError) throw calendarProgressError;
  console.log(`calendar_progress: inserted ${calendarProgressRows.length}`);

  if (mockMediaAssets.length > 0) {
    const mediaAssetRows = mockMediaAssets.map((asset) => ({
      id: asset.id,
      project_id: asset.projectId,
      title: asset.title,
      url: asset.url,
      note: asset.note ?? "",
    }));
    const { error: mediaAssetsError } = await supabase.from("media_assets").insert(mediaAssetRows);
    if (mediaAssetsError) throw mediaAssetsError;
    console.log(`media_assets: inserted ${mediaAssetRows.length}`);
  }

  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
