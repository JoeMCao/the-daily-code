import Link from "next/link";
import { HabitToggle } from "@/components/HabitToggle";
import type { DayData } from "@/lib/habits";
import { formatLongDate, isFuture, isToday, todayKey } from "@/lib/date";

export function DayView({ day }: { day: DayData }) {
  const today = isToday(day.dateKey);
  const future = isFuture(day.dateKey);
  const allDone = day.completedCount === day.totalCount && day.totalCount > 0;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
            {today ? "Today" : future ? "Upcoming" : "Past"}
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            {formatLongDate(day.dateKey)}
          </h1>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-serif text-2xl text-ink">
            {day.completedCount}
            <span className="text-ink-faint">/{day.totalCount}</span>
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
            practices
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {day.habits.map((h) => (
          <li key={h.id}>
            <HabitToggle dateKey={day.dateKey} habit={h} disabled={future} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-sm text-ink-faint">
        {allDone ? (
          <p className="font-serif italic text-emerald-700">
            A full day. Close it cleanly.
          </p>
        ) : (
          <p className="font-serif italic">
            {today
              ? "Do the next one. That is enough."
              : "You can still log the past. History is not frozen."}
          </p>
        )}
        {!today && (
          <Link
            href={`/day/${todayKey()}`}
            className="text-xs uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
          >
            Back to today →
          </Link>
        )}
      </div>
    </section>
  );
}
