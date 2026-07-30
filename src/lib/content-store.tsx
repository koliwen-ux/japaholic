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
  ContentItem,
  ContentProposal,
  CoveragePlan,
  CoveragePlanChecklistItem,
} from "@/types";
import {
  createContentItem,
  deleteContentItem,
  updateContentItem as updateContentItemAction,
} from "@/lib/actions/content-items";
import {
  createProposal,
  deleteProposal,
  updateProposal as updateProposalAction,
} from "@/lib/actions/content-proposals";
import {
  createChecklistItem,
  createCoveragePlan,
  deleteChecklistItem,
  deleteCoveragePlan,
  toggleChecklistItem as toggleChecklistItemAction,
  updateCoveragePlan as updateCoveragePlanAction,
} from "@/lib/actions/coverage-plans";

type NewContentItemInput = Omit<ContentItem, "id">;
type ContentItemPatch = Partial<Omit<ContentItem, "id">>;

type NewProposalInput = Omit<ContentProposal, "id">;
type ProposalPatch = Partial<Omit<ContentProposal, "id">>;

type NewCoveragePlanInput = Omit<CoveragePlan, "id" | "checklist">;
type CoveragePlanPatch = Partial<Omit<CoveragePlan, "id" | "checklist">>;

interface ContentStoreValue {
  contentItems: ContentItem[];
  addContentItem: (input: NewContentItemInput) => void;
  updateContentItem: (id: string, patch: ContentItemPatch) => void;
  removeContentItem: (id: string) => void;

  proposals: ContentProposal[];
  addProposal: (input: NewProposalInput) => void;
  updateProposal: (id: string, patch: ProposalPatch) => void;
  removeProposal: (id: string) => void;

  coveragePlans: CoveragePlan[];
  addCoveragePlan: (input: NewCoveragePlanInput) => void;
  updateCoveragePlan: (id: string, patch: CoveragePlanPatch) => void;
  removeCoveragePlan: (id: string) => void;
  addChecklistItem: (planId: string, label: string) => void;
  toggleChecklistItem: (planId: string, itemId: string) => void;
  removeChecklistItem: (planId: string, itemId: string) => void;
}

const ContentStoreContext = createContext<ContentStoreValue | null>(null);

let idCounter = 0;
function generateId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function ContentStoreProvider({
  initialContentItems,
  initialProposals,
  initialCoveragePlans,
  children,
}: {
  initialContentItems: ContentItem[];
  initialProposals: ContentProposal[];
  initialCoveragePlans: CoveragePlan[];
  children: ReactNode;
}) {
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems);
  const [proposals, setProposals] = useState<ContentProposal[]>(initialProposals);
  const [coveragePlans, setCoveragePlans] = useState<CoveragePlan[]>(initialCoveragePlans);

  const addContentItem = useCallback((input: NewContentItemInput) => {
    const item: ContentItem = { id: generateId("content"), ...input };
    setContentItems((prev) => [...prev, item]);
    void createContentItem(item);
  }, []);

  const updateContentItem = useCallback((id: string, patch: ContentItemPatch) => {
    setContentItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    void updateContentItemAction(id, patch);
  }, []);

  const removeContentItem = useCallback((id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    void deleteContentItem(id);
  }, []);

  const addProposal = useCallback((input: NewProposalInput) => {
    const proposal: ContentProposal = { id: generateId("proposal"), ...input };
    setProposals((prev) => [...prev, proposal]);
    void createProposal(proposal);
  }, []);

  const updateProposal = useCallback((id: string, patch: ProposalPatch) => {
    setProposals((prev) => prev.map((proposal) => (proposal.id === id ? { ...proposal, ...patch } : proposal)));
    void updateProposalAction(id, patch);
  }, []);

  const removeProposal = useCallback((id: string) => {
    setProposals((prev) => prev.filter((proposal) => proposal.id !== id));
    void deleteProposal(id);
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

  const value = useMemo(
    () => ({
      contentItems,
      addContentItem,
      updateContentItem,
      removeContentItem,
      proposals,
      addProposal,
      updateProposal,
      removeProposal,
      coveragePlans,
      addCoveragePlan,
      updateCoveragePlan,
      removeCoveragePlan,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
    }),
    [
      contentItems,
      addContentItem,
      updateContentItem,
      removeContentItem,
      proposals,
      addProposal,
      updateProposal,
      removeProposal,
      coveragePlans,
      addCoveragePlan,
      updateCoveragePlan,
      removeCoveragePlan,
      addChecklistItem,
      toggleChecklistItem,
      removeChecklistItem,
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
