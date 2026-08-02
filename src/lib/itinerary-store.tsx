"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BudgetItem, ItineraryStop } from "@/types";
import { createDebouncedPatcher } from "@/lib/debounce-map";
import {
  createStop,
  deleteStop,
  reorderStops,
  updateStop as updateStopAction,
} from "@/lib/actions/itinerary";
import {
  createBudgetItem,
  deleteBudgetItem,
  updateBudgetItem as updateBudgetItemAction,
} from "@/lib/actions/budget";

interface AddStopInput {
  date: string;
  spotName: string;
  note: string;
  locationId: string;
  transport?: string;
  contentFocus?: string;
  startTime?: string;
  endTime?: string;
}

interface AddBudgetItemInput {
  category: string;
  amount: number;
  note: string;
}

type StopPatch = Partial<
  Pick<ItineraryStop, "spotName" | "note" | "date" | "transport" | "contentFocus" | "startTime" | "endTime">
>;
type BudgetItemPatch = Partial<Pick<BudgetItem, "category" | "amount" | "note">>;

interface ItineraryContextValue {
  stops: ItineraryStop[];
  dates: string[];
  addStop: (input: AddStopInput) => void;
  removeStop: (id: string) => void;
  updateStop: (id: string, patch: StopPatch) => void;
  reorderDate: (date: string, orderedIds: string[]) => void;
  addDate: (date: string) => void;
  stopsForLocation: (locationId: string) => ItineraryStop[];
  budgetItems: BudgetItem[];
  addBudgetItem: (input: AddBudgetItemInput) => void;
  removeBudgetItem: (id: string) => void;
  updateBudgetItem: (id: string, patch: BudgetItemPatch) => void;
  budgetTotal: number;
}

const ItineraryContext = createContext<ItineraryContextValue | null>(null);

let idCounter = 0;
function generateStopId() {
  idCounter += 1;
  return `stop-${Date.now()}-${idCounter}`;
}

let budgetIdCounter = 0;
function generateBudgetId() {
  budgetIdCounter += 1;
  return `budget-${Date.now()}-${budgetIdCounter}`;
}

/** Scoped to a single `Project` — instantiate one per project page, not app-wide. */
export function ItineraryProvider({
  projectId,
  initialStops,
  initialBudgetItems,
  children,
}: {
  projectId: string;
  initialStops: ItineraryStop[];
  initialBudgetItems: BudgetItem[];
  children: ReactNode;
}) {
  const [stops, setStops] = useState<ItineraryStop[]>(initialStops);
  const initialDates = Array.from(new Set(initialStops.map((stop) => stop.date))).sort();
  const [dates, setDates] = useState<string[]>(initialDates);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  const stopPatcher = useRef(
    createDebouncedPatcher<ItineraryStop>(600, (id, patch) => void updateStopAction(id, patch))
  ).current;
  const budgetPatcher = useRef(
    createDebouncedPatcher<BudgetItem>(600, (id, patch) => void updateBudgetItemAction(id, patch))
  ).current;

  const addStop = useCallback(
    (input: AddStopInput) => {
      setDates((prev) => (prev.includes(input.date) ? prev : [...prev, input.date].sort()));
      const stop: ItineraryStop = { id: generateStopId(), projectId, ...input };
      let position = 0;
      setStops((prev) => {
        position = prev.filter((s) => s.date === input.date).length;
        return [...prev, stop];
      });
      void createStop(stop, position);
    },
    [projectId]
  );

  const removeStop = useCallback((id: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));
    void deleteStop(id);
  }, []);

  const updateStop = useCallback(
    (id: string, patch: StopPatch) => {
      setStops((prev) => prev.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)));
      if (patch.date !== undefined) {
        setDates((prev) => (prev.includes(patch.date!) ? prev : [...prev, patch.date!].sort()));
      }
      stopPatcher.schedule(id, patch);
    },
    [stopPatcher]
  );

  const reorderDate = useCallback((date: string, orderedIds: string[]) => {
    setStops((prev) => {
      const others = prev.filter((stop) => stop.date !== date);
      const reordered = orderedIds
        .map((id) => prev.find((stop) => stop.id === id))
        .filter((stop): stop is ItineraryStop => Boolean(stop));
      return [...others, ...reordered];
    });
    void reorderStops(orderedIds);
  }, []);

  const addDate = useCallback((date: string) => {
    setDates((prev) => (prev.includes(date) ? prev : [...prev, date].sort()));
  }, []);

  const stopsForLocation = useCallback(
    (locationId: string) => stops.filter((stop) => stop.locationId === locationId),
    [stops]
  );

  const addBudgetItem = useCallback(
    (input: AddBudgetItemInput) => {
      const item: BudgetItem = { id: generateBudgetId(), projectId, ...input };
      setBudgetItems((prev) => [...prev, item]);
      void createBudgetItem(item);
    },
    [projectId]
  );

  const removeBudgetItem = useCallback((id: string) => {
    setBudgetItems((prev) => prev.filter((item) => item.id !== id));
    void deleteBudgetItem(id);
  }, []);

  const updateBudgetItem = useCallback(
    (id: string, patch: BudgetItemPatch) => {
      setBudgetItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      budgetPatcher.schedule(id, patch);
    },
    [budgetPatcher]
  );

  const budgetTotal = useMemo(
    () => budgetItems.reduce((sum, item) => sum + item.amount, 0),
    [budgetItems]
  );

  const value = useMemo(
    () => ({
      stops,
      dates,
      addStop,
      removeStop,
      updateStop,
      reorderDate,
      addDate,
      stopsForLocation,
      budgetItems,
      addBudgetItem,
      removeBudgetItem,
      updateBudgetItem,
      budgetTotal,
    }),
    [
      stops,
      dates,
      addStop,
      removeStop,
      updateStop,
      reorderDate,
      addDate,
      stopsForLocation,
      budgetItems,
      addBudgetItem,
      removeBudgetItem,
      updateBudgetItem,
      budgetTotal,
    ]
  );

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
}
