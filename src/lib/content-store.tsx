"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  CalendarProgress,
  ContentItem,
  CoveragePlan,
  CoveragePlanChecklistItem,
  MediaAsset,
  Project,
} from "@/types";
import {
  createContentItem,
  deleteContentItem,
  reorderContentItems as reorderContentItemsAction,
  updateContentItem as updateContentItemAction,
} from "@/lib/actions/content-items";
import {
  createChecklistItem,
  createCoveragePlan,
  deleteChecklistItem,
  deleteCoveragePlan,
  toggleChecklistItem as toggleChecklistItemAction,
  updateCoveragePlan as updateCoveragePlanAction,
} from "@/lib/actions/coverage-plans";
import {
  createCalendarTask,
  deleteCalendarTask,
  updateCalendarTask as updateCalendarTaskAction,
} from "@/lib/actions/calendar-progress";
import {
  createProject,
  deleteProject,
  updateProject as updateProjectAction,
} from "@/lib/actions/projects";
import {
  createMediaAsset,
  deleteMediaAsset,
  updateMediaAsset as updateMediaAssetAction,
} from "@/lib/actions/media-assets";

type NewContentItemInput = Omit<ContentItem, "id" | "position">;
type ContentItemPatch = Partial<Omit<ContentItem, "id">>;

type NewCoveragePlanInput = Omit<CoveragePlan, "id" | "checklist">;
type CoveragePlanPatch = Partial<Omit<CoveragePlan, "id" | "checklist">>;

type NewCalendarTaskInput = Omit<CalendarProgress, "id" | "completed">;
type CalendarTaskPatch = Partial<Omit<CalendarProgress, "id">>;

type NewProjectInput = Omit<Project, "id">;
type ProjectPatch = Partial<Omit<Project, "id">>;

type NewMediaAssetInput = Omit<MediaAsset, "id">;
type MediaAssetPatch = Partial<Omit<MediaAsset, "id">>;

interface ContentStoreValue {
  contentItems: ContentItem[];
  addContentItem: (input: NewContentItemInput) => void;
  updateContentItem: (id: string, patch: ContentItemPatch) => void;
  removeContentItem: (id: string) => void;
  reorderContentItems: (orderedIds: string[]) => void;

  coveragePlans: CoveragePlan[];
  addCoveragePlan: (input: NewCoveragePlanInput) => void;
  updateCoveragePlan: (id: string, patch: CoveragePlanPatch) => void;
  removeCoveragePlan: (id: string) => void;
  addChecklistItem: (planId: string, label: string) => void;
  toggleChecklistItem: (planId: string, itemId: string) => void;
  removeChecklistItem: (planId: string, itemId: string) => void;

  calendarProgress: CalendarProgress[];
  addCalendarTask: (input: NewCalendarTaskInput) => void;
  updateCalendarTask: (id: string, patch: CalendarTaskPatch) => void;
  toggleCalendarTask: (id: string) => void;
  removeCalendarTask: (id: string) => void;

  projects: Project[];
  addProject: (input: NewProjectInput) => void;
  updateProject: (id: string, patch: ProjectPatch) => void;
  removeProject: (id: string) => void;

  mediaAssets: MediaAsset[];
  addMediaAsset: (input: NewMediaAssetInput) => void;
  updateMediaAsset: (id: string, patch: MediaAssetPatch) => void;
  removeMediaAsset: (id: string) => void;
}

const ContentStoreContext = createContext<ContentStoreValue | null>(null);

