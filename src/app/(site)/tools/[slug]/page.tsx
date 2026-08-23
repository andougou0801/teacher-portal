import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { tools, getToolBySlug } from "@/lib/tools";
import CopyEmbedLinkButton from "@/components/CopyEmbedLinkButton";
import FavoriteButton from "@/components/FavoriteButton";

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
  return { title: tool ? `${tool.name} | 全国教員支援ポータル` : "ツール" };
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
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-[#EAF2FA] px-2.5 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
            >
              {tag}
            </Link>
          ))}
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
          {tool.icon} {tool.name}
          <FavoriteButton kind="tool" slug={tool.slug} />
        </h1>
        <p className="mt-1 text-sm text-muted">{tool.description}</p>
        {tool.status === "live" ? (
          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-good">
            ✓ 開発者本人による自作ツール
          </div>
        ) : (
          <div className="mt-1 text-sm font-bold text-accent">作成予定のツールです</div>
        )}
        {tool.mobileNote && (
          <div className="mt-3 rounded-xl border border-warn-line bg-warn-bg px-4 py-2.5 text-sm text-warn md:hidden">
            {tool.mobileNote}
          </div>
        )}
        {tool.status === "live" && tool.file && (
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`/embed/tools/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-cta px-6 py-3 text-center text-base font-bold text-white hover:bg-cta-dark"
            >
              🔗 新しいタブでツールを開く
            </a>
            <div>
              <CopyEmbedLinkButton slug={tool.slug} />
              <p className="mt-1.5 text-sm text-muted">
                コピーしたURLはヘッダーなしでツールだけが開く、共有・ブックマーク用のリンクです。
                デスクトップに保存しておくと、次回からすぐ開けます。
              </p>
            </div>
          </div>
        )}
        {tool.status !== "live" && (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
            このツールはまだ準備中です。公開までしばらくお待ちください。
          </div>
        )}
      </div>
    </section>
  );
}
