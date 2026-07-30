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
  day: number;
  spotName: string;
  note: string;
  locationId: string;
  transport?: string;
  contentFocus?: string;
}

interface AddBudgetItemInput {
  category: string;
  amount: number;
  note: string;
}

type StopPatch = Partial<Pick<ItineraryStop, "spotName" | "note" | "day" | "transport" | "contentFocus">>;
type BudgetItemPatch = Partial<Pick<BudgetItem, "category" | "amount" | "note">>;

interface ItineraryContextValue {
  stops: ItineraryStop[];
  days: number[];
  addStop: (input: AddStopInput) => void;
  removeStop: (id: string) => void;
  updateStop: (id: string, patch: StopPatch) => void;
  reorderDay: (day: number, orderedIds: string[]) => void;
  addDay: () => void;
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

export function ItineraryProvider({
  initialStops,
  initialBudgetItems,
  children,
}: {
  initialStops: ItineraryStop[];
  initialBudgetItems: BudgetItem[];
  children: ReactNode;
}) {
  const [stops, setStops] = useState<ItineraryStop[]>(initialStops);
  const initialDays = Array.from(new Set(initialStops.map((stop) => stop.day))).sort((a, b) => a - b);
  const [days, setDays] = useState<number[]>(initialDays.length ? initialDays : [1]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);

  const stopPatcher = useRef(
    createDebouncedPatcher<ItineraryStop>(600, (id, patch) => void updateStopAction(id, patch))
  ).current;
  const budgetPatcher = useRef(
    createDebouncedPatcher<BudgetItem>(600, (id, patch) => void updateBudgetItemAction(id, patch))
  ).current;

  const addStop = useCallback((input: AddStopInput) => {
    setDays((prev) => (prev.includes(input.day) ? prev : [...prev, input.day].sort((a, b) => a - b)));
    const stop: ItineraryStop = { id: generateStopId(), ...input };
    let position = 0;
    setStops((prev) => {
      position = prev.filter((s) => s.day === input.day).length;
      return [...prev, stop];
    });
    void createStop(stop, position);
  }, []);

  const removeStop = useCallback((id: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));
    void deleteStop(id);
  }, []);

  const updateStop = useCallback(
    (id: string, patch: StopPatch) => {
      setStops((prev) => prev.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)));
      if (patch.day !== undefined) {
        setDays((prev) => (prev.includes(patch.day!) ? prev : [...prev, patch.day!].sort((a, b) => a - b)));
      }
      stopPatcher.schedule(id, patch);
    },
    [stopPatcher]
  );

  const reorderDay = useCallback((day: number, orderedIds: string[]) => {
    setStops((prev) => {
      const others = prev.filter((stop) => stop.day !== day);
      const reordered = orderedIds
        .map((id) => prev.find((stop) => stop.id === id))
        .filter((stop): stop is ItineraryStop => Boolean(stop));
      return [...others, ...reordered];
    });
    void reorderStops(orderedIds);
  }, []);

  const addDay = useCallback(() => {
    setDays((prev) => [...prev, (prev.length ? Math.max(...prev) : 0) + 1]);
  }, []);

  const stopsForLocation = useCallback(
    (locationId: string) => stops.filter((stop) => stop.locationId === locationId),
    [stops]
  );

  const addBudgetItem = useCallback((input: AddBudgetItemInput) => {
    const item: BudgetItem = { id: generateBudgetId(), ...input };
    setBudgetItems((prev) => [...prev, item]);
    void createBudgetItem(item);
  }, []);

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
      days,
      addStop,
      removeStop,
      updateStop,
      reorderDay,
      addDay,
      stopsForLocation,
      budgetItems,
      addBudgetItem,
      removeBudgetItem,
      updateBudgetItem,
      budgetTotal,
    }),
    [
      stops,
      days,
      addStop,
      removeStop,
      updateStop,
      reorderDay,
      addDay,
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
