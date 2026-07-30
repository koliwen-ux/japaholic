"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import { useContentStore } from "@/lib/content-store";
import type { ContentProposal, ContentProposalStatus, ContentType } from "@/types";
import { cn } from "@/lib/utils";

const statusStyle: Record<ContentProposalStatus, string> = {
  candidate: "bg-ink/10 text-ink/70",
  selected: "bg-mint/40 text-ink",
  discarded: "bg-ink/5 text-ink/30 line-through",
};

const statusLabel: Record<ContentProposalStatus, string> = {
  candidate: "待定",
  selected: "已選定",
  discarded: "已捨棄",
};

const nextStatus: Record<ContentProposalStatus, ContentProposalStatus> = {
  candidate: "selected",
  selected: "discarded",
  discarded: "candidate",
};

const inputClass =
  "w-full rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base";
const labelClass = "text-sm font-semibold text-ink/60 md:text-base";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCommas(value: string) {
  return value
    .split(/[,、]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

interface ProposalFormValue {
  title: string;
  summary: string;
  outline: string;
  primaryKeywords: string;
  secondaryKeywords: string;
  titleAlternatives: string;
  format: string;
}

function toFormValue(proposal?: ContentProposal): ProposalFormValue {
  return {
    title: proposal?.title ?? "",
    summary: proposal?.summary ?? "",
    outline: (proposal?.outline ?? []).join("\n"),
    primaryKeywords: (proposal?.keywords.primary ?? []).join("、"),
    secondaryKeywords: (proposal?.keywords.secondary ?? []).join("、"),
    titleAlternatives: (proposal?.titleAlternatives ?? []).join("\n"),
    format: proposal?.format ?? "",
  };
}

function ProposalForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: ProposalFormValue;
  onSubmit: (value: ProposalFormValue) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [value, setValue] = useState(initial);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.title.trim()) return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 md:p-5">
      <div>
        <label className={labelClass}>標題</label>
        <input
          value={value.title}
          onChange={(event) => setValue((v) => ({ ...v, title: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="提案標題"
        />
      </div>
      <div>
        <label className={labelClass}>概要</label>
        <textarea
          value={value.summary}
          onChange={(event) => setValue((v) => ({ ...v, summary: event.target.value }))}
          rows={2}
          className={cn(inputClass, "mt-1 resize-none")}
          placeholder="一句話概要"
        />
      </div>
      <div>
        <label className={labelClass}>大綱／影片架構（每行一項）</label>
        <textarea
          value={value.outline}
          onChange={(event) => setValue((v) => ({ ...v, outline: event.target.value }))}
          rows={3}
          className={cn(inputClass, "mt-1 resize-none")}
          placeholder={"福島地理位置＆交通介紹\n福島必去景點：大內宿"}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>主要關鍵字（頓號分隔）</label>
          <input
            value={value.primaryKeywords}
            onChange={(event) => setValue((v) => ({ ...v, primaryKeywords: event.target.value }))}
            className={cn(inputClass, "mt-1")}
            placeholder="福島自由行、福島五天四夜"
          />
        </div>
        <div>
          <label className={labelClass}>次要關鍵字（頓號分隔）</label>
          <input
            value={value.secondaryKeywords}
            onChange={(event) => setValue((v) => ({ ...v, secondaryKeywords: event.target.value }))}
            className={cn(inputClass, "mt-1")}
            placeholder="福島交通、福島景點"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>候選標題（每行一項）</label>
        <textarea
          value={value.titleAlternatives}
          onChange={(event) => setValue((v) => ({ ...v, titleAlternatives: event.target.value }))}
          rows={2}
          className={cn(inputClass, "mt-1 resize-none")}
          placeholder="其他候選標題"
        />
      </div>
      <div>
        <label className={labelClass}>格式（SNS 用，如 reels／輪播圖文）</label>
        <input
          value={value.format}
          onChange={(event) => setValue((v) => ({ ...v, format: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="reels"
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

function KeywordRow({ label, keywords, tone }: { label: string; keywords: string[]; tone: string }) {
  if (keywords.length === 0) return null;
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className={cn("rounded-full px-2.5 py-1 text-xs font-medium md:text-sm", tone)}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProposalAccordionItem({
  proposal,
  isOpen,
  onToggle,
  accentColor,
}: {
  proposal: ContentProposal;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  const { updateProposal, removeProposal } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);

  const relatedNames = (proposal.relatedPrefectureIds ?? [])
    .map((id) => mockPrefectures.find((pref) => pref.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const handleSave = (value: ProposalFormValue) => {
    updateProposal(proposal.id, {
      title: value.title.trim(),
      summary: value.summary.trim(),
      outline: splitLines(value.outline),
      keywords: {
        primary: splitCommas(value.primaryKeywords),
        secondary: splitCommas(value.secondaryKeywords),
      },
      titleAlternatives: splitLines(value.titleAlternatives),
      format: value.format.trim() || undefined,
    });
    setIsEditing(false);
  };

  return (
    <li className="overflow-hidden rounded-2xl bg-white/70 shadow-sm">
      <div className="flex w-full items-center justify-between gap-3 p-4 md:p-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={cn(
              "text-base font-bold text-ink md:text-lg",
              proposal.status === "discarded" && "text-ink/40 line-through"
            )}
          >
            {proposal.title}
          </p>
          {proposal.summary && (
            <p className="mt-0.5 truncate text-xs text-ink/50 md:text-sm">{proposal.summary}</p>
          )}
        </button>
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => updateProposal(proposal.id, { status: nextStatus[proposal.status] })}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm",
              statusStyle[proposal.status]
            )}
          >
            {statusLabel[proposal.status]}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing((v) => !v);
              if (!isOpen) onToggle();
            }}
            aria-label="編輯提案"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Pencil size={14} className="md:h-4 md:w-4" />
          </button>
          <button
            type="button"
            onClick={() => removeProposal(proposal.id)}
            aria-label="刪除提案"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Trash2 size={14} className="md:h-4 md:w-4" />
          </button>
          <button type="button" onClick={onToggle} aria-expanded={isOpen} aria-label="展開詳情">
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
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
            <ProposalForm
              initial={toFormValue(proposal)}
              onSubmit={handleSave}
              onCancel={() => setIsEditing(false)}
              submitLabel="儲存"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 border-t border-ink/5 p-4 md:p-5">
            {proposal.summary && (
              <div>
                <p className={labelClass}>概要</p>
                <p className="mt-1 text-sm text-ink/70 md:text-base">{proposal.summary}</p>
              </div>
            )}

            {relatedNames.length > 0 && (
              <div>
                <p className={labelClass}>跨縣市合集</p>
                <p className="mt-1 text-sm text-ink/70 md:text-base">同步收錄：{relatedNames.join("、")}</p>
              </div>
            )}

            {proposal.outline && proposal.outline.length > 0 && (
              <div>
                <p className={labelClass}>大綱</p>
                <ol className="mt-1 flex flex-col gap-1 text-sm text-ink/70 md:text-base">
                  {proposal.outline.map((section, index) => (
                    <li key={section} className="flex gap-2">
                      <span className="shrink-0 text-ink/40">{index + 1}.</span>
                      <span>{section}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <KeywordRow label="主要關鍵字" keywords={proposal.keywords.primary} tone="bg-mint/30 text-ink" />
            <KeywordRow label="次要關鍵字" keywords={proposal.keywords.secondary} tone="bg-ink/5 text-ink/60" />

            {proposal.titleAlternatives && proposal.titleAlternatives.length > 0 && (
              <div>
                <p className={labelClass}>候選標題</p>
                <ul className="mt-1 flex flex-col gap-1 text-sm text-ink/70 md:text-base">
                  {proposal.titleAlternatives.map((alt) => (
                    <li key={alt}>・{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {proposal.format && (
              <div>
                <p className={labelClass}>格式</p>
                <span
                  className="mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium text-ink md:text-sm"
                  style={{ backgroundColor: `${accentColor}33` }}
                >
                  {proposal.format}
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </li>
  );
}

export function ContentProposalAccordion({
  proposals,
  accentColor,
  prefectureId,
  type,
}: {
  proposals: ContentProposal[];
  accentColor: string;
  prefectureId: string;
  type: ContentType;
}) {
  const { addProposal } = useContentStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (value: ProposalFormValue) => {
    addProposal({
      type,
      prefectureId,
      title: value.title.trim(),
      summary: value.summary.trim(),
      outline: splitLines(value.outline),
      keywords: {
        primary: splitCommas(value.primaryKeywords),
        secondary: splitCommas(value.secondaryKeywords),
      },
      titleAlternatives: splitLines(value.titleAlternatives),
      format: value.format.trim() || undefined,
      status: "candidate",
    });
    setIsAdding(false);
  };

  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 md:text-sm">企劃提案</p>
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增提案
        </button>
      </div>

      {isAdding && (
        <div className="mb-2 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
          <ProposalForm
            initial={toFormValue()}
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
            submitLabel="新增提案"
          />
        </div>
      )}

      {proposals.length > 0 && (
        <ul className="flex flex-col gap-2 md:gap-3">
          {proposals.map((proposal) => (
            <ProposalAccordionItem
              key={proposal.id}
              proposal={proposal}
              isOpen={openId === proposal.id}
              onToggle={() => setOpenId((current) => (current === proposal.id ? null : proposal.id))}
              accentColor={accentColor}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
