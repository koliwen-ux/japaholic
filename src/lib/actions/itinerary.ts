"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ItineraryStop } from "@/types";

export async function createStop(stop: ItineraryStop, position: number) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("itinerary_stops").insert({
    id: stop.id,
    project_id: stop.projectId,
    date: stop.date,
    position,
    spot_name: stop.spotName,
    note: stop.note,
    location_id: stop.locationId,
    transport: stop.transport ?? null,
    content_focus: stop.contentFocus ?? null,
    start_time: stop.startTime ?? null,
    end_time: stop.endTime ?? null,
    script: stop.script ?? "",
  });
  if (error) console.error("createStop failed", error);
}

export async function updateStop(
  id: string,
  patch: Partial<
    Pick<
      ItineraryStop,
      "spotName" | "note" | "date" | "transport" | "contentFocus" | "startTime" | "endTime" | "script"
    >
  >
) {
  const supabase = getSupabaseServerClient();
  const row: Record<string, unknown> = {};
  if (patch.spotName !== undefined) row.spot_name = patch.spotName;
  if (patch.note !== undefined) row.note = patch.note;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.transport !== undefined) row.transport = patch.transport ?? null;
  if (patch.contentFocus !== undefined) row.content_focus = patch.contentFocus ?? null;
  if (patch.startTime !== undefined) row.start_time = patch.startTime ?? null;
  if (patch.endTime !== undefined) row.end_time = patch.endTime ?? null;
  if (patch.script !== undefined) row.script = patch.script ?? "";

  const { error } = await supabase.from("itinerary_stops").update(row).eq("id", id);
  if (error) console.error("updateStop failed", error);
}

export async function deleteStop(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("itinerary_stops").delete().eq("id", id);
  if (error) console.error("deleteStop failed", error);
}

export async function reorderStops(orderedIds: string[]) {
  const supabase = getSupabaseServerClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("itinerary_stops").update({ position: index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) console.error("reorderStops failed", failed.error);
}
