-- Restore The Daily Code schema after the Weekly Compass pivot.

DROP TABLE IF EXISTS "WeeklyReview";

CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "dateOfBirth" DATE NOT NULL,
    "assumedLifespanYears" INTEGER NOT NULL DEFAULT 88,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Habit" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DayEntry" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "journal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HabitCheck" (
    "id" TEXT NOT NULL,
    "dayEntryId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitCheck_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Habit_slug_key" ON "Habit"("slug");
CREATE INDEX IF NOT EXISTS "Habit_isActive_sortOrder_idx" ON "Habit"("isActive", "sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "DayEntry_date_key" ON "DayEntry"("date");
CREATE INDEX IF NOT EXISTS "HabitCheck_habitId_idx" ON "HabitCheck"("habitId");
CREATE UNIQUE INDEX IF NOT EXISTS "HabitCheck_dayEntryId_habitId_key" ON "HabitCheck"("dayEntryId", "habitId");

ALTER TABLE "HabitCheck"
    ADD CONSTRAINT "HabitCheck_dayEntryId_fkey"
    FOREIGN KEY ("dayEntryId") REFERENCES "DayEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HabitCheck"
    ADD CONSTRAINT "HabitCheck_habitId_fkey"
    FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Habit" ("id", "slug", "name", "description", "isDefault", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
    ('default_wake_at_dawn', 'wake-at-dawn', 'Wake at dawn', 'Meet the day before the day meets you.', true, true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_move_the_body', 'move-the-body', 'Move the body', 'Sweat. Breath. Strength.', true, true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_journal', 'journal', 'Journal', 'Write to think. Think to act.', true, true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_read_actively', 'read-actively', 'Read actively', 'Mark it. Argue with it. Apply it.', true, true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_walk_outdoors', 'walk-outdoors', 'Walk outdoors', 'Sun on the face. Phone in the pocket.', true, true, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_deep_work', 'deep-work', 'Deep work', 'One hard thing, done well.', true, true, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_memento_mori', 'memento-mori', 'Memento mori', 'You will die. Act accordingly.', true, true, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('default_skip_phone_usage', 'skip-phone-usage', 'Skip phone usage', 'No scroll. No feed. No noise.', false, true, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "isDefault" = EXCLUDED."isDefault",
    "isActive" = EXCLUDED."isActive",
    "sortOrder" = EXCLUDED."sortOrder",
    "updatedAt" = CURRENT_TIMESTAMP;
