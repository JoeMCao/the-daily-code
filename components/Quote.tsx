import { quoteForDate } from "@/lib/quotes";

export function Quote({ dateKey }: { dateKey: string }) {
  const q = quoteForDate(dateKey);
  return (
    <figure className="text-center">
      <blockquote className="font-serif text-[15px] italic text-ink-soft text-balance">
        &ldquo;{q.text}&rdquo;
      </blockquote>
      {q.attribution && (
        <figcaption className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-faint">
          — {q.attribution}
        </figcaption>
      )}
    </figure>
  );
}
