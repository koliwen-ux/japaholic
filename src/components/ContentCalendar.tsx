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
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
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

const typeDotColor: Record<ContentType, string> = {
  article: "bg-azure",
  youtube: "bg-coral",
  sns: "bg-pink",
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

// "已捨棄" is intentionally excluded — discarded content isn't useful to filter by here.
const filterableStatuses: ContentStatus[] = ["candidate", "draft", "scheduled", "published"];

type DayEvent =
  | { kind: "content"; id: string; item: ContentItem }
  | { kind: "coverage"; id: string; spot: string; assignees: string[] };

export function ContentCalendar({ itineraryDates }: { itineraryDates: ItineraryDateEntry[] }) {
  const [month, setMonth] = useState(() => new Date());
  const [prefectureFilter, setPrefectureFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const dotEvents = dayEvents.slice(0, 6);
          const extraCount = dayEvents.length - dotEvents.length;
          const hasEvents = dayEvents.length > 0;
          const Wrapper = hasEvents ? "button" : "div";

          return (
            <Wrapper
              key={day.toISOString()}
              type={hasEvents ? "button" : undefined}
              onClick={hasEvents ? () => setSelectedDate(dateKey) : undefined}
              className={cn(
                "flex min-h-[64px] flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors sm:min-h-[80px] sm:p-2 md:min-h-[100px] md:gap-2 md:rounded-2xl md:p-3",
                isSameMonth(day, month) ? "bg-white/70" : "bg-white/25",
                isToday(day) && "ring-2 ring-mint",
                hasEvents && "hover:bg-white active:bg-white/90"
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

              {hasEvents && (
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {dotEvents.map((event) =>
                    event.kind === "content" ? (
                      <span
                        key={event.id}
                        className={cn("h-1.5 w-1.5 rounded-full md:h-2 md:w-2", typeDotColor[event.item.type])}
                      />
                    ) : (
                      <Camera key={event.id} size={10} className="text-ink/50 md:h-3 md:w-3" />
                    )
                  )}
                  {extraCount > 0 && <span className="text-[9px] font-medium text-ink/40 md:text-[10px]">+{extraCount}</span>}
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <DayEventsSheet
            dateKey={selectedDate}
            events={eventsByDate.get(selectedDate) ?? []}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DayEventsSheet({
  dateKey,
  events,
  onClose,
}: {
  dateKey: string;
  events: DayEvent[];
  onClose: () => void;
}) {
  let heading = dateKey;
  try {
    heading = format(new Date(`${dateKey}T00:00:00`), "M月d日（EEEEEE）", { locale: zhTW });
  } catch {
    // keep raw dateKey as a fallback
  }

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/30"
      />
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">{heading}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-ink/40">這天沒有安排。</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.map((event) =>
              event.kind === "content" ? (
                <li key={event.id} className={cn("rounded-xl p-3", typeBadgeStyle[event.item.type])}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      {typeLabel[event.item.type]} · {statusLabel[event.item.status]}
                    </span>
                    {event.item.url && (
                      <a
                        href={event.item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="預覽連結"
                        className="shrink-0 opacity-70 hover:opacity-100"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium">{event.item.title}</p>
                </li>
              ) : (
                <li key={event.id} className="flex items-start gap-2.5 rounded-xl bg-ink/5 p-3">
                  <Camera size={16} className="mt-0.5 shrink-0 text-ink/50" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{event.spot}</p>
                    {event.assignees.length > 0 && (
                      <p className="mt-0.5 text-xs text-ink/50">負責人：{event.assignees.join("、")}</p>
                    )}
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </motion.div>
    </>
  );
}
