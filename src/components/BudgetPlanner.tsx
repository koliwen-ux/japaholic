"use client";

import { Plus, Trash2 } from "lucide-react";
import { useItinerary } from "@/lib/itinerary-store";

const currency = new Intl.NumberFormat("zh-TW");

export function BudgetPlanner() {
  const { budgetItems, addBudgetItem, removeBudgetItem, updateBudgetItem, budgetTotal } = useItinerary();

  return (
    <section className="rounded-2xl bg-white/50 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-end md:mb-4">
        <button
          type="button"
          onClick={() => addBudgetItem({ category: "新項目", amount: 0, note: "" })}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 print:hidden md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增項目
        </button>
      </div>

      {budgetItems.length === 0 ? (
        <p className="text-sm text-ink/40 md:text-base">尚無預算項目，點擊「新增項目」開始試算。</p>
      ) : (
        <div className="flex flex-col gap-2 md:gap-2.5">
          {budgetItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl bg-white/80 p-2.5 shadow-sm md:gap-3 md:p-3"
            >
              <input
                value={item.category}
                onChange={(event) => updateBudgetItem(item.id, { category: event.target.value })}
                className="w-28 shrink-0 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-ink hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:w-36 md:text-base"
              />
              <div className="flex shrink-0 items-center gap-1 text-sm text-ink/70 md:text-base">
                <span>NT$</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(event) => updateBudgetItem(item.id, { amount: Number(event.target.value) || 0 })}
                  className="w-20 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-right text-sm text-ink hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:w-24 md:text-base"
                />
              </div>
              <input
                value={item.note}
                onChange={(event) => updateBudgetItem(item.id, { note: event.target.value })}
                placeholder="說明..."
                className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
              />
              <button
                type="button"
                onClick={() => removeBudgetItem(item.id)}
                aria-label="刪除項目"
                className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink print:hidden"
              >
                <Trash2 size={14} className="md:h-4 md:w-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-end gap-2 border-t border-ink/10 px-2.5 pt-3 text-sm font-bold text-ink md:px-3 md:text-base">
            <span>合計</span>
            <span>NT$ {currency.format(budgetTotal)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
