import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japaholic 取材企劃",
    short_name: "取材企劃",
    description: "日本取材企劃協作平台：地圖、專案、行程與內容規劃一站管理",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF0EC",
    theme_color: "#7ED3BF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
