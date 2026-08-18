import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "記事・コラム | 全国教員支援ポータル（仮称）",
};

const upcomingTopics = [
  {
    category: "授業アイデア",
    title: "盛り上がる係活動の決め方",
    meta: "執筆予定",
  },
  {
    category: "時短術",
    title: "職員会議の資料作りを効率化する",
    meta: "執筆予定",
  },
];

export default function ArticlesPage() {
  const [featured] = articles;

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

      <div className="grid gap-4.5 md:grid-cols-3">
        {featured && (
          <Link
            href={`/articles/${featured.slug}`}
            className="overflow-hidden rounded-2xl border border-line bg-white"
          >
            <div className="h-50 bg-gradient-to-br from-[#F0F4F8] to-line" />
            <div className="p-4">
              <div className="text-[13px] font-extrabold tracking-wide text-accent">
                {featured.category}
              </div>
              <h4 className="my-1.5 text-lg font-bold">{featured.title}</h4>
              <div className="text-[13px] text-muted">
                {featured.author}・{featured.readTime}
              </div>
            </div>
          </Link>
        )}
        {upcomingTopics.map((article) => (
          <div
            key={article.title}
            className="overflow-hidden rounded-2xl border border-dashed border-line bg-white opacity-70"
          >
            <div className="h-30 bg-gradient-to-br from-[#F0F4F8] to-line" />
            <div className="p-4">
              <div className="text-[13px] font-extrabold tracking-wide text-accent">
                {article.category}
              </div>
              <h4 className="my-1.5 text-sm font-bold">{article.title}</h4>
              <div className="text-[13px] text-muted">{article.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
