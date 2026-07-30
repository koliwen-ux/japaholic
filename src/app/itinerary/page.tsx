import { ItineraryPlanner } from "@/components/ItineraryPlanner";

export default function ItineraryPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 text-ink md:py-20">
      <ItineraryPlanner />
    </div>
  );
}
