import Link from "next/link";
import { ViewPageHeader } from "@/components/ViewPageHeader";
import {
  DateKey,
  formatDayNumber,
  formatShortWeekday,
  isFuture,
  isToday,
} from "@/lib/date";

type WeekRow = {
  dateKey: DateKey;
  completed: number;
  total: number;
};

function progressClass(row: WeekRow): string {
  if (row.completed === 0) return "bg-rose-200/70";

  const ratio = row.total > 0 ? row.completed / row.total : 0;
  if (ratio >= 0.75) return "bg-emerald-600";
  if (ratio > 0.5) return "bg-emerald-300";
  return "bg-lime-300";
}

export function WeekView({
  weekStartLabel,
  rows,
  eyebrow = "This week",
  todayKey,
}: {
  weekStartLabel: string;
  rows: WeekRow[];
  /** e.g. "This week" when viewing the current ISO week, or "Week" otherwise */
  eyebrow?: string;
  todayKey: DateKey;
}) {
  return (
    <section className="flex flex-col gap-8">
      <ViewPageHeader eyebrow={eyebrow} title={weekStartLabel} />

      <ol className="divide-y divide-line-subtle/90 overflow-hidden rounded-xl border border-line-subtle bg-white shadow-soft">
        {rows.map((row) => {
          const future = isFuture(row.dateKey, todayKey);
          const today = isToday(row.dateKey, todayKey);
          const ratio = row.total > 0 ? row.completed / row.total : 0;
          const width = row.completed === 0 && !future ? "0.5rem" : `${Math.round(ratio * 100)}%`;

          return (
            <li key={row.dateKey}>
              <Link
                href={`/day/${row.dateKey}`}
                className={[
                  "flex items-center gap-4 px-5 py-4 transition-colors",
                  future ? "pointer-events-none opacity-60" : "hover:bg-stone-50",
                ].join(" ")}
                aria-disabled={future}
              >
                <div className="w-14 flex-none">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    {formatShortWeekday(row.dateKey)}
                  </p>
                  <p
                    className={[
                      "font-serif text-2xl leading-none",
                      today ? "text-ink" : "text-ink-soft",
                    ].join(" ")}
                  >
                    {formatDayNumber(row.dateKey)}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={[
                        "h-full rounded-full transition-all",
                        progressClass(row),
                      ].join(" ")}
                      style={{ width }}
                    />
                  </div>
                </div>

                <div className="w-16 flex-none text-right font-serif text-sm tabular-nums text-ink-soft">
                  {row.completed}
                  <span className="text-ink-faint">/{row.total}</span>
                </div>

                {today && (
                  <span className="ml-2 rounded-full border border-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-ink">
                    today
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
