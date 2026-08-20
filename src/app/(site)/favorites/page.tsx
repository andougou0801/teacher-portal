"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { getToolBySlug } from "@/lib/tools";
import { getArticleBySlug } from "@/lib/articles";
import { getIcebreakerBySlug } from "@/lib/icebreakers";
import FavoriteButton from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const { ids } = useFavorites();

  const items = ids
    .map((id) => {
      const [kind, slug] = id.split(":");
      if (kind === "tool") {
        const tool = getToolBySlug(slug);
        if (!tool) return null;
        return {
          kind: "tool" as const,
          slug,
          href: `/tools/${tool.slug}`,
          icon: tool.icon,
          title: tool.name,
          summary: tool.description,
        };
      }
      if (kind === "article") {
        const article = getArticleBySlug(slug);
        if (!article) return null;
        return {
          kind: "article" as const,
          slug,
          href: `/articles/${article.slug}`,
          icon: "📄",
          title: article.title,
          summary: article.summary,
        };
      }
      if (kind === "icebreaker") {
        const ib = getIcebreakerBySlug(slug);
        if (!ib) return null;
        return {
          kind: "icebreaker" as const,
          slug,
          href: `/lessons/icebreakers/${ib.slug}`,
          icon: ib.emoji,
          title: ib.title,
          summary: `⏱ ${ib.duration}・👥 ${ib.groupSize}`,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return (
    <section className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 text-center">
        <div className="text-xs font-bold tracking-widest text-accent uppercase">
          Favorites
        </div>
        <h1 className="mt-2 mb-2 text-2xl font-bold">⭐ お気に入り</h1>
        <p className="mx-auto max-w-lg text-sm text-muted">
          このブラウザだけに保存されます。会員登録・サーバー保存は不要です。ツール・記事・アイスブレイクの
          ☆マークをタップすると、ここに追加されます。
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted">
          まだお気に入りがありません。気になるツールや記事の☆マークをタップしてみてください。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={`${item.kind}:${item.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4"
            >
              <Link href={item.href} className="flex flex-1 items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">{item.summary}</p>
                </div>
              </Link>
              <FavoriteButton kind={item.kind} slug={item.slug} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
