/**
 * Debounces per-record field updates (e.g. keystrokes) into a single write per
 * record id. Patches are merged, not replaced, so editing two different fields
 * on the same record within the delay window still persists both — a plain
 * "last call wins" debounce would silently drop the earlier field's edit.
 */
export function createDebouncedPatcher<T extends object>(
  delayMs: number,
  commit: (id: string, patch: Partial<T>) => void
) {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const pending = new Map<string, Partial<T>>();

  return {
    schedule(id: string, patch: Partial<T>) {
      pending.set(id, { ...pending.get(id), ...patch });

      const existing = timers.get(id);
      if (existing) clearTimeout(existing);

      timers.set(
        id,
        setTimeout(() => {
          timers.delete(id);
          const merged = pending.get(id);
          pending.delete(id);
          if (merged) commit(id, merged);
        }, delayMs)
      );
    },
  };
}
