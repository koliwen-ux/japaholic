import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { Prefecture, Project } from "@/types";
import { SectionHeading } from "@/components/SectionHeading";

export function ProjectSectionShell({
  prefecture,
  project,
  icon,
  title,
  children,
}: {
  prefecture: Prefecture;
  project: Project;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem]">
      <Link
        href={`/prefecture/${prefecture.id.replace("pref-", "")}/project/${project.id}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm transition-colors hover:bg-ink/5 hover:text-ink md:px-4 md:py-2 md:text-sm"
      >
        <ArrowLeft size={14} className="md:h-4 md:w-4" /> 返回{project.name}
      </Link>

      <div className="mt-6 md:mt-8">
        <SectionHeading icon={icon} title={title} color={prefecture.color} />
        {children}
      </div>
    </div>
  );
}
