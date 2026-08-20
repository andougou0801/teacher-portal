import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const metadata: Metadata = {
  title: "記事・コラム | 全国教員支援ポータル（仮称）",
};

export default function ArticlesPage() {
  const [featured, ...rest] = articles;

  return (
    <section className="mx-auto max-w-5xl px-8 py-14">
      <div className="mb-9 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Media
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">記事・コラム</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          教員の「困った」を解決する記事や、現場発のアイデアを紹介していきます。
        </p>
      </div>

      {featured && (
        <Link
          href={`/articles/${featured.slug}`}
          className="mb-4.5 block overflow-hidden rounded-2xl border border-line bg-white"
        >
          <div className="h-50 bg-gradient-to-br from-[#F0F4F8] to-line" />
          <div className="p-4">
            <div className="text-[13px] font-extrabold tracking-wide text-accent">
              {featured.category}
            </div>
            <h3 className="my-1.5 text-lg font-bold">{featured.title}</h3>
            <p className="text-sm text-muted">{featured.summary}</p>
            <div className="mt-1 text-[13px] text-muted">
              {featured.author}・{featured.readTime}
            </div>
          </div>
        </Link>
      )}

      <div className="grid gap-4.5 md:grid-cols-3">
        {rest.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className={`overflow-hidden rounded-2xl border border-line border-l-4 bg-white ${getCategoryBorderColor(article.category)}`}
          >
            <div className="p-4">
              <div className="text-[13px] font-extrabold tracking-wide text-accent">
                {article.category}
              </div>
              <h3 className="my-1.5 text-sm font-bold">{article.title}</h3>
              <p className="text-sm text-muted">{article.summary}</p>
              <div className="mt-1 text-[13px] text-muted">
                {article.author}・{article.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