let idCounter = 0;
function generateId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function ContentStoreProvider({
  initialContentItems,
  initialCoveragePlans,
  initialCalendarProgress,
  initialProjects,
  initialMediaAssets,
  children,
}: {
  initialContentItems: ContentItem[];
  initialCoveragePlans: CoveragePlan[];
  initialCalendarProgress: CalendarProgress[];
  initialProjects: Project[];
  initialMediaAssets: MediaAsset[];
  children: ReactNode;
}) {
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems);
  const [coveragePlans, setCoveragePlans] = useState<CoveragePlan[]>(initialCoveragePlans);
  const [calendarProgress, setCalendarProgress] = useState<CalendarProgress[]>(initialCalendarProgress);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(initialMediaAssets);

  const addContentItem = useCallback((input: NewContentItemInput) => {
    const id = generateId("content");
    let item: ContentItem | undefined;
    setContentItems((prev) => {
      const position = prev.filter((i) => i.projectId === input.projectId && i.type === input.type).length;
      item = { id, position, ...input };
      return [...prev, item];
    });
    void createContentItem(item as ContentItem);
  }, []);

  const updateContentItem = useCallback((id: string, patch: ContentItemPatch) => {
    setContentItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    void updateContentItemAction(id, patch);
  }, []);

  const reorderContentItems = useCallback((orderedIds: string[]) => {
    setContentItems((prev) => {
      const orderedSet = new Set(orderedIds);
      const reordered = orderedIds
        .map((id) => prev.find((item) => item.id === id))
        .filter((item): item is ContentItem => Boolean(item));
      const others = prev.filter((item) => !orderedSet.has(item.id));
      return [...others, ...reordered];
    });
    void reorderContentItemsAction(orderedIds);
  }, []);

  const removeContentItem = useCallback((id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    void deleteContentItem(id);
  }, []);

  const addCoveragePlan = useCallback((input: NewCoveragePlanInput) => {
    const plan: CoveragePlan = { id: generateId("coverage"), checklist: [], ...input };
    setCoveragePlans((prev) => [...prev, plan]);
    void createCoveragePlan(plan);
  }, []);

  const updateCoveragePlan = useCallback((id: string, patch: CoveragePlanPatch) => {
    setCoveragePlans((prev) => prev.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan)));
    void updateCoveragePlanAction(id, patch);
  }, []);

  const removeCoveragePlan = useCallback((id: string) => {
    setCoveragePlans((prev) => prev.filter((plan) => plan.id !== id));
    void deleteCoveragePlan(id);
  }, []);

  const addChecklistItem = useCallback((planId: string, label: string) => {
    const item: CoveragePlanChecklistItem = { id: generateId("shot"), label, done: false };
    setCoveragePlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, checklist: [...plan.checklist, item] } : plan))
    );
    void createChecklistItem(planId, item);
  }, []);

  const toggleChecklistItem = useCallback((planId: string, itemId: string) => {
    let nextDone = false;
    setCoveragePlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              checklist: plan.checklist.map((item) => {
                if (item.id !== itemId) return item;
                nextDone = !item.done;
                return { ...item, done: nextDone };
              }),
            }
          : plan
      )
    );
    void toggleChecklistItemAction(itemId, nextDone);
  }, []);

  const removeChecklistItem = useCallback((planId: string, itemId: string) => {
    setCoveragePlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, checklist: plan.checklist.filter((item) => item.id !== itemId) }
          : plan
      )
    );
    void deleteChecklistItem(itemId);
  }, []);

  const addCalendarTask = useCallback((input: NewCalendarTaskInput) => {
    const task: CalendarProgress = { id: generateId("cal"), completed: false, ...input };
    setCalendarProgress((prev) => [...prev, task]);
    void createCalendarTask(task);
  }, []);

  const updateCalendarTask = useCallback((id: string, patch: CalendarTaskPatch) => {
    setCalendarProgress((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)));
    void updateCalendarTaskAction(id, patch);
  }, []);

  const toggleCalendarTask = useCallback((id: string) => {
    let nextCompleted = false;
    setCalendarProgress((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        nextCompleted = !task.completed;
        return { ...task, completed: nextCompleted };
      })
    );
    void updateCalendarTaskAction(id, { completed: nextCompleted });
  }, []);

  const removeCalendarTask = useCallback((id: string) => {
    setCalendarProgress((prev) => prev.filter((task) => task.id !== id));
    void deleteCalendarTask(id);
  }, []);

  const addProject = useCallback((input: NewProjectInput) => {
    const project: Project = { id: generateId("project"), ...input };
    setProjects((prev) => [...prev, project]);
    void createProject(project);
  }, []);

  const updateProject = useCallback((id: string, patch: ProjectPatch) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...patch } : project)));
    void updateProjectAction(id, patch);
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    void deleteProject(id);
  }, []);

  const addMediaAsset = useCallback((input: NewMediaAssetInput) => {
    const asset: MediaAsset = { id: generateId("media"), ...input };
    setMediaAssets((prev) => [...prev, asset]);
    void createMediaAsset(asset);
  }, []);

  const updateMediaAsset = useCallback((id: string, patch: MediaAssetPatch) => {
    setMediaAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)));
    void updateMediaAssetAction(id, patch);
  }, []);

  const removeMediaAsset = useCallback((id: string) => {
    setMediaAssets((prev) => prev.filter((asset) => asset.id !== id));
    void deleteMediaAsset(id);
  }, []);

  const value = useMemo(
    () => ({
      contentItems,
      addContentItem,
      updateContentItem,
      removeContentItem,
      reorderContentItems,
      coveragePlans,
      addCoveragePlan,
      updateCoveragePlan,
      removeCoveragePlan,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
      calendarProgress,
      addCalendarTask,
      updateCalendarTask,
      toggleCalendarTask,
      removeCalendarTask,
      projects,
      addProject,
      updateProject,
      removeProject,
      mediaAssets,
      addMediaAsset,
      updateMediaAsset,
      removeMediaAsset,
    }),
    [
      contentItems,
      addContentItem,
      updateContentItem,
      removeContentItem,
      reorderContentItems,
      coveragePlans,
      addCoveragePlan,
      updateCoveragePlan,
      removeCoveragePlan,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
      calendarProgress,
      addCalendarTask,
      updateCalendarTask,
      toggleCalendarTask,
      removeCalendarTask,
      projects,
      addProject,
      updateProject,
      removeProject,
      mediaAssets,
      addMediaAsset,
      updateMediaAsset,
      removeMediaAsset,
    ]
  );

  return <ContentStoreContext.Provider value={value}>{children}</ContentStoreContext.Provider>;
}

export function useContentStore() {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error("useContentStore must be used within a ContentStoreProvider");
  }
  return context;
}
