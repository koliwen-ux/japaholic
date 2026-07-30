"use client";

import Link from "next/link";
import { ArrowLeft, CalendarCheck2, ClipboardList, Compass, X } from "lucide-react";
import type { Prefecture } from "@/types";
import { iconMap } from "@/lib/icons";
import { PrefectureContentSection } from "@/components/PrefectureContentSection";
import { PrefectureCalendarSection } from "@/components/PrefectureCalendarSection";
import { PrefectureCoverageAccordion } from "@/components/PrefectureCoverageAccordion";

function SectionHeading({
  icon: Icon,
  title,
  color,
}: {
  icon: typeof ClipboardList;
  title: string;
  color: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5 md:mb-5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-ink md:h-10 md:w-10"
        style={{ backgroundColor: `${color}33` }}
      >
        <Icon size={18} className="md:h-5 md:w-5" />
      </span>
      <h2 className="text-lg font-black text-ink md:text-xl">{title}</h2>
    </div>
  );
}

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
          <p className="text-sm text-ink/50 md:text-base">內容規劃・進度月曆・取材安排</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-10">
        <section>
          <SectionHeading icon={ClipboardList} title="內容規劃" color={prefecture.color} />
          <PrefectureContentSection prefecture={prefecture} />
        </section>

        <section>
          <SectionHeading icon={CalendarCheck2} title="進度月曆" color={prefecture.color} />
          <PrefectureCalendarSection prefecture={prefecture} />
        </section>

        <section>
          <SectionHeading icon={Compass} title="取材安排" color={prefecture.color} />
          <PrefectureCoverageAccordion prefecture={prefecture} />
        </section>
      </div>
    </div>
  );
}
