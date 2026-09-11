import { CheckCircle2, LinkIcon, Send, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";

const fieldClass =
  "mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

const textareaClass =
  "mt-2 min-h-28 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

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

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <form className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-800">
              Stack name
              <input className={fieldClass} placeholder="Steps For SEO Traffic" />
            </label>

            <label className="block text-sm font-medium text-stone-800">
              Goal category
              <select className={fieldClass} defaultValue="">
                <option value="" disabled>
                  Select category
                </option>
                <option>Traffic</option>
                <option>Revenue</option>
                <option>Content</option>
                <option>Automation</option>
                <option>Launch</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-stone-800">
            Workflow summary
            <textarea
              className={textareaClass}
              placeholder="Describe what this stack helps users accomplish and who it is best for."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block text-sm font-medium text-stone-800">
              Step 1
              <input className={fieldClass} placeholder="ChatGPT" />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Step 2
              <input className={fieldClass} placeholder="Jasper" />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Step 3
              <input className={fieldClass} placeholder="Ghost" />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-800">
              Monthly cost estimate
              <input className={fieldClass} placeholder="$29 - $149/mo" />
            </label>

            <label className="block text-sm font-medium text-stone-800">
              Reference link
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-5 h-4 w-4 text-stone-400" aria-hidden="true" />
                <input className={`${fieldClass} pl-9`} placeholder="https://example.com" />
              </div>
            </label>
          </div>

          <label className="block text-sm font-medium text-stone-800">
            Notes for review
            <textarea
              className={textareaClass}
              placeholder="Add affiliate details, proof, screenshots, or why this workflow should be featured."
            />
          </label>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Submissions are reviewed before publishing.</p>
            <Button type="button">
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Stack
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
