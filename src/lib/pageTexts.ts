/**
 * 一覧ページの「見出し・紹介文・今後扱っていくテーマ」。
 *
 * 記事やアイスブレイクのような中身とちがって、これまではページのコードに
 * 直接書かれていたため管理画面から変えられなかった。009_page_texts.sql を
 * 実行すると、データベースの内容が正になる。
 *
 * データベースに中身が無いときは、ここの内容を表示する。
 */

export type PageCard = {
  /** リンク先 */
  href: string;
  emoji: string;
  title: string;
  description: string;
  /** 「NEW・66個掲載」の数をどこから数えるか。空なら数を出さない */
  countFrom: "icebreakers" | "recreations" | "";
};

export type PageText = {
  /** 管理画面と `getPageText()` で使う合言葉 */
  slug: string;
  /** 管理画面での呼び名 */
  name: string;
  /** 実際のページのアドレス */
  path: string;
  /** 見出しの上に小さく出る英字 */
  eyebrow: string;
  emoji: string;
  heading: string;
  lead: string;
  topicsTitle: string;
  topics: string[];
  cards: PageCard[];
};

export const pageTexts: PageText[] = [
  {
    slug: "lessons",
    name: "授業・教材アイデア",
    path: "/lessons",
    eyebrow: "Lessons",
    emoji: "📚",
    heading: "授業・教材アイデア",
    lead: "「明日の授業に使える」を合言葉に、教科別・場面別のアイデアを紹介していきます。",
    topicsTitle: "今後扱っていくテーマ（例）",
    topics: [
      "国語", "算数", "理科", "社会", "体育", "音楽", "図工", "道徳",
      "授業開き", "授業終わり",
    ],
    cards: [
      {
        href: "/lessons/icebreakers",
        emoji: "🎉",
        title: "アイスブレイク大特集",
        description:
          "時間・場所・人数・やり方が一目でわかる、すぐ使えるアイスブレイク集",
        countFrom: "icebreakers",
      },
      {
        href: "/lessons/recreations",
        emoji: "🏃",
        title: "学級レク特集",
        description:
          "〇〇鬼などのそとあそびから、ハンカチ落としのような室内レクまで。「お楽しみ会」「雨の日」など場面・場所・学年で絞り込めます",
        countFrom: "recreations",
      },
    ],
  },
  {
    slug: "classroom",
    name: "学級経営・子ども対応",
    path: "/classroom",
    eyebrow: "Classroom",
    emoji: "🏫",
    heading: "学級経営・子ども対応",
    lead: "教員が日々困りやすい場面から探せるページを目指しています。",
    topicsTitle: "今後扱っていくテーマ（例）",
    topics: [
      "班活動", "係活動", "掃除", "給食", "褒め方", "叱り方",
      "子ども同士のトラブル", "授業中の私語", "個人懇談",
    ],
    cards: [],
  },
  {
    slug: "ai",
    name: "先生のAI活用",
    path: "/ai",
    eyebrow: "AI for Teachers",
    emoji: "🤖",
    heading: "先生のAI活用",
    lead: "「何ができる？」「どう使う？」「実際のプロンプト」まで、初心者にも分かる形で紹介します。",
    topicsTitle: "今後扱っていくテーマ（例）",
    topics: [
      "Claude Code", "Canva", "AIによるアイデア出し", "AIを使った学級経営",
      "教育現場でのAI活用事例",
    ],
    cards: [],
  },
];

export function getStaticPageText(slug: string): PageText {
  const found = pageTexts.find((page) => page.slug === slug);
  if (!found) {
    throw new Error(`pageTexts に "${slug}" がありません`);
  }
  return found;
}
