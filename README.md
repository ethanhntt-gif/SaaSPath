# SaaSPath

SaaSPath is a workflow-driven SaaS directory for discovering ready-made software stacks built around practical goals.

Instead of browsing isolated tools, users explore complete paths such as content automation, SEO traffic, MVP launch, sales outreach, customer support, and creator workflows. Each path breaks a goal into clear steps and suggests SaaS products for every stage of the workflow.

## Product Concept

Most SaaS directories are organized around categories like marketing, analytics, writing, or design. SaaSPath is organized around outcomes.

The core idea is simple:

```text
Goal -> Steps -> Tools -> Stack
```

Example:

```text
Steps For SEO Traffic
1. Generate content ideas
2. Write long-form articles
3. Publish to a blog
4. Track performance
```

Each step can include several SaaS options, letting users compare tools by budget, difficulty, use case, and workflow fit.

## Core Features

- Workflow-first SaaS discovery
- Curated paths for specific goals
- Tool recommendations for each step
- Stack-based browsing instead of category-only browsing
- Submit Stack flow for community or founder-submitted workflows
- Clean App Router foundation with reusable layout components

## Initial Paths

- Steps For SEO Traffic
- Steps For AI Content Automation
- Steps For Fast SaaS MVP Launch
- Steps For Newsletter Growth
- Steps For Cold Outreach
- Steps For TikTok and Shorts Content
- Steps For Customer Support Automation
- Steps For Landing Page and Payments

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Lucide Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Build for production:

```bash
npm run build
```

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  Footer.tsx
  Header.tsx
  ui/
    button.tsx
lib/
  utils.ts
```

## Positioning

SaaSPath helps founders, marketers, creators, and small teams find the right SaaS workflow for their next goal.

Tagline:

```text
Don't browse tools. Follow the path.
```
