"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureDay } from "@/lib/habits";
import { isValidDateKey } from "@/lib/date";

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
