"use client";

import { useState } from "react";
import { ExternalLink, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import type { MediaAsset, Project } from "@/types";
import { useContentStore } from "@/lib/content-store";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base";
const labelClass = "text-sm font-semibold text-ink/60 md:text-base";

interface MediaAssetFormValue {
  title: string;
  url: string;
  note: string;
}

function toFormValue(asset?: MediaAsset): MediaAssetFormValue {
  return {
    title: asset?.title ?? "",
    url: asset?.url ?? "",
    note: asset?.note ?? "",
  };
}

function MediaAssetForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: MediaAssetFormValue;
  onSubmit: (value: MediaAssetFormValue) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [value, setValue] = useState(initial);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.title.trim() || !value.url.trim()) return;
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 md:p-5">
      <div>
        <label className={labelClass}>素材名稱</label>
        <input
          value={value.title}
          onChange={(event) => setValue((v) => ({ ...v, title: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="例如：大內宿雪景 4K 原始素材"
        />
      </div>
      <div>
        <label className={labelClass}>連結（Google 雲端等）</label>
        <input
          value={value.url}
          onChange={(event) => setValue((v) => ({ ...v, url: event.target.value }))}
          className={cn(inputClass, "mt-1")}
          placeholder="https://drive.google.com/..."
        />
      </div>
      <div>
        <label className={labelClass}>備註</label>
        <textarea
          value={value.note}
          onChange={(event) => setValue((v) => ({ ...v, note: event.target.value }))}
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

function MediaAssetRow({ asset }: { asset: MediaAsset }) {
  const { updateMediaAsset, removeMediaAsset } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <li className="overflow-hidden rounded-2xl bg-white/70 shadow-sm">
        <MediaAssetForm
          initial={toFormValue(asset)}
          submitLabel="儲存"
          onCancel={() => setIsEditing(false)}
          onSubmit={(value) => {
            updateMediaAsset(asset.id, {
              title: value.title.trim(),
              url: value.url.trim(),
              note: value.note.trim() || undefined,
            });
            setIsEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm md:p-5">
      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-base font-bold text-ink md:text-lg">{asset.title}</p>
          <ExternalLink size={14} className="shrink-0 text-ink/40 md:h-4 md:w-4" />
        </span>
        {asset.note && <p className="mt-1 truncate text-sm text-ink/60 md:text-base">{asset.note}</p>}
      </a>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label="編輯素材"
        className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Pencil size={14} className="md:h-4 md:w-4" />
      </button>
      <button
        type="button"
        onClick={() => removeMediaAsset(asset.id)}
        aria-label="刪除素材"
        className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Trash2 size={14} className="md:h-4 md:w-4" />
      </button>
    </li>
  );
}

export function MediaLibrarySection({ project }: { project: Project }) {
  const { mediaAssets, addMediaAsset } = useContentStore();
  const [isAdding, setIsAdding] = useState(false);

  const relatedAssets = mediaAssets.filter((asset) => asset.projectId === project.id);

  return (
    <div className="mt-8 md:mt-10">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink md:h-10 md:w-10">
            <FolderOpen size={18} className="md:h-5 md:w-5" />
          </span>
          <h2 className="text-lg font-black text-ink md:text-xl">素材庫</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增素材連結
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
          <MediaAssetForm
            initial={toFormValue()}
            submitLabel="新增"
            onCancel={() => setIsAdding(false)}
            onSubmit={(value) => {
              addMediaAsset({
                projectId: project.id,
                title: value.title.trim(),
                url: value.url.trim(),
                note: value.note.trim() || undefined,
              });
              setIsAdding(false);
            }}
          />
        </div>
      )}

      {relatedAssets.length === 0 ? (
        <p className="text-sm text-ink/40 md:text-base">
          目前尚無歸檔素材，點擊「新增素材連結」貼上 Google 雲端等連結。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {relatedAssets.map((asset) => (
            <MediaAssetRow key={asset.id} asset={asset} />
          ))}
        </ul>
      )}
    </div>
  );
}
