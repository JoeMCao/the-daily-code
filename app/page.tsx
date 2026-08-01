import { DayView } from "@/components/DayView";
import { ViewPageHeader } from "@/components/ViewPageHeader";
import { ensureDay } from "@/lib/habits";
import {
  getRequestTimeZone,
  todayKeyForRequest,
} from "@/lib/request-time-zone";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!getRequestTimeZone()) {
    return (
      <section className="flex flex-col gap-6">
        <ViewPageHeader
          eyebrow="Today"
          title="Syncing your local day..."
          dek={
            <p>
              The page is waiting for this browser&apos;s timezone so it opens the
              correct day.
            </p>
          }
        />
      </section>
    );
  }

  const today = todayKeyForRequest();
  const day = await ensureDay(today);
  return <DayView day={day} todayKey={today} />;
}
