export type OfficialLink = {
  name: string;
  url: string;
  description: string;
  whenToUse: string;
  category: "教育委員会・公的機関" | "プリント・ドリル" | "ぬりえ" | "めいろ・なぞなぞ";
};

export const officialLinks: OfficialLink[] = [
  // ── 教育委員会・公的機関 ──────────────────────────
  {
    name: "文部科学省",
    url: "https://www.mext.go.jp/",
    description:
      "学習指導要領や教育施策など、教育に関する国の公式情報を発信しているサイトです。",
    whenToUse: "指導要領の内容を確認したいとき、国の教育施策の最新情報を調べたいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "NHK for School",
    url: "https://www.nhk.or.jp/school/",
    description:
      "NHKが提供する、授業で使える教科別の動画・クリップ教材のポータルです。",
    whenToUse: "授業で使える映像教材を探したいとき、視聴覚教材で理解を助けたいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "国立教育政策研究所（NIER）",
    url: "https://www.nier.go.jp/",
    description:
      "教育に関する調査研究を行う国の機関のサイトです。学力調査の結果なども公開されています。",
    whenToUse: "教育に関する調査データや研究成果を確認したいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "政府広報オンライン",
    url: "https://www.gov-online.go.jp/",
    description:
      "各種制度・手続きなど、政府からのお知らせをまとめて発信している公式サイトです。",
    whenToUse: "教員向け制度に限らず、国の制度・手続き全般について調べたいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "熊本市教育センター",
    url: "https://www.kumamoto-kmm.ed.jp/",
    description:
      "熊本市の教職員向け研修・ICT活用情報を発信する教育センターの公式サイトです。おすすめ学習サイトのまとめなど、他自治体の教員にも参考になる情報が充実しています。",
    whenToUse: "ICT活用の先進事例や、研修コンテンツの参考にしたいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "東京都教育委員会",
    url: "https://www.kyoiku.metro.tokyo.lg.jp/",
    description: "東京都の学校教育・教職員関連情報を発信する公式サイトです。",
    whenToUse: "東京都の教育施策や教職員向け情報を確認したいときに。",
    category: "教育委員会・公的機関",
  },
  {
    name: "大阪府教育委員会（教育庁）",
    url: "https://www.pref.osaka.lg.jp/o180010/kyoikusomu/index.html",
    description: "大阪府の学校教育・教育施策に関する情報を発信する公式サイトです。",
    whenToUse: "大阪府の教育施策や教職員向け情報を確認したいときに。",
    category: "教育委員会・公的機関",
  },
  // ── プリント・ドリル ──────────────────────────
  {
    name: "できすぎ君（無料ドリル）",
    url: "http://dorilu.net/",
    description: "国語・社会・英語・算数のドリルプリントを無料でダウンロードできるサイトです。",
    whenToUse: "教科を問わず、その場でドリルプリントを用意したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "ちびむすドリル【小学生】",
    url: "https://happylilac.net/syogaku.html",
    description:
      "1〜6年生向けに国語・算数・社会・理科・音楽・英語など幅広い教科のプリントを提供する、教員にも人気の定番サイトです。",
    whenToUse: "幅広い教科・学年のプリントをまとめて探したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "一家に１枚｜科学技術週間（文部科学省）",
    url: "https://www.mext.go.jp/stw/series.html",
    description: "文部科学省が発行する、科学技術をテーマにしたポスター・資料シリーズです。",
    whenToUse: "理科・総合の掲示物や話のきっかけを探したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "Kahoot!の杜のリンク集（Wakelet）",
    url: "https://wakelet.com/wake/X0dRSV7mwHXEMazxa1hW4",
    description: "Kahoot!など授業で使えるツール・教材のリンクをまとめた有志のコレクションです。",
    whenToUse: "授業で使えるデジタル教材を幅広く探したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "シン・鬼の全漢字プリント（さくさくブログ）",
    url: "https://sakutsuba.com/%e3%82%b7%e3%83%b3%e3%83%bb%e9%ac%bc%e3%81%ae%e5%85%a8%e6%bc%a2%e5%ad%97%e3%83%97%e3%83%aa%e3%83%b3%e3%83%88%e3%80%9c%ef%bc%91%e5%b9%b4%e7%94%9f%e7%b7%a8%e3%80%9c",
    description: "学年ごとに配布漢字を1枚に網羅した、繰り返し練習用の漢字プリントです。",
    whenToUse: "学年の漢字を総復習させたいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "すらぷり（発達障害対応の学習プリント）",
    url: "https://surapuri.jp/",
    description: "発達障害のある子どもにも取り組みやすいよう配慮された無料学習プリント教材です。",
    whenToUse: "個々の特性に配慮したプリントを用意したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "4学年 わくわく算数 自己評価テスト（新興出版社・啓林館）",
    url: "https://www.shinko-keirin.co.jp/keirinkan/sho/sansu/support/jiko-test2020/sansu4.htm",
    description: "教科書会社が公開している、4年生算数の単元別自己評価テストです。",
    whenToUse: "単元の理解度を児童自身に振り返らせたいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "教授用資料（大日本図書）",
    url: "https://www.dainippon-tosho.co.jp/newsletter/",
    description: "教科書会社が発行する、授業づくりに役立つ教授用資料・通信です。",
    whenToUse: "教科書に沿った授業アイデアや資料を探したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "漢字テストメーカー",
    url: "https://kanjitestmaker.cococig.com/",
    description: "学年・範囲を選んで漢字テストをその場で作成できるWebツールです。",
    whenToUse: "オリジナルの漢字テストをすぐ用意したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "無料プリント一覧（ぷりんときっず）",
    url: "https://print-kids.net/print/",
    description: "幼児〜小学校低学年向けの国語・算数プリントや学習ポスターを提供するサイトです。",
    whenToUse: "低学年向けのやさしいプリントを探したいときに。",
    category: "プリント・ドリル",
  },

  // ── ぬりえ ──────────────────────────
  {
    name: "ぬりえ｜ポケモンだいすきクラブ",
    url: "https://www.pokemon.jp/play/paint/?p=1",
    description: "ポケモンの公式ぬりえを、200種類以上ダウンロードできるページです。",
    whenToUse: "早く終わった子への活動や、お楽しみ会の準備に。",
    category: "ぬりえ",
  },
  {
    name: "ぬりえやさんドットコム",
    url: "https://www.nurieyasan.com/",
    description: "さまざまなキャラクター・テーマのぬりえを無料でダウンロードできるサイトです。",
    whenToUse: "特定のキャラクターにこだわらず、幅広くぬりえを探したいときに。",
    category: "ぬりえ",
  },
  {
    name: "あそびば｜ディズニーキッズ公式",
    url: "https://kids.disney.co.jp/download",
    description: "ディズニー公式のぬりえ・工作素材などをダウンロードできるページです。",
    whenToUse: "ディズニーキャラクターのぬりえを使いたいときに。",
    category: "ぬりえ",
  },
  {
    name: "ぬりえ｜ドラえもんチャンネル",
    url: "https://dora-world.com/coloring",
    description: "ドラえもん公式サイトのぬりえダウンロードページです。",
    whenToUse: "ドラえもんのぬりえを使いたいときに。",
    category: "ぬりえ",
  },
  {
    name: "マイメロディスペシャルサイト｜サンリオ",
    url: "https://www.sanrio.co.jp/specialsite/mymelody/",
    description: "サンリオ公式のマイメロディ特設サイト内にある、ぬりえ・迷路のページです。",
    whenToUse: "サンリオキャラクターのぬりえを使いたいときに。",
    category: "ぬりえ",
  },
  {
    name: "ピーナッツぬりえシート｜PEANUTS",
    url: "https://www.peanuts.com/activities/peanuts-coloring-sheets",
    description: "スヌーピーでおなじみ「PEANUTS」公式のぬりえシートです（英語サイト）。",
    whenToUse: "スヌーピーなど海外キャラクターのぬりえを使いたいときに。",
    category: "ぬりえ",
  },

  // ── めいろ・なぞなぞ ──────────────────────────
  {
    name: "無料迷路プリント（ぷりんときっず）",
    url: "https://print-kids.net/print/unpitsu/meiro/",
    description: "運筆練習にも使える、やさしい迷路プリント集です。",
    whenToUse: "低学年の運筆練習や、すきま時間の活動に。",
    category: "めいろ・なぞなぞ",
  },
  {
    name: "めいろひろば",
    url: "https://meiro.websozai.jp/",
    description: "100万種類以上の迷路を自動生成・印刷できるサイトです。",
    whenToUse: "難易度違いの迷路を何パターンも用意したいときに。",
    category: "めいろ・なぞなぞ",
  },
  {
    name: "子供向けなぞなぞ100問プリント",
    url: "https://print.nazo2.net/kodomo/",
    description: "子ども向けのなぞなぞ100問を、プリントして使える形で掲載しています。",
    whenToUse: "アイスブレイクやすきま時間のクイズに。",
    category: "めいろ・なぞなぞ",
  },
  {
    name: "なぞなぞ300問｜いちごドリル",
    url: "https://naki-blog.com/quiz-nazonazo",
    description: "ひっかけ問題も含む、なぞなぞ300問をまとめたページです。",
    whenToUse: "たくさんのなぞなぞから活動に合わせて選びたいときに。",
    category: "めいろ・なぞなぞ",
  },
];

export const officialLinksNote =
  "都道府県・市町村の教育委員会サイトは自治体ごとに異なります。お住まいの自治体名＋「教育委員会」で検索して、最新の公式情報をご確認ください。また、リンク先は学校のネットワーク環境（フィルタリング等）によって閲覧できない場合があります。";
