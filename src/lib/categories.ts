export type Category = {
  slug: string;
  label: string;
  icon: string;
  description: string;
  href: string;
  status: "live" | "coming-soon";
};

export const categories: Category[] = [
  {
    slug: "teacher-tools",
    label: "先生の便利ツール",
    icon: "🧰",
    description: "採点・プリント作成・時間割など、仕事をすぐ効率化できるツール。",
    href: "/tools",
    status: "live",
  },
  {
    slug: "kids-tools",
    label: "子どもの便利ツール",
    icon: "🎮",
    description: "漢字・計算・タイピングなど、子どもが学校や家庭で使える学習ツール。",
    href: "/kids",
    status: "live",
  },
  {
    slug: "lessons",
    label: "授業・教材アイデア",
    icon: "📚",
    description: "「明日の授業に使える」教科別・場面別のアイデア集。",
    href: "/lessons",
    status: "live",
  },
  {
    slug: "classroom",
    label: "学級経営・子ども対応",
    icon: "🏫",
    description: "学級開き・トラブル対応・保護者対応など、困った場面から探せるページ。",
    href: "/classroom",
    status: "live",
  },
  {
    slug: "events",
    label: "学校行事・年間行事",
    icon: "📅",
    description: "時期ごとに必要な情報を探せる、年間行事の準備ガイド。",
    href: "/events",
    status: "live",
  },
  {
    slug: "links",
    label: "便利な公式サイト集",
    icon: "🔗",
    description: "文部科学省・教育委員会など、教員が必要とする公式サイトをまとめて紹介。",
    href: "/links",
    status: "live",
  },
  {
    slug: "column",
    label: "先生のコラム",
    icon: "✏️",
    description: "学級経営や授業実践について、運営者自身の視点で発信するコラム。",
    href: "/column",
    status: "coming-soon",
  },
  {
    slug: "life",
    label: "忙しい先生のためのページ",
    icon: "💼",
    description: "福利厚生・休暇・手当など、先生自身の生活を支える制度情報。",
    href: "/life",
    status: "coming-soon",
  },
  {
    slug: "ai",
    label: "先生のAI活用",
    icon: "🤖",
    description: "ChatGPT・Claudeなど、生成AIを授業準備や校務に活かすための入門ガイド。",
    href: "/ai",
    status: "live",
  },
  {
    slug: "qa",
    label: "先生の「困った！」Q&A",
    icon: "❓",
    description: "教員が検索しそうな悩みを、Q&A形式でまとめたページ。",
    href: "/qa",
    status: "live",
  },
];
