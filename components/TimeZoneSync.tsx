"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TIME_ZONE_COOKIE_NAME } from "@/lib/date";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  const parts = document.cookie
    .split("; ")
    .map((entry) => entry.split("="));
  const match = parts.find(([key]) => key === name);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function TimeZoneSync() {
  const router = useRouter();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return;

    const current = readCookie(TIME_ZONE_COOKIE_NAME);
    if (current === timeZone) return;

    document.cookie = [
      `${TIME_ZONE_COOKIE_NAME}=${encodeURIComponent(timeZone)}`,
      "Path=/",
      `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
    ].join("; ");

    router.refresh();
  }, [router]);

  return null;
}
