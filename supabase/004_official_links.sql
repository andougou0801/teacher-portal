-- ============================================================================
-- 便利な公式サイト集を、管理画面(/admin/links)から編集できるようにする
--
-- これを実行すると official_links テーブルが作られ、いま src/lib/officialLinks.ts に
-- 入っている42件がそのまま登録されます。
-- 実行後は、サイトはデータベースの内容を表示します（つながらないときだけ
-- officialLinks.ts の内容にもどるので、表示が消えることはありません）。
--
-- Supabase の SQL Editor に貼り付けて実行してください。何度実行しても安全です。
-- ============================================================================

create table if not exists official_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text not null default '',
  when_to_use text not null default '',
  category text not null,
  subject text,
  sort_order integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table official_links enable row level security;

drop policy if exists "official links are publicly readable" on official_links;
create policy "official links are publicly readable" on official_links
  for select using (not hidden);

drop policy if exists "admins can read all official links" on official_links;
create policy "admins can read all official links" on official_links
  for select using (is_admin());

drop policy if exists "admins can insert official links" on official_links;
create policy "admins can insert official links" on official_links
  for insert with check (is_admin());

drop policy if exists "admins can update official links" on official_links;
create policy "admins can update official links" on official_links
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete official links" on official_links;
create policy "admins can delete official links" on official_links
  for delete using (is_admin());

