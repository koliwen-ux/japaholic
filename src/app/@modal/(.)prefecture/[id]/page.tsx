import { notFound } from "next/navigation";
import { mockPrefectures } from "@/data/mockData";
import { PrefecturePanel } from "@/components/PrefecturePanel";

export default async function InterceptedPrefecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prefecture = mockPrefectures.find((item) => item.id === `pref-${id}`);

  if (!prefecture) {
    notFound();
  }

  return <PrefecturePanel prefecture={prefecture} />;
}
