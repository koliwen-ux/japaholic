import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContentStoreProvider } from "@/lib/content-store";
import { loadInitialState } from "@/lib/data/load-initial-state";
import { Navbar } from "@/components/Navbar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japaholic 取材企劃",
  description: "日本取材企劃協作平台：地圖、專案、行程與內容規劃一站管理",
  appleWebApp: {
    capable: true,
    title: "取材企劃",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#7ED3BF",
};

// Every page reads shared, frequently-edited data via loadInitialState() —
// force per-request rendering so no one sees a stale snapshot.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const { contentItems, coveragePlans, calendarProgress, projects, mediaAssets } = await loadInitialState();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ContentStoreProvider
          initialContentItems={contentItems}
          initialCoveragePlans={coveragePlans}
          initialCalendarProgress={calendarProgress}
          initialProjects={projects}
          initialMediaAssets={mediaAssets}
        >
          <ServiceWorkerRegister />
          <Navbar />
          <div className="flex flex-1">
            <div className="min-w-0 flex-1">{children}</div>
            {modal}
          </div>
        </ContentStoreProvider>
      </body>
    </html>
  );
}
