"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VIEWS = [
  { href: "/", label: "Day" },
  { href: "/week", label: "Week" },
  { href: "/month", label: "Month" },
];

export function ViewToggle() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/day");
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="View"
      className="inline-flex items-center rounded-full border border-stone-200 bg-white/70 p-1 text-sm shadow-soft backdrop-blur"
    >
      {VIEWS.map((v) => {
        const active = isActive(v.href);
        return (
          <Link
            key={v.href}
            href={v.href}
            className={[
              "rounded-full px-4 py-1.5 transition-colors",
              active
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink",
            ].join(" ")}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
