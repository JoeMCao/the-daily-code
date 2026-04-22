import Link from "next/link";
import {
  DateKey,
  formatDayNumber,
  formatShortWeekday,
  isFuture,
  isToday,
} from "@/lib/date";
import { majorityComplete } from "@/lib/habits";

type WeekRow = {
  dateKey: DateKey;
  completed: number;
  total: number;
};

export function WeekView({
  weekStartLabel,
  rows,
}: {
  weekStartLabel: string;
  rows: WeekRow[];
}) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
          This week
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink sm:text-4xl">
          {weekStartLabel}
        </h1>
      </div>

      <ol className="divide-y divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft">
        {rows.map((row) => {
          const done = majorityComplete(row);
          const future = isFuture(row.dateKey);
          const today = isToday(row.dateKey);
          const ratio = row.total > 0 ? row.completed / row.total : 0;

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
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
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
                        done ? "bg-emerald-500" : "bg-stone-300",
                      ].join(" ")}
                      style={{ width: `${Math.round(ratio * 100)}%` }}
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
