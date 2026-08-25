"use client";

import { useState } from "react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base";
const labelClass = "text-sm font-semibold text-ink/60 md:text-base";

export function splitCommas(value: string) {
  return value
    .split(/[,、]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export interface ProjectFormValue {
  name: string;
  assignees: string;
  notes: string;
}

export function toFormValue(project?: Project): ProjectFormValue {
  return {
    name: project?.name ?? "",
    assignees: (project?.assignees ?? []).join("、"),
    notes: project?.notes ?? "",
  };
}

export function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: ProjectFormValue;
  onSubmit: (value: ProjectFormValue) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [value, setValue] = useState(initial);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.name.trim()) return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 md:p-5">
      <div>
        <label className={labelClass}>專案名稱</label>
        <input
          value={value.name}
          onChange={(event) => setValue((v) => ({ ...v, name: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="例如：2026夏季福島取材"
        />
      </div>
      <div>
        <label className={labelClass}>執行者／團隊（頓號分隔）</label>
        <input
          value={value.assignees}
          onChange={(event) => setValue((v) => ({ ...v, assignees: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="小明、小華"
        />
      </div>
      <div>
        <label className={labelClass}>備註</label>
        <textarea
          value={value.notes}
          onChange={(event) => setValue((v) => ({ ...v, notes: event.target.value }))}
          rows={2}
          className={cn(inputClass, "mt-1 resize-none")}
          placeholder="選填"
        />
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
