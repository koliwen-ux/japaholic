"use client";

import { useState } from "react";
import { ExternalLink, FileText, Hash, Pencil, PlayCircle, Plus, Trash2 } from "lucide-react";
import type { ContentItem, ContentStatus, ContentType, Prefecture } from "@/types";
import { cn } from "@/lib/utils";
import { resolvePrefectureId } from "@/lib/location";
import { useContentStore } from "@/lib/content-store";
import { ContentProposalAccordion } from "@/components/ContentProposalAccordion";

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
  draft: "bg-ink/10 text-ink/70",
  scheduled: "bg-pink/30 text-ink",
  published: "bg-mint/40 text-ink",
};

const contentStatusLabel: Record<ContentStatus, string> = {
  draft: "草稿",
  scheduled: "製作中",
  published: "已發布",
};

const contentTypes: ContentType[] = ["article", "youtube", "sns"];
const contentStatuses: ContentStatus[] = ["draft", "scheduled", "published"];

const inputClass =
  "rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base";

interface ContentItemFormValue {
  title: string;
  url: string;
  publishDate: string;
  status: ContentStatus;
}

function toFormValue(item?: ContentItem): ContentItemFormValue {
  return {
    title: item?.title ?? "",
    url: item?.url ?? "",
    publishDate: item?.publishDate ?? "",
    status: item?.status ?? "draft",
  };
}

function ContentItemForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-dashed border-ink/20 bg-white/60 p-3 md:gap-3 md:p-4"
    >
      <input
        value={value.title}
        onChange={(event) => setValue((v) => ({ ...v, title: event.target.value }))}
        placeholder="標題"
        className={inputClass}
      />
      <input
        value={value.url}
        onChange={(event) => setValue((v) => ({ ...v, url: event.target.value }))}
        placeholder="連結網址"
        className={inputClass}
      />
      <div className="flex gap-2 md:gap-3">
        <input
          type="date"
          value={value.publishDate}
          onChange={(event) => setValue((v) => ({ ...v, publishDate: event.target.value }))}
          className={cn(inputClass, "flex-1")}
        />
        <select
          value={value.status}
          onChange={(event) => setValue((v) => ({ ...v, status: event.target.value as ContentStatus }))}
          className={cn(inputClass, "flex-1")}
        >
          {contentStatuses.map((status) => (
            <option key={status} value={status}>
              {contentStatusLabel[status]}
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

function ContentItemRow({ item }: { item: ContentItem }) {
  const { updateContentItem, removeContentItem } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);
  const ItemIcon = contentTypeIcon[item.type];

  if (isEditing) {
    return (
      <li className="overflow-hidden rounded-xl bg-white/70 shadow-sm">
        <ContentItemForm
          initial={toFormValue(item)}
          submitLabel="儲存"
          onCancel={() => setIsEditing(false)}
          onSubmit={(value) => {
            updateContentItem(item.id, {
              title: value.title.trim(),
              url: value.url.trim(),
              publishDate: value.publishDate,
              status: value.status,
            });
            setIsEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-sm md:gap-4 md:p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint/30 text-ink md:h-11 md:w-11">
        <ItemIcon size={16} className="md:h-5 md:w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink md:text-base">{item.title}</p>
        <p className="text-xs text-ink/50 md:text-sm">{item.publishDate}</p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium md:px-3 md:py-1.5 md:text-sm",
          contentStatusStyle[item.status]
        )}
      >
        {contentStatusLabel[item.status]}
      </span>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="預覽連結"
        className="shrink-0 rounded-full p-2 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <ExternalLink size={16} className="md:h-[18px] md:w-[18px]" />
      </a>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label="編輯內容"
        className="shrink-0 rounded-full p-2 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Pencil size={16} className="md:h-[18px] md:w-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => removeContentItem(item.id)}
        aria-label="刪除內容"
        className="shrink-0 rounded-full p-2 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Trash2 size={16} className="md:h-[18px] md:w-[18px]" />
      </button>
    </li>
  );
}

export function PrefectureContentSection({ prefecture }: { prefecture: Prefecture }) {
  const [activeType, setActiveType] = useState<ContentType>("article");
  const [isAdding, setIsAdding] = useState(false);
  const { contentItems, proposals, addContentItem } = useContentStore();

  const relatedContent = contentItems.filter(
    (item) => resolvePrefectureId(item.locationId) === prefecture.id
  );
  const items = relatedContent.filter((item) => item.type === activeType);

  const relatedProposals = proposals.filter(
    (proposal) => proposal.prefectureId === prefecture.id && proposal.type === activeType
  );

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
                activeType === type
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink"
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
        <ContentProposalAccordion
          proposals={relatedProposals}
          accentColor={prefecture.color}
          prefectureId={prefecture.id}
          type={activeType}
        />

        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 md:text-sm">
            已定案內容
          </p>
          <button
            type="button"
            onClick={() => setIsAdding((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
          >
            <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增{contentTypeTabLabel[activeType]}
          </button>
        </div>

        {isAdding && (
          <div className="mb-2">
            <ContentItemForm
              initial={toFormValue()}
              submitLabel="新增"
              onCancel={() => setIsAdding(false)}
              onSubmit={(value) => {
                addContentItem({
                  type: activeType,
                  title: value.title.trim(),
                  url: value.url.trim(),
                  publishDate: value.publishDate,
                  status: value.status,
                  locationId: prefecture.id,
                });
                setIsAdding(false);
              }}
            />
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-ink/40 md:text-base">
            目前尚無安排的{contentTypeTabLabel[activeType]}。
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <ContentItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
