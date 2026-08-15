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
      <div className="text-[11px] font-extrabold tracking-wide text-accent">
        {article.category}
      </div>
      <h1 className="mt-2 mb-3 text-2xl font-bold">{article.title}</h1>
      <div className="mb-8 text-xs text-muted">
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
