"use client";

import { useOptimistic, useTransition } from "react";
import { toggleHabit } from "@/app/actions";
import type { HabitWithCheck } from "@/lib/habits";

export function HabitToggle({
  dateKey,
  habit,
  disabled,
}: {
  dateKey: string;
  habit: HabitWithCheck;
  disabled?: boolean;
}) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    habit.completed,
  );
  const [, startTransition] = useTransition();

  const onClick = () => {
    if (disabled) return;
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleHabit(dateKey, habit.id);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={optimisticCompleted}
      className={[
        "group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60",
        optimisticCompleted
          ? "border-emerald-300 bg-emerald-50/80 hover:bg-emerald-50"
          : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "flex h-6 w-6 flex-none items-center justify-center rounded-md border transition-colors",
          optimisticCompleted
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-stone-300 bg-white text-transparent group-hover:border-stone-400",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
          strokeWidth={2.5}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10.5l3.5 3.5L16 6" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={[
            "text-[15px] font-medium",
            optimisticCompleted ? "text-emerald-900" : "text-ink",
          ].join(" ")}
        >
          {habit.name}
        </span>
        {habit.description && (
          <span className="truncate text-xs text-ink-faint">
            {habit.description}
          </span>
        )}
      </span>
      {!habit.isDefault && (
        <span className="ml-auto text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          custom
        </span>
      )}
    </button>
  );
}
