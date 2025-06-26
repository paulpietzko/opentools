import Link from "next/link";
import { Button } from "./ui/button";
import { Wrench } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export default function Navbar() {
  return (
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="https://www.opentools.ch"
            className="flex items-center space-x-2"
          >
            <Wrench className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              OpenTools
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <Link
              href="https://www.paulpietzko.com"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Creator
            </Link>
            <Link
              href="https://github.com/paulpietzko/opentools/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              GitHub
            </Link>
            <Button asChild variant="default" size="sm">
              <Link href="/tools">Browse Tools</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
