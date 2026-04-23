import Link from "next/link";
import {
  ViewPageHeader,
  viewFooterChrome,
  viewLegendSwatches,
} from "@/components/ViewPageHeader";
import type { YearViewData, YearWeekCell } from "@/lib/year-view";
import { weekBoxTitle } from "@/lib/year-view";
import type { YearWeekVisualState } from "@/lib/week-aggregate";

const CELL_FRAME =
  "relative block rounded-xl border text-left transition-[background-color,border-color,opacity] duration-200 focus:outline-none focus:ring-2 focus:ring-ink/15 aspect-square min-h-[2.25rem] w-full min-w-0 sm:min-h-[2.75rem]";

/** Elapsed week with no completions — subtle stripes, calm not punitive. */
const MISSED_BG_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(-52deg, rgb(245 245 244) 0 8px, rgb(214 211 209 / 0.42) 8px 9px)",
} as const;

function classesForVisualState(v: YearWeekVisualState): string {
  switch (v) {
    case "future":
      return [
        CELL_FRAME,
        "pointer-events-none cursor-default border-line-subtle/55 bg-white/85",
      ].join(" ");
    case "strong":
      return [
        CELL_FRAME,
        "border-emerald-600/35 bg-emerald-500/90 hover:bg-emerald-500",
      ].join(" ");
    case "mixed":
      return [
        CELL_FRAME,
        "border-emerald-700/40 bg-emerald-400/95 hover:bg-emerald-400",
      ].join(" ");
    case "light":
      return [
        CELL_FRAME,
        "border-line-subtle bg-stone-100 hover:border-stone-300/70 hover:bg-stone-100/95",
      ].join(" ");
    case "missedElapsed":
      return [
        CELL_FRAME,
        "border-stone-400/55 hover:border-stone-500/45",
      ].join(" ");
    case "notTracked":
      return [
        CELL_FRAME,
        "border-line-subtle/95 bg-paper hover:border-line hover:bg-stone-50/75",
      ].join(" ");
  }
}

function weekNumberClass(v: YearWeekVisualState): string {
  const base =
    "pointer-events-none absolute left-1.5 top-1 font-serif text-[10px] tabular-nums leading-none";
  switch (v) {
    case "strong":
      return `${base} text-white/80`;
    case "mixed":
      return `${base} text-emerald-950/45`;
    case "light":
      return `${base} text-stone-500`;
    case "missedElapsed":
      return `${base} text-stone-500/85`;
    case "notTracked":
      return `${base} text-stone-400/90`;
    case "future":
      return `${base} text-ink-faint/70`;
  }
}

function WeekCell({ cell }: { cell: YearWeekCell }) {
  const title = weekBoxTitle(cell);
  const href = `/week?start=${cell.weekStart}`;
  const numCls = weekNumberClass(cell.visualState);

  if (cell.visualState === "future") {
    return (
      <span
        title={title}
        aria-label={title}
        className={classesForVisualState("future")}
      >
        <span className={numCls}>{cell.isoWeek}</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      className={classesForVisualState(cell.visualState)}
      style={
        cell.visualState === "missedElapsed" ? MISSED_BG_STYLE : undefined
      }
    >
      <span className={numCls}>{cell.isoWeek}</span>
    </Link>
  );
}

function LegendSwatch({ variant }: { variant: YearWeekVisualState }) {
  switch (variant) {
    case "future":
      return (
        <span className="h-3 w-3 rounded-sm border border-line-subtle/60 bg-white/90" />
      );
    case "strong":
      return (
        <span className="h-3 w-3 rounded-sm border border-emerald-600/35 bg-emerald-500" />
      );
    case "mixed":
      return (
        <span className="h-3 w-3 rounded-sm border border-emerald-700/40 bg-emerald-400" />
      );
    case "light":
      return (
        <span className="h-3 w-3 rounded-sm border border-line-subtle bg-stone-100" />
      );
    case "missedElapsed":
      return (
        <span
          className="h-3 w-3 rounded-sm border border-stone-400/50"
          style={MISSED_BG_STYLE}
        />
      );
    case "notTracked":
      return (
        <span className="h-3 w-3 rounded-sm border border-line-subtle/95 bg-paper" />
      );
    default:
      return (
        <span className="h-3 w-3 rounded-sm border border-line-subtle bg-paper" />
      );
  }
}

export function YearView({ data }: { data: YearViewData }) {
  const summary =
    data.strongWeeksSoFar === 0
      ? null
      : `${data.strongWeeksSoFar} strong ${data.strongWeeksSoFar === 1 ? "week" : "weeks"} so far`;

  return (
    <section className="flex flex-col gap-8">
      <ViewPageHeader
        eyebrow="A year in weeks"
        title={data.year}
        meta={
          summary ? (
            <p className="font-serif text-sm italic text-ink-soft sm:text-right">
              {summary}
            </p>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-8">
        {data.quarters.map((block) => (
          <div
            key={block.quarter}
            className="grid grid-cols-1 gap-3 border-t border-line-subtle pt-8 first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-6 sm:gap-y-0"
          >
            <div className="grid min-w-0 grid-cols-7 gap-1.5 sm:gap-2">
              {block.weeks.map((cell) => (
                <WeekCell key={cell.weekStart} cell={cell} />
              ))}
            </div>
            <aside className="flex flex-col gap-0.5 border-t border-line-subtle pt-3 sm:border-t-0 sm:pt-0.5 sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                Q{block.quarter}
              </p>
              <p className="text-[11px] leading-snug text-ink-faint">
                {block.rangeLabel}
              </p>
            </aside>
          </div>
        ))}
      </div>

      <div className={viewFooterChrome}>
        <div className={viewLegendSwatches}>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="strong" /> Strong
          </span>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="mixed" /> Mixed
          </span>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="light" /> Light
          </span>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="missedElapsed" /> Missed
          </span>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="notTracked" /> Not tracked
          </span>
          <span className="flex items-center gap-2">
            <LegendSwatch variant="future" /> Future
          </span>
        </div>
      </div>
    </section>
  );
}
