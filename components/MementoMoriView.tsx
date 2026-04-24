import Link from "next/link";
import { MementoMoriLifeGrid } from "@/components/MementoMoriLifeGrid";
import { QuoteBlock } from "@/components/QuoteBlock";
import {
  ViewPageHeader,
  viewFooterChrome,
  viewLegendSwatches,
} from "@/components/ViewPageHeader";
import type { DateKey } from "@/lib/date";
import type { LifeWeekSummary } from "@/lib/profile";
import type { Profile } from "@/lib/profile";
import { quoteForDate } from "@/lib/quotes";

function fmt(n: number): string {
  return n.toLocaleString();
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <span className="font-serif text-2xl tabular-nums text-ink">
        {value}
      </span>
    </div>
  );
}

export function MementoMoriView({
  profile,
  summary,
  todayKey,
}: {
  profile: Profile;
  summary: LifeWeekSummary;
  todayKey: DateKey;
}) {
  const rows = summary.assumedLifespanYears;
  const quote = quoteForDate(todayKey, "memento");

  return (
    <section className="flex min-h-0 flex-col gap-6 sm:flex-1">
      <div className="shrink-0">
        <ViewPageHeader eyebrow="Memento mori" title="Your life" />
      </div>

      <div className="shrink-0">
        <QuoteBlock
          text={quote.text}
          attribution={quote.attribution}
          variant="memento"
        />
      </div>

      <div className="shrink-0 max-w-xl font-serif text-base italic leading-relaxed text-ink-soft">
        <p>Each square is one week.</p>
        <p className="mt-2">The empty ones are not promised.</p>
      </div>

      <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
        <SummaryStat label="Age" value={`${summary.ageYears}`} />
        <SummaryStat label="Weeks lived" value={fmt(summary.weeksLived)} />
        <SummaryStat label="Weeks remaining" value={fmt(summary.weeksRemaining)} />
        <SummaryStat
          label="Assumed lifespan"
          value={`${summary.assumedLifespanYears} yrs`}
        />
      </dl>

      <MementoMoriLifeGrid
        totalRows={rows}
        currentWeekIndex={summary.currentWeekIndex}
        weeksLived={summary.weeksLived}
        currentLifeYearRowIndex={summary.currentLifeYearRowIndex}
        ageYears={summary.ageYears}
        weeksLivedLabel={`Life grid: ${summary.weeksLived} of ${summary.totalLifeWeeks} weeks lived`}
      />

      <div
        className={[
          viewFooterChrome,
          "flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        ].join(" ")}
      >
        <div className={viewLegendSwatches}>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-stone-500/95 bg-stone-500/88" />
            Lived
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-ink" />
            This week
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-stone-200/95 bg-white/90" />
            Ahead
          </span>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto">
          {profile.name && (
            <span className="font-serif text-sm italic text-ink-soft">
              — {profile.name}
            </span>
          )}
          <Link
            href="/memento-mori?edit=1"
            className="text-xs uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink-soft"
          >
            Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
