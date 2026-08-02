"use client";

import { useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import { addDays, format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import { CalendarPlus, GripVertical, Map, MapPin, Plus, Presentation, Trash2 } from "lucide-react";
import { mockLocations } from "@/data/mockData";
import { useItinerary } from "@/lib/itinerary-store";
import { useContentStore } from "@/lib/content-store";
import { iconMap } from "@/lib/icons";
import { buildTripPptx } from "@/lib/export-pptx";
import { buildTripIcs } from "@/lib/export-ics";
import type { ItineraryStop } from "@/types";

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function formatDateHeading(date: string) {
  try {
    return format(parseISO(date), "M月d日（EEEEEE）", { locale: zhTW });
  } catch {
    return date;
  }
}

function AddStopForm({ date, onDone }: { date: string; onDone: () => void }) {
  const { addStop } = useItinerary();
  const [locationId, setLocationId] = useState(mockLocations[0]?.id ?? "");
  const [spotName, setSpotName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [transport, setTransport] = useState("");
  const [contentFocus, setContentFocus] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!spotName.trim() || !locationId) return;
    addStop({
      date,
      spotName: spotName.trim(),
      note: note.trim(),
      locationId,
      transport: transport.trim() || undefined,
      contentFocus: contentFocus.trim() || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-dashed border-ink/20 bg-white/60 p-3 md:gap-3 md:p-4"
    >
      <div className="flex gap-2 md:gap-3">
        <select
          value={locationId}
          onChange={(event) => setLocationId(event.target.value)}
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        >
          {mockLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <input
          value={spotName}
          onChange={(event) => setSpotName(event.target.value)}
          placeholder="景點名稱"
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        />
      </div>
      <div className="flex gap-2 md:gap-3">
        <input
          value={transport}
          onChange={(event) => setTransport(event.target.value)}
          placeholder="交通方式（選填）"
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        />
        <input
          value={contentFocus}
          onChange={(event) => setContentFocus(event.target.value)}
          placeholder="內容重點（選填）"
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        />
      </div>
      <div className="flex gap-2 md:gap-3">
        <input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          placeholder="開始時間"
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        />
        <input
          type="time"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
          placeholder="結束時間"
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
        />
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="自訂筆記（選填）"
        rows={2}
        className="resize-none rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
      />
      <div className="flex justify-end gap-2 print:hidden">
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
          新增景點
        </button>
      </div>
    </form>
  );
}

function StopCard({ stop }: { stop: ItineraryStop }) {
  const { updateStop, removeStop } = useItinerary();
  const location = mockLocations.find((item) => item.id === stop.locationId);
  const Icon = location ? iconMap[location.icon] ?? MapPin : MapPin;

  return (
    <Reorder.Item
      value={stop.id}
      className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-sm md:gap-4 md:p-4"
    >
      <span className="mt-1.5 shrink-0 cursor-grab text-ink/30 active:cursor-grabbing print:hidden">
        <GripVertical size={16} className="md:h-5 md:w-5" />
      </span>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint/30 text-ink md:h-10 md:w-10">
        <Icon size={14} className="md:h-[18px] md:w-[18px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <input
          value={stop.spotName}
          onChange={(event) => updateStop(stop.id, { spotName: event.target.value })}
          className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-ink hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-base"
        />
        <p className="px-1 text-xs text-ink/50 md:text-sm">{location?.prefectureName ?? ""}</p>
        <div className="flex gap-1.5">
          <input
            value={stop.transport ?? ""}
            onChange={(event) => updateStop(stop.id, { transport: event.target.value })}
            placeholder="交通方式..."
            className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
          />
          <input
            value={stop.contentFocus ?? ""}
            onChange={(event) => updateStop(stop.id, { contentFocus: event.target.value })}
            placeholder="內容重點..."
            className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          <input
            type="time"
            value={stop.startTime ?? ""}
            onChange={(event) => updateStop(stop.id, { startTime: event.target.value })}
            className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
          />
          <input
            type="time"
            value={stop.endTime ?? ""}
            onChange={(event) => updateStop(stop.id, { endTime: event.target.value })}
            className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
          />
        </div>
        <textarea
          value={stop.note}
          onChange={(event) => updateStop(stop.id, { note: event.target.value })}
          placeholder="自訂筆記..."
          rows={1}
          className="w-full resize-none rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-ink/70 hover:border-ink/10 focus:border-ink/20 focus:bg-white focus:outline-none md:text-sm"
        />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 print:hidden">
        <input
          type="date"
          value={stop.date}
          onChange={(event) => updateStop(stop.id, { date: event.target.value })}
          className="rounded-md border border-ink/10 bg-white px-1.5 py-1 text-xs text-ink md:px-2 md:py-1.5 md:text-sm"
        />
        <div className="flex items-center gap-0.5">
          <a
            href={googleMapsSearchUrl(stop.spotName)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在 Google Maps 開啟"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Map size={14} className="md:h-4 md:w-4" />
          </a>
          <button
            type="button"
            onClick={() => removeStop(stop.id)}
            aria-label="刪除景點"
            className="rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Trash2 size={14} className="md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function DateSection({ date }: { date: string }) {
  const { stops, reorderDate } = useItinerary();
  const [isAdding, setIsAdding] = useState(false);
  const dateStops = useMemo(() => stops.filter((stop) => stop.date === date), [stops, date]);
  const dateStopIds = useMemo(() => dateStops.map((stop) => stop.id), [dateStops]);

  return (
    <section className="rounded-2xl bg-white/50 p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <h3 className="text-base font-bold text-ink md:text-lg">{formatDateHeading(date)}</h3>
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 print:hidden md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增景點
        </button>
      </div>

      {isAdding && (
        <div className="mb-3">
          <AddStopForm date={date} onDone={() => setIsAdding(false)} />
        </div>
      )}

      {dateStops.length === 0 ? (
        <p className="text-sm text-ink/40 md:text-base">尚無景點，從地圖點選縣市加入，或點擊「新增景點」。</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={dateStopIds}
          onReorder={(newOrder) => reorderDate(date, newOrder as string[])}
          className="flex flex-col gap-2 md:gap-3"
        >
          {dateStops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
        </Reorder.Group>
      )}
    </section>
  );
}

function AddDateForm({ onDone }: { onDone: () => void }) {
  const { dates, addDate } = useItinerary();
  const defaultDate = dates.length
    ? format(addDays(parseISO(dates[dates.length - 1]), 1), "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(defaultDate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!date) return;
    addDate(date);
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-ink/20 bg-white/60 p-3 md:gap-3"
    >
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink md:px-3 md:py-2 md:text-base"
      />
      <div className="flex gap-2">
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
          新增日期
        </button>
      </div>
    </form>
  );
}

export function ItineraryPlanner({ title, projectId }: { title: string; projectId: string }) {
  const { dates, stops, budgetItems, budgetTotal } = useItinerary();
  const { contentItems: allContentItems } = useContentStore();
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isAddingDate, setIsAddingDate] = useState(false);

  const contentItems = useMemo(
    () => allContentItems.filter((item) => item.projectId === projectId),
    [allContentItems, projectId]
  );

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    try {
      await buildTripPptx({
        tripTitle: title,
        dates,
        stops,
        budgetItems,
        budgetTotal,
        contentItems,
      });
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleExportIcs = () => {
    buildTripIcs({ tripTitle: title, stops });
  };

  return (
    <div className="w-full max-w-3xl rounded-[2.5rem] bg-white/50 p-4 shadow-xl print:bg-white print:p-0 print:shadow-none sm:p-8 md:max-w-4xl md:p-10 lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem]">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3 md:mb-8">
        <div className="flex flex-wrap gap-2 print:hidden md:gap-3">
          <button
            type="button"
            onClick={() => setIsAddingDate((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-mint/80 md:px-4 md:py-2 md:text-sm"
          >
            <Plus size={14} className="md:h-4 md:w-4" /> 新增日期
          </button>
          <button
            type="button"
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm transition-colors hover:bg-ink/5 disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
          >
            <Presentation size={14} className="md:h-4 md:w-4" /> {isExportingPptx ? "產生中…" : "下載 PPT"}
          </button>
          <button
            type="button"
            onClick={handleExportIcs}
            disabled={stops.length === 0}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm transition-colors hover:bg-ink/5 disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
          >
            <CalendarPlus size={14} className="md:h-4 md:w-4" /> 加入行事曆
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        {isAddingDate && <AddDateForm onDone={() => setIsAddingDate(false)} />}

        {dates.length === 0 ? (
          <p className="text-sm text-ink/40 md:text-base">尚無日期，點擊「新增日期」開始安排行程。</p>
        ) : (
          dates.map((date) => <DateSection key={date} date={date} />)
        )}
      </div>
    </div>
  );
}
