export type QuoteBlockVariant = "daily" | "memento";

/** Shared “margin note” treatment: no card, light left rule, left-aligned. */
const WRAPPER =
  "w-full max-w-xl border-l border-stone-200 py-1 pl-4 text-left";

const BODY_BASE =
  "font-serif text-[15px] italic leading-relaxed text-balance";

const BODY_TONE: Record<QuoteBlockVariant, string> = {
  daily: "text-stone-600",
  memento: "text-stone-700",
};

const CAPTION =
  "mt-2 font-serif text-xs tracking-wide text-stone-400 not-italic";

type QuoteBlockProps = {
  text: string;
  attribution?: string;
  variant: QuoteBlockVariant;
};

/**
 * Shared reflective quote for Day and Memento Mori.
 * Same structure everywhere; only body tone differs slightly (daily vs memento).
 */
export function QuoteBlock({ text, attribution, variant }: QuoteBlockProps) {
  return (
    <figure className={WRAPPER}>
      <blockquote className={[BODY_BASE, BODY_TONE[variant]].join(" ")}>
        &ldquo;{text}&rdquo;
      </blockquote>
      {attribution ? (
        <figcaption className={CAPTION}>— {attribution}</figcaption>
      ) : null}
    </figure>
  );
}
