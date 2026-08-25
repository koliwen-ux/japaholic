"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck2,
  ClipboardList,
  Compass,
  MapPinned,
  Pencil,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Prefecture, Project } from "@/types";
import { iconMap } from "@/lib/icons";
import { useContentStore } from "@/lib/content-store";
import { ProjectForm, splitCommas, toFormValue } from "@/components/ProjectForm";

const sections: { slug: string; icon: LucideIcon; title: string; description: string }[] = [
  { slug: "itinerary", icon: MapPinned, title: "行程規劃", description: "每日行程、交通與時間安排" },
  { slug: "content", icon: ClipboardList, title: "內容規劃", description: "文章、YouTube、SNS 企劃與發布排程" },
  { slug: "calendar", icon: CalendarCheck2, title: "進度月曆", description: "追蹤任務與發布／取材日期總覽" },
  { slug: "budget", icon: Wallet, title: "預算規劃", description: "費用項目與總預算試算" },
  { slug: "coverage", icon: Compass, title: "取材安排", description: "景點、時間、地址與拍攝檢查清單" },
];

export function ProjectDetail({
  prefecture,
  project: initialProject,
}: {
  prefecture: Prefecture;
  project: Project;
}) {
  const Icon = iconMap[prefecture.icon] ?? Compass;
  const basePath = `/prefecture/${prefecture.id.replace("pref-", "")}/project/${initialProject.id}`;
  const { projects, updateProject } = useContentStore();
  const project = projects.find((item) => item.id === initialProject.id) ?? initialProject;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full max-w-3xl md:max-w-4xl">
      <Link
        href={`/prefecture/${prefecture.id.replace("pref-", "")}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/60 shadow-sm transition-colors hover:bg-ink/5 hover:text-ink md:px-4 md:py-2 md:text-sm"
      >
        <ArrowLeft size={14} className="md:h-4 md:w-4" /> 返回{prefecture.name}
      </Link>

      {isEditing ? (
        <div className="mt-5 overflow-hidden rounded-3xl bg-white/70 shadow-sm md:mt-6">
          <ProjectForm
            initial={toFormValue(project)}
            submitLabel="儲存"
            onCancel={() => setIsEditing(false)}
            onSubmit={(value) => {
              updateProject(project.id, {
                name: value.name.trim(),
                assignees: splitCommas(value.assignees),
                notes: value.notes.trim() || undefined,
              });
              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <div
          className="mt-5 flex items-start gap-4 rounded-3xl p-5 md:mt-6 md:p-6"
          style={{ backgroundColor: `${prefecture.color}26` }}
        >
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-ink shadow-sm md:h-20 md:w-20"
            style={{ backgroundColor: prefecture.color }}
          >
            <Icon size={32} strokeWidth={2} className="md:h-9 md:w-9" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black text-ink md:text-3xl">{project.name}</h1>
            <p className="text-sm text-ink/50 md:text-base">
              {prefecture.name}
              {project.assignees.length > 0 ? `・執行者：${project.assignees.join("、")}` : ""}
            </p>
            {project.notes && <p className="mt-2 text-sm text-ink/70 md:text-base">{project.notes}</p>}
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="編輯專案"
            className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
          >
            <Pencil size={14} className="md:h-4 md:w-4" />
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-10 md:gap-4">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Link
              key={section.slug}
              href={`${basePath}/${section.slug}`}
              className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 shadow-sm transition-colors hover:bg-white md:gap-4 md:p-5"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink md:h-12 md:w-12"
                style={{ backgroundColor: `${prefecture.color}33` }}
              >
                <SectionIcon size={20} className="md:h-6 md:w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold text-ink md:text-lg">{section.title}</p>
                <p className="mt-0.5 text-xs text-ink/50 md:text-sm">{section.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
