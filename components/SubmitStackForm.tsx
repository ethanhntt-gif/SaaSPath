"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categories, getToolsForStep, paths } from "@/lib/paths";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

const textareaClass =
  "mt-2 min-h-28 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

type StepNumber = 1 | 2 | 3;

const stepLabels: Record<StepNumber, string> = {
  1: "Category",
  2: "Process",
  3: "Tools per step",
};

export function SubmitStackForm() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [pathSlug, setPathSlug] = useState<string | null>(null);
  // One selected tool per step id — each step keeps its own choice.
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const availablePaths = useMemo(
    () => (category ? paths.filter((path) => path.category === category) : []),
    [category],
  );

  const selectedPath = useMemo(
    () => paths.find((path) => path.slug === pathSlug) ?? null,
    [pathSlug],
  );

  function handleSelectCategory(next: Category) {
    setCategory(next);
    setPathSlug(null);
    setSelectedTools({});
    setCurrentStep(2);
  }

  function handleSelectPath(slug: string) {
    setPathSlug(slug);
    setSelectedTools({});
    setCurrentStep(3);
  }

  function handleSelectTool(stepId: string, toolName: string) {
    setSelectedTools((prev) => {
      // Toggle off if the same tool is clicked again.
      if (prev[stepId] === toolName) {
        const next = { ...prev };
        delete next[stepId];
        return next;
      }
      return { ...prev, [stepId]: toolName };
    });
  }

  function handleAutoFill() {
    if (!selectedPath) return;
    const filled: Record<string, string> = {};
    for (const step of selectedPath.steps) {
      const options = getToolsForStep(step.title);
      // Prefer the tool already used by this path, otherwise the first option.
      const preferred = step.tools[0]?.name;
      const pick =
        preferred && options.includes(preferred) ? preferred : options[0] ?? preferred;
      if (pick) {
        filled[step.id] = pick;
      }
    }
    setSelectedTools(filled);
  }

  function handleReset() {
    setCurrentStep(1);
    setCategory(null);
    setPathSlug(null);
    setSelectedTools({});
    setSubmitted(false);
  }

  const selectedCount = Object.keys(selectedTools).length;
  const totalSteps = selectedPath?.steps.length ?? 0;
  const allStepsFilled = totalSteps > 0 && selectedCount === totalSteps;

  if (submitted) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
          Stack submitted
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">
          Your <strong>{selectedPath?.name}</strong> stack with {selectedCount} selected tools
          has been sent for review. Most reviews are completed within 48 hours.
        </p>
        <Button className="mt-8" onClick={handleReset}>
          Submit another stack
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ol className="flex flex-wrap items-center gap-3">
        {([1, 2, 3] as StepNumber[]).map((step) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition-colors",
                  isActive && "bg-emerald-800 text-white",
                  isDone && "bg-emerald-100 text-emerald-800",
                  !isActive && !isDone && "bg-stone-100 text-stone-500",
                )}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : step}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-stone-950" : "text-stone-500",
                )}
              >
                {stepLabels[step]}
              </span>
              {step < 3 && (
                <ArrowRight className="h-4 w-4 text-stone-300" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {currentStep === 1 && (
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">
            Choose a goal category
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Pick the outcome your stack is built around.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectCategory(item)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md",
                  category === item
                    ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-emerald-300",
                )}
              >
                {item}
                <ArrowRight className="h-4 w-4 text-stone-400" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">
                Choose the process
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Select which workflow in <strong>{category}</strong> your stack represents.
              </p>
            </div>
            <Badge>{category}</Badge>
          </div>

          <div className="mt-6 grid gap-3">
            {availablePaths.map((path) => (
              <button
                key={path.slug}
                type="button"
                onClick={() => handleSelectPath(path.slug)}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between",
                  pathSlug === path.slug
                    ? "border-emerald-800 bg-emerald-50"
                    : "border-stone-200 bg-white hover:border-emerald-300",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-medium text-stone-950">{path.name}</span>
                  <span className="mt-1 block text-sm text-stone-600">{path.tagline}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-stone-500">
                  {path.steps.length} steps
                  <ArrowRight className="h-4 w-4 text-stone-400" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to categories
            </Button>
          </div>
        </section>
      )}

      {currentStep === 3 && selectedPath && (
        <section className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-950">
                  Pick a tool for each step
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Each step has its own set of tools — choose one per step, or let us fill it in.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">
                  {selectedCount}/{totalSteps} selected
                </Badge>
                <Button type="button" variant="outline" onClick={handleAutoFill}>
                  <Wand2 className="h-4 w-4" aria-hidden="true" />
                  Auto-fill
                </Button>
              </div>
            </div>
          </div>

          <ol className="space-y-5">
            {selectedPath.steps.map((step, index) => {
              const options = getToolsForStep(step.title);
              const chosen = selectedTools[step.id];

              return (
                <li
                  key={step.id}
                  className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-800 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-stone-950">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {step.description}
                      </p>

                      {options.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {options.map((toolName) => {
                            const isChosen = chosen === toolName;
                            return (
                              <button
                                key={toolName}
                                type="button"
                                onClick={() => handleSelectTool(step.id, toolName)}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                                  isChosen
                                    ? "border-emerald-800 bg-emerald-800 text-white"
                                    : "border-stone-200 bg-white text-stone-700 hover:border-emerald-300 hover:text-emerald-800",
                                )}
                              >
                                {isChosen && (
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                                {toolName}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-stone-500">
                          No preset tools for this step — add your own below.
                        </p>
                      )}

                      <label className="mt-4 block text-sm font-medium text-stone-800">
                        Or add a custom tool
                        <input
                          className={fieldClass}
                          placeholder="Type a tool name"
                          value={
                            chosen && !options.includes(chosen) ? chosen : ""
                          }
                          onChange={(event) =>
                            handleSelectTool(step.id, event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">Stack details</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-800">
                Stack name
                <input className={fieldClass} defaultValue={selectedPath.name} />
              </label>
              <label className="block text-sm font-medium text-stone-800">
                Monthly cost estimate
                <input className={fieldClass} defaultValue={selectedPath.estimatedCost} />
              </label>
            </div>

            <label className="mt-5 block text-sm font-medium text-stone-800">
              Workflow summary
              <textarea
                className={textareaClass}
                defaultValue={selectedPath.description}
              />
            </label>

            <label className="mt-5 block text-sm font-medium text-stone-800">
              Notes for review
              <textarea
                className={textareaClass}
                placeholder="Add affiliate details, proof, screenshots, or why this workflow should be featured."
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to process
            </Button>

            <div className="flex items-center gap-4">
              <p className="text-sm text-stone-500">
                {allStepsFilled
                  ? "All steps have a tool selected."
                  : `${totalSteps - selectedCount} step(s) still empty.`}
              </p>
              <Button type="button" onClick={() => setSubmitted(true)}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Stack
              </Button>
            </div>
          </div>
        </section>
      )}

      <p className="flex items-center gap-2 text-xs text-stone-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
        Submissions are reviewed before publishing.
      </p>
    </div>
  );
}
