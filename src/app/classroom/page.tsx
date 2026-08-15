import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "学級経営・子ども対応 | 全国教員支援ポータル（仮称）",
  description: "教員が日々困りやすい学級経営・子ども対応の場面別ページ。",
};

const upcomingTopics = [
  "班活動", "係活動", "掃除", "給食", "褒め方", "叱り方",
  "子ども同士のトラブル", "授業中の私語", "個人懇談",
];

export default function ClassroomPage() {
  const posts = articles.filter((article) => article.section === "classroom");

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Classroom
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">🏫 学級経営・子ども対応</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          教員が日々困りやすい場面から探せるページを目指しています。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/articles/${post.slug}`}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wide text-accent">
                {post.category}
              </span>
            </div>
            <h2 className="my-1.5 text-base font-bold">{post.title}</h2>
            <p className="text-xs text-muted">{post.summary}</p>
            <div className="mt-2 text-[11px] text-muted">{post.readTime}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">今後扱っていくテーマ（例）</h2>
        <div className="flex flex-wrap gap-2">
          {upcomingTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
