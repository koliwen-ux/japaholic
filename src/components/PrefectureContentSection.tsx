"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Hash,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import type { ContentItem, ContentStatus, ContentType, Prefecture, Project } from "@/types";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/lib/content-store";

const contentTypeIcon: Record<ContentType, typeof FileText> = {
  article: FileText,
  youtube: PlayCircle,
  sns: Hash,
};

const contentTypeTabLabel: Record<ContentType, string> = {
  article: "文章",
  youtube: "YouTube",
  sns: "SNS 貼文",
};

const contentStatusStyle: Record<ContentStatus, string> = {
  candidate: "bg-ink/10 text-ink/70",
  draft: "bg-azure/30 text-ink",
  scheduled: "bg-pink/30 text-ink",
  published: "bg-mint/40 text-ink",
  discarded: "bg-ink/5 text-ink/30 line-through",
};

const contentStatusLabel: Record<ContentStatus, string> = {
  candidate: "待定",
  draft: "草稿",
  scheduled: "製作中",
  published: "已發布",
  discarded: "已捨棄",
};

const contentTypes: ContentType[] = ["article", "youtube", "sns"];
const contentStatuses: ContentStatus[] = ["candidate", "draft", "scheduled", "published", "discarded"];

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

interface ContentItemFormValue {
  title: string;
  summary: string;
  outline: string;
  primaryKeywords: string;
  secondaryKeywords: string;
  titleAlternatives: string;
  format: string;
  url: string;
  draftDueDate: string;
  publishDate: string;
  status: ContentStatus;
}

function toFormValue(item?: ContentItem): ContentItemFormValue {
  return {
    title: item?.title ?? "",
    summary: item?.summary ?? "",
    outline: (item?.outline ?? []).join("\n"),
    primaryKeywords: (item?.keywords?.primary ?? []).join("、"),
    secondaryKeywords: (item?.keywords?.secondary ?? []).join("、"),
    titleAlternatives: (item?.titleAlternatives ?? []).join("\n"),
    format: item?.format ?? "",
    url: item?.url ?? "",
    draftDueDate: item?.draftDueDate ?? "",
    publishDate: item?.publishDate ?? "",
    status: item?.status ?? "candidate",
  };
}

function formValueToPatch(value: ContentItemFormValue): Partial<Omit<ContentItem, "id">> {
  return {
    title: value.title.trim(),
    summary: value.summary.trim() || undefined,
    outline: splitLines(value.outline),
    keywords: {
      primary: splitCommas(value.primaryKeywords),
      secondary: splitCommas(value.secondaryKeywords),
    },
    titleAlternatives: splitLines(value.titleAlternatives),
    format: value.format.trim() || undefined,
    url: value.url.trim() || undefined,
    draftDueDate: value.draftDueDate || undefined,
    publishDate: value.publishDate || undefined,
    status: value.status,
  };
}

