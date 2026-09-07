import type { Metadata } from "next";
import FavoritesList from "@/components/FavoritesList";
import { getPublishedArticles, getVisibleTools } from "@/lib/content";

export const metadata: Metadata = {
  title: "お気に入り | 全国教員支援ポータル",
};

export const revalidate = 60;

export default async function FavoritesPage() {
  const [tools, articles] = await Promise.all([
    getVisibleTools(),
    getPublishedArticles(),
  ]);

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

      <FavoritesList tools={tools} articles={articles} />
    </section>
  );
}
