import { MonthView, type MonthCell } from "@/components/MonthView";
import { getDaySummaries, majorityComplete } from "@/lib/habits";
import { isSameMonth, monthGridKeys, startOfMonth } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function MonthPage() {
  const now = new Date();
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
    />
  );
}
