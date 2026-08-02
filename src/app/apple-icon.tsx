import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 110,
          fontWeight: 900,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        J
      </div>
    ),
    { ...size }
  );
}
