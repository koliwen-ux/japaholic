/**
 * All 47 Japanese prefectures, grouped into the 8 conventional regions and
 * placed on an 18x20 tile grid approximating their real relative position.
 * This is a stylized "tile cartogram" (like a simplified choropleth map),
 * not survey-accurate coastlines.
 */

export type JapanRegionId =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu";

export const gridColumns = 18;
export const gridRows = 20;

/** A single prefecture's id, name, region, and tile-grid position (1-indexed, CSS Grid style). */
export interface JapanPrefectureGeo {
  /** Matches `Prefecture.id` for featured prefectures (e.g. "pref-fukushima"). */
  id: string;
  name: string;
  region: JapanRegionId;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

export const japanPrefectureGeo: JapanPrefectureGeo[] = [
  // 北海道
  { id: "pref-hokkaido", name: "北海道", region: "hokkaido", col: 13, row: 1, colSpan: 2, rowSpan: 2 },

  // 東北
  { id: "pref-aomori", name: "青森縣", region: "tohoku", col: 12, row: 3 },
  { id: "pref-akita", name: "秋田縣", region: "tohoku", col: 10, row: 4 },
  { id: "pref-iwate", name: "岩手縣", region: "tohoku", col: 12, row: 4 },
  { id: "pref-yamagata", name: "山形縣", region: "tohoku", col: 10, row: 5 },
  { id: "pref-miyagi", name: "宮城縣", region: "tohoku", col: 12, row: 5 },
  { id: "pref-fukushima", name: "福島縣", region: "tohoku", col: 11, row: 6 },

  // 中部・北陸
  { id: "pref-niigata", name: "新潟縣", region: "chubu", col: 10, row: 6 },
  { id: "pref-toyama", name: "富山縣", region: "chubu", col: 8, row: 7 },
  { id: "pref-ishikawa", name: "石川縣", region: "chubu", col: 7, row: 7 },
  { id: "pref-fukui", name: "福井縣", region: "chubu", col: 7, row: 8 },
  { id: "pref-nagano", name: "長野縣", region: "chubu", col: 9, row: 8 },
  { id: "pref-yamanashi", name: "山梨縣", region: "chubu", col: 10, row: 8 },
  { id: "pref-gifu", name: "岐阜縣", region: "chubu", col: 8, row: 9 },
  { id: "pref-shizuoka", name: "靜岡縣", region: "chubu", col: 10, row: 9 },
  { id: "pref-aichi", name: "愛知縣", region: "chubu", col: 9, row: 9 },

  // 關東
  { id: "pref-gunma", name: "群馬縣", region: "kanto", col: 11, row: 7 },
  { id: "pref-tochigi", name: "栃木縣", region: "kanto", col: 12, row: 7 },
  { id: "pref-ibaraki", name: "茨城縣", region: "kanto", col: 13, row: 7 },
  { id: "pref-saitama", name: "埼玉縣", region: "kanto", col: 12, row: 8 },
  { id: "pref-chiba", name: "千葉縣", region: "kanto", col: 13, row: 8 },
  { id: "pref-tokyo", name: "東京都", region: "kanto", col: 12, row: 9 },
  { id: "pref-kanagawa", name: "神奈川縣", region: "kanto", col: 11, row: 9 },

  // 關西
  { id: "pref-shiga", name: "滋賀縣", region: "kansai", col: 8, row: 10 },
  { id: "pref-kyoto", name: "京都府", region: "kansai", col: 7, row: 10 },
  { id: "pref-hyogo", name: "兵庫縣", region: "kansai", col: 6, row: 10 },
  { id: "pref-osaka", name: "大阪府", region: "kansai", col: 7, row: 11 },
  { id: "pref-nara", name: "奈良縣", region: "kansai", col: 8, row: 11 },
  { id: "pref-mie", name: "三重縣", region: "kansai", col: 9, row: 10 },
  { id: "pref-wakayama", name: "和歌山縣", region: "kansai", col: 7, row: 12 },

  // 山陽山陰
  { id: "pref-tottori", name: "鳥取縣", region: "chugoku", col: 5, row: 10 },
  { id: "pref-shimane", name: "島根縣", region: "chugoku", col: 4, row: 10 },
  { id: "pref-okayama", name: "岡山縣", region: "chugoku", col: 5, row: 11 },
  { id: "pref-hiroshima", name: "廣島縣", region: "chugoku", col: 4, row: 11 },
  { id: "pref-yamaguchi", name: "山口縣", region: "chugoku", col: 2, row: 11 },

  // 四國
  { id: "pref-kagawa", name: "香川縣", region: "shikoku", col: 6, row: 12 },
  { id: "pref-tokushima", name: "德島縣", region: "shikoku", col: 7, row: 13 },
  { id: "pref-ehime", name: "愛媛縣", region: "shikoku", col: 5, row: 12 },
  { id: "pref-kochi", name: "高知縣", region: "shikoku", col: 6, row: 13 },

  // 九州沖繩
  { id: "pref-fukuoka", name: "福岡縣", region: "kyushu", col: 2, row: 12 },
  { id: "pref-saga", name: "佐賀縣", region: "kyushu", col: 1, row: 12 },
  { id: "pref-nagasaki", name: "長崎縣", region: "kyushu", col: 0, row: 13 },
  { id: "pref-kumamoto", name: "熊本縣", region: "kyushu", col: 1, row: 13 },
  { id: "pref-oita", name: "大分縣", region: "kyushu", col: 3, row: 12 },
  { id: "pref-miyazaki", name: "宮崎縣", region: "kyushu", col: 2, row: 14 },
  { id: "pref-kagoshima", name: "鹿兒島縣", region: "kyushu", col: 1, row: 15 },
  { id: "pref-okinawa", name: "沖繩縣", region: "kyushu", col: 0, row: 18 },
];

/** A rectangular backdrop, in 1-indexed CSS Grid coordinates, behind one region's tiles. */
export interface RegionBackdrop {
  id: JapanRegionId;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

function boundsOf(items: JapanPrefectureGeo[]) {
  return {
    colStart: Math.min(...items.map((g) => g.col)) + 1,
    colEnd: Math.max(...items.map((g) => g.col + (g.colSpan ?? 1) - 1)) + 1,
    rowStart: Math.min(...items.map((g) => g.row)) + 1,
    rowEnd: Math.max(...items.map((g) => g.row + (g.rowSpan ?? 1) - 1)) + 1,
  };
}

/**
 * One backdrop per region, sized to the bounding box of its member prefectures.
 * Okinawa is split out from Kyushu into its own small backdrop since it sits far
 * south of the rest of Kyushu, and a single shared box would cover a lot of empty
 * grid between them.
 */
export const regionBackdrops: RegionBackdrop[] = (() => {
  const okinawa = japanPrefectureGeo.find((g) => g.id === "pref-okinawa")!;
  const groups = new Map<JapanRegionId, JapanPrefectureGeo[]>();
  for (const geo of japanPrefectureGeo) {
    if (geo.id === "pref-okinawa") continue;
    const list = groups.get(geo.region) ?? [];
    list.push(geo);
    groups.set(geo.region, list);
  }

  const result: RegionBackdrop[] = [];
  for (const [id, items] of groups) {
    result.push({ id, ...boundsOf(items) });
  }
  result.push({ id: "kyushu", ...boundsOf([okinawa]) });
  return result;
})();
