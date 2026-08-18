import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles, getArticleBySlug } from "@/lib/articles";

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

  return (
    <article className="mx-auto max-w-2xl px-8 py-14">
      <div className="flex flex-wrap items-center gap-2">
        {article.month && (
          <span className="rounded-full bg-navy px-2.5 py-0.5 text-[13px] font-bold text-white">
            {article.month}
          </span>
        )}
        <span className="text-[13px] font-extrabold tracking-wide text-accent">
          {article.category}
        </span>
        {article.subject && (
          <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
            {article.subject}
          </span>
        )}
      </div>
      <h1 className="mt-2 mb-3 text-2xl font-bold">{article.title}</h1>
      <div className="mb-8 text-sm text-muted">
        {article.author}・{article.publishedAt}・{article.readTime}
      </div>
      <div className="flex flex-col gap-4 text-sm leading-loose">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
