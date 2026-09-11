"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Package,
  Route,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { paths } from "@/lib/paths";
import {
  getPathHref,
  getProductHref,
  getProductsForPath,
  saveProduct,
  type Product,
} from "@/lib/submissions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

const textareaClass =
  "mt-2 min-h-28 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

type StepNumber = 1 | 2 | 3;

const stepLabels: Record<StepNumber, string> = {
  1: "Project",
  2: "Details",
  3: "Tools per step",
};

export function SubmitStackForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  // Whether the visitor is signed in. Submitting requires an account.
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The chosen project (path) defines the fixed set of steps.
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  // The step this product belongs to — required, one of the process steps.
  const [productStepId, setProductStepId] = useState<string | null>(null);
  // One selected product per step id — each step keeps its own choice.
  // The value is the product id, resolved to a name when saving.
  const [selectedTools, setSelectedTools] = useState<Record<string, string>>({});
  // Products created for the selected process, grouped by their step id.
  // Step 3 offers only these DB products instead of a static tool catalog.
  const [productsByStep, setProductsByStep] = useState<Record<string, Product[]>>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // URL of the created product page (/products/<productId>).
  const [productHref, setProductHref] = useState<string | null>(null);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setIsAuthed(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthed(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const selectedPath = useMemo(
    () => paths.find((path) => path.slug === projectSlug) ?? null,
    [projectSlug],
  );

  // Steps are strictly defined by the selected project — no cross-path mixing.
  const steps = selectedPath?.steps ?? [];

  // Load the products created for this process and group them by step id, so
  // each step's dropdown lists only products from the database for that step.
  useEffect(() => {
    if (!projectSlug) {
      setProductsByStep({});
      return;
    }

    let cancelled = false;
    setProductsLoading(true);

    getProductsForPath(projectSlug)
      .then((products) => {
        if (cancelled) return;
        const grouped: Record<string, Product[]> = {};
        for (const product of products) {
          (grouped[product.stepId] ??= []).push(product);
        }
        setProductsByStep(grouped);
      })
      .catch(() => {
        if (!cancelled) setProductsByStep({});
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectSlug]);

  function handleSelectProject(slug: string) {
    setProjectSlug(slug);
    setProductStepId(null);
    setSelectedTools({});
  }

  function handleSelectTool(stepId: string, productId: string) {
    setSelectedTools((prev) => {
      // Clear the choice when the empty option is picked.
      if (!productId) {
        const next = { ...prev };
        delete next[stepId];
        return next;
      }
      return { ...prev, [stepId]: productId };
    });
  }

  function handleAutoFill() {
    const filled: Record<string, string> = {};
    for (const step of steps) {
      // The product step shows the product itself — no product to pick.
      if (step.id === productStepId) continue;
      const options = productsByStep[step.id] ?? [];
      if (options.length === 0) continue;
      // Pick a random product every time the button is clicked.
      const pick = options[Math.floor(Math.random() * options.length)];
      filled[step.id] = pick.id;
    }
    setSelectedTools(filled);
  }

  async function handleSubmit() {
    if (!projectSlug || !productStepId) return;

    // Submitting requires an account so the product can be owned by the user.
    if (!isAuthed) {
      router.push("/login?next=/submit-stack");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Create the product and attach it to the chosen process (path) and step.
      // The process page is derived automatically from the path slug, and the
      // catalog name is stored so the saaspath record gets a proper name.
      // Resolve the selected product ids to their names for storage.
      const selectedToolNames: Record<string, string> = {};
      for (const [stepId, productId] of Object.entries(selectedTools)) {
        const match = (productsByStep[stepId] ?? []).find(
          (item) => item.id === productId,
        );
        if (match) selectedToolNames[stepId] = match.name;
      }

      const product = await saveProduct({
        pathSlug: projectSlug,
        pathName: selectedPath?.name ?? "",
        stepId: productStepId,
        name: projectName,
        url: projectUrl,
        description: projectDescription,
        selectedTools: selectedToolNames,
      });
      setProductHref(getProductHref(product.id, product.slug));
      setSubmitted(true);
    } catch (error) {
      if (error instanceof Error && error.message === "AUTH_REQUIRED") {
        router.push("/login?next=/submit-stack");
        return;
      }
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save your submission. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCurrentStep(1);
    setProjectSlug(null);
    setProductStepId(null);
    setSelectedTools({});
    setProjectName("");
    setProjectUrl("");
    setProjectDescription("");
    setSubmitted(false);
    setProductHref(null);
    setSubmitError(null);
  }

  const selectedCount = Object.keys(selectedTools).length;
  const totalSteps = steps.length;
  // The product step is occupied by the product itself, so it needs no tool.
  const toolSteps = steps.filter((step) => step.id !== productStepId).length;
  const allStepsFilled = toolSteps > 0 && selectedCount === toolSteps;

  if (submitted && selectedPath) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
            Product created
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600">
            <strong>{projectName || selectedPath.name}</strong> was created and attached
            to the <strong>{selectedPath.name}</strong> process.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline">{selectedPath.category}</Badge>
            <Badge variant="outline">{totalSteps} steps</Badge>
            <Badge variant="outline">{selectedCount} tools</Badge>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={productHref ?? getPathHref(selectedPath.slug)}>
                <Package className="h-4 w-4" aria-hidden="true" />
                Open product
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={getPathHref(selectedPath.slug)}>
                <Route className="h-4 w-4" aria-hidden="true" />
                Open process
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Create another
            </Button>
          </div>
        </div>
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
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
            Step 1 of 3
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Steps For
          </h2>

          <div className="mt-5 max-w-xl">
            <Combobox
              options={paths.map((path) =>
                path.name.replace(/^Steps For\s+/, ""),
              )}
              value={
                selectedPath
                  ? selectedPath.name.replace(/^Steps For\s+/, "")
                  : ""
              }
              onChange={(label) => {
                const path = paths.find(
                  (item) => item.name.replace(/^Steps For\s+/, "") === label,
                );
                if (path) handleSelectProject(path.slug);
              }}
              placeholder="Select a workflow…"
              emptyText="No workflows available"
              searchable={false}
            />
          </div>

          {selectedPath && (
            <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{selectedPath.category}</Badge>
                <Badge variant="outline">{selectedPath.steps.length} steps</Badge>
              </div>
              <p className="mt-3 text-sm font-semibold text-stone-900">
                {selectedPath.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {selectedPath.tagline}
              </p>
              <ol className="mt-3 space-y-1.5">
                {selectedPath.steps.map((step, index) => (
                  <li
                    key={step.id}
                    className="flex items-start gap-2 text-sm text-stone-700"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-800 text-[11px] font-semibold text-white">
                      {index + 1}
                    </span>
                    {step.title}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6 flex justify-end border-t border-stone-200 pt-5">
            <Button
              type="button"
              disabled={!projectSlug}
              onClick={() => setCurrentStep(2)}
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      )}

      {currentStep === 2 && selectedPath && (
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
              Step 2 of 3
            </span>
            <Badge>{selectedPath.category}</Badge>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Tell us about your project
          </h2>
          <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
              Selected workflow
            </p>
            <p className="mt-1 text-base font-semibold text-stone-900">
              {selectedPath.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              {selectedPath.tagline}
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Describe the project this stack powers. Next you'll choose a tool for each of
            the {totalSteps} fixed steps in <strong>{selectedPath.name}</strong>.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-800">
              Project name
              <input
                className={fieldClass}
                placeholder="e.g. Acme Analytics"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-stone-800">
              Project URL
              <input
                className={fieldClass}
                placeholder="https://example.com"
                value={projectUrl}
                onChange={(event) => setProjectUrl(event.target.value)}
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-medium text-stone-800">
            What does your project do?
            <textarea
              className={textareaClass}
              placeholder="Describe your product, audience, and what you're trying to achieve."
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
          </label>

          <div className="mt-5 max-w-md">
            <p className="text-sm font-medium text-stone-800">
              Which step does this product belong to?
              <span className="ml-1 text-emerald-700">*</span>
            </p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              Required. Pick one of the {totalSteps} steps in{" "}
              <strong>{selectedPath.name}</strong>.
            </p>
            <Combobox
              options={steps.map((step) => step.title)}
              value={
                steps.find((step) => step.id === productStepId)?.title ?? ""
              }
              onChange={(title) => {
                const step = steps.find((item) => item.title === title);
                setProductStepId(step ? step.id : null);
              }}
              placeholder="Select a step…"
              emptyText="No steps available"
              searchable={false}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to projects
            </Button>
            <div className="flex items-center gap-4">
              {!productStepId && (
                <p className="text-sm text-stone-500">
                  Select a step to continue.
                </p>
              )}
              <Button
                type="button"
                disabled={!productStepId}
                onClick={() => setCurrentStep(3)}
              >
                Continue to tools
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
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
                  The {totalSteps} steps below are fixed by{" "}
                  <strong>{selectedPath.name}</strong> — your product occupies one step,
                  choose a tool for each of the other {toolSteps}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">
                  {selectedCount}/{toolSteps} tools selected
                </Badge>
                <Button type="button" variant="outline" onClick={handleAutoFill}>
                  <Wand2 className="h-4 w-4" aria-hidden="true" />
                  Auto-fill
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-4">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                Workflow
              </span>
              <Badge>{selectedPath.category}</Badge>
              <span className="text-sm font-semibold text-stone-900">
                {selectedPath.name}
              </span>
            </div>
          </div>

          <ol className="space-y-5">
            {steps.map((step, index) => {
              const stepProducts = productsByStep[step.id] ?? [];
              const options = stepProducts.map((product) => product.name);
              const chosenId = selectedTools[step.id];
              const chosen = chosenId
                ? stepProducts.find((product) => product.id === chosenId)?.name ?? ""
                : "";
              const isProductStep = step.id === productStepId;

              return (
                <li
                  key={step.id}
                  className={
                    isProductStep
                      ? "rounded-xl border border-emerald-400 bg-emerald-50/40 p-6 shadow-sm ring-1 ring-emerald-200"
                      : "rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                  }
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-800 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-stone-950">{step.title}</h3>
                        {isProductStep && (
                          <Badge variant="outline">Product step</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {step.description}
                      </p>

                      {isProductStep ? (
                        <div className="mt-4 rounded-lg border border-emerald-300 bg-white p-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                            Your product
                          </span>
                          <p className="mt-1 font-semibold text-stone-950">
                            {projectName || selectedPath.name}
                          </p>
                          {projectDescription && (
                            <p className="mt-1 text-sm leading-6 text-stone-600">
                              {projectDescription}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-stone-500">
                            This step is occupied by your product — no tool needed.
                          </p>
                        </div>
                      ) : options.length > 0 ? (
                        <label className="mt-4 block text-sm font-medium text-stone-800">
                          Choose a product
                          <Combobox
                            options={options}
                            value={chosen}
                            onChange={(productName) => {
                              const picked = stepProducts.find(
                                (product) => product.name === productName,
                              );
                              handleSelectTool(step.id, picked?.id ?? "");
                            }}
                            placeholder="Select a product…"
                            searchPlaceholder="Search products…"
                            emptyText="No products match your search"
                          />
                        </label>
                      ) : (
                        <p className="mt-4 text-sm text-stone-500">
                          {productsLoading
                            ? "Loading products…"
                            : "No products created for this step yet."}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to project
            </Button>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <p className="text-sm text-stone-500">
                  {allStepsFilled
                    ? "All steps are covered."
                    : `${toolSteps - selectedCount} step(s) still empty.`}
                </p>
                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                  {submitting ? "Sending…" : "Send"}
                </Button>
              </div>
              {submitError ? (
                <p className="text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              ) : null}
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
