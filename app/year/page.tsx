import { YearView } from "@/components/YearView";
import { fromDateKey } from "@/lib/date";
import { todayKeyForRequest } from "@/lib/request-time-zone";
import { getYearView } from "@/lib/year-view";

export const dynamic = "force-dynamic";

function parseYear(raw: string | undefined, today: string): number {
  const now = fromDateKey(today).getFullYear();
  if (!raw) return now;
  const y = Number.parseInt(raw, 10);
  if (!Number.isFinite(y) || y < 1970 || y > 2100) return now;
  return y;
}

export default async function YearPage({
  searchParams,
}: {
  searchParams: { y?: string };
}) {
  const today = todayKeyForRequest();
  const year = parseYear(searchParams.y, today);
  const data = await getYearView(year, today);
  return <YearView data={data} />;
}
