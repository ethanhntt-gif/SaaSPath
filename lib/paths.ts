import type { Category, Path, Step, Tool } from "./types";

export const paths: Path[] = [
  {
    slug: "ai-startup-mvp",
    name: "Steps For Launching an AI Startup MVP",
    tagline: "From app prototype to first payments in a couple of days.",
    description:
      "A lean stack for shipping an AI-powered MVP: build the interface, wire up the database and auth, add AI logic, and start taking payments.",
    category: "Launch",
    difficulty: "Intermediate",
    estimatedCost: "$0 - $120/mo",
    estimatedTime: "2-5 days",
    steps: [
      {
        id: "frontend-and-ui",
        title: "Frontend & UI",
        description: "Build a fast prototype of the product interface.",
        tools: [
          {
            name: "Lovable",
            description: "AI app builder that turns prompts into full-stack UIs.",
            url: "https://lovable.dev",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "Rapid UI prototyping",
          },
          {
            name: "Bolt.new",
            description: "Prompt-to-app builder for full-stack prototypes.",
            url: "https://bolt.new",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Rapid prototyping",
          },
          {
            name: "v0",
            description: "Generate React and Tailwind UI from a prompt.",
            url: "https://v0.dev",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "UI generation",
          },
        ],
      },
      {
        id: "database-and-auth",
        title: "Database & Auth",
        description: "Add a database, authentication, and APIs.",
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
            name: "Firebase",
            description: "Managed database, auth, and hosting from Google.",
            url: "https://firebase.google.com",
            price: "Free - $25/mo",
            difficulty: "Intermediate",
            bestFor: "Realtime apps and auth",
          },
        ],
      },
      {
        id: "ai-logic-and-backend",
        title: "AI Logic & Backend",
        description: "Connect the AI models and backend logic that power the product.",
        tools: [
          {
            name: "OpenRouter",
            description: "Unified API for hundreds of AI models.",
            url: "https://openrouter.ai",
            price: "Pay as you go",
            difficulty: "Intermediate",
            bestFor: "Model routing and access",
          },
          {
            name: "Replicate",
            description: "Run and fine-tune open-source AI models via API.",
            url: "https://replicate.com",
            price: "Pay as you go",
            difficulty: "Intermediate",
            bestFor: "Hosting AI models",
          },
        ],
      },
      {
        id: "billing-and-payments",
        title: "Billing & Payments",
        description: "Accept subscriptions and one-time payments.",
        tools: [
          {
            name: "Lemon Squeezy",
            description: "Merchant of record handling tax and compliance.",
            url: "https://lemonsqueezy.com",
            price: "5% + 50¢",
            difficulty: "Beginner",
            bestFor: "Selling globally without tax headaches",
          },
          {
            name: "Paddle",
            description: "Merchant of record for SaaS billing and subscriptions.",
            url: "https://paddle.com",
            price: "5% + 50¢",
            difficulty: "Intermediate",
            bestFor: "Global SaaS billing",
          },
        ],
      },
    ],
  },
  {
    slug: "organic-video-content-factory",
    name: "Steps For Organic Video Content Factory",
    tagline: "Automatically turn one script into Shorts, TikTok, and Reels.",
    description:
      "A repeatable pipeline for scripting, voicing, generating, and publishing short-form video at scale.",
    category: "Content",
    difficulty: "Beginner",
    estimatedCost: "$30 - $150/mo",
    estimatedTime: "1-2 weeks to set up",
    steps: [
      {
        id: "scripting",
        title: "Scripting",
        description: "Generate scripts and content ideas for short-form video.",
        tools: [
          {
            name: "ChatGPT",
            description: "Brainstorm hooks, scripts, and outlines from a topic.",
            url: "https://chat.openai.com",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Fast ideation and scripting",
          },
          {
            name: "Claude",
            description: "Long-context AI for nuanced, on-brand scripts.",
            url: "https://claude.ai",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "High-quality long-form writing",
          },
        ],
      },
      {
        id: "voiceover",
        title: "Voiceover",
        description: "Produce realistic voiceovers from your scripts.",
        tools: [
          {
            name: "ElevenLabs",
            description: "Lifelike AI voice generation in many languages.",
            url: "https://elevenlabs.io",
            price: "Free - $22/mo",
            difficulty: "Beginner",
            bestFor: "Realistic AI voiceovers",
          },
          {
            name: "WellSaid",
            description: "Studio-quality AI voiceovers for video and ads.",
            url: "https://wellsaidlabs.com",
            price: "$44/mo",
            difficulty: "Intermediate",
            bestFor: "Professional narration",
          },
        ],
      },
      {
        id: "video-generation",
        title: "Video Generation",
        description: "Generate the visual content for each video.",
        tools: [
          {
            name: "HeyGen",
            description: "AI avatars and video generation from text.",
            url: "https://heygen.com",
            price: "Free - $29/mo",
            difficulty: "Beginner",
            bestFor: "AI avatar videos",
          },
          {
            name: "Runway",
            description: "Generative video editing and creation tools.",
            url: "https://runwayml.com",
            price: "Free - $15/mo",
            difficulty: "Intermediate",
            bestFor: "Generative video effects",
          },
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
        id: "scheduling-and-publishing",
        title: "Scheduling & Publishing",
        description: "Post consistently across every channel.",
        tools: [
          {
            name: "Metricool",
            description: "Schedule and analyze content across social platforms.",
            url: "https://metricool.com",
            price: "Free - $18/mo",
            difficulty: "Beginner",
            bestFor: "Cross-platform analytics",
          },
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
    slug: "programmatic-seo-blog",
    name: "Steps For Programmatic SEO Blog",
    tagline: "Generate and publish expert articles for thousands of long-tail queries.",
    description:
      "A scalable workflow for keyword research, AI article generation, publishing, and indexing at scale.",
    category: "Traffic",
    difficulty: "Intermediate",
    estimatedCost: "$50 - $250/mo",
    estimatedTime: "2-4 weeks to first results",
    steps: [
      {
        id: "keyword-research",
        title: "Keyword Research",
        description: "Find thousands of low-competition, long-tail keywords.",
        tools: [
          {
            name: "Ahrefs",
            description: "Keyword research with search volume and difficulty data.",
            url: "https://ahrefs.com",
            price: "$129/mo",
            difficulty: "Intermediate",
            bestFor: "Data-driven keyword selection",
          },
          {
            name: "LowFruits",
            description: "Find low-competition keywords with weak SERP results.",
            url: "https://lowfruits.io",
            price: "$15/mo",
            difficulty: "Beginner",
            bestFor: "Easy-to-rank keywords",
          },
        ],
      },
      {
        id: "article-generation",
        title: "Article Generation",
        description: "Produce expert articles at scale from your keyword list.",
        tools: [
          {
            name: "SEOWriting.ai",
            description: "Generate SEO-optimized articles from a keyword.",
            url: "https://seowriting.ai",
            price: "$14/mo",
            difficulty: "Beginner",
            bestFor: "Bulk article generation",
          },
          {
            name: "Writesonic",
            description: "AI writing platform for SEO and marketing content.",
            url: "https://writesonic.com",
            price: "Free - $39/mo",
            difficulty: "Beginner",
            bestFor: "Scaling content production",
          },
        ],
      },
      {
        id: "cms-and-publishing",
        title: "CMS & Publishing",
        description: "Publish articles on a fast, SEO-friendly platform.",
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
        id: "auto-indexing-and-tracking",
        title: "Auto Indexing & Tracking",
        description: "Get pages indexed fast and monitor search performance.",
        tools: [
          {
            name: "IndexNow",
            description: "Instant indexing protocol supported by major search engines.",
            url: "https://www.indexnow.org",
            price: "Free",
            difficulty: "Intermediate",
            bestFor: "Fast indexing at scale",
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
    slug: "cold-b2b-outreach-pipeline",
    name: "Steps For Cold B2B Outreach Pipeline",
    tagline: "Find decision-makers, enrich data, and send automated sequences.",
    description:
      "An outbound workflow for sourcing leads, verifying emails, running sequences, and tracking deals in a CRM.",
    category: "Sales",
    difficulty: "Intermediate",
    estimatedCost: "$100 - $400/mo",
    estimatedTime: "1-2 weeks to first meetings",
    steps: [
      {
        id: "lead-database",
        title: "Lead Database",
        description: "Source contacts that match your ideal customer profile.",
        tools: [
          {
            name: "Apollo.io",
            description: "B2B contact database with filtering and enrichment.",
            url: "https://apollo.io",
            price: "Free - $49/mo",
            difficulty: "Beginner",
            bestFor: "Sourcing B2B leads",
          },
          {
            name: "Ocean.io",
            description: "Find lookalike companies and decision-makers.",
            url: "https://ocean.io",
            price: "Custom",
            difficulty: "Intermediate",
            bestFor: "Lookalike company search",
          },
        ],
      },
      {
        id: "email-enrichment-and-verification",
        title: "Email Enrichment & Verification",
        description: "Enrich and verify emails to protect deliverability.",
        tools: [
          {
            name: "Prospeo",
            description: "Find and verify professional email addresses.",
            url: "https://prospeo.io",
            price: "Free - $39/mo",
            difficulty: "Beginner",
            bestFor: "Email finding and enrichment",
          },
          {
            name: "Debounce",
            description: "Real-time email verification and deliverability checks.",
            url: "https://debounce.io",
            price: "Pay as you go",
            difficulty: "Beginner",
            bestFor: "Email verification",
          },
        ],
      },
      {
        id: "automated-sequences",
        title: "Automated Sequences",
        description: "Run multi-step email sequences with warm-up controls.",
        tools: [
          {
            name: "Instantly.ai",
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
        id: "crm-tracking",
        title: "CRM Tracking",
        description: "Log replies, track deals, and keep follow-ups on schedule.",
        tools: [
          {
            name: "HubSpot",
            description: "Free CRM with pipeline tracking and email integration.",
            url: "https://hubspot.com",
            price: "Free - $20/mo",
            difficulty: "Beginner",
            bestFor: "Managing the pipeline",
          },
          {
            name: "Folk",
            description: "Lightweight, flexible CRM for relationship-driven teams.",
            url: "https://folk.app",
            price: "$20/mo",
            difficulty: "Beginner",
            bestFor: "Simple, modern CRM",
          },
        ],
      },
    ],
  },
  {
    slug: "automated-saas-customer-support",
    name: "Steps For Automated SaaS Customer Support",
    tagline: "Collect feedback, support users, and build a knowledge base on autopilot.",
    description:
      "A support stack for capturing ideas, publishing help docs, deflecting tickets with AI, and tracking complex issues.",
    category: "Support",
    difficulty: "Intermediate",
    estimatedCost: "$50 - $300/mo",
    estimatedTime: "1-3 weeks",
    steps: [
      {
        id: "user-feedback-and-roadmap",
        title: "User Feedback & Roadmap",
        description: "Collect ideas and prioritize what to build next.",
        tools: [
          {
            name: "Canny",
            description: "Collect feedback and manage a public roadmap.",
            url: "https://canny.io",
            price: "Free - $79/mo",
            difficulty: "Beginner",
            bestFor: "Feedback and roadmaps",
          },
          {
            name: "Featurebase",
            description: "Feedback, changelog, and support in one platform.",
            url: "https://featurebase.app",
            price: "Free - $49/mo",
            difficulty: "Beginner",
            bestFor: "All-in-one feedback",
          },
        ],
      },
      {
        id: "knowledge-base",
        title: "Knowledge Base",
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
          {
            name: "GitBook",
            description: "Documentation platform for product and help docs.",
            url: "https://gitbook.com",
            price: "Free - $8/mo",
            difficulty: "Beginner",
            bestFor: "Polished documentation",
          },
        ],
      },
      {
        id: "ai-support-widget",
        title: "AI Support Widget",
        description: "Answer common questions instantly with an AI chatbot.",
        tools: [
          {
            name: "Chatbase",
            description: "Build a custom AI chatbot trained on your docs.",
            url: "https://chatbase.co",
            price: "Free - $40/mo",
            difficulty: "Beginner",
            bestFor: "AI support chatbots",
          },
          {
            name: "Crisp",
            description: "Live chat and AI chatbot with a shared inbox.",
            url: "https://crisp.chat",
            price: "Free - $45/mo",
            difficulty: "Beginner",
            bestFor: "Chat and automation",
          },
        ],
      },
      {
        id: "ticket-tracking",
        title: "Ticket Tracking",
        description: "Route and resolve complex issues that need a human.",
        tools: [
          {
            name: "Linear",
            description: "Fast issue tracking for product and support teams.",
            url: "https://linear.app",
            price: "Free - $8/mo",
            difficulty: "Beginner",
            bestFor: "Fast issue tracking",
          },
          {
            name: "Zendesk",
            description: "Ticketing with AI answer bots and workflow automation.",
            url: "https://zendesk.com",
            price: "$55/mo",
            difficulty: "Advanced",
            bestFor: "Enterprise-grade support",
          },
        ],
      },
    ],
  },
  {
    slug: "faceless-brand-and-newsletter-monetization",
    name: "Steps For Faceless Brand & Newsletter Monetization",
    tagline: "Build a content media brand, grow subscribers, and sell ads.",
    description:
      "A workflow for running a newsletter, designing visuals, selling digital products, and monetizing with an ad network.",
    category: "Revenue",
    difficulty: "Beginner",
    estimatedCost: "$0 - $99/mo",
    estimatedTime: "Ongoing",
    steps: [
      {
        id: "newsletter-platform",
        title: "Newsletter Platform",
        description: "Capture subscribers and send issues on a reliable platform.",
        tools: [
          {
            name: "beehiiv",
            description: "Newsletter platform with growth and monetization tools.",
            url: "https://beehiiv.com",
            price: "Free - $49/mo",
            difficulty: "Beginner",
            bestFor: "Newsletter growth and ads",
          },
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
        id: "visual-and-graphic-design",
        title: "Visual & Graphic Design",
        description: "Create covers, banners, and brand visuals.",
        tools: [
          {
            name: "Canva",
            description: "Templates and design tools for social and brand assets.",
            url: "https://canva.com",
            price: "Free - $15/mo",
            difficulty: "Beginner",
            bestFor: "Fast graphic design",
          },
          {
            name: "Midjourney",
            description: "AI image generation for unique brand visuals.",
            url: "https://midjourney.com",
            price: "$10/mo",
            difficulty: "Intermediate",
            bestFor: "AI-generated imagery",
          },
        ],
      },
      {
        id: "digital-product-sales",
        title: "Digital Product Sales",
        description: "Sell guides, courses, and other digital products.",
        tools: [
          {
            name: "Gumroad",
            description: "Sell digital products with a hosted checkout.",
            url: "https://gumroad.com",
            price: "10% per sale",
            difficulty: "Beginner",
            bestFor: "Selling digital products fast",
          },
          {
            name: "Payhip",
            description: "Sell digital products, memberships, and courses.",
            url: "https://payhip.com",
            price: "5% per sale",
            difficulty: "Beginner",
            bestFor: "Low-fee digital sales",
          },
        ],
      },
      {
        id: "ad-network-monetization",
        title: "Ad Network Monetization",
        description: "Turn your audience into recurring ad revenue.",
        tools: [
          {
            name: "Passionfroot",
            description: "Marketplace connecting creators with brand sponsors.",
            url: "https://passionfroot.me",
            price: "Free",
            difficulty: "Beginner",
            bestFor: "Finding sponsors",
          },
          {
            name: "beehiiv Ad Network",
            description: "Built-in ad network for beehiiv newsletters.",
            url: "https://beehiiv.com/ad-network",
            price: "Free",
            difficulty: "Beginner",
            bestFor: "Newsletter ad revenue",
          },
        ],
      },
    ],
  },
];

export const categories: Category[] = [
  "Launch",
  "Content",
  "Traffic",
  "Sales",
  "Support",
  "Revenue",
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

/**
 * Catalog of tools grouped by the kind of step they belong to.
 * Used by the Submit Stack flow so each step offers its own relevant tools
 * instead of one shared list.
 */
export const toolCatalog: Record<string, string[]> = {
  "Frontend & UI": ["Lovable", "Bolt.new", "v0"],
  "Database & Auth": ["Supabase", "Firebase"],
  "AI Logic & Backend": ["OpenRouter", "Replicate"],
  "Billing & Payments": ["Lemon Squeezy", "Paddle"],
  Scripting: ["ChatGPT", "Claude"],
  Voiceover: ["ElevenLabs", "WellSaid"],
  "Video Generation": ["HeyGen", "Runway", "CapCut"],
  "Scheduling & Publishing": ["Metricool", "Buffer"],
  "Keyword Research": ["Ahrefs", "LowFruits"],
  "Article Generation": ["SEOWriting.ai", "Writesonic"],
  "CMS & Publishing": ["Ghost", "Webflow"],
  "Auto Indexing & Tracking": ["IndexNow", "Google Search Console"],
  "Lead Database": ["Apollo.io", "Ocean.io"],
  "Email Enrichment & Verification": ["Prospeo", "Debounce"],
  "Automated Sequences": ["Instantly.ai", "Smartlead"],
  "CRM Tracking": ["HubSpot", "Folk"],
  "User Feedback & Roadmap": ["Canny", "Featurebase"],
  "Knowledge Base": ["Notion", "GitBook"],
  "AI Support Widget": ["Chatbase", "Crisp"],
  "Ticket Tracking": ["Linear", "Zendesk"],
  "Newsletter Platform": ["beehiiv", "ConvertKit"],
  "Visual & Graphic Design": ["Canva", "Midjourney"],
  "Digital Product Sales": ["Gumroad", "Payhip"],
  "Ad Network Monetization": ["Passionfroot", "beehiiv Ad Network"],
};

export function getToolsForStep(stepTitle: string): string[] {
  return toolCatalog[stepTitle] ?? [];
}
