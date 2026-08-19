import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";
import { icebreakers } from "@/lib/icebreakers";

export const metadata: Metadata = {
  title: "授業・教材アイデア | 全国教員支援ポータル（仮称）",
  description: "「明日の授業に使える」教科別・場面別のアイデア集。",
};

const upcomingTopics = [
  "国語", "算数", "理科", "社会", "体育", "音楽", "図工", "道徳",
  "授業開き", "授業終わり",
];

export default function LessonsPage() {
  const lessons = articles.filter((article) => article.section === "lesson");

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Lessons
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">📚 授業・教材アイデア</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          「明日の授業に使える」を合言葉に、教科別・場面別のアイデアを紹介していきます。
        </p>
      </div>

      <Link
        href="/lessons/icebreakers"
        className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-accent bg-[#EAF2FA] p-5"
      >
        <div>
          <div className="text-[13px] font-extrabold tracking-wide text-accent">
            NEW・{icebreakers.length}個掲載
          </div>
          <h2 className="mt-1 text-base font-bold">🎉 アイスブレイク大特集</h2>
          <p className="mt-1 text-sm text-muted">
            時間・場所・人数・やり方が一目でわかる、すぐ使えるアイスブレイク集
          </p>
        </div>
        <span className="shrink-0 text-accent">→</span>
      </Link>

      <div className="flex flex-col gap-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/articles/${lesson.slug}`}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-extrabold tracking-wide text-accent">
                {lesson.category}
              </span>
              {lesson.subject && (
                <span className="rounded-full bg-[#EAF2FA] px-2 py-0.5 text-[13px] font-bold text-navy">
                  {lesson.subject}
                </span>
              )}
            </div>
            <h3 className="my-1.5 text-base font-bold">{lesson.title}</h3>
            <p className="text-sm text-muted">{lesson.summary}</p>
            <div className="mt-2 text-[13px] text-muted">{lesson.readTime}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-navy">今後扱っていくテーマ（例）</h2>
        <div className="flex flex-wrap gap-2">
          {upcomingTopics.map((topic) => (
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
