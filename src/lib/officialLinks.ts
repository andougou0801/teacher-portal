export type OfficialLink = {
  name: string;
  url: string;
  description: string;
  whenToUse: string;
  category:
    | "教育委員会・公的機関"
    | "プリント・ドリル"
    | "ぬりえ"
    | "めいろ・なぞなぞ"
    | "毎日の話題（朝の会・帰りの会）"
    | "教科の理解を深める"
    | "教科書会社の授業サポート";
  /** 教科の理解を深める で、どの教科向けかを示す */
  subject?: string;
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
  {
    name: "アクティブチャイルドプログラム（日本スポーツ協会）",
    url: "https://www.japan-sports.or.jp/Portals/0/acp/",
    description:
      "日本スポーツ協会（JSPO）が提供する、子どもの基本的な動きを育てる運動遊びプログラム集です。指導法やE-ラーニング教材も掲載されています。",
    whenToUse: "体育の授業や休み時間の運動遊びのネタを探したいとき、指導法を確認したいときに。",
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
  {
    name: "学習プリント.com",
    url: "https://xn--fdk3a7ctb5192box5b.com/",
    description:
      "幼児〜中学生向けに、学年別・教科別（国語・算数・英語・社会・理科など）の学習プリントを幅広く無料提供するサイトです。",
    whenToUse: "学年・教科を横断して、まとまった量のプリントを探したいときに。",
    category: "プリント・ドリル",
  },
  {
    name: "School Stock（現役教員による無料教材の棚）",
    url: "https://a-tozak.github.io/School_Stock/",
    description:
      "現役の小学校教員が作成・公開している、教室用イラスト・教科別ワークシート・学級経営ツール・AIプロンプト集など1,400点以上の無料素材をまとめたサイトです。登録不要・クレジット表記も不要で使えます。",
    whenToUse: "掲示物のイラストや、すぐ使える教材・学級経営ツールを探したいときに。",
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
    name: "めいろ（学習プリント）｜ベストカレンダー",
    url: "https://bestcalendar.jp/print/meiro",
    description:
      "迷路をその場で作って印刷・PDF保存できるページです。用紙（A4たて・よこ／B5／A3）と難易度（8×8・15×15・25×25）を選べ、2枚目に答えが付きます。家庭・学校・塾での印刷と配布は自由とされています。",
    whenToUse: "難易度違いの迷路を何パターンも用意したいときに。白黒コピーで配るときにも。",
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

  // ── 毎日の話題（朝の会・帰りの会） ──────────────────────────
  {
    name: "今日は何の日｜日本記念日協会",
    url: "https://www.kinenbi.gr.jp/",
    description:
      "記念日の認定・登録を行っている一般社団法人の公式サイトです。トップページのカレンダーで日付を選ぶと、その日の記念日が一覧で表示されます。",
    whenToUse: "朝の会の一言や、日直のスピーチの話題さがしに。日付と結びつけて話すと子どもが覚えやすくなります。",
    category: "毎日の話題（朝の会・帰りの会）",
  },
  {
    name: "NEWS WEB EASY（NHK）",
    url: "https://www3.nhk.or.jp/news/easy/",
    description:
      "NHKが小中学生や日本語を学ぶ人向けに、やさしいことばで伝えているニュースサイトです。平日に数本ずつ更新され、音声で聞くこともできます。元のニュースへのリンクも付いています。",
    whenToUse: "時事の話題を児童に紹介したいときに。そのまま読み聞かせたり、音読の材料にも使えます。",
    category: "毎日の話題（朝の会・帰りの会）",
  },
  {
    name: "ほしぞら情報｜国立天文台",
    url: "https://www.nao.ac.jp/astro/sky/",
    description:
      "国立天文台が、その月の星空の様子・惑星の動き・注目の天文現象を紹介しているページです。月ごとにまとめられています。",
    whenToUse: "「今夜こんな天体が見えるよ」と予告したいときに。4年・6年の理科や、季節の話題づくりにも。",
    category: "毎日の話題（朝の会・帰りの会）",
  },

  // ── 教科の理解を深める ──────────────────────────
  {
    name: "漢字ペディア",
    url: "https://www.kanjipedia.jp/",
    description:
      "日本漢字能力検定協会が運営する漢字辞典サイトです。漢字一字・言葉・読み・部首・総画数から引くことができます。",
    whenToUse: "漢字の意味や使い方をその場で確かめたいときに。調べ学習で児童に使わせることもできます。",
    category: "教科の理解を深める",
    subject: "国語",
  },
  {
    name: "地理教育の道具箱｜国土地理院",
    url: "https://www.gsi.go.jp/CHIRIKYOUIKU/index.html",
    description:
      "国土地理院が、地図・地理・防災の教材や素材を公開しているページです。地理院地図の使い方、災害リスクの調べ方、単元別の資料一覧などがあります。公開資料は利用規約の範囲で自由に使えます。",
    whenToUse: "社会科で地図の読み方を扱うとき、防災の学習で土地のようすと災害を結びつけたいときに。",
    category: "教科の理解を深める",
    subject: "社会",
  },
  {
    name: "なるほど統計学園｜総務省統計局",
    url: "https://www.stat.go.jp/naruhodo/",
    description:
      "総務省統計局による統計の学習サイトです。初級・上級に分かれ、データの探し方、グラフの作り方、特徴の捉え方、統計用語辞典などが用意されています。",
    whenToUse: "算数のグラフ・資料の活用や、社会科・総合の調べ学習でデータの示し方を教えたいときに。",
    category: "教科の理解を深める",
    subject: "算数・社会",
  },
  {
    name: "JAXA宇宙教育センター",
    url: "https://edu.jaxa.jp/",
    description:
      "JAXAが初等・中等教育向けに行っている教育支援のサイトです。画像・動画・デジタル教材を探せるほか、授業連携や教員向け研修、コズミックカレッジなどの情報があります。",
    whenToUse: "理科の天体・空気・ものの運動などで、本物の資料や映像を見せたいときに。",
    category: "教科の理解を深める",
    subject: "理科",
  },

  // ── 教科書会社の授業サポート ──────────────────────────
  {
    name: "東書Eネット｜東京書籍",
    url: "https://ten.tokyo-shoseki.co.jp/",
    description:
      "東京書籍の教員向けサイトです。教科ごとの「教科の広場」、年間指導計画作成資料、単元リンク集のほか、指導案・授業プリント・ワークシート・評価問題などをジャンルで絞り込んで探せます（一部は会員登録が必要です）。",
    whenToUse: "東京書籍の教科書で、単元に合う資料やワークシートを探したいときに。",
    category: "教科書会社の授業サポート",
  },
  {
    name: "小学校の教科書・教材｜光村図書",
    url: "https://www.mitsumura-tosho.co.jp/",
    description:
      "光村図書の公式サイトです。小学校の国語・書写・生活・英語・道徳の教科ページに加え、授業づくりのアイデアを紹介するWebマガジンや教育情報誌が読めます。",
    whenToUse: "光村図書の教科書で、教材の読み取りや授業の進め方の参考がほしいときに。",
    category: "教科書会社の授業サポート",
  },
  {
    name: "小学校 授業支援・サポート資料｜啓林館",
    url: "https://www.shinko-keirin.co.jp/keirinkan/sho/",
    description:
      "啓林館の小学校トップページです。算数・理科・生活・英語それぞれに「授業支援・サポート資料」「指導者用書籍」などのメニューがあり、単元の指導に使える資料をたどれます。",
    whenToUse: "啓林館の教科書で、単元ごとの指導資料や自己評価テストを探したいときに。",
    category: "教科書会社の授業サポート",
  },
  {
    name: "年間指導計画・評価計画（案）｜教育出版",
    url: "https://www.kyoiku-shuppan.co.jp/tokushu/r6plan.html",
    description:
      "教育出版が公開している、小学校の年間指導計画・評価計画（案）のページです。教科別にダウンロードできます。",
    whenToUse: "年度はじめに指導計画を立てるとき、評価規準の書き方を参考にしたいときに。",
    category: "教科書会社の授業サポート",
  },
  {
    name: "my実践事例｜日本文教出版",
    url: "https://www.nichibun-g.co.jp/",
    description:
      "日本文教出版の公式サイトです。社会・算数・図画工作・道徳などで、現場の先生の実践事例（my実践事例）やWebマガジン「学び！と算数」「学び！と道徳」、道徳授業サポートナビなどが読めます。",
    whenToUse: "図画工作や道徳など、進め方に迷いやすい教科の実践例を見たいときに。",
    category: "教科書会社の授業サポート",
  },
];

export const officialLinksNote =
  "都道府県・市町村の教育委員会サイトは自治体ごとに異なります。お住まいの自治体名＋「教育委員会」で検索して、最新の公式情報をご確認ください。また、リンク先は学校のネットワーク環境（フィルタリング等）によって閲覧できない場合があります。";
