"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveJournal } from "@/app/actions";

const AUTOSAVE_DELAY_MS = 2800;

export function JournalInput({
  dateKey,
  initialValue,
  disabled,
}: {
  dateKey: string;
  initialValue: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [saveError, setSaveError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedRef = useRef(initialValue);
  const valueRef = useRef(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  valueRef.current = value;

  const dirty = value !== lastSavedRef.current;

  /**
   * Only reset from the server when the calendar day changes.
   * Do not depend on `initialValue` alone — after save, revalidation
   * updates props and would clobber text the user is still typing.
   */
  useEffect(() => {
    setValue(initialValue);
    lastSavedRef.current = initialValue;
    valueRef.current = initialValue;
    setSaveError(false);
    setIsSaving(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: hydrate only on day change
  }, [dateKey]);

  const runSave = useCallback(
    (text: string) => {
      if (disabled) return Promise.resolve();
      setIsSaving(true);
      return saveJournal(dateKey, text)
        .then(() => {
          lastSavedRef.current = text;
          setSaveError(false);
        })
        .catch(() => {
          setSaveError(true);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [dateKey, disabled],
  );

  useEffect(() => {
    if (disabled) return;
    if (value === lastSavedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void runSave(value);
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, dateKey, disabled, runSave]);

  const runSaveRef = useRef(runSave);
  runSaveRef.current = runSave;

  /** Blur may not run on in-app navigation; flush pending text when leaving the day. */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (disabled) return;
      const v = valueRef.current;
      if (v !== lastSavedRef.current) {
        void runSaveRef.current(v);
      }
    };
  }, [dateKey, disabled]);

  const flushSave = useCallback(() => {
    if (disabled) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const v = valueRef.current;
    if (v === lastSavedRef.current) return;
    void runSave(v);
  }, [disabled, runSave]);

  const showStatus = !saveError && !disabled && (isSaving || dirty);

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          valueRef.current = v;
          setValue(v);
          if (saveError) setSaveError(false);
        }}
        onBlur={flushSave}
        disabled={disabled}
        placeholder="What mattered today?"
        rows={3}
        spellCheck
        className={[
          "w-full resize-y rounded-lg border border-line-subtle bg-stone-50/70 px-3.5 py-2.5",
          "font-serif text-[15px] italic leading-relaxed text-ink-soft",
          "placeholder:text-ink-faint placeholder:italic",
          "transition-colors focus:border-stone-300 focus:bg-white focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      />
      {showStatus && (
        <p
          className="mt-1.5 text-xs tracking-wide text-stone-400"
          aria-live="polite"
        >
          {isSaving ? "Saving…" : "Typing…"}
        </p>
      )}
      {saveError && (
        <p className="mt-2 text-xs leading-snug text-stone-500" role="alert">
          Could not save. Confirm Postgres is running,{" "}
          <code className="rounded bg-stone-200/80 px-1 py-0.5 font-mono text-[11px]">
            DATABASE_URL
          </code>{" "}
          is set, and run{" "}
          <code className="rounded bg-stone-200/80 px-1 py-0.5 font-mono text-[11px]">
            npm run db:migrate
          </code>
          .
        </p>
      )}
    </div>
  );
}
