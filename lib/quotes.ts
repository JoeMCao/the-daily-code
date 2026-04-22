// Small rotating set of stoic-ish lines. Hardcoded on purpose.
// Keep these restrained. No cheese.

export const QUOTES: { text: string; attribution?: string }[] = [
  { text: "No drama. Return to the code." },
  { text: "Never zero." },
  { text: "Discipline remembered is discipline repeated." },
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    attribution: "Marcus Aurelius",
  },
  {
    text: "Waste no more time arguing what a good man should be. Be one.",
    attribution: "Marcus Aurelius",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    attribution: "Seneca",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    attribution: "Epictetus",
  },
  { text: "The obstacle is the way." },
  { text: "Small acts, done daily." },
  { text: "Begin. Again. Without comment." },
];

/** Deterministic pick so the same day shows the same quote. */
export function quoteForDate(key: string): (typeof QUOTES)[number] {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % QUOTES.length;
  return QUOTES[idx];
}
