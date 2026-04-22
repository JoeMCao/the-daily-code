import { WeekView } from "@/components/WeekView";
import { getDaySummaries } from "@/lib/habits";
import { startOfWeek, weekKeys, addDays, toDateKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  const now = new Date();
  const keys = weekKeys(now);
  const summaries = await getDaySummaries(keys);

  const rows = keys.map((k) => {
    const s = summaries.get(k) ?? { completed: 0, total: 0 };
    return { dateKey: k, completed: s.completed, total: s.total };
  });

  const start = startOfWeek(now);
  const end = addDays(start, 6);
  const label =
    start.toLocaleDateString(undefined, { month: "long", day: "numeric" }) +
    " – " +
    end.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Ensure "today" marker uses local keys, not server UTC.
  void toDateKey(now);

  return <WeekView weekStartLabel={label} rows={rows} />;
}
