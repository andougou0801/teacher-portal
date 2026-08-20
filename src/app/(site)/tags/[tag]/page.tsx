import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import { articles } from "@/lib/articles";
import { icebreakers } from "@/lib/icebreakers";
import { getCategoryBorderColor } from "@/lib/categoryColor";

export async function generateMetadata(
  props: PageProps<"/tags/[tag]">,
): Promise<Metadata> {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);
  return { title: `「${decoded}」の一覧 | 全国教員支援ポータル（仮称）` };
}

export default async function TagPage(props: PageProps<"/tags/[tag]">) {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);

  const matchedTools = tools.filter((tool) => tool.tags.includes(decoded));
  const matchedArticles = articles.filter(
    (article) =>
      article.category === decoded ||
      article.subject === decoded ||
      article.situation === decoded,
  );
  const matchedIcebreakers = icebreakers.filter((ib) => ib.category === decoded);
  const total = matchedTools.length + matchedArticles.length + matchedIcebreakers.length;

  return (
    <section className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Tag
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">
          🏷 「{decoded}」に関するもの（{total}件）
        </h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          ツール・記事・アイスブレイクを横断して、このタグに関係するものを表示しています。
        </p>
      </div>

      {total === 0 && (
        <p className="text-center text-sm text-muted">
          「{decoded}」に該当するものは見つかりませんでした。
        </p>
      )}

      {matchedTools.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-sm font-bold text-navy">
            ツール（{matchedTools.length}件）
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {matchedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={`rounded-2xl border border-line border-l-4 bg-white p-4 ${getCategoryBorderColor(tool.tags[0])}`}
              >
                <div className="text-2xl">{tool.icon}</div>
                <h3 className="mt-2 text-sm font-bold">{tool.name}</h3>
                <p className="mt-1 text-sm text-muted">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchedArticles.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-sm font-bold text-navy">
            記事（{matchedArticles.length}件）
          </h2>
          <div className="flex flex-col gap-3">
            {matchedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className={`rounded-2xl border border-line border-l-4 bg-white p-4 ${getCategoryBorderColor(article.category)}`}
              >
                <div className="text-[13px] font-extrabold tracking-wide text-accent">
                  {article.category}
                </div>
                <h3 className="mt-1 text-sm font-bold">{article.title}</h3>
                <p className="mt-1 text-sm text-muted">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchedIcebreakers.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-navy">
            アイスブレイク（{matchedIcebreakers.length}件）
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {matchedIcebreakers.map((ib) => (
              <Link
                key={ib.slug}
                href={`/lessons/icebreakers/${ib.slug}`}
                className={`rounded-2xl border border-line border-l-4 bg-white p-4 ${getCategoryBorderColor(ib.category)}`}
              >
                <h3 className="text-sm font-bold">
                  {ib.emoji} {ib.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  ⏱ {ib.duration}・👥 {ib.groupSize}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
