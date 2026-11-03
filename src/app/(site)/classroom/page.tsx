import Link from "next/link";
import type { Metadata } from "next";
import { getPageText, getPublishedArticles } from "@/lib/content";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageText("classroom");
  return {
    title: `${page.heading} | 全国教員支援ポータル`,
    description: page.lead,
  };
}

export default async function ClassroomPage() {
  const [page, articles] = await Promise.all([
    getPageText("classroom"),
    getPublishedArticles(),
  ]);
  const posts = articles.filter((article) => article.section === "classroom");

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

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/articles/${post.slug}`}
            className={`rounded-2xl border border-line border-l-4 bg-white p-5 ${getCategoryBorderColor(post.category)}`}
          >
            <div className="flex flex-wrap items-center gap-2">
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
