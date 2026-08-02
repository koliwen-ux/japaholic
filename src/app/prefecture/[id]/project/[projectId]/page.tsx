import { notFound } from "next/navigation";
import { mockPrefectures } from "@/data/mockData";
import { loadProjectItinerary } from "@/lib/data/load-project-itinerary";
import { ProjectDetail } from "@/components/ProjectDetail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  const prefecture = mockPrefectures.find((item) => item.id === `pref-${id}`);
  if (!prefecture) {
    notFound();
  }

  const { project, stops, budgetItems } = await loadProjectItinerary(projectId);
  if (!project || project.prefectureId !== prefecture.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-10 text-ink md:py-14">
      <ProjectDetail
        prefecture={prefecture}
        project={project}
        initialStops={stops}
        initialBudgetItems={budgetItems}
      />
    </div>
  );
}
