import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PathDetailContent } from "@/components/PathDetailContent";
import { getPathBySlug, paths } from "@/lib/paths";
import { getPathId } from "@/lib/submissions";

type PathDetailPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * The process URL is /paths/<slug>-<pathId>. We accept the bare <slug> too so
 * older links keep working, and strip the trailing "-<pathId>" when present.
 */
function resolveSlug(raw: string): string {
  const direct = getPathBySlug(raw);
  if (direct) return raw;

  const dashIndex = raw.lastIndexOf("-");
  if (dashIndex > 0) {
    const base = raw.slice(0, dashIndex);
    if (getPathBySlug(base)) return base;
  }

  return raw;
}

export function generateStaticParams() {
  return paths.map((path) => ({ slug: `${path.slug}-${getPathId(path.slug)}` }));
}

export async function generateMetadata({ params }: PathDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathBySlug(resolveSlug(slug));

  if (!path) {
    return { title: "Path not found | SaaSPath" };
  }

  return {
    title: `${path.name} | SaaSPath`,
    description: path.description,
  };
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { slug } = await params;
  const path = getPathBySlug(resolveSlug(slug));

  if (!path) {
    notFound();
  }

  return <PathDetailContent path={path} />;
}
