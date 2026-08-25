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

/**
 * A single content piece's lifecycle, from idea to published:
 * candidate (待定) → draft (草稿) → scheduled (製作中) → published (已發布),
 * with discarded (已捨棄) as a side branch.
 */
export type ContentStatus = "candidate" | "draft" | "scheduled" | "published" | "discarded";

/**
 * A piece of coverage content (article / YouTube video / SNS post) tied to a
 * location, spanning both pre-production planning and publish tracking —
 * fields fill in gradually as `status` advances.
 */
export interface ContentItem {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  /** Related `Location.id` (a prefecture or a city within one). */
  locationId: string;
  /** ISO 8601 date string (YYYY-MM-DD). Set once scheduled/published. */
  publishDate?: string;
  /** ISO 8601 date string (YYYY-MM-DD). When the first draft is due. */
  draftDueDate?: string;
  url?: string;
  summary?: string;
  /** Article / video section outline, in order. */
  outline?: string[];
  keywords?: { primary: string[]; secondary: string[] };
  /** Candidate titles under consideration alongside `title`. */
  titleAlternatives?: string[];
  /** SNS post format, e.g. "reels" or "輪播圖文". */
  format?: string;
  /** Other prefectures covered by a cross-prefecture roundup piece. */
  relatedPrefectureIds?: string[];
  /** Manual sort order within the same project + type list (lower first). */
  position: number;
}

/** A single day's stop within a project's itinerary. */
export interface ItineraryStop {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
  /** ISO 8601 date string (YYYY-MM-DD) for this stop's day. */
  date: string;
  /** Spot / attraction name for this day. */
  spotName: string;
  note: string;
  /** Related `Location.id` (typically a prefecture). */
  locationId: string;
  /** How to get to this stop, e.g. "機場巴士＋JR". */
  transport?: string;
  /** What content this stop is meant to produce, e.g. "五色沼健行、山鹽拉麵". */
  contentFocus?: string;
  /** HH:mm, when this stop starts. */
  startTime?: string;
  /** HH:mm, when this stop ends. */
  endTime?: string;
  /** On-camera narration script for this stop, typed by hand (no AI generation). */
  script?: string;
}

/** A single budget line item for a project. */
export interface BudgetItem {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
  /** Expense category, e.g. "四晚住宿". */
  category: string;
  /** Suggested budget in NT$. */
  amount: number;
  note: string;
}

/**
 * A coverage trip within a prefecture — e.g. one team's outing at one point in
 * time. A prefecture can have many; each has its own itinerary and budget.
 */
export interface Project {
  id: string;
  /** Related `Prefecture.id`. */
  prefectureId: string;
  name: string;
  /** Names of the people/team assigned to this trip. */
  assignees: string[];
  notes?: string;
}

/** A single tracked task on a project's progress calendar. */
export interface CalendarProgress {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
  /** ISO 8601 date string (YYYY-MM-DD). */
  date: string;
  /** Task description, e.g. "確認會津若松鶴城拍攝許可". */
  task: string;
  completed: boolean;
}

/** A link to an archived piece of raw footage/photos (hosted elsewhere, e.g. Google Drive). */
export interface MediaAsset {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
  title: string;
  url: string;
  note?: string;
}

export type CoveragePlanStatus = "planned" | "confirmed" | "completed";

/** A single must-shoot item on a coverage plan's shot checklist. */
export interface CoveragePlanChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

/** A planned or completed coverage (取材) visit within a project. */
export interface CoveragePlan {
  id: string;
  /** Owning `Project.id`. */
  projectId: string;
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
