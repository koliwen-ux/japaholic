/** Converts a hex color to HSL (h in degrees, s/l as 0-100). */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

/**
 * A tint of `hex` at a fixed lightness, keeping its hue and saturation intact.
 * Blending toward white (mixing RGB channels) washes out saturation, which makes
 * warm base colors converge on any warm, pale page background instead of staying
 * visually distinct from it — holding hue/saturation constant and only lifting
 * lightness keeps that distinction at any lightness level.
 */
export function tintHex(hex: string, lightness: number, minSaturation = 45): string {
  const { h, s } = hexToHsl(hex);
  const saturation = Math.max(s, minSaturation);
  return `hsl(${h}, ${saturation}%, ${lightness}%)`;
}
