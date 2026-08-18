import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "先生のコラム | 全国教員支援ポータル（仮称）",
  description: "サイト運営者の視点で教育について発信するコラムページ。",
};

const topics = [
  "学級経営", "授業", "子どもとの関わり", "教員生活", "若手教員向けアドバイス",
  "教育について考えたこと", "実際の授業実践", "教員の働き方", "ICT・AI教育",
];

export default function ColumnPage() {
  const columns = articles.filter((article) => article.section === "column");

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Column
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">✏️ 先生のコラム</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          サイト運営者の視点で、教育について発信していきます。
        </p>
      </div>

      {columns.length > 0 ? (
        <div className="flex flex-col gap-4">
          {columns.map((column) => (
            <Link
              key={column.slug}
              href={`/articles/${column.slug}`}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="text-[13px] font-extrabold tracking-wide text-accent">
                {column.category}
              </div>
              <h2 className="my-1.5 text-base font-bold">{column.title}</h2>
              <p className="text-sm text-muted">{column.summary}</p>
              <div className="mt-2 text-[13px] text-muted">
                {column.author}・{column.publishedAt}・{column.readTime}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-warn-line bg-warn-bg p-6 text-center text-sm text-warn">
          コラムはまだ執筆中です。公開までしばらくお待ちください。
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">扱っていくテーマ（例）</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
