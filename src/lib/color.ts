/** Blends a hex color toward white by `ratio` (0 = original color, 1 = white). */
export function tintHex(hex: string, ratio: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
