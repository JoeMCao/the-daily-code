"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/app/actions";
import { DEFAULT_ASSUMED_LIFESPAN } from "@/lib/profile";

function todayInputValueLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ProfileSetupForm({
  defaultDateOfBirth = "",
  defaultAssumedLifespanYears = DEFAULT_ASSUMED_LIFESPAN,
  defaultName = "",
}: {
  defaultDateOfBirth?: string;
  defaultAssumedLifespanYears?: number;
  defaultName?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const maxDate = todayInputValueLocal();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await saveProfile(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.replace("/memento-mori");
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-stone-200 bg-white/80 p-6 shadow-soft sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <p className="font-serif text-sm italic text-ink-soft">
          To see your life in weeks, enter a date of birth and how many years
          you assume as a lifespan. You can change this later.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Date of birth
          </span>
          <input
            type="date"
            name="dateOfBirth"
            required
            defaultValue={defaultDateOfBirth}
            max={maxDate}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-serif text-base text-ink outline-none transition-colors focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Assumed lifespan (years)
          </span>
          <input
            type="number"
            name="assumedLifespanYears"
            min={20}
            max={130}
            step={1}
            defaultValue={defaultAssumedLifespanYears}
            className="w-28 rounded-lg border border-stone-200 bg-white px-3 py-2 font-serif text-base text-ink outline-none transition-colors focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Name <span className="normal-case tracking-normal">(optional)</span>
          </span>
          <input
            type="text"
            name="name"
            defaultValue={defaultName}
            maxLength={80}
            autoComplete="off"
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 font-serif text-base text-ink outline-none transition-colors focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
          />
        </label>
      </div>

      {error && (
        <p className="font-serif text-sm italic text-ink-soft" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-full bg-ink px-5 py-2 text-sm tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
