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
  mockContentItems,
  mockContentProposals,
  mockCoveragePlans,
  mockItineraries,
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
    type: item.type,
    title: item.title,
    url: item.url,
    publish_date: item.publishDate || null,
    status: item.status,
    location_id: item.locationId,
  }));
  const { error: contentItemsError } = await supabase.from("content_items").insert(contentItemsRows);
  if (contentItemsError) throw contentItemsError;
  console.log(`content_items: inserted ${contentItemsRows.length}`);

  const proposalRows = mockContentProposals.map((proposal) => ({
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
  }));
  const { error: proposalsError } = await supabase.from("content_proposals").insert(proposalRows);
  if (proposalsError) throw proposalsError;
  console.log(`content_proposals: inserted ${proposalRows.length}`);

  const coveragePlanRows = mockCoveragePlans.map((plan) => ({
    id: plan.id,
    prefecture_id: plan.prefectureId,
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

  const stops = mockItineraries[0]?.stops ?? [];
  const stopsByDay = new Map<number, typeof stops>();
  for (const stop of stops) {
    const list = stopsByDay.get(stop.day) ?? [];
    list.push(stop);
    stopsByDay.set(stop.day, list);
  }
  const stopRows = stops.map((stop) => ({
    id: stop.id,
    day: stop.day,
    position: stopsByDay.get(stop.day)!.indexOf(stop),
    spot_name: stop.spotName,
    note: stop.note,
    location_id: stop.locationId,
    transport: stop.transport ?? null,
    content_focus: stop.contentFocus ?? null,
  }));
  const { error: stopsError } = await supabase.from("itinerary_stops").insert(stopRows);
  if (stopsError) throw stopsError;
  console.log(`itinerary_stops: inserted ${stopRows.length}`);

  const budgetRows = mockBudgetItems.map((item) => ({
    id: item.id,
    category: item.category,
    amount: item.amount,
    note: item.note,
  }));
  const { error: budgetError } = await supabase.from("budget_items").insert(budgetRows);
  if (budgetError) throw budgetError;
  console.log(`budget_items: inserted ${budgetRows.length}`);

  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
