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

export type MonthCell = {
  dateKey: DateKey;
  completed: number;
  total: number;
  hasEntry: boolean;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CompletionTone = "strong" | "steady" | "partial" | "missed" | "notTracked";

function completionTone(cell: MonthCell): CompletionTone {
  if (!cell.hasEntry && cell.completed === 0) return "notTracked";
  if (cell.completed === 0) return "missed";

  const ratio = cell.total > 0 ? cell.completed / cell.total : 0;
  if (ratio >= 0.75) return "strong";
  if (ratio > 0.5) return "steady";
  return "partial";
}

function classesForTone(tone: CompletionTone): string {
  switch (tone) {
    case "strong":
      return "border-emerald-700/30 bg-emerald-600/85 text-white hover:bg-emerald-600";
    case "steady":
      return "border-emerald-700/20 bg-emerald-300/80 text-emerald-950 hover:bg-emerald-300/90";
    case "partial":
      return "border-lime-700/20 bg-lime-100/90 text-lime-950 hover:bg-lime-100";
    case "missed":
      return "border-rose-200/50 bg-rose-50/55 text-rose-950 hover:bg-rose-50";
    case "notTracked":
      return "border-line-subtle bg-white hover:border-stone-300/70";
  }
}

function markerClassForTone(tone: CompletionTone): string {
  if (tone === "steady") return "bg-emerald-700/35";
  if (tone === "partial") return "bg-lime-700/35";
  return "";
}

export function MonthView({
  anchorISO,
  monthLabel,
  cells,
  totalsLabel,
  todayKey,
}: {
  anchorISO: string;
  monthLabel: string;
  cells: MonthCell[];
  totalsLabel: string;
  todayKey: DateKey;
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
            const future = isFuture(cell.dateKey, todayKey);
            const today = isToday(cell.dateKey, todayKey);
            const toneName = completionTone(cell);
            const strong = toneName === "strong";
            const marker = markerClassForTone(toneName);

            const base =
              "relative aspect-square rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-ink/20";
            const tone = classesForTone(toneName);

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
                    strong ? "text-white/90" : "text-ink-soft",
                  ].join(" ")}
                >
                  {formatDayNumber(cell.dateKey)}
                </span>
                {today && (
                  <span
                    aria-hidden
                    className={[
                      "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
                      strong ? "bg-white" : "bg-ink",
                    ].join(" ")}
                  />
                )}
                {marker && (
                  <span
                    aria-hidden
                    className={[
                      "absolute bottom-1.5 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full",
                      marker,
                    ].join(" ")}
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
            <span className="h-3 w-3 rounded-sm border border-emerald-700/30 bg-emerald-600" />
            Strong
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-lime-700/20 bg-lime-100" />
            Partial
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-rose-200/50 bg-rose-50/55" />
            Missed
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-line-subtle bg-white" />
            Not tracked
          </span>
        </div>
      </div>
    </section>
  );
}
