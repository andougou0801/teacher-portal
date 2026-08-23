import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const metadata: Metadata = {
  title: "学校行事・年間行事 | 全国教員支援ポータル",
  description: "時期ごとに必要な情報を探せる、年間行事の準備ガイド。",
};

const upcomingMonths = [
  "5〜6月：授業参観・遠足・運動会",
  "9〜12月：運動会・学習発表会・修学旅行・冬休み",
  "1〜3月：卒業・6年生を送る会・年度末・学級じまい",
];

export default function EventsPage() {
  const posts = articles.filter((article) => article.section === "event");

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Events
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">📅 学校行事・年間行事</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          時期ごとに必要な情報を探せるページを目指しています。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/articles/${post.slug}`}
            className={`rounded-2xl border border-line border-l-4 bg-white p-5 ${getCategoryBorderColor(post.category)}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {post.month && (
                <span className="rounded-full bg-navy px-2.5 py-0.5 text-[13px] font-bold text-white">
                  {post.month}
                </span>
              )}
              <span className="text-[13px] font-extrabold tracking-wide text-accent">
                {post.category}
              </span>
            </div>
            <h3 className="my-1.5 text-base font-bold">{post.title}</h3>
            <p className="text-sm text-muted">{post.summary}</p>
            <div className="mt-2 text-[13px] text-muted">{post.readTime}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">今後扱っていく時期（例）</h2>
        <div className="flex flex-col gap-2">
          {upcomingMonths.map((month) => (
            <span
              key={month}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-muted"
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
