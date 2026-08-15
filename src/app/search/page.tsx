import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "検索結果 | 全国教員支援ポータル（仮称）",
};

function matches(query: string, ...fields: string[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some((field) => field.toLowerCase().includes(normalized));
}

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q : "";

  const matchedTools = tools.filter((tool) =>
    matches(query, tool.name, tool.description, tool.tags.join(" ")),
  );
  const matchedArticles = articles.filter((article) =>
    matches(query, article.title, article.summary, article.category),
  );
  const hasQuery = query.trim().length > 0;
  const hasResults = matchedTools.length > 0 || matchedArticles.length > 0;

  return (
    <section className="mx-auto max-w-4xl px-8 py-14">
      <form action="/search" method="get" className="mb-10">
        <div className="mx-auto flex max-w-lg gap-1.5 rounded-full border border-line bg-white p-1.5">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="例）時間割　プリント作成 で検索"
            className="flex-1 rounded-full border-none px-4 py-2.5 text-sm text-[#1E2732] outline-none"
          />
          <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white">
            検索する
          </button>
        </div>
      </form>

      <h1 className="mb-6 text-center text-lg font-bold">
        {hasQuery ? (
          <>
            「{query}」の検索結果（{matchedTools.length + matchedArticles.length}件）
          </>
        ) : (
          "すべてのツール・記事"
        )}
      </h1>

      {!hasResults && (
        <p className="text-center text-sm text-muted">
          該当する結果が見つかりませんでした。別のキーワードでお試しください。
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
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="text-2xl">{tool.icon}</div>
                <h3 className="mt-2 text-sm font-bold">{tool.name}</h3>
                <p className="mt-1 text-xs text-muted">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchedArticles.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-navy">
            記事（{matchedArticles.length}件）
          </h2>
          <div className="flex flex-col gap-3">
            {matchedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <div className="text-[10px] font-extrabold tracking-wide text-accent">
                  {article.category}
                </div>
                <h3 className="mt-1 text-sm font-bold">{article.title}</h3>
                <p className="mt-1 text-xs text-muted">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
