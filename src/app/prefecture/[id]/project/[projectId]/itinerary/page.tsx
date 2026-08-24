import { notFound } from "next/navigation";
import { MapPinned } from "lucide-react";
import { mockPrefectures } from "@/data/mockData";
import { loadProjectItinerary } from "@/lib/data/load-project-itinerary";
import { ProjectSectionShell } from "@/components/ProjectSectionShell";
import { ItineraryProvider } from "@/lib/itinerary-store";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";

export default async function ProjectItineraryPage({
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
      <ProjectSectionShell prefecture={prefecture} project={project} icon={MapPinned} title="行程規劃">
        <ItineraryProvider projectId={project.id} initialStops={stops} initialBudgetItems={budgetItems}>
          <ItineraryPlanner title={project.name} projectId={project.id} prefectureColor={prefecture.color} />
        </ItineraryProvider>
      </ProjectSectionShell>
    </div>
  );
}
