import { HabitToggle } from "@/components/HabitToggle";
import { JournalInput } from "@/components/JournalInput";
import { QuoteBlock } from "@/components/QuoteBlock";
import { ViewPageHeader } from "@/components/ViewPageHeader";
import type { DayData } from "@/lib/habits";
import { formatLongDate, isFuture, isToday } from "@/lib/date";
import { quoteForDate } from "@/lib/quotes";

export function DayView({ day }: { day: DayData }) {
  const today = isToday(day.dateKey);
  const future = isFuture(day.dateKey);
  const quote = quoteForDate(day.dateKey, "daily");

  return (
    <section className="flex flex-col">
      <ViewPageHeader
        eyebrow={today ? "Today" : future ? "Upcoming" : "Past"}
        title={formatLongDate(day.dateKey)}
        metaClassName="hidden sm:block"
        meta={
          <>
            <p className="font-serif text-2xl text-ink">
              {day.completedCount}
              <span className="text-ink-faint">/{day.totalCount}</span>
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
              practices
            </p>
          </>
        }
      />

      <ul className="mt-10 flex flex-col gap-2 sm:mt-12">
        {day.habits.map((h) => (
          <li key={h.id}>
            <HabitToggle dateKey={day.dateKey} habit={h} disabled={future} />
          </li>
        ))}
      </ul>

      <div className="mt-10 sm:mt-12">
        <JournalInput
          key={day.dateKey}
          dateKey={day.dateKey}
          initialValue={day.journal}
          disabled={future}
        />
      </div>

      <div className="mt-6 sm:mt-7">
        <QuoteBlock
          text={quote.text}
          attribution={quote.attribution}
          variant="daily"
        />
      </div>
    </section>
  );
}
