import Link from "next/link";
import {
  ViewPageHeader,
  viewFooterChrome,
  viewLegendSwatches,
} from "@/components/ViewPageHeader";
import {
  DateKey,
  formatDayNumber,
  isFuture,
  isSameMonth,
  isToday,
} from "@/lib/date";
import { majorityComplete } from "@/lib/habits";

export type MonthCell = {
  dateKey: DateKey;
  completed: number;
  total: number;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({
  anchorISO,
  monthLabel,
  cells,
  totalsLabel,
}: {
  anchorISO: string;
  monthLabel: string;
  cells: MonthCell[];
  totalsLabel: string;
}) {
  const anchor = new Date(anchorISO);

  return (
    <section className="flex flex-col gap-8">
      <ViewPageHeader
        eyebrow="This month"
        title={monthLabel}
        meta={
          <p className="font-serif text-sm italic text-ink-soft">{totalsLabel}</p>
        }
      />

      <div>
        <div className="mb-2 grid grid-cols-7 gap-2 px-1 text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell) => {
            const sameMonth = isSameMonth(cell.dateKey, anchor);
            const done = majorityComplete(cell);
            const empty = cell.completed === 0;
            const future = isFuture(cell.dateKey);
            const today = isToday(cell.dateKey);

            const base =
              "relative aspect-square rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-ink/20";

            const tone = done
              ? "border-emerald-300 bg-emerald-500/90 text-white hover:bg-emerald-500"
                : empty
                ? "border-line-subtle bg-white hover:border-stone-300/70"
                : "border-line-subtle bg-stone-100 hover:bg-stone-200/70";

            const ghost = !sameMonth ? "opacity-40" : "";
            const disabled = future ? "pointer-events-none opacity-50" : "";

            return (
              <Link
                key={cell.dateKey}
                href={`/day/${cell.dateKey}`}
                className={[base, tone, ghost, disabled].join(" ")}
                aria-label={`${cell.dateKey}: ${cell.completed} of ${cell.total} habits`}
              >
                <span
                  className={[
                    "absolute left-2 top-1.5 font-serif text-[13px] tabular-nums",
                    done ? "text-white/90" : "text-ink-soft",
                  ].join(" ")}
                >
                  {formatDayNumber(cell.dateKey)}
                </span>
                {today && (
                  <span
                    aria-hidden
                    className={[
                      "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
                      done ? "bg-white" : "bg-ink",
                    ].join(" ")}
                  />
                )}
                {cell.completed > 0 && !done && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-stone-400/60"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className={viewFooterChrome}>
        <div className={viewLegendSwatches}>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Majority complete
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-stone-200" /> Partial
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-line-subtle bg-white" />
            None
          </span>
        </div>
      </div>
    </section>
  );
}
