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
import { Camera, Check, ChevronLeft, ChevronRight, Circle, Plus, Trash2 } from "lucide-react";
import type { ContentType, Prefecture, Project } from "@/types";
import { useContentStore } from "@/lib/content-store";
import { cn } from "@/lib/utils";

const typeDotColor: Record<ContentType, string> = {
  article: "bg-azure",
  youtube: "bg-coral",
  sns: "bg-pink",
};

const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"];

function AddTaskForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const { addCalendarTask } = useContentStore();
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!task.trim()) return;
    addCalendarTask({ projectId, task: task.trim(), date });
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-dashed border-ink/20 bg-white/60 p-3 md:flex-row md:items-center md:gap-3"
    >
      <input
        value={task}
        onChange={(event) => setTask(event.target.value)}
        placeholder="任務內容"
        className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
      />
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-ink/5 md:px-4 md:py-2 md:text-sm"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-lg bg-mint px-3 py-1.5 text-xs font-semibold text-ink hover:bg-mint/80 md:px-4 md:py-2 md:text-sm"
        >
          新增
        </button>
      </div>
    </form>
  );
}

export function PrefectureCalendarSection({ prefecture, project }: { prefecture: Prefecture; project: Project }) {
  const [month, setMonth] = useState(() => new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const {
    contentItems: allContentItems,
    coveragePlans: allCoveragePlans,
    calendarProgress,
    updateCalendarTask,
    toggleCalendarTask,
    removeCalendarTask,
  } = useContentStore();

  const contentItems = useMemo(
    () => allContentItems.filter((item) => item.projectId === project.id),
    [allContentItems, project.id]
  );
  const coveragePlans = useMemo(
    () => allCoveragePlans.filter((plan) => plan.projectId === project.id),
    [allCoveragePlans, project.id]
  );
  const tasks = useMemo(
    () =>
      calendarProgress
        .filter((task) => task.projectId === project.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [calendarProgress, project.id]
  );

  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentType[]>();
    for (const item of contentItems) {
      if (!item.publishDate) continue;
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

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink/60 md:text-base">追蹤任務</h3>
          <button
            type="button"
            onClick={() => setIsAddingTask((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
          >
            <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增任務
          </button>
        </div>

        {isAddingTask && (
          <div className="mt-2.5">
            <AddTaskForm projectId={project.id} onDone={() => setIsAddingTask(false)} />
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="mt-2.5 text-sm text-ink/40 md:text-base">目前尚無追蹤任務。</p>
        ) : (
          <ul className="mt-2.5 flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-sm md:gap-4 md:p-4"
              >
                <button
                  type="button"
                  onClick={() => toggleCalendarTask(task.id)}
                  aria-label={task.completed ? "標記為未完成" : "標記為完成"}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors md:h-10 md:w-10",
                    task.completed ? "bg-mint/50 text-ink" : "bg-ink/10 text-ink/40 hover:bg-ink/20"
                  )}
                >
                  {task.completed ? (
                    <Check size={14} className="md:h-4 md:w-4" />
                  ) : (
                    <Circle size={14} className="md:h-4 md:w-4" />
                  )}
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <input
                    value={task.task}
                    onChange={(event) => updateCalendarTask(task.id, { task: event.target.value })}
                    className={cn(
                      "min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-base",
                      task.completed ? "text-ink/50 line-through" : "text-ink"
                    )}
                  />
                  <input
                    type="date"
                    value={task.date}
                    onChange={(event) => updateCalendarTask(task.id, { date: event.target.value })}
                    className="shrink-0 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/50 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCalendarTask(task.id)}
                  aria-label="刪除任務"
                  className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  <Trash2 size={14} className="md:h-4 md:w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
