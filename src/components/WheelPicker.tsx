"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WheelPickerOption {
  value: string;
  label: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PAD = (ITEM_HEIGHT * (VISIBLE_COUNT - 1)) / 2;

/** A compact vertical scroll-snap picker (iOS-style wheel) for a small set of options. */
export function WheelPicker({
  options,
  value,
  onChange,
}: {
  options: WheelPickerOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollIndex, setScrollIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));

  const scrollToIndex = useCallback((index: number, smooth: boolean) => {
    const container = containerRef.current;
    if (!container) return;
    isProgrammatic.current = true;
    container.scrollTo({ top: index * ITEM_HEIGHT, behavior: smooth ? "smooth" : "auto" });
    window.setTimeout(
      () => {
        isProgrammatic.current = false;
      },
      smooth ? 350 : 0
    );
  }, []);

  useEffect(() => {
    // The resulting native "scroll" event (fired even for instant scrollTo)
    // is what updates scrollIndex via handleScroll — no need to set it here.
    const index = Math.max(0, options.findIndex((o) => o.value === value));
    scrollToIndex(index, false);
    // Only re-sync when the selected value changes externally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    setScrollIndex(container.scrollTop / ITEM_HEIGHT);

    if (isProgrammatic.current) return;
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(() => {
      const index = Math.min(options.length - 1, Math.max(0, Math.round(container.scrollTop / ITEM_HEIGHT)));
      scrollToIndex(index, true);
      const option = options[index];
      if (option && option.value !== value) onChange(option.value);
    }, 100);
  };

  return (
    <div className="relative w-full max-w-[180px]" style={{ height: CONTAINER_HEIGHT }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 rounded-xl bg-mint/25"
        aria-hidden
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: PAD, paddingBottom: PAD }}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - scrollIndex);
          const opacity = Math.max(0.25, 1 - distance * 0.45);
          const scale = Math.max(0.82, 1 - distance * 0.1);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                scrollToIndex(index, true);
              }}
              className="flex w-full snap-center items-center justify-center text-ink transition-transform"
              style={{
                height: ITEM_HEIGHT,
                opacity,
                transform: `scale(${scale})`,
                fontWeight: distance < 0.5 ? 700 : 500,
                fontSize: distance < 0.5 ? "0.9375rem" : "0.875rem",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
