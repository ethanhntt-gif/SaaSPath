import Link from "next/link";
import { Route } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { href: "/workflows", label: "Workflows" },
      { href: "/tools", label: "Tools" },
      { href: "/paths", label: "Paths" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/submit", label: "Submit a tool" },
      { href: "/sign-in", label: "Sign in" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Route className="size-4" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                SaaSPath
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover workflows built from the best SaaS tools.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SaaSPath. All rights reserved.</p>
          <p>Workflow → Steps → Tools → Paths</p>
        </div>
      </div>
    </footer>
  );
}
