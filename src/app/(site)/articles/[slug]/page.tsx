import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articles, getArticleBySlug } from "@/lib/articles";
import { getToolBySlug } from "@/lib/tools";
import { getIcebreakerBySlug } from "@/lib/icebreakers";
import FavoriteButton from "@/components/FavoriteButton";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);
  return {
    title: article
      ? `${article.title} | 全国教員支援ポータル（仮称）`
      : "記事",
  };
}

export default async function ArticlePage(
  props: PageProps<"/articles/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedTools = (article.relatedTools ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool !== undefined);
  const relatedIcebreakers = (article.relatedIcebreakers ?? [])
    .map((slug) => getIcebreakerBySlug(slug))
    .filter((ib) => ib !== undefined);

  return (
    <article className="mx-auto max-w-2xl px-8 py-14">
      <div className="flex flex-wrap items-center gap-2">
        {article.month && (
          <span className="rounded-full bg-navy px-2.5 py-0.5 text-[13px] font-bold text-white">
            {article.month}
          </span>
        )}
        <Link
          href={`/tags/${encodeURIComponent(article.category)}`}
          className="text-[13px] font-extrabold tracking-wide text-accent hover:underline"
        >
          {article.category}
        </Link>
        {article.subject && (
          <Link
            href={`/tags/${encodeURIComponent(article.subject)}`}
            className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy hover:bg-accent hover:text-white"
          >
            {article.subject}
          </Link>
        )}
      </div>
      <h1 className="mt-2 mb-3 flex items-center gap-2 text-2xl font-bold">
        {article.title}
        <FavoriteButton kind="article" slug={article.slug} />
      </h1>
      <div className="mb-8 text-sm text-muted">
        {article.author}・{article.publishedAt}・{article.readTime}
      </div>
      <div className="flex flex-col gap-4 text-sm leading-loose">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {(relatedTools.length > 0 || relatedIcebreakers.length > 0) && (
        <div className="mt-10 border-t border-line pt-8">
          {relatedTools.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-bold text-navy">
                この記事に出てきたツール
              </h2>
              <div className="flex flex-col gap-2">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm font-bold">{tool.name}</span>
                    <span className="ml-auto shrink-0 text-sm text-accent">
                      開く →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedIcebreakers.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-bold text-navy">
                この記事に出てきたアイスブレイク
              </h2>
              <div className="flex flex-col gap-2">
                {relatedIcebreakers.map((ib) => (
                  <Link
                    key={ib.slug}
                    href={`/lessons/icebreakers/${ib.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"
                  >
                    <span className="text-xl">{ib.emoji}</span>
                    <span className="text-sm font-bold">{ib.title}</span>
                    <span className="ml-auto shrink-0 text-sm text-accent">
                      詳しく見る →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
