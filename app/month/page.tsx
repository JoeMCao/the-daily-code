import { MonthView, type MonthCell } from "@/components/MonthView";
import { getDaySummaries, majorityComplete } from "@/lib/habits";
import {
  fromDateKey,
  isSameMonth,
  monthGridKeys,
  startOfMonth,
} from "@/lib/date";
import { todayKeyForRequest } from "@/lib/request-time-zone";

export const dynamic = "force-dynamic";

export default async function MonthPage() {
  const today = todayKeyForRequest();
  const now = fromDateKey(today);
  const anchor = startOfMonth(now);
  const keys = monthGridKeys(now);
  const summaries = await getDaySummaries(keys);

  const cells: MonthCell[] = keys.map((k) => {
    const s = summaries.get(k) ?? {
      completed: 0,
      total: 0,
      hasEntry: false,
    };
    return { dateKey: k, completed: s.completed, total: s.total };
  });

  const monthLabel = anchor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const inMonth = cells.filter((c) => isSameMonth(c.dateKey, anchor));
  const greenCount = inMonth.filter((c) => majorityComplete(c)).length;
  const totalsLabel = `${greenCount} green ${greenCount === 1 ? "day" : "days"} so far`;

  return (
    <MonthView
      anchorISO={anchor.toISOString()}
      monthLabel={monthLabel}
      cells={cells}
      totalsLabel={totalsLabel}
      todayKey={today}
    />
  );
}
