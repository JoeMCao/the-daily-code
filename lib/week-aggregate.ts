import type { DateKey } from "@/lib/date";
import { isFuture, todayKey } from "@/lib/date";
import { majorityComplete } from "@/lib/habits";

export type WeekTier = "strong" | "mixed" | "weak" | "empty";

/** Per-day score: majority = 1, partial = 0.5, none = 0. Future days = 0. */
export function dayCompletionScore(
  summary: { completed: number; total: number },
  dateKey: DateKey,
  today: DateKey = todayKey(),
): number {
  if (isFuture(dateKey, today)) return 0;
  if (summary.total <= 0) return 0;
  if (majorityComplete(summary)) return 1;
  if (summary.completed > 0) return 0.5;
  return 0;
}

export function weeklyAverageScore(dayScores: number[]): number {
  if (dayScores.length === 0) return 0;
  return dayScores.reduce((a, b) => a + b, 0) / dayScores.length;
}

export function tierFromWeeklyScore(score: number): WeekTier {
  if (score >= 0.75) return "strong";
  if (score >= 0.4) return "mixed";
  if (score >= 0.1) return "weak";
  return "empty";
}

/** Year grid: time-aware states (future vs elapsed, honest empty weeks). */
export type YearWeekVisualState =
  | "future"
  | "strong"
  | "mixed"
  | "light"
  | "missedElapsed"
  | "notTracked";

/**
 * - Future: week starts after today (untouched time ahead).
 * - Strong / mixed / light: from weekly score once the week has begun.
 * - Missed: week fully ended, score 0, but at least one day has a DayEntry.
 * - Not tracked: week fully ended, score 0, no DayEntry on any day (quiet / before use).
 * - In-progress week with score 0: light (soft gray), not “missed” yet.
 */
export function yearWeekVisualState(
  weekStart: DateKey,
  weekEnd: DateKey,
  weeklyScore: number,
  today: DateKey,
  touchedWeek: boolean,
): YearWeekVisualState {
  if (weekStart > today) return "future";
  if (weeklyScore >= 0.75) return "strong";
  if (weeklyScore >= 0.4) return "mixed";
  if (weeklyScore > 0) return "light";
  if (weekEnd < today) {
    return touchedWeek ? "missedElapsed" : "notTracked";
  }
  return "light";
}

export type DayBreakdown = { strong: number; partial: number; empty: number };

export function dayBreakdownFromScores(
  summaries: { completed: number; total: number }[],
  keys: DateKey[],
  today: DateKey,
): DayBreakdown {
  const out: DayBreakdown = { strong: 0, partial: 0, empty: 0 };
  for (let i = 0; i < keys.length; i++) {
    const s = summaries[i] ?? { completed: 0, total: 0 };
    const k = keys[i];
    if (!k) continue;
    const sc = dayCompletionScore(s, k, today);
    if (sc >= 1) out.strong += 1;
    else if (sc >= 0.5) out.partial += 1;
    else out.empty += 1;
  }
  return out;
}
