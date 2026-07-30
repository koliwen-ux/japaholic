"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Map as MapIcon, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "全日本取材地圖", icon: MapIcon },
  { href: "/itinerary", label: "行程規劃", icon: Route },
  { href: "/calendar", label: "內容上線行事曆", icon: CalendarClock },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-white/70 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-10">
        <Link href="/" className="text-base font-black tracking-tight text-ink sm:text-lg">
          東北地方
          <span className="ml-1.5 hidden text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 sm:inline">
            Tohoku
          </span>
        </Link>

        <div className="flex gap-1 rounded-full bg-ink/5 p-1 md:gap-1.5 md:p-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm md:px-4 md:py-2",
                  isActive ? "bg-mint text-ink shadow-sm" : "text-ink/60 hover:bg-white hover:text-ink"
                )}
              >
                <Icon size={14} className="md:h-4 md:w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
