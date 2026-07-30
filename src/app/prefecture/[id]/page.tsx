import { notFound } from "next/navigation";
import { mockPrefectures } from "@/data/mockData";
import { PrefectureDetail } from "@/components/PrefectureDetail";

export function generateStaticParams() {
  return mockPrefectures.map((prefecture) => ({
    id: prefecture.id.replace("pref-", ""),
  }));
}

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prefecture = mockPrefectures.find((item) => item.id === `pref-${id}`);

  if (!prefecture) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-10 text-ink md:py-14">
      <PrefectureDetail prefecture={prefecture} />
    </div>
  );
}
