import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContentStoreProvider } from "@/lib/content-store";
import { loadInitialState } from "@/lib/data/load-initial-state";
import { Navbar } from "@/components/Navbar";
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
  title: "Tohoku Coverage Hub",
  description: "Isometric coverage map for the Tohoku region",
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
  const { contentItems, coveragePlans, calendarProgress, projects } = await loadInitialState();

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
        >
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
