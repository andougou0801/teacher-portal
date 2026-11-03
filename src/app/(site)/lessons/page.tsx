import Link from "next/link";
import type { Metadata } from "next";
import {
  getIcebreakers,
  getPageText,
  getPublishedArticles,
  getRecreations,
} from "@/lib/content";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageText("lessons");
  return {
    title: `${page.heading} | 全国教員支援ポータル`,
    description: page.lead,
  };
}

export default async function LessonsPage() {
  const [page, icebreakers, recreations] = await Promise.all([
    getPageText("lessons"),
    getIcebreakers(),
    getRecreations(),
  ]);
  const articles = await getPublishedArticles();
  const lessons = articles.filter((article) => article.section === "lesson");
  // カードの「NEW・66個掲載」は、実際に載っている数をその場で数える
  const counts = {
    icebreakers: icebreakers.length,
    recreations: recreations.length,
    "": 0,
  };

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          {page.eyebrow}
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">
          {page.emoji} {page.heading}
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted">{page.lead}</p>
      </div>

      {page.cards.map((card, i) => (
        <Link
          key={card.href}
          href={card.href}
          className={`flex items-center justify-between gap-3 rounded-2xl border border-accent bg-[#EAF2FA] p-5 ${
            i === page.cards.length - 1 ? "mb-6" : "mb-4"
          }`}
        >
          <div>
            {counts[card.countFrom] > 0 && (
              <div className="text-[13px] font-extrabold tracking-wide text-accent">
                NEW・{counts[card.countFrom]}個掲載
              </div>
            )}
            <h2 className="mt-1 text-base font-bold">
              {card.emoji} {card.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{card.description}</p>
          </div>
          <span className="shrink-0 text-accent">→</span>
        </Link>
      ))}

      <div className="flex flex-col gap-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/articles/${lesson.slug}`}
            className={`rounded-2xl border border-line border-l-4 bg-white p-5 ${getCategoryBorderColor(lesson.subject ?? lesson.category)}`}
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

      {page.topics.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-navy">{page.topicsTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {page.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-muted"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
