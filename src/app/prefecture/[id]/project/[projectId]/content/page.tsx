import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import { loadProjectItinerary } from "@/lib/data/load-project-itinerary";
import { ProjectSectionShell } from "@/components/ProjectSectionShell";
import { PrefectureContentSection } from "@/components/PrefectureContentSection";

export default async function ProjectContentPage({
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
      <ProjectSectionShell prefecture={prefecture} project={project} icon={ClipboardList} title="內容規劃">
        <PrefectureContentSection prefecture={prefecture} project={project} />
      </ProjectSectionShell>
    </div>
  );
}
