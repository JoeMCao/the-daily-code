import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_HABITS = [
  {
    slug: "wake-at-dawn",
    name: "Wake at dawn",
    description: "Meet the day before the day meets you.",
    sortOrder: 10,
    isDefault: true,
  },
  {
    slug: "move-the-body",
    name: "Move the body",
    description: "Sweat. Breath. Strength.",
    sortOrder: 20,
    isDefault: true,
  },
  {
    slug: "journal",
    name: "Journal",
    description: "Write to think. Think to act.",
    sortOrder: 30,
    isDefault: true,
  },
  {
    slug: "read-actively",
    name: "Read actively",
    description: "Mark it. Argue with it. Apply it.",
    sortOrder: 40,
    isDefault: true,
  },
  {
    slug: "walk-outdoors",
    name: "Walk outdoors",
    description: "Sun on the face. Phone in the pocket.",
    sortOrder: 50,
    isDefault: true,
  },
  {
    slug: "deep-work",
    name: "Deep work",
    description: "One hard thing, done well.",
    sortOrder: 60,
    isDefault: true,
  },
  {
    slug: "memento-mori",
    name: "Memento mori",
    description: "You will die. Act accordingly.",
    sortOrder: 70,
    isDefault: true,
  },
  {
    slug: "skip-phone-usage",
    name: "Skip phone usage",
    description: "No scroll. No feed. No noise.",
    sortOrder: 80,
    isDefault: false,
  },
];

async function main() {
  for (const habit of DEFAULT_HABITS) {
    await prisma.habit.upsert({
      where: { slug: habit.slug },
      update: {
        name: habit.name,
        description: habit.description,
        sortOrder: habit.sortOrder,
        isDefault: habit.isDefault,
        isActive: true,
      },
      create: habit,
    });
  }
  console.log(`Seeded ${DEFAULT_HABITS.length} habits.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
