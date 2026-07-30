"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { featuredPrefectureIds, mockPrefectures } from "@/data/mockData";
import {
  gridColumns,
  gridRows,
  japanPrefectureGeo,
  regionBackdrops,
  type JapanPrefectureGeo,
  type JapanRegionId,
  type RegionBackdrop,
} from "@/lib/japan-prefectures";
import { cn } from "@/lib/utils";

const regionLabels: Record<JapanRegionId, string> = {
  hokkaido: "北海道地區",
  tohoku: "東北地區",
  kanto: "關東地區",
  chubu: "中部・北陸地區",
  kansai: "近畿地區",
  chugoku: "中國地區",
  shikoku: "四國地區",
  kyushu: "九州沖繩地區",
};

const regionBackdropColor: Record<JapanRegionId, string> = {
  hokkaido: "#8FD9C4",
  tohoku: "#E8877A",
  kanto: "#F5B87A",
  chubu: "#E8C88A",
  kansai: "#A8C98A",
  chugoku: "#8FBEE0",
  shikoku: "#C4D178",
  kyushu: "#7FCDB0",
};

const regionOrder: JapanRegionId[] = [
  "hokkaido",
  "tohoku",
  "kanto",
  "chubu",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
];

function prefectureSlug(id: string) {
  return id.replace("pref-", "");
}

/** Strips the trailing 都/道/府/縣 marker, e.g. "京都府" → "京都", "東京都" → "東京". */
function shortPrefectureName(name: string) {
  if (name === "北海道") return name;
  return name.replace(/(都|道|府|縣)$/, "");
}

function RegionBackdropBlock({ backdrop }: { backdrop: RegionBackdrop }) {
  const color = regionBackdropColor[backdrop.id];
  const style: CSSProperties = {
    gridColumn: `${backdrop.colStart} / ${backdrop.colEnd + 1}`,
    gridRow: `${backdrop.rowStart} / ${backdrop.rowEnd + 1}`,
    backgroundColor: `${color}33`,
    boxShadow: `inset 0 0 0 1px ${color}66`,
  };

  return <div aria-hidden style={style} className="pointer-events-none rounded-xl sm:rounded-2xl" />;
}

function PrefectureTile({ geo }: { geo: JapanPrefectureGeo }) {
  const router = useRouter();
  const prefecture = mockPrefectures.find((item) => item.id === geo.id);
  const isActive = featuredPrefectureIds.includes(geo.id) && !!prefecture;
  const label = shortPrefectureName(geo.name);
  const isLong = label.length >= 3;

  const style: CSSProperties = {
    gridColumn: `${geo.col + 1} / span ${geo.colSpan ?? 1}`,
    gridRow: `${geo.row + 1} / span ${geo.rowSpan ?? 1}`,
  };

  const labelSizeClass = isLong ? "text-[8px] sm:text-[9px] md:text-[10px]" : "text-[10px] sm:text-xs md:text-sm";

  if (isActive && prefecture) {
    return (
      <button
        type="button"
        aria-label={prefecture.name}
        onClick={() => router.push(`/prefecture/${prefectureSlug(geo.id)}`)}
        style={{ ...style, backgroundColor: prefecture.color }}
        className={cn(
          "group relative flex items-center justify-center whitespace-nowrap rounded-md text-center font-bold text-white shadow-sm transition-all duration-150 hover:z-10 hover:scale-110 hover:shadow-[0_0_0_2px_#fff,0_0_16px_4px_rgba(45,55,72,0.25)] sm:rounded-lg",
          labelSizeClass
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      style={style}
      className={cn(
        "group relative flex items-center justify-center whitespace-nowrap rounded-md border border-ink/10 bg-white text-center font-medium text-ink/40 transition-colors duration-150 hover:bg-ink/5 hover:text-ink/60 sm:rounded-lg",
        labelSizeClass
      )}
    >
      {label}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
        {geo.name}・規劃中
      </span>
    </div>
  );
}

function PrefectureChip({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const prefecture = mockPrefectures.find((item) => item.id === id);
  const isActive = featuredPrefectureIds.includes(id);
  const label = shortPrefectureName(name);

  if (isActive && prefecture) {
    return (
      <button
        type="button"
        onClick={() => router.push(`/prefecture/${prefectureSlug(id)}`)}
        style={{ backgroundColor: prefecture.color }}
        className="rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 sm:text-sm"
      >
        {label}
      </button>
    );
  }

  return <span className="text-xs font-medium text-ink/45 sm:text-sm">{label}</span>;
}

function RegionDirectory({
  label,
  color,
  prefectures,
}: {
  label: string;
  color: string;
  prefectures: JapanPrefectureGeo[];
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink sm:text-base">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </h3>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {prefectures.map((prefecture, index) => (
          <span key={prefecture.id} className="flex items-center gap-2">
            <PrefectureChip id={prefecture.id} name={prefecture.name} />
            {index < prefectures.length - 1 && (
              <span className="text-ink/20" aria-hidden>
                ｜
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function JapanMap() {
  return (
    <div className="w-full max-w-4xl rounded-[2rem] bg-white/60 p-4 shadow-sm sm:p-6 md:max-w-5xl md:p-8 lg:max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-ink/60 sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-pink" /> 已有取材資料（可點擊）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md border border-ink/20 bg-white" /> 規劃中
        </span>
      </div>

      <div className="overflow-x-auto">
        <div
          className="mx-auto grid gap-[3px] sm:gap-1"
          style={{
            width: "100%",
            minWidth: "620px",
            maxWidth: "42rem",
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
            aspectRatio: `${gridColumns} / ${gridRows}`,
          }}
        >
          {regionBackdrops.map((backdrop, index) => (
            <RegionBackdropBlock key={`${backdrop.id}-${index}`} backdrop={backdrop} />
          ))}
          {japanPrefectureGeo.map((geo) => (
            <PrefectureTile key={geo.id} geo={geo} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-10 md:gap-8">
        {regionOrder.map((regionId) => (
          <RegionDirectory
            key={regionId}
            label={regionLabels[regionId]}
            color={regionBackdropColor[regionId]}
            prefectures={japanPrefectureGeo.filter((geo) => geo.region === regionId)}
          />
        ))}
      </div>
    </div>
  );
}
