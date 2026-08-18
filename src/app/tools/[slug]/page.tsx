import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools, getToolBySlug } from "@/lib/tools";

export function generateStaticParams() {
  return tools
    .filter((tool) => tool.status === "live")
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(
  props: PageProps<"/tools/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);
  return { title: tool ? `${tool.name} | 全国教員支援ポータル（仮称）` : "ツール" };
}

export default async function ToolPage(props: PageProps<"/tools/[slug]">) {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-4 px-8 py-10">
      <div>
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-bold">
          {tool.icon} {tool.name}
        </h1>
        <p className="mt-1 text-sm text-muted">{tool.description}</p>
        {tool.status === "live" ? (
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-good">
            ✓ 開発者本人による自作ツール
          </div>
        ) : (
          <div className="mt-1 text-xs font-bold text-accent">作成予定のツールです</div>
        )}
        {tool.mobileNote && (
          <div className="mt-3 rounded-xl border border-warn-line bg-warn-bg px-4 py-2.5 text-xs text-warn md:hidden">
            {tool.mobileNote}
          </div>
        )}
      </div>
      {tool.status === "live" && tool.file ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <iframe src={tool.file} title={tool.name} className="h-[80vh] w-full" />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
          このツールはまだ準備中です。公開までしばらくお待ちください。
        </div>
      )}
    </section>
  );
}