-- 既存の42件を登録する（すでに中身があるときは何もしない）
insert into official_links (name, url, description, when_to_use, category, subject, sort_order)
select * from (values
  ('文部科学省', 'https://www.mext.go.jp/', '学習指導要領や教育施策など、教育に関する国の公式情報を発信しているサイトです。', '指導要領の内容を確認したいとき、国の教育施策の最新情報を調べたいときに。', '教育委員会・公的機関', null, 1),
  ('NHK for School', 'https://www.nhk.or.jp/school/', 'NHKが提供する、授業で使える教科別の動画・クリップ教材のポータルです。', '授業で使える映像教材を探したいとき、視聴覚教材で理解を助けたいときに。', '教育委員会・公的機関', null, 2),
  ('国立教育政策研究所（NIER）', 'https://www.nier.go.jp/', '教育に関する調査研究を行う国の機関のサイトです。学力調査の結果なども公開されています。', '教育に関する調査データや研究成果を確認したいときに。', '教育委員会・公的機関', null, 3),
  ('政府広報オンライン', 'https://www.gov-online.go.jp/', '各種制度・手続きなど、政府からのお知らせをまとめて発信している公式サイトです。', '教員向け制度に限らず、国の制度・手続き全般について調べたいときに。', '教育委員会・公的機関', null, 4),
  ('熊本市教育センター', 'https://www.kumamoto-kmm.ed.jp/', '熊本市の教職員向け研修・ICT活用情報を発信する教育センターの公式サイトです。おすすめ学習サイトのまとめなど、他自治体の教員にも参考になる情報が充実しています。', 'ICT活用の先進事例や、研修コンテンツの参考にしたいときに。', '教育委員会・公的機関', null, 5),
  ('東京都教育委員会', 'https://www.kyoiku.metro.tokyo.lg.jp/', '東京都の学校教育・教職員関連情報を発信する公式サイトです。', '東京都の教育施策や教職員向け情報を確認したいときに。', '教育委員会・公的機関', null, 6),
  ('大阪府教育委員会（教育庁）', 'https://www.pref.osaka.lg.jp/o180010/kyoikusomu/index.html', '大阪府の学校教育・教育施策に関する情報を発信する公式サイトです。', '大阪府の教育施策や教職員向け情報を確認したいときに。', '教育委員会・公的機関', null, 7),
  ('アクティブチャイルドプログラム（日本スポーツ協会）', 'https://www.japan-sports.or.jp/Portals/0/acp/', '日本スポーツ協会（JSPO）が提供する、子どもの基本的な動きを育てる運動遊びプログラム集です。指導法やE-ラーニング教材も掲載されています。', '体育の授業や休み時間の運動遊びのネタを探したいとき、指導法を確認したいときに。', '教育委員会・公的機関', null, 8),
  ('できすぎ君（無料ドリル）', 'http://dorilu.net/', '国語・社会・英語・算数のドリルプリントを無料でダウンロードできるサイトです。', '教科を問わず、その場でドリルプリントを用意したいときに。', 'プリント・ドリル', null, 9),
  ('ちびむすドリル【小学生】', 'https://happylilac.net/syogaku.html', '1〜6年生向けに国語・算数・社会・理科・音楽・英語など幅広い教科のプリントを提供する、教員にも人気の定番サイトです。', '幅広い教科・学年のプリントをまとめて探したいときに。', 'プリント・ドリル', null, 10),
  ('一家に１枚｜科学技術週間（文部科学省）', 'https://www.mext.go.jp/stw/series.html', '文部科学省が発行する、科学技術をテーマにしたポスター・資料シリーズです。', '理科・総合の掲示物や話のきっかけを探したいときに。', 'プリント・ドリル', null, 11),
  ('Kahoot!の杜のリンク集（Wakelet）', 'https://wakelet.com/wake/X0dRSV7mwHXEMazxa1hW4', 'Kahoot!など授業で使えるツール・教材のリンクをまとめた有志のコレクションです。', '授業で使えるデジタル教材を幅広く探したいときに。', 'プリント・ドリル', null, 12),
  ('シン・鬼の全漢字プリント（さくさくブログ）', 'https://sakutsuba.com/%e3%82%b7%e3%83%b3%e3%83%bb%e9%ac%bc%e3%81%ae%e5%85%a8%e6%bc%a2%e5%ad%97%e3%83%97%e3%83%aa%e3%83%b3%e3%83%88%e3%80%9c%ef%bc%91%e5%b9%b4%e7%94%9f%e7%b7%a8%e3%80%9c', '学年ごとに配布漢字を1枚に網羅した、繰り返し練習用の漢字プリントです。', '学年の漢字を総復習させたいときに。', 'プリント・ドリル', null, 13),
  ('すらぷり（発達障害対応の学習プリント）', 'https://surapuri.jp/', '発達障害のある子どもにも取り組みやすいよう配慮された無料学習プリント教材です。', '個々の特性に配慮したプリントを用意したいときに。', 'プリント・ドリル', null, 14),
  ('4学年 わくわく算数 自己評価テスト（新興出版社・啓林館）', 'https://www.shinko-keirin.co.jp/keirinkan/sho/sansu/support/jiko-test2020/sansu4.htm', '教科書会社が公開している、4年生算数の単元別自己評価テストです。', '単元の理解度を児童自身に振り返らせたいときに。', 'プリント・ドリル', null, 15),
  ('教授用資料（大日本図書）', 'https://www.dainippon-tosho.co.jp/newsletter/', '教科書会社が発行する、授業づくりに役立つ教授用資料・通信です。', '教科書に沿った授業アイデアや資料を探したいときに。', 'プリント・ドリル', null, 16),
  ('漢字テストメーカー', 'https://kanjitestmaker.cococig.com/', '学年・範囲を選んで漢字テストをその場で作成できるWebツールです。', 'オリジナルの漢字テストをすぐ用意したいときに。', 'プリント・ドリル', null, 17),
  ('無料プリント一覧（ぷりんときっず）', 'https://print-kids.net/print/', '幼児〜小学校低学年向けの国語・算数プリントや学習ポスターを提供するサイトです。', '低学年向けのやさしいプリントを探したいときに。', 'プリント・ドリル', null, 18),
  ('学習プリント.com', 'https://xn--fdk3a7ctb5192box5b.com/', '幼児〜中学生向けに、学年別・教科別（国語・算数・英語・社会・理科など）の学習プリントを幅広く無料提供するサイトです。', '学年・教科を横断して、まとまった量のプリントを探したいときに。', 'プリント・ドリル', null, 19),
  ('School Stock（現役教員による無料教材の棚）', 'https://a-tozak.github.io/School_Stock/', '現役の小学校教員が作成・公開している、教室用イラスト・教科別ワークシート・学級経営ツール・AIプロンプト集など1,400点以上の無料素材をまとめたサイトです。登録不要・クレジット表記も不要で使えます。', '掲示物のイラストや、すぐ使える教材・学級経営ツールを探したいときに。', 'プリント・ドリル', null, 20),
  ('ぬりえ｜ポケモンだいすきクラブ', 'https://www.pokemon.jp/play/paint/?p=1', 'ポケモンの公式ぬりえを、200種類以上ダウンロードできるページです。', '早く終わった子への活動や、お楽しみ会の準備に。', 'ぬりえ', null, 21),
  ('ぬりえやさんドットコム', 'https://www.nurieyasan.com/', 'さまざまなキャラクター・テーマのぬりえを無料でダウンロードできるサイトです。', '特定のキャラクターにこだわらず、幅広くぬりえを探したいときに。', 'ぬりえ', null, 22),
  ('あそびば｜ディズニーキッズ公式', 'https://kids.disney.co.jp/download', 'ディズニー公式のぬりえ・工作素材などをダウンロードできるページです。', 'ディズニーキャラクターのぬりえを使いたいときに。', 'ぬりえ', null, 23),
  ('ぬりえ｜ドラえもんチャンネル', 'https://dora-world.com/coloring', 'ドラえもん公式サイトのぬりえダウンロードページです。', 'ドラえもんのぬりえを使いたいときに。', 'ぬりえ', null, 24),
  ('マイメロディスペシャルサイト｜サンリオ', 'https://www.sanrio.co.jp/specialsite/mymelody/', 'サンリオ公式のマイメロディ特設サイト内にある、ぬりえ・迷路のページです。', 'サンリオキャラクターのぬりえを使いたいときに。', 'ぬりえ', null, 25),
  ('ピーナッツぬりえシート｜PEANUTS', 'https://www.peanuts.com/activities/peanuts-coloring-sheets', 'スヌーピーでおなじみ「PEANUTS」公式のぬりえシートです（英語サイト）。', 'スヌーピーなど海外キャラクターのぬりえを使いたいときに。', 'ぬりえ', null, 26),
  ('無料迷路プリント（ぷりんときっず）', 'https://print-kids.net/print/unpitsu/meiro/', '運筆練習にも使える、やさしい迷路プリント集です。', '低学年の運筆練習や、すきま時間の活動に。', 'めいろ・なぞなぞ', null, 27),
  ('めいろ（学習プリント）｜ベストカレンダー', 'https://bestcalendar.jp/print/meiro', '迷路をその場で作って印刷・PDF保存できるページです。用紙（A4たて・よこ／B5／A3）と難易度（8×8・15×15・25×25）を選べ、2枚目に答えが付きます。家庭・学校・塾での印刷と配布は自由とされています。', '難易度違いの迷路を何パターンも用意したいときに。白黒コピーで配るときにも。', 'めいろ・なぞなぞ', null, 28),
  ('子供向けなぞなぞ100問プリント', 'https://print.nazo2.net/kodomo/', '子ども向けのなぞなぞ100問を、プリントして使える形で掲載しています。', 'アイスブレイクやすきま時間のクイズに。', 'めいろ・なぞなぞ', null, 29),
  ('なぞなぞ300問｜いちごドリル', 'https://naki-blog.com/quiz-nazonazo', 'ひっかけ問題も含む、なぞなぞ300問をまとめたページです。', 'たくさんのなぞなぞから活動に合わせて選びたいときに。', 'めいろ・なぞなぞ', null, 30),
  ('今日は何の日｜日本記念日協会', 'https://www.kinenbi.gr.jp/', '記念日の認定・登録を行っている一般社団法人の公式サイトです。トップページのカレンダーで日付を選ぶと、その日の記念日が一覧で表示されます。', '朝の会の一言や、日直のスピーチの話題さがしに。日付と結びつけて話すと子どもが覚えやすくなります。', '毎日の話題（朝の会・帰りの会）', null, 31),
  ('NEWS WEB EASY（NHK）', 'https://www3.nhk.or.jp/news/easy/', 'NHKが小中学生や日本語を学ぶ人向けに、やさしいことばで伝えているニュースサイトです。平日に数本ずつ更新され、音声で聞くこともできます。元のニュースへのリンクも付いています。', '時事の話題を児童に紹介したいときに。そのまま読み聞かせたり、音読の材料にも使えます。', '毎日の話題（朝の会・帰りの会）', null, 32),
  ('ほしぞら情報｜国立天文台', 'https://www.nao.ac.jp/astro/sky/', '国立天文台が、その月の星空の様子・惑星の動き・注目の天文現象を紹介しているページです。月ごとにまとめられています。', '「今夜こんな天体が見えるよ」と予告したいときに。4年・6年の理科や、季節の話題づくりにも。', '毎日の話題（朝の会・帰りの会）', null, 33),
  ('漢字ペディア', 'https://www.kanjipedia.jp/', '日本漢字能力検定協会が運営する漢字辞典サイトです。漢字一字・言葉・読み・部首・総画数から引くことができます。', '漢字の意味や使い方をその場で確かめたいときに。調べ学習で児童に使わせることもできます。', '教科の理解を深める', '国語', 34),
  ('地理教育の道具箱｜国土地理院', 'https://www.gsi.go.jp/CHIRIKYOUIKU/index.html', '国土地理院が、地図・地理・防災の教材や素材を公開しているページです。地理院地図の使い方、災害リスクの調べ方、単元別の資料一覧などがあります。公開資料は利用規約の範囲で自由に使えます。', '社会科で地図の読み方を扱うとき、防災の学習で土地のようすと災害を結びつけたいときに。', '教科の理解を深める', '社会', 35),
  ('なるほど統計学園｜総務省統計局', 'https://www.stat.go.jp/naruhodo/', '総務省統計局による統計の学習サイトです。初級・上級に分かれ、データの探し方、グラフの作り方、特徴の捉え方、統計用語辞典などが用意されています。', '算数のグラフ・資料の活用や、社会科・総合の調べ学習でデータの示し方を教えたいときに。', '教科の理解を深める', '算数・社会', 36),
  ('JAXA宇宙教育センター', 'https://edu.jaxa.jp/', 'JAXAが初等・中等教育向けに行っている教育支援のサイトです。画像・動画・デジタル教材を探せるほか、授業連携や教員向け研修、コズミックカレッジなどの情報があります。', '理科の天体・空気・ものの運動などで、本物の資料や映像を見せたいときに。', '教科の理解を深める', '理科', 37),
  ('東書Eネット｜東京書籍', 'https://ten.tokyo-shoseki.co.jp/', '東京書籍の教員向けサイトです。教科ごとの「教科の広場」、年間指導計画作成資料、単元リンク集のほか、指導案・授業プリント・ワークシート・評価問題などをジャンルで絞り込んで探せます（一部は会員登録が必要です）。', '東京書籍の教科書で、単元に合う資料やワークシートを探したいときに。', '教科書会社の授業サポート', null, 38),
  ('小学校の教科書・教材｜光村図書', 'https://www.mitsumura-tosho.co.jp/', '光村図書の公式サイトです。小学校の国語・書写・生活・英語・道徳の教科ページに加え、授業づくりのアイデアを紹介するWebマガジンや教育情報誌が読めます。', '光村図書の教科書で、教材の読み取りや授業の進め方の参考がほしいときに。', '教科書会社の授業サポート', null, 39),
  ('小学校 授業支援・サポート資料｜啓林館', 'https://www.shinko-keirin.co.jp/keirinkan/sho/', '啓林館の小学校トップページです。算数・理科・生活・英語それぞれに「授業支援・サポート資料」「指導者用書籍」などのメニューがあり、単元の指導に使える資料をたどれます。', '啓林館の教科書で、単元ごとの指導資料や自己評価テストを探したいときに。', '教科書会社の授業サポート', null, 40),
  ('年間指導計画・評価計画（案）｜教育出版', 'https://www.kyoiku-shuppan.co.jp/tokushu/r6plan.html', '教育出版が公開している、小学校の年間指導計画・評価計画（案）のページです。教科別にダウンロードできます。', '年度はじめに指導計画を立てるとき、評価規準の書き方を参考にしたいときに。', '教科書会社の授業サポート', null, 41),
  ('my実践事例｜日本文教出版', 'https://www.nichibun-g.co.jp/', '日本文教出版の公式サイトです。社会・算数・図画工作・道徳などで、現場の先生の実践事例（my実践事例）やWebマガジン「学び！と算数」「学び！と道徳」、道徳授業サポートナビなどが読めます。', '図画工作や道徳など、進め方に迷いやすい教科の実践例を見たいときに。', '教科書会社の授業サポート', null, 42)
) as seed(name, url, description, when_to_use, category, subject, sort_order)
where not exists (select 1 from official_links);
