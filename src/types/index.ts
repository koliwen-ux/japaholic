/** Icon name from the `lucide-react` export map (e.g. "Landmark", "Mountain"). */
export type LucideIconName = string;

/** One of the six Tohoku prefectures. */
export interface Prefecture {
  id: string;
  /** Display name, e.g. "福島縣". */
  name: string;
  /** Primary visual color as a hex string, e.g. "#F4CE5D". */
  color: string;
  /** Representative icon shown on the map and detail page, e.g. "Landmark". */
  icon: LucideIconName;
}

export type LocationType = "prefecture" | "city";

/** A prefecture or a city within one. Cities are used for fine-grained itinerary planning. */
export interface Location {
  id: string;
  type: LocationType;
  /** Display name, e.g. "福島縣" or "福島市". */
  name: string;
  /** Owning prefecture's display name, e.g. "福島縣" (equals `name` when type is "prefecture"). */
  prefectureName: string;
  /** Representative building icon, e.g. "Landmark". */
  icon: LucideIconName;
  /** Parent prefecture's `Location.id`, set when type is "city". */
  parentId?: string;
}

export type ContentType = "article" | "youtube" | "sns";

export type ContentStatus = "draft" | "scheduled" | "published";

/** A piece of coverage content (article / YouTube video / SNS post) tied to a location. */
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  /** ISO 8601 date string (YYYY-MM-DD). */
  publishDate: string;
  status: ContentStatus;
  /** Related `Location.id` (a prefecture or a city within one). */
  locationId: string;
}

/** A single day's stop within an itinerary. */
export interface ItineraryStop {
  id: string;
  /** Day number within the itinerary, e.g. 1 for "Day 1". */
  day: number;
  /** Spot / attraction name for this day. */
  spotName: string;
  note: string;
  /** Related `Location.id` (typically a prefecture). */
  locationId: string;
  /** How to get to this stop, e.g. "機場巴士＋JR". */
  transport?: string;
  /** What content this stop is meant to produce, e.g. "五色沼健行、山鹽拉麵". */
  contentFocus?: string;
}

export type ContentProposalStatus = "candidate" | "selected" | "discarded";

/** A pre-production content idea (article / YouTube / SNS) not yet committed to a tracked `ContentItem`. */
export interface ContentProposal {
  id: string;
  type: ContentType;
  /** Related `Prefecture.id` this proposal is anchored to. */
  prefectureId: string;
  /** Other prefectures covered by a cross-prefecture roundup proposal. */
  relatedPrefectureIds?: string[];
  title: string;
  summary: string;
  /** Article / video section outline, in order. */
  outline?: string[];
  keywords: { primary: string[]; secondary: string[] };
  /** Candidate titles under consideration alongside `title`. */
  titleAlternatives?: string[];
  /** SNS post format, e.g. "reels" or "輪播圖文". */
  format?: string;
  status: ContentProposalStatus;
}

/** A single budget line item for a trip. */
export interface BudgetItem {
  id: string;
  /** Expense category, e.g. "四晚住宿". */
  category: string;
  /** Suggested budget in NT$. */
  amount: number;
  note: string;
}

/** A multi-day itinerary plan made up of ordered stops. */
export interface Itinerary {
  id: string;
  title: string;
  stops: ItineraryStop[];
}

/** A single tracked task on a prefecture's progress calendar. */
export interface CalendarProgress {
  id: string;
  /** Related `Prefecture.id`. */
  prefectureId: string;
  /** ISO 8601 date string (YYYY-MM-DD). */
  date: string;
  /** Task description, e.g. "確認會津若松鶴城拍攝許可". */
  task: string;
  completed: boolean;
}

export type CoveragePlanStatus = "planned" | "confirmed" | "completed";

/** A single must-shoot item on a coverage plan's shot checklist. */
export interface CoveragePlanChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

/** A planned or completed coverage (取材) visit within a prefecture. */
export interface CoveragePlan {
  id: string;
  /** Related `Prefecture.id`. */
  prefectureId: string;
  /** Coverage spot or theme, e.g. "會津若松鶴城". */
  spot: string;
  /** ISO 8601 date string (YYYY-MM-DD). */
  date: string;
  /** Expected time window, e.g. "09:00–11:00". */
  time: string;
  /** Street address or meeting point. */
  address: string;
  /** Optional reference link (official site, map, booking page). */
  referenceUrl?: string;
  /** Notes: shop info, contacts, logistics, etc. */
  notes: string;
  /** Must-shoot checklist for the visit. */
  checklist: CoveragePlanChecklistItem[];
  status: CoveragePlanStatus;
}
