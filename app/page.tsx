import { DayView } from "@/components/DayView";
import { ensureDay } from "@/lib/habits";
import { todayKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const day = await ensureDay(todayKey());
  return <DayView day={day} />;
}
