// Curated, category-based quote set. Intentionally small.
// Daily → instruction / discipline. Memento → finitude / urgency.
// If a line is not clearly one of those, it does not belong here.

export type QuoteCategory = "daily" | "memento";

export type Quote = {
  text: string;
  attribution?: string;
  category: QuoteCategory;
};

export const QUOTES: Quote[] = [
  // Daily — discipline, execution, behavior.
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    attribution: "Marcus Aurelius, Meditations 10.16",
    category: "daily",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    attribution: "Epictetus, Discourses 3.23",
    category: "daily",
  },
  {
    text: "If it is not right, do not do it; if it is not true, do not say it.",
    attribution: "Marcus Aurelius, Meditations 12.17",
    category: "daily",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    attribution: "Marcus Aurelius, Meditations 5.20",
    category: "daily",
  },
  {
    text: "At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work — as a human being.",
    attribution: "Marcus Aurelius, Meditations 5.1",
    category: "daily",
  },
  {
    text: "Never call yourself a philosopher, and do not talk much among ordinary people about your principles; act on them.",
    attribution: "Epictetus, Enchiridion 46",
    category: "daily",
  },
  {
    text: "If you wish to be a good reader, read; if a writer, write.",
    attribution: "Epictetus, Discourses 3.23",
    category: "daily",
  },
  {
    text: "Be tolerant with others and strict with yourself.",
    attribution: "Marcus Aurelius, Meditations 8.59",
    category: "daily",
  },
  {
    text: "We should every night call ourselves to account.",
    attribution: "Seneca, On Anger 3.36",
    category: "daily",
  },
  {
    text: "If you wish to improve, be content to appear clueless or stupid in extraneous matters.",
    attribution: "Epictetus, Enchiridion 13",
    category: "daily",
  },
  {
    text: "Do not seek for events to happen as you wish, but wish them to happen as they do happen, and you will go on well.",
    attribution: "Epictetus, Enchiridion 8",
    category: "daily",
  },

  // Memento — finitude, time, urgency.
  {
    text: "You could leave life right now. Let that determine what you do and say and think.",
    attribution: "Marcus Aurelius, Meditations 2.11",
    category: "memento",
  },
  {
    text: "While we are postponing, life speeds by.",
    attribution: "Seneca, Letters 1",
    category: "memento",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    attribution: "Seneca, On the Shortness of Life 1",
    category: "memento",
  },
  {
    text: "The whole future lies in uncertainty: live immediately.",
    attribution: "Seneca, Letters 101",
    category: "memento",
  },
  {
    text: "The part of life we really live is small.",
    attribution: "Seneca, On the Shortness of Life 10",
    category: "memento",
  },
  {
    text: "Soon you will have forgotten all things; soon all things will have forgotten you.",
    attribution: "Marcus Aurelius, Meditations 7.21",
    category: "memento",
  },
  {
    text: "Do every act of your life as though it were the very last act of your life.",
    attribution: "Marcus Aurelius, Meditations 2.5",
    category: "memento",
  },
  {
    text: "The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today.",
    attribution: "Seneca, On the Shortness of Life 9",
    category: "memento",
  },
  {
    text: "You are but a little soul carrying around a corpse.",
    attribution: "Epictetus, Discourses 4.7",
    category: "memento",
  },
];

/** Deterministic pick so the same day shows the same quote for a given category. */
export function quoteForDate(key: string, category: QuoteCategory): Quote {
  const filtered = QUOTES.filter((q) => q.category === category);

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }

  const idx = Math.abs(hash) % filtered.length;
  return filtered[idx];
}
