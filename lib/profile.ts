import { prisma } from "@/lib/prisma";

/**
 * Persisted profile row — mirrors `model Profile` in prisma/schema.prisma.
 * Declared here (not `import type { Profile } from "@prisma/client"`) because
 * some TS/IDE setups fail to resolve Prisma’s generated model type re-exports.
 */
export type Profile = {
  id: string;
  name: string | null;
  dateOfBirth: Date;
  assumedLifespanYears: number;
  createdAt: Date;
  updatedAt: Date;
};

// We intentionally treat a single active profile as "the" profile for now.
// This layer is shaped so that a future `userId` / `ownerId` argument can be
// threaded through without changing call sites far away.

export const DEFAULT_ASSUMED_LIFESPAN = 88;
export const MIN_ASSUMED_LIFESPAN = 20;
export const MAX_ASSUMED_LIFESPAN = 130;

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Load the single active profile, or null if none exists yet. */
export async function getCurrentProfile(): Promise<Profile | null> {
  return prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });
}

export type SaveProfileInput = {
  name?: string | null;
  dateOfBirth: Date;
  assumedLifespanYears: number;
};

/**
 * Upsert-style save: if a profile already exists, update it; otherwise create
 * the first one. Keeps the "single active profile" invariant for now.
 */
export async function saveCurrentProfile(
  input: SaveProfileInput,
): Promise<Profile> {
  const existing = await getCurrentProfile();

  const data = {
    name: input.name?.trim() ? input.name.trim() : null,
    dateOfBirth: input.dateOfBirth,
    assumedLifespanYears: clampLifespan(input.assumedLifespanYears),
  };

  if (existing) {
    return prisma.profile.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.profile.create({ data });
}

export function clampLifespan(years: number): number {
  if (!Number.isFinite(years)) return DEFAULT_ASSUMED_LIFESPAN;
  const rounded = Math.round(years);
  if (rounded < MIN_ASSUMED_LIFESPAN) return MIN_ASSUMED_LIFESPAN;
  if (rounded > MAX_ASSUMED_LIFESPAN) return MAX_ASSUMED_LIFESPAN;
  return rounded;
}

export type LifeWeekSummary = {
  totalLifeWeeks: number;
  weeksLived: number;
  weeksRemaining: number;
  /** Index of the current week, clamped into [0, totalLifeWeeks - 1]. */
  currentWeekIndex: number;
  /**
   * 0-based grid row (52 weeks per row from DOB) that contains the current
   * week. Same as floor(currentWeekIndex / 52).
   */
  currentLifeYearRowIndex: number;
  ageYears: number;
  assumedLifespanYears: number;
  /** True if life has already exceeded the assumed lifespan. */
  isPastAssumedLifespan: boolean;
};

/**
 * Compute the Memento Mori life-in-weeks summary from a profile.
 * Safe against future DOBs and lifespans shorter than current age —
 * nothing here should ever break the UI.
 */
export function computeLifeWeekSummary(
  profile: Pick<Profile, "dateOfBirth" | "assumedLifespanYears">,
  now: Date = new Date(),
): LifeWeekSummary {
  const lifespan = clampLifespan(profile.assumedLifespanYears);
  const totalLifeWeeks = lifespan * 52;

  const dob = new Date(profile.dateOfBirth);
  const rawWeeks = Math.floor((now.getTime() - dob.getTime()) / MS_PER_WEEK);
  const weeksLived = Math.max(0, Math.min(rawWeeks, totalLifeWeeks));
  const weeksRemaining = Math.max(0, totalLifeWeeks - weeksLived);

  const currentWeekIndex =
    rawWeeks < 0
      ? 0
      : rawWeeks >= totalLifeWeeks
        ? totalLifeWeeks - 1
        : rawWeeks;

  const weeksPerYear = 52;
  const currentLifeYearRowIndex = Math.floor(
    currentWeekIndex / weeksPerYear,
  );

  return {
    totalLifeWeeks,
    weeksLived,
    weeksRemaining,
    currentWeekIndex,
    currentLifeYearRowIndex,
    ageYears: calculateAge(dob, now),
    assumedLifespanYears: lifespan,
    isPastAssumedLifespan: rawWeeks >= totalLifeWeeks,
  };
}

function calculateAge(dob: Date, now: Date): number {
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

/**
 * Normalize a "YYYY-MM-DD" date input from a form into a UTC-midnight Date,
 * matching how we persist other date-only fields.
 */
export function parseDateOfBirthInput(raw: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map(Number);
  const dob = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  if (dob.getTime() > now.getTime()) return null;
  // Sanity bound: nobody alive today was born before 1900.
  if (y < 1900) return null;

  return dob;
}

/** Format a DOB for <input type="date"> default values. */
export function toDateInputValue(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
