import Link from "next/link";
import { Route } from "lucide-react";

import { AuthButton } from "@/components/AuthButton";

const navItems = [
  { href: "/paths", label: "Explore Paths" },
  { href: "/#categories", label: "Categories" },
  { href: "/submit-stack", label: "Submit Stack" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3 font-semibold text-stone-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-800 text-white shadow-sm transition-transform group-hover:scale-105">
            <Route className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">SaaSPath</span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Beta
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition-colors hover:text-emerald-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AuthButton />
      </div>
    </header>
  );
}
