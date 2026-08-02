import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** A lightweight cross-project view of itinerary stops, for the site-wide calendar. */
export interface ItineraryDateEntry {
  projectId: string;
  date: string;
  spotName: string;
}

export async function loadAllItineraryDates(): Promise<ItineraryDateEntry[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("itinerary_stops").select("project_id, date, spot_name");
  if (error) {
    console.error("loadAllItineraryDates failed", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    projectId: row.project_id,
    date: row.date,
    spotName: row.spot_name,
  }));
}
