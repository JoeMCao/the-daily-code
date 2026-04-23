import { YearView } from "@/components/YearView";
import { getYearView } from "@/lib/year-view";

export const dynamic = "force-dynamic";

function parseYear(raw: string | undefined): number {
  const now = new Date().getFullYear();
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
  const year = parseYear(searchParams.y);
  const data = await getYearView(year);
  return <YearView data={data} />;
}
