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
    name: "週の時間割メーカー",
    description:
      "1週間の時間割（朝の時間〜6時間目）に宿題・持ち物・メモを書き込んで、そのまま印刷して配れます。曜日ごとの基本時間割を「定型」として登録しておけば1クリックで反映でき、前の週の内容のコピー、年間予定の登録、土曜・日曜の追加にも対応。低学年向けのひらがな表示に切り替えることもできます。",
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
    description:
      "日本の都道府県の位置・名前をゲーム感覚で楽しく覚えられます。地形・気候、食料生産、工業の3テーマクイズに加え、県庁所在地クイズ、間違えた県だけを復習できるモードにも対応。",
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
    slug: "league-tournament-maker",
    name: "リーグ戦・トーナメント表メーカー",
    description:
      "参加者・チーム名と条件を入れるだけで、リーグ戦（総当たり戦）の日程表・対戦表や、トーナメント表を自動作成。対戦表はクリックで勝敗を記録すると順位表が自動計算され、トーナメント表も勝者をクリックするだけで次の対戦相手まで自動更新されます。印刷にも対応。",
    icon: "🏆",
    tags: ["体育・学校行事", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/league-tournament-maker.html",
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
      "ルーレットとあみだくじを1つに統合。同じ名簿をタブ切替で使い回せます。ルーレットは40人学級に対応し、出席番号での自動入力、日直2人などの複数人まとめ選び、今日のお休みの一時除外、選ばれた人を次回から外す機能、直前の結果の取り消しが可能。減速に合わせたカチカチ音と当選区画のスポットライトで教室が盛り上がります。色覚多様性に配慮した配色、投影用の「大きく表示」モードにも対応。",
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
    slug: "history-quiz",
    name: "歴史人物タイムトラベルクイズ",
    description:
      "卑弥呼から明治の人物まで、日本の歴史人物43人をヒントクイズで覚えられます。ヒントは1つずつ出てきて、少ないヒントで当てるほど高得点。時代ごとの挑戦、正解した人物が集まる人物図鑑、間違えた人物だけの復習モードにも対応。",
    icon: "🏯",
    tags: ["社会", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/history-quiz.html",
  },
  {
    slug: "typing-practice",
    name: "タイピングれんしゅう",
    description:
      "ひらがなの言葉をローマ字で入力する、子ども向けタイピング練習ツール。自分のペースで打つ「シンプルモード」と、打った言葉が町のエネルギーになって「はらっぱ」から「ことばのみやこ」まで育っていくゲームモード「ことばのまち」（どうぶつ広場・ことばタワー・ことばキャッチの3ゲーム）があります。し/shi・ち/chi・つ/tsu・ふ/fu・じ/ji など複数のローマ字表記や、促音（っ）・撥音（ん）にも対応。四字熟語やことわざが出る「むずかしいことば」の切り替えもできます。",
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
  {
    slug: "report-comment-maker",
    name: "通知表所見文例集",
    description:
      "観点別に217の文例から選んで所見を組み立てられます。画面下に文字数が常に表示され、「次の児童へ」で名簿順に書き進められます。他の児童と同じ文になっていないかを一覧で確認でき、「他の子との比較」「断定的な否定」など避けたい表現も自動でチェック。課題を配慮して伝える言い回し、学期末の結び、指導要録用の常体変換にも対応。全員分はまとめてコピー・CSV保存できます。",
    icon: "📝",
    tags: ["学級経営", "校務効率化", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/report-comment-maker.html",
    mobileNote:
      "スマートフォンでも使えますが、クラス全員分をまとめて作成する場合はPCでの利用を推奨します。",
  },
  {
    slug: "minutes-maker",
    name: "議事録メーカー",
    description:
      "会議中に録音するだけで、話した言葉がその場で文字になり、要約・決定事項・やること（担当と期限つき）・課題・次回の予定まで自動で整理します。声の高さと声質から話者を聞き分けて「Aさん」「Bさん」と記録し、会議の前に参加者の声を登録しておけば最初から実名で残せます。20人規模の会議でも、あとから人数を指定して話者を整理し直せます。誤変換はその場で直せ、コピー・印刷・PDF・テキスト保存に対応。音声も文章も外部には送信されません。",
    icon: "🎙",
    tags: ["校務効率化", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/minutes-maker.html",
    mobileNote:
      "音声認識はChrome・Edge・Safariで動きます（Firefoxは非対応）。iPad・iPhoneでは区切りごとに認識が止まりやすいため、止まったら画面の「認識を再開」を押してください。長い会議はPCでの利用を推奨します。",
  },
  {
    slug: "reading-text-maker",
    name: "国語の文章作成メーカー",
    description:
      "帯時間の音読・朝読書に使える読み物を326作品収録。学年（小1〜6年）と説明文／物語文を選ぶだけで、A4一枚に収まる文章を印刷できます。動物・かがく・歴史・食べものなど25分野のオリジナル作品に加え、芥川龍之介・宮沢賢治・新美南吉などの著作権が切れた名作の再話も収録し、オリジナルか再話かを教員が一目で確認できます。フリガナは「学年に合わせて」自動で付き、よこ書き／たて書き／原稿用紙の切り替え、行間・1行の字数の調整にも対応。ねらい・発問例・語句の説明が入った教員用メモつきで印刷することもできます。",
    icon: "📚",
    tags: ["国語", "無料"],
    audience: "teacher",
    status: "live",
    file: "/tools/reading-text-maker.html",
    mobileNote:
      "印刷プレビューはA4サイズ基準のため、スマートフォンでは横スクロールしてご確認ください。学級で配る文章を印刷する場合はPCでの利用を推奨します。",
  },
  {
    slug: "angle-master",
    name: "角度マスター",
    description:
      "三角形・四角形の角度の問題を、図を見ながら繰り返し練習できます。分度器を使わずに角の大きさを当てる「見当をつける」、画面の分度器をドラッグして角に置く「分度器のおき方」、分度器の読み取り、一直線と1回転の角、三角じょうぎの角（4年）、三角形・二等辺三角形・四角形・平行四辺形・多角形の角（5年）、三角形の外角（発展）の11単元に対応。まちがえたときは「きみの答え」の角を図に重ねて見せるので、どれくらいちがうのかが目で分かります。おき方の問題は ピッタリ／せいかい／おしい の4段階で判定し、ずれの向きと大きさを教えてその場で直せます。図は毎回自動で作られ、向きも変わるので同じ問題が続きません。学年やにがてな単元での出題、まちがえた問題だけの復習、単元別の正答率の記録にも対応しています。",
    icon: "📐",
    tags: ["算数", "無料"],
    audience: "student",
    status: "live",
    file: "/tools/angle-master.html",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
