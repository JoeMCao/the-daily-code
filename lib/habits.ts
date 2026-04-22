import { prisma } from "@/lib/prisma";
import {
  DateKey,
  dateKeyToUtc,
  utcToDateKey,
} from "@/lib/date";
import type { Habit } from "@prisma/client";

export type HabitWithCheck = Habit & {
  completed: boolean;
  completedAt: Date | null;
};

export type DayData = {
  dateKey: DateKey;
  habits: HabitWithCheck[];
  completedCount: number;
  totalCount: number;
};

export async function getActiveHabits(): Promise<Habit[]> {
  return prisma.habit.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

/**
 * Ensures a DayEntry + HabitChecks exist for the given date, then returns the
 * list of active habits with their check state for that date.
 */
export async function ensureDay(dateKey: DateKey): Promise<DayData> {
  const habits = await getActiveHabits();
  const dbDate = dateKeyToUtc(dateKey);

  const day = await prisma.dayEntry.upsert({
    where: { date: dbDate },
    create: { date: dbDate },
    update: {},
    include: { checks: true },
  });

  const existing = new Set(day.checks.map((c) => c.habitId));
  const missing = habits.filter((h) => !existing.has(h.id));

  if (missing.length > 0) {
    await prisma.habitCheck.createMany({
      data: missing.map((h) => ({
        dayEntryId: day.id,
        habitId: h.id,
        completed: false,
      })),
      skipDuplicates: true,
    });
  }

  const checks = await prisma.habitCheck.findMany({
    where: { dayEntryId: day.id },
  });
  const byHabit = new Map(checks.map((c) => [c.habitId, c]));

  const merged: HabitWithCheck[] = habits.map((h) => {
    const c = byHabit.get(h.id);
    return {
      ...h,
      completed: c?.completed ?? false,
      completedAt: c?.completedAt ?? null,
    };
  });

  const completedCount = merged.filter((h) => h.completed).length;

  return {
    dateKey,
    habits: merged,
    completedCount,
    totalCount: habits.length,
  };
}

/**
 * Lightweight read used by week/month views. Does NOT create missing rows.
 * Returns a map of DateKey -> { completed, total } for all given keys.
 */
export async function getDaySummaries(
  keys: DateKey[],
): Promise<Map<DateKey, { completed: number; total: number }>> {
  if (keys.length === 0) return new Map();

  const habits = await getActiveHabits();
  const totalActive = habits.length;

  const utcDates = keys.map(dateKeyToUtc);
  const entries = await prisma.dayEntry.findMany({
    where: { date: { in: utcDates } },
    include: {
      checks: {
        where: { completed: true, habit: { isActive: true } },
      },
    },
  });

  const map = new Map<DateKey, { completed: number; total: number }>();
  for (const k of keys) {
    map.set(k, { completed: 0, total: totalActive });
  }
  for (const e of entries) {
    const k = utcToDateKey(e.date);
    map.set(k, { completed: e.checks.length, total: totalActive });
  }
  return map;
}

export type MonthDaySummary = {
  dateKey: DateKey;
  completed: number;
  total: number;
};

export function majorityComplete(s: { completed: number; total: number }): boolean {
  return s.total > 0 && s.completed > s.total / 2;
}
