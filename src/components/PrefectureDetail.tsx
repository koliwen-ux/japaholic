"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Compass, X } from "lucide-react";
import type { Prefecture } from "@/types";
import { iconMap } from "@/lib/icons";
import { PrefectureProjectSection } from "@/components/PrefectureProjectSection";
import { SectionHeading } from "@/components/SectionHeading";

export function PrefectureDetail({
  prefecture,
  onClose,
}: {
  prefecture: Prefecture;
  /** When provided, renders as a closeable panel (e.g. the split-view modal) instead of a standalone page. */
  onClose?: () => void;
}) {
  const Icon = iconMap[prefecture.icon] ?? Compass;

  return (
    <div className={onClose ? "w-full" : "w-full max-w-3xl"}>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm transition-colors hover:bg-ink/5 hover:text-ink md:px-4 md:py-2 md:text-sm"
        >
          <X size={14} className="md:h-4 md:w-4" /> 關閉
        </button>
      ) : (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm transition-colors hover:bg-ink/5 hover:text-ink md:px-4 md:py-2 md:text-sm"
        >
          <ArrowLeft size={14} className="md:h-4 md:w-4" /> 返回地圖
        </Link>
      )}

      <div
        className="mt-5 flex items-center gap-4 rounded-3xl p-5 md:mt-6 md:p-6"
        style={{ backgroundColor: `${prefecture.color}26` }}
      >
        <span
          className="flex h-16 w-16 items-center justify-center rounded-3xl text-ink shadow-sm md:h-20 md:w-20"
          style={{ backgroundColor: prefecture.color }}
        >
          <Icon size={32} strokeWidth={2} className="md:h-9 md:w-9" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-ink md:text-3xl">{prefecture.name}</h1>
          <p className="text-sm text-ink/50 md:text-base">取材專案</p>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        <SectionHeading icon={Briefcase} title="取材專案" color={prefecture.color} />
        <PrefectureProjectSection prefecture={prefecture} />
      </div>
    </div>
  );
}
