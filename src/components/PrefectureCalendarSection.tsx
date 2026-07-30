"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { Camera, Check, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { mockCalendarProgress } from "@/data/mockData";
import type { ContentType, Prefecture } from "@/types";
import { resolvePrefectureId } from "@/lib/location";
import { useContentStore } from "@/lib/content-store";
import { cn } from "@/lib/utils";

const typeDotColor: Record<ContentType, string> = {
  article: "bg-azure",
  youtube: "bg-coral",
  sns: "bg-pink",
};

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"];

export function PrefectureCalendarSection({ prefecture }: { prefecture: Prefecture }) {
  const [month, setMonth] = useState(() => new Date());
  const { contentItems: allContentItems, coveragePlans: allCoveragePlans } = useContentStore();

  const contentItems = useMemo(
    () => allContentItems.filter((item) => resolvePrefectureId(item.locationId) === prefecture.id),
    [allContentItems, prefecture.id]
  );
  const coveragePlans = useMemo(
    () => allCoveragePlans.filter((plan) => plan.prefectureId === prefecture.id),
    [allCoveragePlans, prefecture.id]
  );
  const tasks = useMemo(
    () =>
      mockCalendarProgress
        .filter((task) => task.prefectureId === prefecture.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [prefecture.id]
  );

  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentType[]>();
    for (const item of contentItems) {
      const list = map.get(item.publishDate) ?? [];
      list.push(item.type);
      map.set(item.publishDate, list);
    }
    return map;
  }, [contentItems]);

  const coverageDates = useMemo(
    () => new Set(coveragePlans.map((plan) => plan.date)),
    [coveragePlans]
  );

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonth((prev) => subMonths(prev, 1))}
            aria-label="上個月"
            className="rounded-full p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="w-28 text-center text-base font-bold text-ink md:text-lg">
            {format(month, "yyyy年 M月", { locale: zhTW })}
          </h3>
          <button
            type="button"
            onClick={() => setMonth((prev) => addMonths(prev, 1))}
            aria-label="下個月"
            className="rounded-full p-1.5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setMonth(new Date())}
          className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-mint/80"
        >
          今天
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-ink/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-azure" /> 文章發布日
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" /> YouTube 發布日
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pink" /> SNS 發布日
        </span>
        <span className="flex items-center gap-1.5">
          <Camera size={12} style={{ color: prefecture.color }} /> 取材日
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/50 sm:gap-1.5">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayTypes = contentByDate.get(dateKey) ?? [];
          const hasCoverage = coverageDates.has(dateKey);
          const ringColor = hasCoverage ? prefecture.color : isToday(day) ? "#7ED3BF" : undefined;

          return (
            <div
              key={day.toISOString()}
              title={hasCoverage ? "此日有取材安排" : undefined}
              className={cn(
                "flex min-h-[58px] flex-col items-center gap-1 rounded-lg p-1 sm:min-h-[68px] sm:p-1.5",
                isSameMonth(day, month) ? "bg-white/70" : "bg-white/25"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isSameMonth(day, month) ? "text-ink/70" : "text-ink/30"
                )}
                style={ringColor ? { boxShadow: `0 0 0 2px ${ringColor}` } : undefined}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-0.5">
                {dayTypes.slice(0, 3).map((type, index) => (
                  <span key={index} className={cn("h-1.5 w-1.5 rounded-full", typeDotColor[type])} />
                ))}
                {hasCoverage && <Camera size={10} style={{ color: prefecture.color }} />}
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink/60 md:text-base">追蹤任務</h3>
          <ul className="mt-2.5 flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-sm md:gap-4 md:p-4"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10",
                    task.completed ? "bg-mint/50 text-ink" : "bg-ink/10 text-ink/40"
                  )}
                >
                  {task.completed ? (
                    <Check size={14} className="md:h-4 md:w-4" />
                  ) : (
                    <Circle size={14} className="md:h-4 md:w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium md:text-base",
                      task.completed ? "text-ink/50 line-through" : "text-ink"
                    )}
                  >
                    {task.task}
                  </p>
                  <p className="text-xs text-ink/50 md:text-sm">{task.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
