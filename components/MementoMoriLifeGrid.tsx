"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

const COLS = 52;
/** Space for one compact year-marker strip above the current row. */
const INDICATOR_RESERVE_PX = 16;
const MIN_CELL_PX = 2;

type Layout = {
  cellPx: number;
  gapPx: number;
};

function computeLayout(
  width: number,
  height: number,
  rowCount: number,
): Layout | null {
  if (width <= 0 || height <= 0 || rowCount <= 0) return null;

  let best: Layout | null = null;

  for (let gapPx = 4; gapPx >= 1; gapPx--) {
    const cw = (width - (COLS - 1) * gapPx) / COLS;
    const ch =
      (height - (rowCount - 1) * gapPx - INDICATOR_RESERVE_PX) / rowCount;
    const cellPx = Math.max(MIN_CELL_PX, Math.floor(Math.min(cw, ch)));

    const totalW = COLS * cellPx + (COLS - 1) * gapPx;
    const totalH =
      rowCount * cellPx + (rowCount - 1) * gapPx + INDICATOR_RESERVE_PX;

    if (totalW <= width + 0.5 && totalH <= height + 0.5) {
      if (
        !best ||
        cellPx > best.cellPx ||
        (cellPx === best.cellPx && gapPx > best.gapPx)
      ) {
        best = { cellPx, gapPx };
      }
    }
  }

  if (best) {
    let { cellPx, gapPx } = best;
    while (true) {
      const next = cellPx + 1;
      const totalW = COLS * next + (COLS - 1) * gapPx;
      const totalH =
        rowCount * next + (rowCount - 1) * gapPx + INDICATOR_RESERVE_PX;
      if (totalW <= width + 0.5 && totalH <= height + 0.5) cellPx = next;
      else break;
    }
    return { cellPx, gapPx };
  }

  const gapPx = 1;
  let cellPx = Math.max(
    MIN_CELL_PX,
    Math.floor(
      Math.min(
        (width - (COLS - 1) * gapPx) / COLS,
        (height - (rowCount - 1) * gapPx - INDICATOR_RESERVE_PX) / rowCount,
      ),
    ),
  );
  while (cellPx >= MIN_CELL_PX) {
    const totalH =
      rowCount * cellPx + (rowCount - 1) * gapPx + INDICATOR_RESERVE_PX;
    const totalW = COLS * cellPx + (COLS - 1) * gapPx;
    if (totalH <= height + 0.5 && totalW <= width + 0.5) {
      return { cellPx, gapPx };
    }
    cellPx -= 1;
  }

  return { cellPx: MIN_CELL_PX, gapPx: 1 };
}

export function MementoMoriLifeGrid({
  totalRows,
  currentWeekIndex,
  weeksLived,
  currentLifeYearRowIndex,
  ageYears,
  weeksLivedLabel,
}: {
  totalRows: number;
  currentWeekIndex: number;
  weeksLived: number;
  currentLifeYearRowIndex: number;
  ageYears: number;
  weeksLivedLabel: string;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  const measure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const laidOut = computeLayout(rect.width, rect.height, totalRows);
    setLayout(laidOut);
  }, [totalRows]);

  useLayoutEffect(() => {
    measure();
    const el = measureRef.current;
    if (!el) return undefined;

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  const years = Array.from({ length: totalRows }, (_, i) => i);

  const gridGapStyle = layout
    ? { gap: layout.gapPx }
    : { gap: "0.25rem" as const };

  return (
    <div
      ref={measureRef}
      className={[
        "w-full min-h-[12rem] shrink-0",
        "max-sm:h-[min(52dvh,400px)] max-sm:overflow-x-hidden max-sm:overflow-y-auto",
        "sm:min-h-0 sm:flex-1 sm:overflow-hidden",
      ].join(" ")}
    >
      <div
        className={[
          "flex w-full flex-col",
          "max-sm:min-h-0",
          "sm:h-full md:h-full",
        ].join(" ")}
      >
        <div
          aria-label={weeksLivedLabel}
          className="mx-auto flex w-max max-w-full flex-col"
          style={gridGapStyle}
        >
          {years.map((y) => {
            const rowStart = y * COLS;
            const isCurrentLifeYearRow = y === currentLifeYearRowIndex;
            return (
              <div key={y} className="flex flex-col">
                {isCurrentLifeYearRow && (
                  <div
                    className="flex w-full items-center gap-1.5 sm:gap-2"
                    style={{
                      marginBottom: layout
                        ? Math.max(1, Math.min(2, layout.gapPx))
                        : 2,
                    }}
                    aria-hidden="true"
                  >
                    <div className="h-px min-h-px min-w-[0.75rem] flex-1 bg-stone-400/28" />
                    <span className="shrink-0 whitespace-nowrap font-serif text-[10px] leading-none text-stone-500/55">
                      {ageYears === 1 ? "1 year" : `${ageYears} years`}
                    </span>
                    <div className="h-px min-h-px min-w-[0.75rem] flex-1 bg-stone-400/28" />
                  </div>
                )}
                <div
                  className="grid w-full max-w-full"
                  style={
                    layout
                      ? {
                          gridTemplateColumns: `repeat(${COLS}, ${layout.cellPx}px)`,
                          gap: layout.gapPx,
                          width: COLS * layout.cellPx + (COLS - 1) * layout.gapPx,
                        }
                      : {
                          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                          gap: "0.25rem",
                        }
                  }
                >
                  {Array.from({ length: COLS }, (_, w) => {
                    const idx = rowStart + w;
                    const isCurrent = idx === currentWeekIndex;
                    const isLived = idx < weeksLived;

                    const base = "box-border rounded-sm border";
                    const tone = isCurrent
                      ? "border-ink bg-ink"
                      : isLived
                        ? "border-stone-500/95 bg-stone-500/88"
                        : "border-stone-200/95 bg-white/90";

                    return (
                      <div
                        key={w}
                        className={[base, tone].join(" ")}
                        style={
                          layout
                            ? {
                                width: layout.cellPx,
                                height: layout.cellPx,
                              }
                            : { aspectRatio: "1" }
                        }
                        aria-hidden="true"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
