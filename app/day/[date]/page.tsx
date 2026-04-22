import { notFound } from "next/navigation";
import { DayView } from "@/components/DayView";
import { ensureDay } from "@/lib/habits";
import { isValidDateKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function DayDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const { date } = params;
  if (!isValidDateKey(date)) notFound();
  const day = await ensureDay(date);
  return <DayView day={day} />;
}
