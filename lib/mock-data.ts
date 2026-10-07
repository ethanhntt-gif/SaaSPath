export type ToolCategory =
  | "Research"
  | "Writing"
  | "Design"
  | "Image Generation"
  | "Video Generation"
  | "Audio"
  | "SEO"
  | "Development"
  | "Marketing";

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  /** Short tagline describing what the tool does. */
  tagline: string;
  /** Two-letter monogram used as an avatar placeholder. */
  monogram: string;
}

export interface WorkflowStep {
  id: string;
  /** Canonical step name, e.g. "Script". */
  name: string;
  /** Example tool used at this step. */
  tool: Tool;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  /** Number of distinct paths that satisfy this workflow. */
  pathCount: number;
}

export interface Path {
  id: string;
  workflowId: string;
  name: string;
  /** Ordered tool ids that make up this path. */
  toolIds: string[];
}

export interface WorkflowCategory {
  id: string;
  label: ToolCategory;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*  Tools                                                                     */
/* -------------------------------------------------------------------------- */

export const tools: Tool[] = [
  {
    id: "claude",
    name: "Claude",
    category: "Writing",
    tagline: "Long-form reasoning and drafting",
    monogram: "CL",
  },
  {
    id: "gpt",
    name: "GPT",
    category: "Writing",
    tagline: "General purpose writing assistant",
    monogram: "GP",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "Research",
    tagline: "Cited research and answers",
    monogram: "PX",
  },
  {
    id: "flux",
    name: "Flux",
    category: "Image Generation",
    tagline: "High fidelity image generation",
    monogram: "FX",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Image Generation",
    tagline: "Stylised concept imagery",
    monogram: "MJ",
  },
  {
    id: "kling",
    name: "Kling",
    category: "Video Generation",
    tagline: "Text and image to video",
    monogram: "KL",
  },
  {
    id: "runway",
    name: "Runway",
    category: "Video Generation",
    tagline: "Generative video editing suite",
    monogram: "RW",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Audio",
    tagline: "Natural voice synthesis",
    monogram: "EL",
  },
  {
    id: "capcut",
    name: "CapCut",
    category: "Video Generation",
    tagline: "Fast timeline video editing",
    monogram: "CC",
  },
  {
    id: "descript",
    name: "Descript",
    category: "Video Generation",
    tagline: "Edit video by editing text",
    monogram: "DS",
  },
  {
    id: "surfer",
    name: "Surfer",
    category: "SEO",
    tagline: "Content briefs and optimisation",
    monogram: "SF",
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    category: "SEO",
    tagline: "Keyword and backlink research",
    monogram: "AH",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    tagline: "Collaborative interface design",
    monogram: "FG",
  },
  {
    id: "framer",
    name: "Framer",
    category: "Design",
    tagline: "Design and publish sites",
    monogram: "FR",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "Development",
    tagline: "AI-native code editor",
    monogram: "CU",
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Development",
    tagline: "Frontend cloud and hosting",
    monogram: "VC",
  },
  {
    id: "buffer",
    name: "Buffer",
    category: "Marketing",
    tagline: "Social scheduling and analytics",
    monogram: "BF",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "Marketing",
    tagline: "Email campaigns and automation",
    monogram: "MC",
  },
];

const toolById = new Map(tools.map((tool) => [tool.id, tool]));

export function getTool(id: string): Tool {
  const tool = toolById.get(id);
  if (!tool) {
    throw new Error(`Unknown tool id: ${id}`);
  }
  return tool;
}

/* -------------------------------------------------------------------------- */
/*  Workflows                                                                 */
/* -------------------------------------------------------------------------- */

export const workflows: Workflow[] = [
  {
    id: "youtube-video",
    title: "Create a YouTube Video",
    description:
      "Take an idea from research to a fully edited, publish-ready video.",
    steps: [
      { id: "research", name: "Research", tool: getTool("perplexity") },
      { id: "script", name: "Script", tool: getTool("claude") },
      { id: "images", name: "Images", tool: getTool("flux") },
      { id: "video", name: "Video", tool: getTool("kling") },
      { id: "voice", name: "Voice", tool: getTool("elevenlabs") },
      { id: "edit", name: "Edit", tool: getTool("capcut") },
    ],
    pathCount: 12,
  },
  {
    id: "seo-article",
    title: "Write an SEO Article",
    description:
      "Research keywords, draft, and optimise an article that ranks.",
    steps: [
      { id: "research", name: "Research", tool: getTool("ahrefs") },
      { id: "outline", name: "Outline", tool: getTool("surfer") },
      { id: "draft", name: "Draft", tool: getTool("gpt") },
      { id: "edit", name: "Edit", tool: getTool("claude") },
    ],
    pathCount: 8,
  },
  {
    id: "launch-saas",
    title: "Launch a SaaS",
    description:
      "Go from concept to a shipped product with a landing page and launch plan.",
    steps: [
      { id: "research", name: "Research", tool: getTool("perplexity") },
      { id: "design", name: "Design", tool: getTool("figma") },
      { id: "build", name: "Build", tool: getTool("cursor") },
      { id: "ship", name: "Ship", tool: getTool("vercel") },
      { id: "launch", name: "Launch", tool: getTool("buffer") },
    ],
    pathCount: 15,
  },
  {
    id: "social-content",
    title: "Create Social Content",
    description:
      "Produce a batch of on-brand posts and visuals for every channel.",
    steps: [
      { id: "ideas", name: "Ideas", tool: getTool("gpt") },
      { id: "visuals", name: "Visuals", tool: getTool("midjourney") },
      { id: "caption", name: "Caption", tool: getTool("claude") },
      { id: "schedule", name: "Schedule", tool: getTool("buffer") },
    ],
    pathCount: 10,
  },
];

/* -------------------------------------------------------------------------- */
/*  Paths                                                                     */
/* -------------------------------------------------------------------------- */

export const paths: Path[] = [
  {
    id: "youtube-path-a",
    workflowId: "youtube-video",
    name: "Fast AI pipeline",
    toolIds: ["perplexity", "claude", "flux", "kling", "elevenlabs", "capcut"],
  },
  {
    id: "youtube-path-b",
    workflowId: "youtube-video",
    name: "Cinematic pipeline",
    toolIds: ["perplexity", "gpt", "midjourney", "runway", "elevenlabs", "descript"],
  },
  {
    id: "seo-path-a",
    workflowId: "seo-article",
    name: "Data-driven",
    toolIds: ["ahrefs", "surfer", "gpt", "claude"],
  },
  {
    id: "saas-path-a",
    workflowId: "launch-saas",
    name: "Solo founder",
    toolIds: ["perplexity", "figma", "cursor", "vercel", "buffer"],
  },
  {
    id: "social-path-a",
    workflowId: "social-content",
    name: "Visual first",
    toolIds: ["gpt", "midjourney", "claude", "buffer"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

export const workflowCategories: WorkflowCategory[] = [
  {
    id: "research",
    label: "Research",
    description: "Gather sources, facts, and citations.",
  },
  {
    id: "writing",
    label: "Writing",
    description: "Draft, rewrite, and refine copy.",
  },
  {
    id: "design",
    label: "Design",
    description: "Interfaces, brand, and visuals.",
  },
  {
    id: "image-generation",
    label: "Image Generation",
    description: "Create original imagery on demand.",
  },
  {
    id: "video-generation",
    label: "Video Generation",
    description: "Generate and edit motion content.",
  },
  {
    id: "audio",
    label: "Audio",
    description: "Voice, music, and sound design.",
  },
  {
    id: "seo",
    label: "SEO",
    description: "Keywords, briefs, and rankings.",
  },
  {
    id: "development",
    label: "Development",
    description: "Build, ship, and host products.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Reach and grow an audience.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Homepage helpers                                                          */
/* -------------------------------------------------------------------------- */

export const exampleGoals: string[] = [
  "Create a video",
  "Write an SEO article",
  "Launch a SaaS",
  "Create social content",
];

export const builderSteps: string[] = [
  "Research",
  "Script",
  "Images",
  "Video",
  "Edit",
];

export function getWorkflow(id: string): Workflow {
  const workflow = workflows.find((item) => item.id === id);
  if (!workflow) {
    throw new Error(`Unknown workflow id: ${id}`);
  }
  return workflow;
}

export function getPathsForWorkflow(workflowId: string): Path[] {
  return paths.filter((path) => path.workflowId === workflowId);
}

export function getToolsForCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
