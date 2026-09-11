import type { Category, Path, Step, Tool } from "./types";

export const paths: Path[] = [
  {
    slug: "seo-traffic",
    name: "Steps For SEO Traffic",
    tagline: "Build a repeatable content engine that ranks and compounds.",
    description:
      "A complete workflow for turning keyword research into published, tracked articles that grow organic traffic over time.",
    category: "Traffic",
    difficulty: "Intermediate",
    estimatedCost: "$29 - $149/mo",
    estimatedTime: "2-4 weeks to first results",
    steps: [
      {
        id: "generate-content-ideas",
        title: "Generate content ideas",
        description:
          "Find high-intent keywords and cluster them into topics your audience is actively searching for.",
        tools: [
          {
            name: "ChatGPT",
            description: "Brainstorm topic clusters and outlines from a seed keyword.",
            url: "https://chat.openai.com",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Fast ideation and outlining",
          },
          {
            name: "Ahrefs",
            description: "Keyword research with search volume and difficulty data.",
            url: "https://ahrefs.com",
            price: "$129/mo",
            difficulty: "Intermediate",
            bestFor: "Data-driven keyword selection",
          },
        ],
      },
      {
        id: "write-long-form-articles",
        title: "Write long-form articles",
        description:
          "Produce in-depth, well-structured articles that satisfy search intent and are easy to scan.",
        tools: [
          {
            name: "Jasper",
            description: "AI writing assistant tuned for marketing and SEO content.",
            url: "https://jasper.ai",
            price: "$49/mo",
            difficulty: "Beginner",
            bestFor: "Scaling content production",
          },
          {
            name: "Surfer SEO",
            description: "Optimize drafts against top-ranking pages in real time.",
            url: "https://surferseo.com",
            price: "$99/mo",
            difficulty: "Intermediate",
            bestFor: "On-page optimization",
          },
        ],
      },
      {
        id: "publish-to-a-blog",
        title: "Publish to a blog",
        description:
          "Ship articles on a fast, SEO-friendly platform with clean URLs and structured data.",
        tools: [
          {
            name: "Ghost",
            description: "Modern publishing platform with built-in SEO and newsletters.",
            url: "https://ghost.org",
            price: "$9/mo",
            difficulty: "Beginner",
            bestFor: "Content-first blogs",
          },
          {
            name: "WordPress",
            description: "Flexible CMS with the largest plugin ecosystem.",
            url: "https://wordpress.org",
            price: "Free - $25/mo",
            difficulty: "Intermediate",
            bestFor: "Full control and customization",
          },
        ],
      },
      {
        id: "track-performance",
        title: "Track performance",
        description:
          "Monitor rankings, traffic, and conversions to double down on what works.",
        tools: [
          {
            name: "Google Analytics",
            description: "Traffic and conversion analytics for every published page.",
            url: "https://analytics.google.com",
            price: "Free",
            difficulty: "Beginner",
            bestFor: "Traffic and behavior tracking",
          },
          {
            name: "Google Search Console",
            description: "Query-level impressions, clicks, and indexing health.",
            url: "https://search.google.com/search-console",
            price: "Free",
            difficulty: "Beginner",
            bestFor: "Search performance monitoring",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-content-automation",
    name: "Steps For AI Content Automation",
    tagline: "Turn one idea into a multi-channel content pipeline.",
    description:
      "Automate research, drafting, repurposing, and scheduling so a single piece of content reaches every channel.",
    category: "Content",
    difficulty: "Intermediate",
    estimatedCost: "$40 - $200/mo",
    estimatedTime: "1-2 weeks to set up",
    steps: [
      {
        id: "research-and-brief",
        title: "Research and brief",
        description: "Collect sources and generate a structured brief for each piece.",
        tools: [
          {
            name: "Perplexity",
            description: "AI research assistant with cited sources.",
            url: "https://perplexity.ai",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Fast, sourced research",
          },
        ],
      },
      {
        id: "generate-drafts",
        title: "Generate drafts",
        description: "Produce first drafts in your brand voice across formats.",
        tools: [
          {
            name: "Claude",
            description: "Long-context AI for nuanced, on-brand long-form drafts.",
            url: "https://claude.ai",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "High-quality long-form writing",
          },
          {
            name: "Copy.ai",
            description: "Templated generation for short-form and marketing copy.",
            url: "https://copy.ai",
            price: "$49/mo",
            difficulty: "Beginner",
            bestFor: "Bulk short-form copy",
          },
        ],
      },
      {
        id: "repurpose-content",
        title: "Repurpose content",
        description: "Convert long-form into social posts, threads, and clips.",
        tools: [
          {
            name: "Opus Clip",
            description: "Turns long videos into short, captioned clips automatically.",
            url: "https://opus.pro",
            price: "$19/mo",
            difficulty: "Beginner",
            bestFor: "Video repurposing",
          },
          {
            name: "Repurpose.io",
            description: "Automatically distributes content across platforms.",
            url: "https://repurpose.io",
            price: "$25/mo",
            difficulty: "Intermediate",
            bestFor: "Cross-platform distribution",
          },
        ],
      },
      {
        id: "schedule-and-publish",
        title: "Schedule and publish",
        description: "Queue everything and publish on an optimal cadence.",
        tools: [
          {
            name: "Buffer",
            description: "Schedule and analyze posts across social channels.",
            url: "https://buffer.com",
            price: "$6/mo",
            difficulty: "Beginner",
            bestFor: "Simple social scheduling",
          },
        ],
      },
    ],
  },
  {
    slug: "fast-saas-mvp-launch",
    name: "Steps For Fast SaaS MVP Launch",
    tagline: "Go from idea to a live, paying product in days.",
    description:
      "A lean stack for building, hosting, and monetizing a SaaS MVP without a large engineering team.",
    category: "Launch",
    difficulty: "Intermediate",
    estimatedCost: "$0 - $100/mo",
    estimatedTime: "3-10 days",
    steps: [
      {
        id: "build-the-app",
        title: "Build the app",
        description: "Ship a working frontend and backend fast with AI-assisted tooling.",
        tools: [
          {
            name: "Bolt.new",
            description: "Prompt-to-app builder for full-stack prototypes.",
            url: "https://bolt.new",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Rapid prototyping",
          },
          {
            name: "Cursor",
            description: "AI-native code editor for building production features.",
            url: "https://cursor.com",
            price: "$20/mo",
            difficulty: "Intermediate",
            bestFor: "Serious development speed",
          },
        ],
      },
      {
        id: "add-backend-and-auth",
        title: "Add backend and auth",
        description: "Wire up a database, authentication, and APIs in minutes.",
        tools: [
          {
            name: "Supabase",
            description: "Postgres database, auth, and storage with a generous free tier.",
            url: "https://supabase.com",
            price: "Free - $25/mo",
            difficulty: "Intermediate",
            bestFor: "Backend without the ops",
          },
          {
            name: "Clerk",
            description: "Drop-in authentication and user management.",
            url: "https://clerk.com",
            price: "Free - $25/mo",
            difficulty: "Beginner",
            bestFor: "Fast, polished auth",
          },
        ],
      },
      {
        id: "add-payments",
        title: "Add payments",
        description: "Accept subscriptions and one-time payments with minimal code.",
        tools: [
          {
            name: "Stripe",
            description: "Payments, subscriptions, and billing infrastructure.",
            url: "https://stripe.com",
            price: "2.9% + 30¢",
            difficulty: "Intermediate",
            bestFor: "Full billing control",
          },
          {
            name: "Lemon Squeezy",
            description: "Merchant of record handling tax and compliance.",
            url: "https://lemonsqueezy.com",
            price: "5% + 50¢",
            difficulty: "Beginner",
            bestFor: "Selling globally without tax headaches",
          },
        ],
      },
      {
        id: "deploy-and-monitor",
        title: "Deploy and monitor",
        description: "Push to production and keep an eye on uptime and errors.",
        tools: [
          {
            name: "Vercel",
            description: "Zero-config deployment for Next.js with previews.",
            url: "https://vercel.com",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "Frontend hosting",
          },
          {
            name: "Sentry",
            description: "Error tracking and performance monitoring.",
            url: "https://sentry.io",
            price: "Free - $26/mo",
            difficulty: "Intermediate",
            bestFor: "Catching production errors",
          },
        ],
      },
    ],
  },
  {
    slug: "newsletter-growth",
    name: "Steps For Newsletter Growth",
    tagline: "Grow an engaged list and turn it into a business.",
    description:
      "Capture subscribers, keep them engaged, and monetize your audience with a repeatable newsletter workflow.",
    category: "Content",
    difficulty: "Beginner",
    estimatedCost: "$0 - $99/mo",
    estimatedTime: "Ongoing",
    steps: [
      {
        id: "capture-subscribers",
        title: "Capture subscribers",
        description: "Turn visitors into subscribers with high-converting opt-in forms.",
        tools: [
          {
            name: "ConvertKit",
            description: "Email marketing built for creators with automations.",
            url: "https://convertkit.com",
            price: "Free - $29/mo",
            difficulty: "Beginner",
            bestFor: "Creator-focused email",
          },
        ],
      },
      {
        id: "write-and-send",
        title: "Write and send",
        description: "Draft, format, and schedule issues that people actually open.",
        tools: [
          {
            name: "Beehiiv",
            description: "Newsletter platform with growth and monetization tools.",
            url: "https://beehiiv.com",
            price: "Free - $49/mo",
            difficulty: "Beginner",
            bestFor: "Newsletter growth and ads",
          },
        ],
      },
      {
        id: "grow-the-list",
        title: "Grow the list",
        description: "Run referrals and cross-promotions to compound subscribers.",
        tools: [
          {
            name: "SparkLoop",
            description: "Paid and organic newsletter recommendation network.",
            url: "https://sparkloop.app",
            price: "Free - $99/mo",
            difficulty: "Intermediate",
            bestFor: "Accelerating list growth",
          },
        ],
      },
      {
        id: "monetize",
        title: "Monetize",
        description: "Add sponsorships or paid tiers to turn attention into revenue.",
        tools: [
          {
            name: "Stripe",
            description: "Charge for paid subscriptions and one-off products.",
            url: "https://stripe.com",
            price: "2.9% + 30¢",
            difficulty: "Intermediate",
            bestFor: "Paid subscriptions",
          },
        ],
      },
    ],
  },
  {
    slug: "cold-outreach",
    name: "Steps For Cold Outreach",
    tagline: "Fill your pipeline with qualified conversations.",
    description:
      "Find prospects, personalize at scale, and book meetings with a compliant outbound workflow.",
    category: "Sales",
    difficulty: "Intermediate",
    estimatedCost: "$100 - $400/mo",
    estimatedTime: "1-2 weeks to first meetings",
    steps: [
      {
        id: "build-prospect-list",
        title: "Build a prospect list",
        description: "Source and enrich leads that match your ideal customer profile.",
        tools: [
          {
            name: "Apollo",
            description: "B2B contact database with filtering and enrichment.",
            url: "https://apollo.io",
            price: "Free - $49/mo",
            difficulty: "Beginner",
            bestFor: "Sourcing B2B leads",
          },
        ],
      },
      {
        id: "send-sequences",
        title: "Send sequences",
        description: "Run multi-step email sequences with warm-up and deliverability controls.",
        tools: [
          {
            name: "Instantly",
            description: "Cold email platform with inbox warm-up and rotation.",
            url: "https://instantly.ai",
            price: "$37/mo",
            difficulty: "Intermediate",
            bestFor: "High-volume cold email",
          },
          {
            name: "Smartlead",
            description: "Scalable sending infrastructure with unified inboxes.",
            url: "https://smartlead.ai",
            price: "$39/mo",
            difficulty: "Intermediate",
            bestFor: "Agency-scale outreach",
          },
        ],
      },
      {
        id: "track-and-crm",
        title: "Track and CRM",
        description: "Log replies, track deals, and keep follow-ups from slipping.",
        tools: [
          {
            name: "HubSpot",
            description: "Free CRM with pipeline tracking and email integration.",
            url: "https://hubspot.com",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "Managing the pipeline",
          },
        ],
      },
      {
        id: "book-meetings",
        title: "Book meetings",
        description: "Remove scheduling friction and confirm calls automatically.",
        tools: [
          {
            name: "Calendly",
            description: "Automated scheduling with reminders and routing.",
            url: "https://calendly.com",
            price: "Free - $12/mo",
            difficulty: "Beginner",
            bestFor: "Frictionless booking",
          },
        ],
      },
    ],
  },
  {
    slug: "tiktok-and-shorts-content",
    name: "Steps For TikTok and Shorts Content",
    tagline: "Produce short-form video that actually gets watched.",
    description:
      "A repeatable system for scripting, filming, editing, and posting short-form video across platforms.",
    category: "Content",
    difficulty: "Beginner",
    estimatedCost: "$0 - $80/mo",
    estimatedTime: "Ongoing",
    steps: [
      {
        id: "find-hooks-and-trends",
        title: "Find hooks and trends",
        description: "Spot trending formats and write hooks that stop the scroll.",
        tools: [
          {
            name: "TikTok Creative Center",
            description: "Official trend, hashtag, and sound discovery tool.",
            url: "https://ads.tiktok.com/business/creativecenter",
            price: "Free",
            difficulty: "Beginner",
            bestFor: "Trend research",
          },
        ],
      },
      {
        id: "script-and-film",
        title: "Script and film",
        description: "Turn ideas into tight scripts and record clean footage.",
        tools: [
          {
            name: "CapCut",
            description: "All-in-one editor with templates, captions, and effects.",
            url: "https://capcut.com",
            price: "Free - $8/mo",
            difficulty: "Beginner",
            bestFor: "Editing and captions",
          },
        ],
      },
      {
        id: "edit-and-caption",
        title: "Edit and caption",
        description: "Add captions, b-roll, and pacing that boosts retention.",
        tools: [
          {
            name: "Descript",
            description: "Text-based video editing with auto captions.",
            url: "https://descript.com",
            price: "$12/mo",
            difficulty: "Beginner",
            bestFor: "Fast, text-based editing",
          },
        ],
      },
      {
        id: "schedule-and-analyze",
        title: "Schedule and analyze",
        description: "Post consistently and learn from retention and watch-time data.",
        tools: [
          {
            name: "Metricool",
            description: "Schedule and analyze content across social platforms.",
            url: "https://metricool.com",
            price: "Free - $18/mo",
            difficulty: "Beginner",
            bestFor: "Cross-platform analytics",
          },
        ],
      },
    ],
  },
  {
    slug: "customer-support-automation",
    name: "Steps For Customer Support Automation",
    tagline: "Resolve more tickets with less headcount.",
    description:
      "Deflect common questions, route complex issues, and measure satisfaction with an automated support stack.",
    category: "Support",
    difficulty: "Intermediate",
    estimatedCost: "$50 - $300/mo",
    estimatedTime: "1-3 weeks",
    steps: [
      {
        id: "centralize-conversations",
        title: "Centralize conversations",
        description: "Bring email, chat, and social into one shared inbox.",
        tools: [
          {
            name: "Intercom",
            description: "Shared inbox, messenger, and automation in one platform.",
            url: "https://intercom.com",
            price: "$39/mo",
            difficulty: "Intermediate",
            bestFor: "Unified customer messaging",
          },
        ],
      },
      {
        id: "build-a-knowledge-base",
        title: "Build a knowledge base",
        description: "Publish help articles that deflect repeat questions.",
        tools: [
          {
            name: "Notion",
            description: "Flexible docs that double as an internal or public wiki.",
            url: "https://notion.so",
            price: "Free - $10/mo",
            difficulty: "Beginner",
            bestFor: "Fast help center setup",
          },
        ],
      },
      {
        id: "automate-responses",
        title: "Automate responses",
        description: "Use AI to draft replies and resolve common requests instantly.",
        tools: [
          {
            name: "Zendesk",
            description: "Ticketing with AI answer bots and workflow automation.",
            url: "https://zendesk.com",
            price: "$55/mo",
            difficulty: "Advanced",
            bestFor: "Enterprise-grade support",
          },
          {
            name: "Tidio",
            description: "Live chat and chatbots with simple automation flows.",
            url: "https://tidio.com",
            price: "Free - $29/mo",
            difficulty: "Beginner",
            bestFor: "Small teams and SMBs",
          },
        ],
      },
      {
        id: "measure-satisfaction",
        title: "Measure satisfaction",
        description: "Track CSAT and response times to find bottlenecks.",
        tools: [
          {
            name: "Delighted",
            description: "Automated NPS and CSAT surveys with reporting.",
            url: "https://delighted.com",
            price: "Free - $224/mo",
            difficulty: "Beginner",
            bestFor: "Customer satisfaction tracking",
          },
        ],
      },
    ],
  },
  {
    slug: "landing-page-and-payments",
    name: "Steps For Landing Page and Payments",
    tagline: "Launch a page that converts and takes money.",
    description:
      "Design, build, and optimize a high-converting landing page wired to a payment provider.",
    category: "Revenue",
    difficulty: "Beginner",
    estimatedCost: "$0 - $60/mo",
    estimatedTime: "2-5 days",
    steps: [
      {
        id: "write-the-copy",
        title: "Write the copy",
        description: "Craft a clear value proposition, headline, and call to action.",
        tools: [
          {
            name: "ChatGPT",
            description: "Draft and iterate on headlines, copy, and CTAs.",
            url: "https://chat.openai.com",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Copy iteration",
          },
        ],
      },
      {
        id: "build-the-page",
        title: "Build the page",
        description: "Ship a fast, responsive landing page without a developer.",
        tools: [
          {
            name: "Framer",
            description: "Design-first site builder with responsive layouts.",
            url: "https://framer.com",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "Design-heavy pages",
          },
          {
            name: "Webflow",
            description: "Visual development platform with full CMS control.",
            url: "https://webflow.com",
            price: "Free - $29/mo",
            difficulty: "Intermediate",
            bestFor: "Complex marketing sites",
          },
        ],
      },
      {
        id: "connect-payments",
        title: "Connect payments",
        description: "Add checkout and subscriptions with minimal integration work.",
        tools: [
          {
            name: "Stripe",
            description: "Checkout, subscriptions, and payment links.",
            url: "https://stripe.com",
            price: "2.9% + 30¢",
            difficulty: "Intermediate",
            bestFor: "Developer-friendly payments",
          },
          {
            name: "Gumroad",
            description: "Sell digital products with a hosted checkout.",
            url: "https://gumroad.com",
            price: "10% per sale",
            difficulty: "Beginner",
            bestFor: "Selling digital products fast",
          },
        ],
      },
      {
        id: "optimize-conversion",
        title: "Optimize conversion",
        description: "Test variants and analyze behavior to lift conversion rate.",
        tools: [
          {
            name: "PostHog",
            description: "Product analytics, session replay, and A/B testing.",
            url: "https://posthog.com",
            price: "Free - $50/mo",
            difficulty: "Intermediate",
            bestFor: "Conversion experimentation",
          },
        ],
      },
    ],
  },
];

export const categories: Category[] = [
  "Traffic",
  "Content",
  "Revenue",
  "Automation",
  "Launch",
  "Sales",
  "Support",
];

export function getPathBySlug(slug: string): Path | undefined {
  return paths.find((path) => path.slug === slug);
}

export function getPathsByCategory(category: Category): Path[] {
  return paths.filter((path) => path.category === category);
}

export function getCategoryCount(category: Category): number {
  return getPathsByCategory(category).length;
}

export function toToolSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ToolWithContext {
  tool: Tool;
  path: Path;
  step: Step;
}

export function getAllTools(): ToolWithContext[] {
  return paths.flatMap((path) =>
    path.steps.flatMap((step) => step.tools.map((tool) => ({ tool, path, step }))),
  );
}

export function getToolBySlug(slug: string): ToolWithContext | undefined {
  return getAllTools().find((entry) => toToolSlug(entry.tool.name) === slug);
}

export function getToolSlugs(): string[] {
  return Array.from(new Set(getAllTools().map((entry) => toToolSlug(entry.tool.name))));
}

export function getPathsForTool(toolName: string): Path[] {
  return paths.filter((path) =>
    path.steps.some((step) => step.tools.some((tool) => tool.name === toolName)),
  );
}
