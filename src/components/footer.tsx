import { Wrench } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                © 2024 <a href="https://www.paulpietzko.com">Paul Pietzko</a>. Open source and free to use.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com/paulpietzko/opentools/blob/main/CONTRIBUTING.md"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Contributing Guide
              </Link>
              <Link
                href="https://github.com/paulpietzko/opentools/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
  )
}