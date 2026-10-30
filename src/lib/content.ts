import { articles as staticArticles, type Article } from "./articles";
import { tools as staticTools, type Tool } from "./tools";
import {
  officialLinks as staticOfficialLinks,
  type OfficialLink,
} from "./officialLinks";
import { aiGuides as staticAiGuides, type AiGuide } from "./aiGuides";
import {
  termGroups as staticTermGroups,
  officialLinksForLife as staticLifeLinks,
  type SubItem,
  type TermGroup,
} from "./lifeTerms";
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
  description?: string | null;
};

/**
 * ツールの表示設定を読む。
 *
 * description 列は 003_tool_descriptions.sql で追加したものなので、まだ実行していない
 * プロジェクトでは列が無い。その場合だけ、列を指定し直してもう一度読みにいく
 * （SQLを流す前にデプロイしても、ツール一覧が消えてしまわないようにするため）。
 */
async function loadToolSettings(): Promise<ToolSettingRow[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const withDescription = await supabase
    .from("tool_settings")
    .select("slug,hidden,sort_order,description");
  if (!withDescription.error && withDescription.data) {
    return withDescription.data as ToolSettingRow[];
  }

  const legacy = await supabase.from("tool_settings").select("slug,hidden,sort_order");
  if (legacy.error || !legacy.data) return null;
  return legacy.data as ToolSettingRow[];
}

/** 管理画面で非表示にされたツールを除き、指定された並び順・説明文で返す。 */
export async function getVisibleTools(): Promise<Tool[]> {
  const rows = await loadToolSettings();
  if (!rows) return staticTools;

  const settings = new Map(rows.map((row) => [row.slug, row]));
  const orderOf = (tool: Tool) =>
    settings.get(tool.slug)?.sort_order ?? Number.MAX_SAFE_INTEGER;

  return staticTools
    .filter((tool) => !settings.get(tool.slug)?.hidden)
    .map((tool) => {
      // 管理画面で書き換えた説明文があればそれを使う。空欄に戻したら tools.ts の説明に戻る。
      const override = settings.get(tool.slug)?.description?.trim();
      return override ? { ...tool, description: override } : tool;
    })
    // 並び順が未設定のものは、tools.ts の並び順のまま後ろに続く。
    .sort((a, b) => orderOf(a) - orderOf(b));
}

export async function getVisibleToolBySlug(
  slug: string,
): Promise<Tool | undefined> {
  const list = await getVisibleTools();
  return list.find((tool) => tool.slug === slug);
}

/* ---------------------------------------------------------------------------
   便利な公式サイト集
   004_official_links.sql を実行するとデータベースが正になる。
   まだ実行していない / つながらないときは officialLinks.ts にフォールバックする。
   --------------------------------------------------------------------------- */

type OfficialLinkRow = {
  name: string;
  url: string;
  description: string | null;
  when_to_use: string | null;
  category: string;
  subject: string | null;
  sort_order: number | null;
};

function toOfficialLink(row: OfficialLinkRow): OfficialLink {
  return {
    name: row.name,
    url: row.url,
    description: row.description ?? "",
    whenToUse: row.when_to_use ?? "",
    category: row.category as OfficialLink["category"],
    subject: row.subject ?? undefined,
  };
}

/** 公開中の公式サイトを、管理画面で決めた並び順で返す。 */
export async function getOfficialLinks(): Promise<OfficialLink[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("official_links")
      .select("name,url,description,when_to_use,category,subject,sort_order")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return (data as OfficialLinkRow[]).map(toOfficialLink);
    }
  }
  return staticOfficialLinks;
}

/* ---------------------------------------------------------------------------
   先生のAI活用ガイド
   005_ai_guides.sql を実行するとデータベースが正になる。
   --------------------------------------------------------------------------- */

type AiGuideRow = {
  slug: string;
  title: string;
  tool: string | null;
  summary: string | null;
  what_it_does: string | null;
  how_to_use: string[] | null;
  sample_prompt: string | null;
  caution: string | null;
};

function toAiGuide(row: AiGuideRow): AiGuide {
  return {
    slug: row.slug,
    title: row.title,
    tool: row.tool ?? "",
    summary: row.summary ?? "",
    whatItDoes: row.what_it_does ?? "",
    howToUse: row.how_to_use ?? [],
    samplePrompt: row.sample_prompt ?? "",
    caution: row.caution ?? "",
  };
}

/** 公開中のAI活用ガイドを、管理画面で決めた並び順で返す。 */
export async function getAiGuides(): Promise<AiGuide[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("ai_guides")
      .select("slug,title,tool,summary,what_it_does,how_to_use,sample_prompt,caution")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return (data as AiGuideRow[]).map(toAiGuide);
    }
  }
  return staticAiGuides;
}

/* ---------------------------------------------------------------------------
   忙しい先生のためのページ
   006_life_terms.sql を実行するとデータベースが正になる。
   グループ（life_groups）と用語（life_terms）を組み立て直して返す。
   ページ下部の公式窓口は official_links の「忙しい先生のためのページ」カテゴリー。
   --------------------------------------------------------------------------- */

export type LifeLink = { linkName: string; url: string; note: string };

type LifeGroupRow = { title: string; icon: string | null; note: string | null };
type LifeTermRow = {
  group_title: string;
  name: string;
  description: string | null;
  sub_items: SubItem[] | null;
};

export async function getLifeContent(): Promise<{
  termGroups: TermGroup[];
  officialLinksForLife: LifeLink[];
}> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const [groups, terms, links] = await Promise.all([
      supabase
        .from("life_groups")
        .select("title,icon,note")
        .order("sort_order", { ascending: true }),
      supabase
        .from("life_terms")
        .select("group_title,name,description,sub_items")
        .order("sort_order", { ascending: true }),
      supabase
        .from("official_links")
        .select("name,url,description,sort_order")
        .eq("category", "忙しい先生のためのページ")
        .order("sort_order", { ascending: true }),
    ]);

    if (!groups.error && groups.data && groups.data.length > 0 && !terms.error) {
      const termRows = (terms.data ?? []) as LifeTermRow[];
      const built: TermGroup[] = (groups.data as LifeGroupRow[]).map((g) => ({
        icon: g.icon ?? "",
        groupTitle: g.title,
        groupNote: g.note ?? undefined,
        terms: termRows
          .filter((t) => t.group_title === g.title)
          .map((t) => ({
            name: t.name,
            description: t.description ?? "",
            subItems: t.sub_items ?? undefined,
          })),
      }));

      // 公式窓口はDBに無ければ、ひかえの3件をそのまま使う
      const linkRows = links.error ? [] : (links.data ?? []);
      const builtLinks: LifeLink[] =
        linkRows.length > 0
          ? (linkRows as { name: string; url: string; description: string | null }[]).map(
              (l) => ({ linkName: l.name, url: l.url, note: l.description ?? "" }),
            )
          : staticLifeLinks;

      return { termGroups: built, officialLinksForLife: builtLinks };
    }
  }
  return {
    termGroups: staticTermGroups,
    officialLinksForLife: staticLifeLinks,
  };
}
