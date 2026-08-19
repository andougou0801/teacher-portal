import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { tools, getToolBySlug } from "@/lib/tools";

export function generateStaticParams() {
  return tools
    .filter((tool) => tool.status === "live" && tool.file)
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(
  props: PageProps<"/embed/tools/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);
  return { title: tool ? tool.name : "ツール" };
}

export default async function EmbedToolPage(
  props: PageProps<"/embed/tools/[slug]">,
) {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);

  if (!tool || tool.status !== "live" || !tool.file) {
    notFound();
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex items-center justify-between gap-2 bg-navy px-3 py-1.5 text-white">
        <span className="truncate text-xs font-bold">
          {tool.icon} {tool.name}
        </span>
        <Link
          href={`/tools/${tool.slug}`}
          className="shrink-0 text-xs opacity-80 hover:opacity-100 hover:underline"
        >
          サイトで見る →
        </Link>
      </div>
      <iframe src={tool.file} title={tool.name} className="w-full flex-1" />
    </div>
  );
}
