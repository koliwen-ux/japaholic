"use client";

import { useRouter } from "next/navigation";
import type { Prefecture } from "@/types";
import { PrefectureDetail } from "@/components/PrefectureDetail";

/**
 * Wraps `PrefectureDetail` for the split-view panel opened via the intercepted
 * `/prefecture/[id]` route: a full-screen sheet on small screens, a persistent
 * side panel next to the map on large screens.
 */
export function PrefecturePanel({ prefecture }: { prefecture: Prefecture }) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 z-20 overflow-y-auto bg-cream sm:top-16 lg:static lg:inset-auto lg:top-auto lg:z-auto lg:w-2/3 lg:shrink-0 lg:border-l lg:border-ink/10 lg:bg-white/50">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <PrefectureDetail prefecture={prefecture} onClose={() => router.back()} />
      </div>
    </div>
  );
}
