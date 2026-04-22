// Date helpers. We treat a "date" as a calendar day in the user's local timezone,
// and serialize it to "YYYY-MM-DD" for URLs and DB-facing UTC midnight Date objects.

export type DateKey = string; // "YYYY-MM-DD"

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function isValidDateKey(key: string): key is DateKey {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const d = fromDateKey(key);
  return !Number.isNaN(d.getTime()) && toDateKey(d) === key;
}

/**
 * Convert a local calendar date (YYYY-MM-DD) to a UTC midnight Date.
 * Postgres `@db.Date` stores a pure date; Prisma returns it as UTC midnight.
 * To avoid "off-by-one" drift, we always write UTC midnight for a given key.
 */
export function dateKeyToUtc(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function utcToDateKey(date: Date): DateKey {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** ISO week: Monday as first day. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function weekKeys(anchor: Date = new Date()): DateKey[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

/**
 * Returns a 6x7 grid of DateKeys (Mon..Sun) covering the month that contains `anchor`.
 * Some leading/trailing cells belong to adjacent months.
 */
export function monthGridKeys(anchor: Date = new Date()): DateKey[] {
  const first = startOfMonth(anchor);
  const gridStart = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => toDateKey(addDays(gridStart, i)));
}

export function formatLongDate(key: DateKey): string {
  const d = fromDateKey(key);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortWeekday(key: DateKey): string {
  return fromDateKey(key).toLocaleDateString(undefined, { weekday: "short" });
}

export function formatDayNumber(key: DateKey): string {
  return String(fromDateKey(key).getDate());
}

export function isSameMonth(key: DateKey, anchor: Date): boolean {
  const d = fromDateKey(key);
  return d.getMonth() === anchor.getMonth() && d.getFullYear() === anchor.getFullYear();
}

export function isToday(key: DateKey): boolean {
  return key === todayKey();
}

export function isFuture(key: DateKey): boolean {
  return key > todayKey();
}
