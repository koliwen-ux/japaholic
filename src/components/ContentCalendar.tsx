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
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import type { ContentItem, ContentStatus, ContentType } from "@/types";
import { cn } from "@/lib/utils";
import { resolvePrefectureId } from "@/lib/location";
import { useContentStore } from "@/lib/content-store";
import type { ItineraryDateEntry } from "@/lib/data/load-all-itinerary-dates";

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

// "已捨棄" is intentionally excluded — discarded content isn't useful to filter by here.
const filterableStatuses: ContentStatus[] = ["candidate", "draft", "scheduled", "published"];

type DayEvent =
  | { kind: "content"; id: string; item: ContentItem }
  | { kind: "coverage"; id: string; spot: string; assignees: string[] };

export function ContentCalendar({ itineraryDates }: { itineraryDates: ItineraryDateEntry[] }) {
  const [month, setMonth] = useState(() => new Date());
  const [prefectureFilter, setPrefectureFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const { contentItems, coveragePlans, projects } = useContentStore();

  const projectPrefectureMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects]
  );

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (prefectureFilter !== "all" && resolvePrefectureId(item.locationId) !== prefectureFilter) {
        return false;
      }
      return true;
    });
  }, [contentItems, statusFilter, prefectureFilter]);

  const filteredCoveragePlans = useMemo(() => {
    return coveragePlans.filter((plan) => {
      if (prefectureFilter === "all") return true;
      return projectPrefectureMap.get(plan.projectId)?.prefectureId === prefectureFilter;
    });
  }, [coveragePlans, projectPrefectureMap, prefectureFilter]);

  const filteredItineraryDates = useMemo(() => {
    return itineraryDates.filter((entry) => {
      if (prefectureFilter === "all") return true;
      return projectPrefectureMap.get(entry.projectId)?.prefectureId === prefectureFilter;
    });
  }, [itineraryDates, projectPrefectureMap, prefectureFilter]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DayEvent[]>();
    for (const item of filteredItems) {
      if (!item.publishDate) continue;
      const list = map.get(item.publishDate) ?? [];
      list.push({ kind: "content", id: item.id, item });
      map.set(item.publishDate, list);
    }
    for (const plan of filteredCoveragePlans) {
      if (!plan.date) continue;
      const assignees = projectPrefectureMap.get(plan.projectId)?.assignees ?? [];
      const list = map.get(plan.date) ?? [];
      list.push({ kind: "coverage", id: plan.id, spot: plan.spot, assignees });
      map.set(plan.date, list);
    }
    for (const entry of filteredItineraryDates) {
      if (!entry.date) continue;
      const assignees = projectPrefectureMap.get(entry.projectId)?.assignees ?? [];
      const list = map.get(entry.date) ?? [];
      list.push({ kind: "coverage", id: `stop-${entry.projectId}-${entry.date}-${entry.spotName}`, spot: entry.spotName, assignees });
      map.set(entry.date, list);
    }
    return map;
  }, [filteredItems, filteredCoveragePlans, filteredItineraryDates, projectPrefectureMap]);

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
        <span className="flex items-center gap-1.5">
          <Camera size={12} className="text-ink/60" /> 取材安排
        </span>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:mb-6 md:gap-4">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <span className="mr-1 self-center text-xs font-medium text-ink/50 md:text-sm">縣市</span>
          <select
            value={prefectureFilter}
            onChange={(event) => setPrefectureFilter(event.target.value)}
            className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-white md:px-4 md:py-2 md:text-sm"
          >
            <option value="all">全部</option>
            {mockPrefectures.map((prefecture) => (
              <option key={prefecture.id} value={prefecture.id}>
                {prefecture.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <span className="mr-1 self-center text-xs font-medium text-ink/50 md:text-sm">狀態（僅篩選內容上線）</span>
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
          {filterableStatuses.map((status) => (
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
          const dayEvents = eventsByDate.get(format(day, "yyyy-MM-dd")) ?? [];
          const visibleEvents = dayEvents.slice(0, 3);
          const extraCount = dayEvents.length - visibleEvents.length;

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
                {visibleEvents.map((event) =>
                  event.kind === "content" ? (
                    <a
                      key={event.id}
                      href={event.item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${typeLabel[event.item.type]} · ${statusLabel[event.item.status]} · ${event.item.title}`}
                      className={cn(
                        "truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-tight md:px-2 md:py-1 md:text-xs",
                        typeBadgeStyle[event.item.type],
                        statusBadgeModifier[event.item.status]
                      )}
                    >
                      {event.item.title}
                    </a>
                  ) : (
                    <span
                      key={event.id}
                      title={`取材安排 · ${event.spot}${event.assignees.length ? " · " + event.assignees.join("、") : ""}`}
                      className="flex items-center gap-1 truncate rounded-full bg-ink/10 px-1.5 py-0.5 text-[10px] font-medium leading-tight text-ink/70 md:px-2 md:py-1 md:text-xs"
                    >
                      <Camera size={10} className="shrink-0" />
                      <span className="truncate">
                        {event.spot}
                        {event.assignees.length > 0 ? `・${event.assignees.join("、")}` : ""}
                      </span>
                    </span>
                  )
                )}
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
