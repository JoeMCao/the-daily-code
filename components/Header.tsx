import Link from "next/link";
import { ViewToggle } from "@/components/ViewToggle";

export function Header() {
  return (
    <header className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
      <Link href="/" className="group inline-flex items-baseline gap-2">
        <span className="font-serif text-2xl tracking-tight text-ink">
          The Daily Code
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-ink-faint group-hover:text-ink-soft">
          v.1
        </span>
      </Link>
      <ViewToggle />
    </header>
  );
}
