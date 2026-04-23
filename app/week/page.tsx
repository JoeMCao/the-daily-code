import { WeekView } from "@/components/WeekView";
import { getDaySummaries } from "@/lib/habits";
import {
  addDays,
  fromDateKey,
  isValidDateKey,
  startOfWeek,
  todayKey,
  weekKeys,
} from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function WeekPage({
  searchParams,
}: {
  searchParams: { start?: string };
}) {
  const anchorDate =
    searchParams.start && isValidDateKey(searchParams.start)
      ? fromDateKey(searchParams.start)
      : new Date();
  const weekAnchor = startOfWeek(anchorDate);
  const keys = weekKeys(weekAnchor);
  const summaries = await getDaySummaries(keys);

  const rows = keys.map((k) => {
    const s = summaries.get(k) ?? {
      completed: 0,
      total: 0,
      hasEntry: false,
    };
    return { dateKey: k, completed: s.completed, total: s.total };
  });

  const start = weekAnchor;
  const end = addDays(start, 6);
  const label =
    start.toLocaleDateString(undefined, { month: "long", day: "numeric" }) +
    " – " +
    end.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const isThisWeek = keys.includes(todayKey());

  return (
    <WeekView
      eyebrow={isThisWeek ? "This week" : "Week"}
      weekStartLabel={label}
      rows={rows}
    />
  );
}
