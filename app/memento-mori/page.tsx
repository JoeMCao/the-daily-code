import { MementoMoriView } from "@/components/MementoMoriView";
import { ProfileSetupForm } from "@/components/ProfileSetupForm";
import { ViewPageHeader } from "@/components/ViewPageHeader";
import {
  computeLifeWeekSummary,
  getCurrentProfile,
  toDateInputValue,
} from "@/lib/profile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Memento Mori — The Daily Code",
  description:
    "A quiet reflection on a finite life, rendered as a grid of weeks.",
};

export default async function MementoMoriPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const profile = await getCurrentProfile();
  const isEditing = searchParams.edit === "1";

  if (!profile || isEditing) {
    return (
      <section className="flex flex-col gap-8">
        <ViewPageHeader
          eyebrow="Memento mori"
          title={profile ? "Edit your profile" : "Your life"}
          dek={
            !profile ? (
              <p>
                Remember that you will die. Not as a threat — as a compass.
                First, a little information.
              </p>
            ) : undefined
          }
        />

        <ProfileSetupForm
          defaultDateOfBirth={
            profile ? toDateInputValue(profile.dateOfBirth) : ""
          }
          defaultAssumedLifespanYears={profile?.assumedLifespanYears}
          defaultName={profile?.name ?? ""}
        />
      </section>
    );
  }

  const summary = computeLifeWeekSummary(profile);
  return <MementoMoriView profile={profile} summary={summary} />;
}
