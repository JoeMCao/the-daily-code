import {
  type DateKey,
  fromDateKey,
  isoWeekNumberForMonday,
  startOfWeek,
  todayKey,
  toDateKey,
  weekKeys,
  weekMondayKeysForCalendarYear,
} from "@/lib/date";
import { getDaySummaries } from "@/lib/habits";
import {
  dayBreakdownFromScores,
  dayCompletionScore,
  weeklyAverageScore,
  yearWeekVisualState,
  type YearWeekVisualState,
} from "@/lib/week-aggregate";

export type YearWeekCell = {
  weekStart: DateKey;
  weekEnd: DateKey;
  /** ISO 8601 week number for this row’s Monday. */
  isoWeek: number;
  score: number;
  visualState: YearWeekVisualState;
  breakdown: { strong: number; partial: number; empty: number };
  dayKeys: DateKey[];
};

export type YearQuarterBlock = {
  quarter: 1 | 2 | 3 | 4;
  rangeLabel: string;
  weeks: YearWeekCell[];
};

export type YearViewData = {
  year: number;
  quarters: YearQuarterBlock[];
  strongWeeksSoFar: number;
};

const QUARTER_LABELS: { quarter: 1 | 2 | 3 | 4; rangeLabel: string }[] = [
  { quarter: 1, rangeLabel: "Jan – Mar" },
  { quarter: 2, rangeLabel: "Apr – Jun" },
  { quarter: 3, rangeLabel: "Jul – Sep" },
  { quarter: 4, rangeLabel: "Oct – Dec" },
];

function quarterIndexForWeek(w: YearWeekCell, year: number): number {
  const prefix = `${year}-`;
  const anchor =
    w.dayKeys.find((k) => k.startsWith(prefix)) ?? w.dayKeys[w.dayKeys.length - 1]!;
  const m = fromDateKey(anchor).getMonth();
  if (m <= 2) return 0;
  if (m <= 5) return 1;
  if (m <= 8) return 2;
  return 3;
}

function buildQuarterBlocks(
  weeks: YearWeekCell[],
  year: number,
): YearQuarterBlock[] {
  const buckets: YearWeekCell[][] = [[], [], [], []];
  for (const w of weeks) {
    buckets[quarterIndexForWeek(w, year)]!.push(w);
  }
  return QUARTER_LABELS.map((meta, i) => ({
    quarter: meta.quarter,
    rangeLabel: meta.rangeLabel,
    weeks: buckets[i]!,
  }));
}

function formatWeekRangeLabel(weekStart: DateKey, weekEnd: DateKey): string {
  const a = fromDateKey(weekStart);
  const b = fromDateKey(weekEnd);
  const sameMonth =
    a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const left = a.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const right = sameMonth
    ? b.toLocaleDateString(undefined, { day: "numeric" })
    : b.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${left}–${right}`;
}

export function weekBoxTitle(cell: YearWeekCell): string {
  const { strong, partial, empty } = cell.breakdown;
  const range = formatWeekRangeLabel(cell.weekStart, cell.weekEnd);
  const base = `W${cell.isoWeek} · ${range} · ${strong} strong, ${partial} partial, ${empty} empty`;
  if (cell.visualState === "future") return `${base} · Upcoming`;
  if (cell.visualState === "missedElapsed")
    return `${base} · Elapsed week, no activity`;
  if (cell.visualState === "notTracked") return `${base} · No days logged`;
  return base;
}

export async function getYearView(year: number): Promise<YearViewData> {
  const mondays = weekMondayKeysForCalendarYear(year);
  const allDayKeys = mondays.flatMap((mon) => weekKeys(fromDateKey(mon)));
  const uniqueKeys = [...new Set(allDayKeys)];
  const summaries = await getDaySummaries(uniqueKeys);

  const now = new Date();
  const currentYear = now.getFullYear();
  const thisWeekMonday = toDateKey(startOfWeek(fromDateKey(todayKey())));
  const today = todayKey();

  const weeks: YearWeekCell[] = mondays.map((mon) => {
    const dayKeys = weekKeys(fromDateKey(mon));
    const daySummaries = dayKeys.map(
      (k) =>
        summaries.get(k) ?? { completed: 0, total: 0, hasEntry: false },
    );
    const touchedWeek = daySummaries.some((s) => s.hasEntry);
    const scores = dayKeys.map((k, i) =>
      dayCompletionScore(daySummaries[i]!, k),
    );
    const score = weeklyAverageScore(scores);
    const breakdown = dayBreakdownFromScores(daySummaries, dayKeys);
    const weekEnd = dayKeys[6]!;
    const visualState = yearWeekVisualState(
      mon,
      weekEnd,
      score,
      today,
      touchedWeek,
    );
    const { week: isoWeek } = isoWeekNumberForMonday(mon);
    return {
      weekStart: mon,
      weekEnd,
      isoWeek,
      score,
      visualState,
      breakdown,
      dayKeys,
    };
  });

  const quarters = buildQuarterBlocks(weeks, year);

  let strongWeeksSoFar = 0;
  if (year > currentYear) {
    strongWeeksSoFar = 0;
  } else if (year < currentYear) {
    strongWeeksSoFar = weeks.filter((w) => w.visualState === "strong").length;
  } else {
    strongWeeksSoFar = weeks.filter(
      (w) => w.visualState === "strong" && w.weekStart <= thisWeekMonday,
    ).length;
  }

  return {
    year,
    quarters,
    strongWeeksSoFar,
  };
}
