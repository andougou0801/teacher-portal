import type { MetadataRoute } from "next";
import { getPublishedArticles, getVisibleTools } from "@/lib/content";
import { icebreakers } from "@/lib/icebreakers";
import { recreations } from "@/lib/recreations";

/**
 * 検索エンジンに「どんなページがあるか」を伝える一覧。
 * /sitemap.xml として配信され、robots.ts から参照される。
 *
 * 載せないもの：
 * - /admin（管理画面）、/api（内部用）… robots.ts で巡回も禁止している
 * - /favorites・/search … 人ごとに中身が変わるので検索結果に出す意味がない
 * - /embed/tools/<slug> … /tools/<slug> と中身が重なるため、親ページだけを載せる
 */
const BASE = "https://teacher-portal-puce.vercel.app";

// 1時間ごとに作り直す。記事やツールを追加したら自動で反映される。
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tools] = await Promise.all([
    getPublishedArticles(),
    getVisibleTools(),
  ]);

  const now = new Date();

  const fixed: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/tools", priority: 0.9 },
    { path: "/articles", priority: 0.9 },
    { path: "/lessons", priority: 0.8 },
    { path: "/lessons/icebreakers", priority: 0.8 },
    { path: "/lessons/recreations", priority: 0.8 },
    { path: "/classroom", priority: 0.8 },
    { path: "/kids", priority: 0.8 },
    { path: "/events", priority: 0.7 },
    { path: "/life", priority: 0.7 },
    { path: "/column", priority: 0.7 },
    { path: "/ai", priority: 0.6 },
    { path: "/qa", priority: 0.6 },
    { path: "/community", priority: 0.6 },
    { path: "/links", priority: 0.5 },
    { path: "/about", priority: 0.5 },
  ];

  return [
    ...fixed.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/articles/${article.slug}`,
      // 公開日を更新日として扱う（記事に更新日を持たせていないため）
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...tools
      .filter((tool) => tool.status === "live")
      .map((tool) => ({
        url: `${BASE}/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...icebreakers.map((ib) => ({
      url: `${BASE}/lessons/icebreakers/${ib.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...recreations.map((rec) => ({
      url: `${BASE}/lessons/recreations/${rec.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
