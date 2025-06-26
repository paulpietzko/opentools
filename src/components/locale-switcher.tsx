"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/lib/locales";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

const LocaleSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  const setLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Languages size={ICON_SIZE} className={"text-muted-foreground"} />
          <span className="ml-2 text-xs">
            {currentLocale.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]" align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
          {locales.map((l) => (
            <DropdownMenuRadioItem
              key={l.code}
              className="flex gap-2"
              value={l.code}
            >
              <span className="w-5">{l.flag}</span>
              <span>{l.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LocaleSwitcher };
