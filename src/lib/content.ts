import { articles as staticArticles, type Article } from "./articles";
import { tools as staticTools, type Tool } from "./tools";
import { getSupabaseClient } from "./supabaseClient";

/**
 * サイトに表示するコンテンツの取得口。
 *
 * 記事は管理画面（/admin）からデータベースで管理し、ツールは本体HTMLの都合で
 * src/lib/tools.ts を正とし、公開/非公開と並び順だけをデータベースで上書きする。
 *
 * データベースに接続できないときは、いずれも既存のファイルの内容にフォールバックする
 * （設定ミスや障害でサイトの記事が消えてしまわないようにするため）。
 */

const ARTICLE_COLUMNS =
  "slug,title,category,summary,body,author,read_time,published_at,section,subject,month,situation,related_tools,related_icebreakers";

type ArticleRow = {
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  body: string[] | null;
  author: string | null;
  read_time: string | null;
  published_at: string;
  section: Article["section"] | null;
  subject: string | null;
  month: string | null;
  situation: string | null;
  related_tools: string[] | null;
  related_icebreakers: string[] | null;
};

function toArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary ?? "",
    body: row.body ?? [],
    author: row.author ?? "全国教員支援ポータル編集部",
    readTime: row.read_time ?? "",
    publishedAt: row.published_at,
    section: row.section ?? undefined,
    subject: row.subject ?? undefined,
    month: row.month ?? undefined,
    situation: row.situation ?? undefined,
    relatedTools: row.related_tools ?? undefined,
    relatedIcebreakers: row.related_icebreakers ?? undefined,
  };
}

/** 新しい記事が先頭に来るように並べる。 */
function newestFirst(list: Article[]): Article[] {
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 公開中の記事を新しい順に返す。 */
export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return (data as ArticleRow[]).map(toArticle);
    }
  }
  return newestFirst(staticArticles);
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const list = await getPublishedArticles();
  return list.find((article) => article.slug === slug);
}

type ToolSettingRow = {
  slug: string;
  hidden: boolean;
  sort_order: number | null;
};

/** 管理画面で非表示にされたツールを除き、指定された並び順で返す。 */
export async function getVisibleTools(): Promise<Tool[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return staticTools;

  const { data, error } = await supabase
    .from("tool_settings")
    .select("slug,hidden,sort_order");
  if (error || !data) return staticTools;

  const settings = new Map(
    (data as ToolSettingRow[]).map((row) => [row.slug, row]),
  );
  const visible = staticTools.filter((tool) => !settings.get(tool.slug)?.hidden);
  const orderOf = (tool: Tool) =>
    settings.get(tool.slug)?.sort_order ?? Number.MAX_SAFE_INTEGER;

  // 並び順が未設定のものは、tools.ts の並び順のまま後ろに続く。
  return visible.sort((a, b) => orderOf(a) - orderOf(b));
}

export async function getVisibleToolBySlug(
  slug: string,
): Promise<Tool | undefined> {
  const list = await getVisibleTools();
  return list.find((tool) => tool.slug === slug);
}
