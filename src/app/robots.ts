import type { MetadataRoute } from "next";

/**
 * /robots.txt として配信される。
 * 管理画面と内部用のURLは巡回させない（検索結果に出す意味がなく、入口を広げたくない）。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/favorites", "/search"],
    },
    sitemap: "https://teacher-portal-puce.vercel.app/sitemap.xml",
  };
}
