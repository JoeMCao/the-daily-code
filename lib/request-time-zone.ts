import { cookies } from "next/headers";
import {
  TIME_ZONE_COOKIE_NAME,
  isValidTimeZone,
  todayKey,
  type DateKey,
} from "@/lib/date";

export function getRequestTimeZone(): string | undefined {
  const value = cookies().get(TIME_ZONE_COOKIE_NAME)?.value;
  return isValidTimeZone(value) ? value : undefined;
}

export function todayKeyForRequest(): DateKey {
  return todayKey(getRequestTimeZone());
}
