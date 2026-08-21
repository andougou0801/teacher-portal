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
    description:
      "学年を選ぶだけで、読み方・書き取りの漢字テストと解答を自動作成。印刷してすぐ使えます（小学1〜6年生の教育漢字1026字すべてに対応）。",
    icon: "🈁",
    tags: ["国語", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/kanji-test-maker.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。PCでの利用を推奨します。",
  },
  {
    slug: "seating-chart-maker",
    name: "座席表作成",
    description:
      "名簿を読み込んで自動配置、席をクリックで入れ替え。学級委員などの目印付けや、学期ごとの複数保存にも対応。",
    icon: "🪑",
    tags: ["学級経営", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/seating-chart-maker.html",
  },
  {
    slug: "group-divider",
    name: "班分けツール",
    description:
      "名簿を入力し、班の数または1班の人数を指定してランダムに班分け。同じ班にしたくない組み合わせの指定にも対応。名簿はブラウザ内だけで処理され、外部送信は一切ありません。",
    icon: "👥",
    tags: ["学級経営", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/group-divider.html",
  },
  {
    slug: "roster-tools",
    name: "名簿関連ツール",
    description:
      "氏名とふりがなを入力するだけで50音順に並べ替え、出席番号を自動採番。手動での順番調整、印刷用名簿、CSVエクスポート、名簿の保存・読み込みにも対応。",
    icon: "📋",
    tags: ["校務効率化", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/roster-tools.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。PCでの利用を推奨します。",
  },
  {
    slug: "score-average-calculator",
    name: "点数・平均計算",
    description:
      "氏名と点数を入力するだけで、平均点・最高/最低点・中央値・標準偏差・順位・偏差値を自動計算。結果は印刷でき、データの保存・読み込みにも対応。テストの点数という特に機微な情報を扱うため、外部送信は一切ありません。",
    icon: "🧮",
    tags: ["校務効率化", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/score-average-calculator.html",
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
    slug: "lottery-tools",
    name: "抽選・あみだくじツール",
    description:
      "ルーレットとあみだくじを1つに統合。同じ名簿をタブ切替で使い回せます。ルーレットは結果履歴を表示して公平性を可視化、あみだくじは1人ずつクリックして結果を確認。効果音オン/オフと、投影用の「大きく表示」モードにも対応。",
    icon: "🎲",
    tags: ["授業支援", "無料", "ルーレット", "あみだくじ", "抽選"],
    audience: "teacher",
    status: "live",
    file: "/tools/lottery-tools.html",
  },
  {
    slug: "kanji-practice",
    name: "漢字れんしゅう",
    description:
      "小学1〜6年生の教育漢字1026字を、選んで答える／読みを書くの2モードで練習できる子ども向けドリルです。学年を選んで挑戦でき、間違えた漢字は自動的に後でもう一度出題され、連続正解やごほうび演出で楽しく続けられます。",
    icon: "🈶",
    tags: ["国語", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/kanji-practice.html",
  },
  {
    slug: "typing-practice",
    name: "タイピングれんしゅう",
    description:
      "ひらがなの単語をローマ字で入力する、子ども向けタイピング練習ゲーム。れんしゅうモード（10問）と60秒チャレンジモードがあり、し/shi・ち/chi・つ/tsu・ふ/fu・じ/ji など複数のローマ字表記や、促音（っ）・撥音（ん）にも対応。",
    icon: "⌨️",
    tags: ["情報", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/typing-practice.html",
  },
  {
    slug: "word-problem-maker",
    name: "文章問題メーカー",
    description:
      "学年（1〜6年生）と単元を選ぶだけで、学習指導要領に沿った算数の文章題プリントを自動作成。式・答えを書く欄付きで印刷でき、先生用の解答プリントにも切り替えられます。",
    icon: "📖",
    tags: ["算数", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/word-problem-maker.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。PCでの利用を推奨します。",
  },
  {
    slug: "calc-practice",
    name: "100マス計算プリントメーカー",
    description:
      "たし算・ひき算・かけ算の100マス計算プリントを自動作成。数字の範囲やレイアウトを選んで印刷、Wordファイルでの保存にも対応。",
    icon: "➕",
    tags: ["算数", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/calc-practice.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。PCでの利用を推奨します。",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
