import { locales } from "@/lib/locales";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales.map((l) => l.code),

  // Used when no locale matches
  defaultLocale: "en",
});
