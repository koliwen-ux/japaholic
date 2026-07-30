import { mockLocations } from "@/data/mockData";

/** Resolves any location id (prefecture or city) to its owning prefecture's id. */
export function resolvePrefectureId(locationId: string): string | undefined {
  const location = mockLocations.find((item) => item.id === locationId);
  if (!location) return undefined;
  return location.type === "prefecture" ? location.id : location.parentId;
}

/** Human-readable label for a location id, e.g. "會津若松市（福島縣）". */
export function locationLabel(locationId: string): string {
  const location = mockLocations.find((item) => item.id === locationId);
  if (!location) return "未指定地點";
  return location.name === location.prefectureName
    ? location.name
    : `${location.name}（${location.prefectureName}）`;
}
