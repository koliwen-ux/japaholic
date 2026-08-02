import Link from "next/link";
import { ArrowLeft, CalendarCheck2, ClipboardList, Compass, MapPinned } from "lucide-react";
import type { BudgetItem, ItineraryStop, Prefecture, Project } from "@/types";
import { iconMap } from "@/lib/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { PrefectureContentSection } from "@/components/PrefectureContentSection";
import { PrefectureCalendarSection } from "@/components/PrefectureCalendarSection";
import { PrefectureCoverageAccordion } from "@/components/PrefectureCoverageAccordion";
import { ItineraryProvider } from "@/lib/itinerary-store";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";

export function ProjectDetail({
  prefecture,
  project,
  initialStops,
  initialBudgetItems,
}: {
  prefecture: Prefecture;
  project: Project;
  initialStops: ItineraryStop[];
  initialBudgetItems: BudgetItem[];
}) {
  const Icon = iconMap[prefecture.icon] ?? Compass;

  return (
    <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem]">
      <Link
        href={`/prefecture/${prefecture.id.replace("pref-", "")}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm transition-colors hover:bg-ink/5 hover:text-ink md:px-4 md:py-2 md:text-sm"
      >
        <ArrowLeft size={14} className="md:h-4 md:w-4" /> 返回{prefecture.name}
      </Link>

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
          <h1 className="text-2xl font-black text-ink md:text-3xl">{project.name}</h1>
          <p className="text-sm text-ink/50 md:text-base">
            {prefecture.name}
            {project.assignees.length > 0 ? `・執行者：${project.assignees.join("、")}` : ""}
          </p>
          {project.notes && <p className="mt-2 text-sm text-ink/70 md:text-base">{project.notes}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-10">
        <section>
          <SectionHeading icon={ClipboardList} title="內容規劃" color={prefecture.color} />
          <PrefectureContentSection prefecture={prefecture} project={project} />
        </section>

        <section>
          <SectionHeading icon={CalendarCheck2} title="進度月曆" color={prefecture.color} />
          <PrefectureCalendarSection prefecture={prefecture} project={project} />
        </section>

        <section>
          <SectionHeading icon={Compass} title="取材安排" color={prefecture.color} />
          <PrefectureCoverageAccordion prefecture={prefecture} project={project} />
        </section>

        <section>
          <SectionHeading icon={MapPinned} title="行程規劃" color={prefecture.color} />
          <ItineraryProvider projectId={project.id} initialStops={initialStops} initialBudgetItems={initialBudgetItems}>
            <ItineraryPlanner title={project.name} projectId={project.id} />
          </ItineraryProvider>
        </section>
      </div>
    </div>
  );
}
