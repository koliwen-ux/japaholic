import { notFound } from "next/navigation";
import { Compass } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import { loadProjectItinerary } from "@/lib/data/load-project-itinerary";
import { ProjectSectionShell } from "@/components/ProjectSectionShell";
import { PrefectureCoverageAccordion } from "@/components/PrefectureCoverageAccordion";

export default async function ProjectCoveragePage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  const prefecture = mockPrefectures.find((item) => item.id === `pref-${id}`);
  if (!prefecture) {
    notFound();
  }

  const { project } = await loadProjectItinerary(projectId);
  if (!project || project.prefectureId !== prefecture.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-10 text-ink md:py-14">
      <ProjectSectionShell prefecture={prefecture} project={project} icon={Compass} title="取材安排">
        <PrefectureCoverageAccordion prefecture={prefecture} project={project} />
      </ProjectSectionShell>
    </div>
  );
}
