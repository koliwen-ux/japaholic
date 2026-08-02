"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import type { ContentItem, ContentStatus, ContentType } from "@/types";
import { cn } from "@/lib/utils";
import { resolvePrefectureId } from "@/lib/location";
import { useContentStore } from "@/lib/content-store";

const typeBadgeStyle: Record<ContentType, string> = {
  article: "bg-azure text-ink",
  youtube: "bg-coral text-white",
  sns: "bg-pink text-ink",
};

const typeLabel: Record<ContentType, string> = {
  article: "文章",
  youtube: "YouTube",
  sns: "SNS",
};

const statusLabel: Record<ContentStatus, string> = {
  candidate: "待定",
  draft: "草稿",
  scheduled: "已排程",
  published: "已上線",
  discarded: "已捨棄",
};

const statusBadgeModifier: Record<ContentStatus, string> = {
  candidate: "opacity-60 border border-dashed border-ink/40",
  draft: "opacity-60 border border-dashed border-ink/40",
  scheduled: "border border-white/60",
  published: "border border-white shadow-sm",
  discarded: "opacity-40 border border-dashed border-ink/20",
};

export function ContentCalendar() {
  const [month, setMonth] = useState(() => new Date());
  const [prefectureFilter, setPrefectureFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const { contentItems } = useContentStore();

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (prefectureFilter !== "all" && resolvePrefectureId(item.locationId) !== prefectureFilter) {
        return false;
      }
      return true;
    });
  }, [contentItems, statusFilter, prefectureFilter]);

  const itemsByDate = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    for (const item of filteredItems) {
      if (!item.publishDate) continue;
      const list = map.get(item.publishDate) ?? [];
      list.push(item);
      map.set(item.publishDate, list);
    }
    return map;
  }, [filteredItems]);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="w-full max-w-4xl rounded-[2.5rem] bg-white/50 p-4 shadow-xl sm:p-8 md:max-w-5xl md:p-10 lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setMonth((prev) => subMonths(prev, 1))}
            aria-label="上個月"
            className="rounded-full p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink md:p-2"
          >
            <ChevronLeft size={18} className="md:h-5 md:w-5" />
          </button>
          <h2 className="w-28 text-center text-base font-bold text-ink sm:w-32 sm:text-lg md:w-40 md:text-xl">
            {format(month, "yyyy年 M月", { locale: zhTW })}
          </h2>
          <button
            type="button"
            onClick={() => setMonth((prev) => addMonths(prev, 1))}
            aria-label="下個月"
            className="rounded-full p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink md:p-2"
          >
            <ChevronRight size={18} className="md:h-5 md:w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMonth(new Date())}
          className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-mint/80 md:px-4 md:py-2 md:text-sm"
        >
          今天
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-ink/60 md:mb-6 md:gap-4 md:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-azure md:h-3 md:w-3" /> 文章
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral md:h-3 md:w-3" /> YouTube
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pink md:h-3 md:w-3" /> SNS
        </span>
      </div>

      <div className="mb-4 flex flex-col gap-2 md:mb-6 md:gap-3">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <span className="mr-1 self-center text-xs font-medium text-ink/50 md:text-sm">縣市</span>
          <button
            type="button"
            onClick={() => setPrefectureFilter("all")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm",
              prefectureFilter === "all" ? "bg-ink text-cream" : "bg-white/70 text-ink/60 hover:bg-ink/10"
            )}
          >
            全部
          </button>
          {mockPrefectures.map((prefecture) => (
            <button
              key={prefecture.id}
              type="button"
              onClick={() => setPrefectureFilter(prefecture.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm",
                prefectureFilter === prefecture.id
                  ? "bg-ink text-cream"
                  : "bg-white/70 text-ink/60 hover:bg-ink/10"
              )}
            >
              {prefecture.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <span className="mr-1 self-center text-xs font-medium text-ink/50 md:text-sm">狀態</span>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm",
              statusFilter === "all" ? "bg-mint text-ink" : "bg-white/70 text-ink/60 hover:bg-ink/10"
            )}
          >
            全部
          </button>
          {(Object.keys(statusLabel) as ContentStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm",
                statusFilter === status ? "bg-mint text-ink" : "bg-white/70 text-ink/60 hover:bg-ink/10"
              )}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink/50 sm:gap-2 md:text-sm">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
        {days.map((day) => {
          const dayItems = itemsByDate.get(format(day, "yyyy-MM-dd")) ?? [];
          const visibleItems = dayItems.slice(0, 3);
          const extraCount = dayItems.length - visibleItems.length;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-[92px] flex-col gap-1 rounded-xl p-1.5 sm:min-h-[110px] sm:p-2 md:min-h-[130px] md:gap-1.5 md:rounded-2xl md:p-3 lg:min-h-[150px]",
                isSameMonth(day, month) ? "bg-white/70" : "bg-white/25",
                isToday(day) && "ring-2 ring-mint"
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold md:text-sm",
                  isSameMonth(day, month) ? "text-ink/70" : "text-ink/30",
                  isSameDay(day, new Date()) && "text-mint"
                )}
              >
                {format(day, "d")}
              </span>

              <div className="flex flex-col gap-1 md:gap-1.5">
                {visibleItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${typeLabel[item.type]} · ${statusLabel[item.status]} · ${item.title}`}
                    className={cn(
                      "truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-tight md:px-2 md:py-1 md:text-xs",
                      typeBadgeStyle[item.type],
                      statusBadgeModifier[item.status]
                    )}
                  >
                    {item.title}
                  </a>
                ))}
                {extraCount > 0 && (
                  <span className="px-1.5 text-[10px] font-medium text-ink/40 md:text-xs">
                    +{extraCount} 則
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
