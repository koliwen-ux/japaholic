"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { BudgetItem } from "@/types";

export async function createBudgetItem(item: BudgetItem) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("budget_items").insert({
    id: item.id,
    project_id: item.projectId,
    category: item.category,
    amount: item.amount,
    note: item.note,
  });
  if (error) console.error("createBudgetItem failed", error);
}

export async function updateBudgetItem(id: string, patch: Partial<Pick<BudgetItem, "category" | "amount" | "note">>) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("budget_items").update(patch).eq("id", id);
  if (error) console.error("updateBudgetItem failed", error);
}

export async function deleteBudgetItem(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("budget_items").delete().eq("id", id);
  if (error) console.error("deleteBudgetItem failed", error);
}
