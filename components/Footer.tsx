import Link from "next/link";
import { Route } from "lucide-react";

const footerLinks = [
  { href: "/paths", label: "Explore Paths" },
  { href: "/submit-stack", label: "Submit Stack" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "https://github.com", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-emerald-800 text-white">
            <Route className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-950">SaaSPath</p>
            <p className="text-xs text-stone-500">Don't browse tools. Follow the path.</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-stone-600">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-emerald-800"
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-stone-100">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-stone-500 sm:px-6">
          &copy; 2026 SaaSPath. Workflow-driven SaaS directory.
        </p>
      </div>
    </footer>
  );
}
