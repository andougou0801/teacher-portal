export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  audience: "teacher" | "student";
  status: "live" | "planned";
  file?: string;
  mobileNote?: string;
};

export const tools: Tool[] = [
  {
    slug: "timetable-maker",
    name: "時間割自動作成ツール",
    description:
      "条件を入れるだけで学級・教科の時間割案を作成できます。担任の時間割づくりの負担を軽減します。",
    icon: "🗓",
    tags: ["時間割", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/timetable-maker.html",
  },
  {
    slug: "written-calc-master",
    name: "筆算マスター",
    description:
      "筆算（たし算・ひき算・かけ算・わり算）の練習問題を繰り返し解いて練習できます。",
    icon: "✏️",
    tags: ["算数", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/written-calc-master.html",
  },
  {
    slug: "prefecture-master-game",
    name: "都道府県マスターゲーム",
    description: "日本の都道府県の位置・名前をゲーム感覚で楽しく覚えられます。",
    icon: "🗾",
    tags: ["社会", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/prefecture-master-game.html",
  },
  {
    slug: "math-worksheet-maker",
    name: "算数プリントメーカー",
    description:
      "単元や難易度を選ぶだけで、算数の練習プリントを自動生成。授業準備の時間を大幅に短縮します。",
    icon: "🖨",
    tags: ["授業支援", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/math-worksheet-maker.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。PCでの利用を推奨します。",
  },
  {
    slug: "kanji-test-maker",
    name: "漢字テスト作成",
    description: "学年・単元を選ぶだけで漢字テストを自動生成する予定のツールです。",
    icon: "🈁",
    tags: ["国語", "作成予定"],
    audience: "teacher",
    status: "planned",
  },
  {
    slug: "seating-chart-maker",
    name: "座席表作成",
    description: "条件を指定して座席表を自動作成する予定のツールです。",
    icon: "🪑",
    tags: ["学級経営", "作成予定"],
    audience: "teacher",
    status: "planned",
  },
  {
    slug: "group-divider",
    name: "班分けツール",
    description: "人数や条件に応じて班分けを自動で行う予定のツールです。",
    icon: "👥",
    tags: ["学級経営", "作成予定"],
    audience: "teacher",
    status: "planned",
  },
  {
    slug: "roster-tools",
    name: "名簿関連ツール",
    description: "名簿の作成・並べ替えなどを支援する予定のツールです。",
    icon: "📋",
    tags: ["校務効率化", "作成予定"],
    audience: "teacher",
    status: "planned",
  },
  {
    slug: "score-average-calculator",
    name: "点数・平均計算",
    description: "テストの点数から平均・順位を自動計算する予定のツールです。",
    icon: "🧮",
    tags: ["校務効率化", "作成予定"],
    audience: "teacher",
    status: "planned",
  },
  {
    slug: "class-timer",
    name: "授業用タイマー",
    description:
      "プリセット・カスタム両対応のカウントダウンタイマー。終了時に音と画面の色でお知らせします。",
    icon: "⏱",
    tags: ["授業支援", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/class-timer.html",
  },
  {
    slug: "lottery-roulette",
    name: "抽選・ルーレット",
    description:
      "名前や項目を入力するだけで使えるルーレット抽選ツール。発表者や当番決めに。",
    icon: "🎯",
    tags: ["授業支援", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/lottery-roulette.html",
  },
  {
    slug: "kanji-practice",
    name: "漢字れんしゅう",
    description: "子どもが漢字を練習できるツールを提供する予定です。",
    icon: "🈶",
    tags: ["国語", "作成予定"],
    audience: "student",
    status: "planned",
  },
  {
    slug: "typing-practice",
    name: "タイピングれんしゅう",
    description: "子どもがローマ字入力を楽しく練習できるツールを提供する予定です。",
    icon: "⌨️",
    tags: ["情報", "作成予定"],
    audience: "student",
    status: "planned",
  },
  {
    slug: "calc-practice",
    name: "けいさんれんしゅう",
    description: "子どもが計算問題を繰り返し練習できるツールを提供する予定です。",
    icon: "➕",
    tags: ["算数", "作成予定"],
    audience: "student",
    status: "planned",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