function ContentItemForm({
  type,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  type: ContentType;
  initial: ContentItemFormValue;
  onSubmit: (value: ContentItemFormValue) => void;
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
          placeholder="標題"
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
      {type === "sns" && (
        <div>
          <label className={labelClass}>格式（如 reels／輪播圖文）</label>
          <input
            value={value.format}
            onChange={(event) => setValue((v) => ({ ...v, format: event.target.value }))}
            className={cn(inputClass, "mt-1")}
            placeholder="reels"
          />
        </div>
      )}

      <div className="mt-1 border-t border-ink/10 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 md:text-sm">發布追蹤</p>
      </div>
      <div>
        <label className={labelClass}>連結網址</label>
        <input
          value={value.url}
          onChange={(event) => setValue((v) => ({ ...v, url: event.target.value }))}
          placeholder="https://"
          className={cn(inputClass, "mt-1")}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass}>初稿提交日</label>
          <input
            type="date"
            value={value.draftDueDate}
            onChange={(event) => setValue((v) => ({ ...v, draftDueDate: event.target.value }))}
            className={cn(inputClass, "mt-1")}
          />
        </div>
        <div>
          <label className={labelClass}>發布日期</label>
          <input
            type="date"
            value={value.publishDate}
            onChange={(event) => setValue((v) => ({ ...v, publishDate: event.target.value }))}
            className={cn(inputClass, "mt-1")}
          />
        </div>
        <div>
          <label className={labelClass}>狀態</label>
          <select
            value={value.status}
            onChange={(event) => setValue((v) => ({ ...v, status: event.target.value as ContentStatus }))}
            className={cn(inputClass, "mt-1")}
          >
            {contentStatuses.map((status) => (
              <option key={status} value={status}>
                {contentStatusLabel[status]}
              </option>
            ))}
          </select>
        </div>
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
          <span key={keyword} className={cn("rounded-full px-2.5 py-1 text-xs font-medium md:text-sm", tone)}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContentItemAccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: ContentItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { updateContentItem, removeContentItem } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);
  const ItemIcon = contentTypeIcon[item.type];

  const relatedNames = (item.relatedPrefectureIds ?? [])
    .map((id) => mockPrefectures.find((pref) => pref.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const handleSave = (value: ContentItemFormValue) => {
    updateContentItem(item.id, formValueToPatch(value));
    setIsEditing(false);
  };

  return (
    <li className="overflow-hidden rounded-2xl bg-white/70 shadow-sm">
      <div className="flex w-full items-center justify-between gap-3 p-4 md:p-5">
        <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint/30 text-ink md:h-11 md:w-11">
            <ItemIcon size={16} className="md:h-5 md:w-5" />
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-medium text-ink md:text-base",
                item.status === "discarded" && "text-ink/40 line-through"
              )}
            >
              {item.title}
            </p>
            <p className="text-xs text-ink/50 md:text-sm">{item.publishDate || "尚未排定日期"}</p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium md:px-3 md:py-1.5 md:text-sm",
              contentStatusStyle[item.status]
            )}
          >
            {contentStatusLabel[item.status]}
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="預覽連結"
              className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <ExternalLink size={14} className="md:h-4 md:w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setIsEditing((v) => !v);
              if (!isOpen) onToggle();
            }}
            aria-label="編輯內容"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Pencil size={14} className="md:h-4 md:w-4" />
          </button>
          <button
            type="button"
            onClick={() => removeContentItem(item.id)}
            aria-label="刪除內容"
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
            <ContentItemForm
              type={item.type}
              initial={toFormValue(item)}
              onSubmit={handleSave}
              onCancel={() => setIsEditing(false)}
              submitLabel="儲存"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 border-t border-ink/5 p-4 md:p-5">
            {item.summary && (
              <div>
                <p className={labelClass}>概要</p>
                <p className="mt-1 text-sm text-ink/70 md:text-base">{item.summary}</p>
              </div>
            )}

            {relatedNames.length > 0 && (
              <div>
                <p className={labelClass}>跨縣市合集</p>
                <p className="mt-1 text-sm text-ink/70 md:text-base">同步收錄：{relatedNames.join("、")}</p>
              </div>
            )}

            {item.outline && item.outline.length > 0 && (
              <div>
                <p className={labelClass}>大綱</p>
                <ol className="mt-1 flex flex-col gap-1 text-sm text-ink/70 md:text-base">
                  {item.outline.map((section, index) => (
                    <li key={section} className="flex gap-2">
                      <span className="shrink-0 text-ink/40">{index + 1}.</span>
                      <span>{section}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {item.keywords && (
              <>
                <KeywordRow label="主要關鍵字" keywords={item.keywords.primary} tone="bg-mint/30 text-ink" />
                <KeywordRow label="次要關鍵字" keywords={item.keywords.secondary} tone="bg-ink/5 text-ink/60" />
              </>
            )}

            {item.titleAlternatives && item.titleAlternatives.length > 0 && (
              <div>
                <p className={labelClass}>候選標題</p>
                <ul className="mt-1 flex flex-col gap-1 text-sm text-ink/70 md:text-base">
                  {item.titleAlternatives.map((alt) => (
                    <li key={alt}>・{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.format && (
              <div>
                <p className={labelClass}>格式</p>
                <span className="mt-1 inline-block rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-ink md:text-sm">
                  {item.format}
                </span>
              </div>
            )}

            <div>
              <p className={labelClass}>連結網址</p>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-sm text-ink underline decoration-ink/30 underline-offset-2 hover:text-ink/70 md:text-base"
                >
                  <ExternalLink size={14} /> {item.url}
                </a>
              ) : (
                <p className="mt-1 text-sm text-ink/40 md:text-base">尚未填寫</p>
              )}
            </div>

            {item.draftDueDate && (
              <div>
                <p className={labelClass}>初稿提交日</p>
                <p className="mt-1 text-sm text-ink/70 md:text-base">{item.draftDueDate}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </li>
  );
}

export function PrefectureContentSection({ prefecture, project }: { prefecture: Prefecture; project: Project }) {
  const [activeType, setActiveType] = useState<ContentType>("article");
  const [isAdding, setIsAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const { contentItems, addContentItem } = useContentStore();

  const relatedContent = contentItems.filter((item) => item.projectId === project.id);
  const items = relatedContent.filter((item) => item.type === activeType);

  return (
    <div>
      <div className="flex gap-1 rounded-full bg-ink/5 p-1">
        {contentTypes.map((type) => {
          const TabIcon = contentTypeIcon[type];
          const count = relatedContent.filter((item) => item.type === type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setActiveType(type);
                setIsAdding(false);
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors md:text-base",
                activeType === type ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"
              )}
            >
              <TabIcon size={15} className="md:h-4 md:w-4" />
              {contentTypeTabLabel[type]}
              <span className="text-xs text-ink/40">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsAdding((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
          >
            <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增{contentTypeTabLabel[activeType]}
          </button>
        </div>

        {isAdding && (
          <div className="mb-2 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
            <ContentItemForm
              type={activeType}
              initial={toFormValue()}
              submitLabel="新增"
              onCancel={() => setIsAdding(false)}
              onSubmit={(value) => {
                addContentItem({
                  ...formValueToPatch(value),
                  type: activeType,
                  title: value.title.trim(),
                  status: value.status,
                  locationId: prefecture.id,
                  projectId: project.id,
                });
                setIsAdding(false);
              }}
            />
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-ink/40 md:text-base">目前尚無安排的{contentTypeTabLabel[activeType]}。</p>
        ) : (
          <ul className="flex flex-col gap-2 md:gap-3">
            {items.map((item) => (
              <ContentItemAccordionRow
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
