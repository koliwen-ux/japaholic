"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  ChevronDown,
  Clock,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Square,
  Trash2,
} from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import type { CoveragePlan, CoveragePlanChecklistItem, CoveragePlanStatus, Prefecture } from "@/types";
import { cn } from "@/lib/utils";

const statusStyle: Record<CoveragePlanStatus, string> = {
  planned: "bg-ink/10 text-ink/70",
  confirmed: "bg-pink/30 text-ink",
  completed: "bg-mint/40 text-ink",
};

const statusLabel: Record<CoveragePlanStatus, string> = {
  planned: "規劃中",
  confirmed: "已確認",
  completed: "已完成",
};

const coverageStatuses: CoveragePlanStatus[] = ["planned", "confirmed", "completed"];

const inputClass =
  "w-full rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base";
const labelClass = "text-sm font-semibold text-ink/60 md:text-base";

interface CoveragePlanFormValue {
  spot: string;
  date: string;
  time: string;
  address: string;
  referenceUrl: string;
  notes: string;
  status: CoveragePlanStatus;
}

function toFormValue(plan?: CoveragePlan): CoveragePlanFormValue {
  return {
    spot: plan?.spot ?? "",
    date: plan?.date ?? "",
    time: plan?.time ?? "",
    address: plan?.address ?? "",
    referenceUrl: plan?.referenceUrl ?? "",
    notes: plan?.notes ?? "",
    status: plan?.status ?? "planned",
  };
}

function CoveragePlanForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: CoveragePlanFormValue;
  onSubmit: (value: CoveragePlanFormValue) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [value, setValue] = useState(initial);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.spot.trim()) return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 md:p-5">
      <div>
        <label className={labelClass}>景點／主題</label>
        <input
          value={value.spot}
          onChange={(event) => setValue((v) => ({ ...v, spot: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="取材景點名稱"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>日期</label>
          <input
            type="date"
            value={value.date}
            onChange={(event) => setValue((v) => ({ ...v, date: event.target.value }))}
            className={cn(inputClass, "mt-1")}
          />
        </div>
        <div>
          <label className={labelClass}>時間</label>
          <input
            value={value.time}
            onChange={(event) => setValue((v) => ({ ...v, time: event.target.value }))}
            className={cn(inputClass, "mt-1")}
            placeholder="09:00–11:00"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>地址／集合地點</label>
        <input
          value={value.address}
          onChange={(event) => setValue((v) => ({ ...v, address: event.target.value }))}
          className={cn(inputClass, "mt-1")}
        />
      </div>
      <div>
        <label className={labelClass}>參考連結</label>
        <input
          value={value.referenceUrl}
          onChange={(event) => setValue((v) => ({ ...v, referenceUrl: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="https://"
        />
      </div>
      <div>
        <label className={labelClass}>備註事項</label>
        <textarea
          value={value.notes}
          onChange={(event) => setValue((v) => ({ ...v, notes: event.target.value }))}
          rows={3}
          className={cn(inputClass, "mt-1 resize-none")}
        />
      </div>
      <div>
        <label className={labelClass}>狀態</label>
        <select
          value={value.status}
          onChange={(event) => setValue((v) => ({ ...v, status: event.target.value as CoveragePlanStatus }))}
          className={cn(inputClass, "mt-1")}
        >
          {coverageStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabel[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-ink/5 md:px-4 md:py-2 md:text-sm"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-lg bg-mint px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mint/80 md:px-4 md:py-2 md:text-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function ChecklistRow({
  planId,
  item,
  accentColor,
}: {
  planId: string;
  item: CoveragePlanChecklistItem;
  accentColor: string;
}) {
  const { toggleChecklistItem, removeChecklistItem } = useContentStore();

  return (
    <div className="flex w-full items-center gap-1 rounded-lg px-1 py-1 text-left text-sm transition-colors hover:bg-ink/5 md:text-base">
      <button
        type="button"
        onClick={() => toggleChecklistItem(planId, item.id)}
        className="flex flex-1 items-center gap-2 py-0.5 text-left"
      >
        {item.done ? (
          <CheckSquare size={16} className="shrink-0" style={{ color: accentColor }} />
        ) : (
          <Square size={16} className="shrink-0 text-ink/30" />
        )}
        <span className={cn(item.done ? "text-ink/40 line-through" : "text-ink")}>{item.label}</span>
      </button>
      <button
        type="button"
        onClick={() => removeChecklistItem(planId, item.id)}
        aria-label="刪除項目"
        className="shrink-0 rounded-full p-1 text-ink/30 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function AddChecklistItem({ planId }: { planId: string }) {
  const { addChecklistItem } = useContentStore();
  const [label, setLabel] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!label.trim()) return;
    addChecklistItem(planId, label.trim());
    setLabel("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-1.5">
      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="新增必拍項目..."
        className="flex-1 rounded-lg border border-dashed border-ink/20 bg-transparent px-2 py-1 text-sm text-ink focus:border-ink/30 focus:outline-none md:text-base"
      />
      <button
        type="submit"
        aria-label="新增必拍項目"
        className="shrink-0 rounded-full bg-ink/5 p-1.5 text-ink/60 transition-colors hover:bg-ink/10"
      >
        <Plus size={14} />
      </button>
    </form>
  );
}

function CoverageAccordionItem({
  plan,
  isOpen,
  onToggle,
  accentColor,
}: {
  plan: CoveragePlan;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  const { updateCoveragePlan, removeCoveragePlan } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="overflow-hidden rounded-2xl bg-white/70 shadow-sm">
      <div className="flex w-full items-center justify-between gap-3 p-4 md:p-5">
        <button type="button" onClick={onToggle} aria-expanded={isOpen} className="min-w-0 flex-1 text-left">
          <p className="text-base font-bold text-ink md:text-lg">{plan.spot}</p>
          <p className="text-xs text-ink/50 md:text-sm">
            {plan.date} · {plan.time}
          </p>
        </button>
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium md:px-3 md:py-1.5 md:text-sm",
              statusStyle[plan.status]
            )}
          >
            {statusLabel[plan.status]}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsEditing((v) => !v);
              if (!isOpen) onToggle();
            }}
            aria-label="編輯取材安排"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Pencil size={14} className="md:h-4 md:w-4" />
          </button>
          <button
            type="button"
            onClick={() => removeCoveragePlan(plan.id)}
            aria-label="刪除取材安排"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Trash2 size={14} className="md:h-4 md:w-4" />
          </button>
          <button type="button" onClick={onToggle} aria-expanded={isOpen} aria-label="展開詳情">
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="block">
              <ChevronDown size={18} className="text-ink/40" />
            </motion.span>
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {isEditing ? (
          <div className="border-t border-ink/5">
            <CoveragePlanForm
              initial={toFormValue(plan)}
              submitLabel="儲存"
              onCancel={() => setIsEditing(false)}
              onSubmit={(value) => {
                updateCoveragePlan(plan.id, {
                  spot: value.spot.trim(),
                  date: value.date,
                  time: value.time.trim(),
                  address: value.address.trim(),
                  referenceUrl: value.referenceUrl.trim() || undefined,
                  notes: value.notes.trim(),
                  status: value.status,
                });
                setIsEditing(false);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 border-t border-ink/5 p-4 md:p-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/70 md:text-base">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {plan.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {plan.address}
              </span>
              {plan.referenceUrl && (
                <a
                  href={plan.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-ink underline decoration-ink/30 underline-offset-2 hover:text-ink/70"
                >
                  <ExternalLink size={14} /> 參考連結
                </a>
              )}
            </div>

            <div>
              <p className={labelClass}>備註事項</p>
              <p className="mt-1 text-sm text-ink/70 md:text-base">{plan.notes}</p>
            </div>

            <div>
              <p className={labelClass}>必拍畫面 Check List</p>
              <div className="mt-1 flex flex-col">
                {plan.checklist.map((item) => (
                  <ChecklistRow key={item.id} planId={plan.id} item={item} accentColor={accentColor} />
                ))}
              </div>
              <AddChecklistItem planId={plan.id} />
            </div>
          </div>
        )}
      </motion.div>
    </li>
  );
}

export function PrefectureCoverageAccordion({ prefecture }: { prefecture: Prefecture }) {
  const { coveragePlans, addCoveragePlan } = useContentStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const plans = coveragePlans
    .filter((plan) => plan.prefectureId === prefecture.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增取材安排
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
          <CoveragePlanForm
            initial={toFormValue()}
            submitLabel="新增"
            onCancel={() => setIsAdding(false)}
            onSubmit={(value) => {
              addCoveragePlan({
                prefectureId: prefecture.id,
                spot: value.spot.trim(),
                date: value.date,
                time: value.time.trim(),
                address: value.address.trim(),
                referenceUrl: value.referenceUrl.trim() || undefined,
                notes: value.notes.trim(),
                status: value.status,
              });
              setIsAdding(false);
            }}
          />
        </div>
      )}

      {plans.length === 0 ? (
        <p className="text-sm text-ink/40 md:text-base">目前尚無安排的取材景點。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {plans.map((plan) => (
            <CoverageAccordionItem
              key={plan.id}
              plan={plan}
              isOpen={openId === plan.id}
              onToggle={() => setOpenId((current) => (current === plan.id ? null : plan.id))}
              accentColor={prefecture.color}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
