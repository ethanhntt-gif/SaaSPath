import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ToolNotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
        Tool not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-stone-600">
        The tool you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/paths"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Browse all paths
      </Link>
    </div>
  );
}
