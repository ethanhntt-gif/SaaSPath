export type Category =
  | "Launch"
  | "Content"
  | "Traffic"
  | "Sales"
  | "Support"
  | "Revenue";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Tool {
  name: string;
  description: string;
  url: string;
  price: string;
  difficulty: Difficulty;
  bestFor: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  tools: Tool[];
}

export interface Path {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  estimatedCost: string;
  estimatedTime: string;
  steps: Step[];
}
