"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useContentStore } from "@/lib/content-store";
import type { Prefecture, Project } from "@/types";
import { ProjectForm, splitCommas, toFormValue } from "@/components/ProjectForm";

function ProjectRow({ prefecture, project }: { prefecture: Prefecture; project: Project }) {
  const { updateProject, removeProject } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <li className="overflow-hidden rounded-2xl bg-white/70 shadow-sm">
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
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm md:p-5">
      <Link
        href={`/prefecture/${prefecture.id.replace("pref-", "")}/project/${project.id}`}
        className="min-w-0 flex-1"
      >
        <p className="text-base font-bold text-ink md:text-lg">{project.name}</p>
        {project.assignees.length > 0 && (
          <p className="mt-0.5 text-xs text-ink/50 md:text-sm">執行者：{project.assignees.join("、")}</p>
        )}
        {project.notes && <p className="mt-1 text-sm text-ink/60 md:text-base">{project.notes}</p>}
      </Link>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label="編輯專案"
        className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Pencil size={14} className="md:h-4 md:w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`確定要刪除「${project.name}」嗎？這會一併刪除其下所有內容規劃、進度月曆、取材安排與行程預算，無法復原。`)) {
            removeProject(project.id);
          }
        }}
        aria-label="刪除專案"
        className="shrink-0 rounded-full p-1.5 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <Trash2 size={14} className="md:h-4 md:w-4" />
      </button>
    </li>
  );
}

export function PrefectureProjectSection({ prefecture }: { prefecture: Prefecture }) {
  const { projects, addProject } = useContentStore();
  const [isAdding, setIsAdding] = useState(false);

  const relatedProjects = projects.filter((project) => project.prefectureId === prefecture.id);

  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/10 md:px-3 md:py-1.5 md:text-sm"
        >
          <Plus size={12} className="md:h-3.5 md:w-3.5" /> 新增專案
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 overflow-hidden rounded-2xl bg-white/70 shadow-sm">
          <ProjectForm
            initial={toFormValue()}
            submitLabel="新增"
            onCancel={() => setIsAdding(false)}
            onSubmit={(value) => {
              addProject({
                prefectureId: prefecture.id,
                name: value.name.trim(),
                assignees: splitCommas(value.assignees),
                notes: value.notes.trim() || undefined,
              });
              setIsAdding(false);
            }}
          />
        </div>
      )}

      {relatedProjects.length === 0 ? (
        <p className="text-sm text-ink/40 md:text-base">目前尚無專案，點擊「新增專案」開始規劃取材出差。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {relatedProjects.map((project) => (
            <ProjectRow key={project.id} prefecture={prefecture} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}
