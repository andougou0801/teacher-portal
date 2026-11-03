import type { Metadata } from "next";

/**
 * SNSに貼ったときのカード（OGP・Twitterカード）の共通設定。
 *
 * カードの画像とURLは**絶対URL**でないと読まれないため、サイトのアドレスを
 * ここで一元管理する。各ページは `pageMetadata()` を呼ぶだけでよい。
 */
export const SITE_URL = "https://teacher-portal-puce.vercel.app";

export const SITE_NAME = "全国教員支援ポータル";

export const SITE_DESCRIPTION =
  "現場発の自作ツール・実践記事・教員コミュニティを1つにまとめた、全国の教員のための支援ポータルサイト。";

/**
 * 既定のカード画像（1200×630）。`scripts/make-og-image.mjs` で作り直せる。
 * 写真や他サイトの素材は使わず、文字と色だけで作っている。
 */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

type PageMetaInput = {
  /** ページの見出し。サイト名は自動で付けるので入れない。 */
  title: string;
  /** カードの説明文。省略するとサイト全体の説明になる。 */
  description?: string;
  /** サイト内のパス（例: `/articles/foo`）。カードのURLに使う。 */
  path: string;
  /** カードの種類。記事は "article"、それ以外のページは "website"。 */
  type?: "article" | "website";
  /**
   * 検索エンジンに「正式なURLはこちら」と伝えたいとき。
   * 同じ中身のページが2つあるとき（ツールの個別ページと単体ページ）に使う。
   */
  canonicalPath?: string;
};

/**
 * ページ用のメタデータを作る。
 *
 * `<title>` にはサイト名を付け、カードの見出しにはページ名だけを使う
 * （カードにはサイト名が別の行で出るため、入れると二重になる）。
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "article",
  canonicalPath,
}: PageMetaInput): Metadata {
  const text = description ?? SITE_DESCRIPTION;
  return {
    title: `${title} | ${SITE_NAME}`,
    description: text,
    alternates: { canonical: canonicalPath ?? path },
    openGraph: {
      type,
      title,
      description: text,
      url: path,
      siteName: SITE_NAME,
      locale: "ja_JP",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: text,
      images: [OG_IMAGE.url],
    },
  };
}
