import type { ItineraryStop } from "@/types";

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatUtcTimestamp(date: Date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function toDateStamp(isoDate: string) {
  return isoDate.replace(/-/g, "");
}

/** `isoDate` plus `days`, returned as a YYYYMMDD stamp (for exclusive all-day DTEND). */
function addDaysToDateStamp(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

/**
 * Builds a .ics file for a trip's itinerary and triggers a browser download.
 * Timed stops (with startTime/endTime) use floating local time — no TZID or
 * UTC "Z" suffix — so the calendar app shows exactly the HH:mm the user
 * typed, regardless of which timezone the device is set to.
 */
export function buildTripIcs({ tripTitle, stops }: { tripTitle: string; stops: ItineraryStop[] }) {
  const now = formatUtcTimestamp(new Date());
  const lines: string[] = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Japaholic//Itinerary//ZH", "CALSCALE:GREGORIAN"];

  const sortedStops = [...stops].sort((a, b) => a.date.localeCompare(b.date));

  for (const stop of sortedStops) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${stop.id}@japaholic`);
    lines.push(`DTSTAMP:${now}`);

    if (stop.startTime && stop.endTime) {
      lines.push(`DTSTART:${toDateStamp(stop.date)}T${stop.startTime.replace(":", "")}00`);
      lines.push(`DTEND:${toDateStamp(stop.date)}T${stop.endTime.replace(":", "")}00`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${toDateStamp(stop.date)}`);
      lines.push(`DTEND;VALUE=DATE:${addDaysToDateStamp(stop.date, 1)}`);
    }

    lines.push(`SUMMARY:${escapeIcsText(stop.spotName)}`);
    lines.push(`LOCATION:${escapeIcsText(stop.spotName)}`);

    const descriptionParts = [
      stop.transport ? `交通：${stop.transport}` : null,
      stop.contentFocus ? `內容重點：${stop.contentFocus}` : null,
      stop.note || null,
    ].filter((part): part is string => Boolean(part));
    if (descriptionParts.length > 0) {
      lines.push(`DESCRIPTION:${escapeIcsText(descriptionParts.join("\n"))}`);
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tripTitle || "行程"}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
