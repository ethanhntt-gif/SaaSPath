# SaaSPath

Find the right tools for the job. SaaSPath is a workflow-first SaaS discovery
platform built around a simple model:

**Workflow → Steps → Tools → Paths**

A workflow is canonical and reusable (e.g. "Create a YouTube Video"). Different
combinations of tools form different **paths** through that workflow.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui primitives
- Lucide icons

This is the **frontend foundation only** — no backend, auth, database, or
external APIs yet. All content renders from local mock data.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |

## Project structure

```
app/
  layout.tsx          Root layout (navbar + footer shell)
  page.tsx            Homepage composed from sections
  globals.css         Tailwind + design tokens
components/
  home/               Homepage sections (hero, workflows, builder, tools, CTA)
  layout/             navbar, footer
  workflows/          workflow-card, workflow-chain, workflow-step
  tools/              tool-card, tool-category-card
  paths/              path-preview
  ui/                 shadcn/ui primitives
lib/
  mock-data.ts        Types (Tool, Workflow, WorkflowStep, Path) + mock data
  utils.ts            cn() helper
```

## Design principles

- Workflow-first: the workflow chain is the primary visual element.
- Restrained design system: neutral backgrounds, subtle borders, strong
  hierarchy, compact metadata.
- Responsive: horizontal scrolling for workflow chains on smaller screens,
  no horizontal page overflow.
