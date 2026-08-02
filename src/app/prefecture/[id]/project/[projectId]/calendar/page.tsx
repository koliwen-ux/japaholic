import { notFound } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import { loadProjectItinerary } from "@/lib/data/load-project-itinerary";
import { ProjectSectionShell } from "@/components/ProjectSectionShell";
import { PrefectureCalendarSection } from "@/components/PrefectureCalendarSection";

export default async function ProjectCalendarPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  const prefecture = mockPrefectures.find((item) => item.id === `pref-${id}`);
  if (!prefecture) {
    notFound();
  }

  const { project, stops } = await loadProjectItinerary(projectId);
  if (!project || project.prefectureId !== prefecture.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-10 text-ink md:py-14">
      <ProjectSectionShell prefecture={prefecture} project={project} icon={CalendarCheck2} title="進度月曆">
        <PrefectureCalendarSection prefecture={prefecture} project={project} itineraryStops={stops} />
      </ProjectSectionShell>
    </div>
  );
}
