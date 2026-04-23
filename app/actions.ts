"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureDay } from "@/lib/habits";
import { dateKeyToUtc, isValidDateKey } from "@/lib/date";
import {
  DEFAULT_ASSUMED_LIFESPAN,
  parseDateOfBirthInput,
  saveCurrentProfile,
} from "@/lib/profile";

const MAX_JOURNAL_LENGTH = 4000;

export async function saveJournal(dateKey: string, text: string) {
  if (!isValidDateKey(dateKey)) {
    throw new Error("Invalid date");
  }

  const normalized = String(text ?? "").slice(0, MAX_JOURNAL_LENGTH);

  await ensureDay(dateKey);

  await prisma.dayEntry.update({
    where: { date: dateKeyToUtc(dateKey) },
    data: { journal: normalized.length === 0 ? null : normalized },
  });

  revalidatePath("/");
  revalidatePath("/week");
  revalidatePath("/month");
  revalidatePath("/year");
  revalidatePath(`/day/${dateKey}`);
}

export async function toggleHabit(dateKey: string, habitId: string) {
  if (!isValidDateKey(dateKey)) {
    throw new Error("Invalid date");
  }

  await ensureDay(dateKey);

  const check = await prisma.habitCheck.findFirst({
    where: {
      habitId,
      dayEntry: { date: new Date(`${dateKey}T00:00:00.000Z`) },
    },
  });

  if (!check) {
    throw new Error("Habit check not found");
  }

  const nextCompleted = !check.completed;
  await prisma.habitCheck.update({
    where: { id: check.id },
    data: {
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/week");
  revalidatePath("/month");
  revalidatePath(`/day/${dateKey}`);
}

export type SaveProfileResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveProfile(
  formData: FormData,
): Promise<SaveProfileResult> {
  const rawDob = String(formData.get("dateOfBirth") ?? "").trim();
  const rawLifespan = String(formData.get("assumedLifespanYears") ?? "").trim();
  const rawName = formData.get("name");

  const dob = parseDateOfBirthInput(rawDob);
  if (!dob) {
    return { ok: false, error: "Please enter a valid date of birth." };
  }

  const parsedLifespan = rawLifespan === "" ? DEFAULT_ASSUMED_LIFESPAN : Number(rawLifespan);
  if (!Number.isFinite(parsedLifespan)) {
    return { ok: false, error: "Please enter a valid assumed lifespan." };
  }

  await saveCurrentProfile({
    name: typeof rawName === "string" ? rawName : null,
    dateOfBirth: dob,
    assumedLifespanYears: parsedLifespan,
  });

  revalidatePath("/memento-mori");
  return { ok: true };
}
