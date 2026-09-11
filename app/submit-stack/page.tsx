import { CheckCircle2, Workflow } from "lucide-react";

import { SubmitStackForm } from "@/components/SubmitStackForm";

export default function SubmitStackPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
      <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-800 text-white">
          <Workflow className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Submit Stack
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
          Share a SaaS workflow with the directory.
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Add a practical chain of tools that helps people reach a clear outcome, from idea to launch or growth.
        </p>

        <div className="mt-8 space-y-4">
          {["Clear goal", "2-5 workflow steps", "Real SaaS tools", "Useful context"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-medium text-stone-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-800" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </aside>

      <SubmitStackForm />
    </div>
  );
}
