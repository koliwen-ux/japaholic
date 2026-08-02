import { ImageResponse } from "next/og";

// Maskable icon: keep the glyph well inside the ~80%-diameter safe zone that
// OS launchers use when clipping to a circle/squircle/rounded-square mask.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7ED3BF",
          color: "#2D3748",
          fontSize: 200,
          fontWeight: 900,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        J
      </div>
    ),
    { width: 512, height: 512 }
  );
}
