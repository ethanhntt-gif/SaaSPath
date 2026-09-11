import Link from "next/link";

const footerLinks = [
  { href: "/paths", label: "Explore Paths" },
  { href: "/submit-stack", label: "Submit Stack" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "https://github.com", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex min-h-24 w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-stone-600 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>&copy; 2026 SaaSPath. Workflow-driven SaaS directory.</p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-medium">
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
    </footer>
  );
}
