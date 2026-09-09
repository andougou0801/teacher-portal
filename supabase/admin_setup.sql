-- ============================================================================
-- 全国教員支援ポータル - 管理画面（/admin）のセットアップ
--
-- このファイルの中身を「すべて」コピーして、Supabaseの SQL Editor に貼り付け、
-- Run を押してください。実行は1回だけでOKです。
--
-- 実行すると、次の3つが用意されます。
--   1. 記事・コラムを保存するテーブル（今サイトにある13本の記事も取り込みます）
--   2. ツールの表示設定を保存するテーブル
--   3. 管理者だけが編集できるようにする権限設定
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 管理者の判定
--   ここに書いたメールアドレスでログインした人だけが、記事などを編集できます。
--   別のメールアドレスを使う場合は、下の1行を書き換えてから実行してください。
--   （複数登録したいときは、カンマ区切りで並べられます）
-- ============================================================================
create or replace function is_admin()
returns boolean as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'andougou0801@gmail.com'
  );
$$ language sql stable;

-- ============================================================================
-- 記事・コラム
-- ============================================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null default '',
  body text[] not null default '{}',
  author text not null default '全国教員支援ポータル編集部',
  read_time text not null default '',
  published_at date not null default current_date,
  -- 掲載先。null なら /articles のみ。
  section text check (section in ('column', 'lesson', 'classroom', 'event')),
  subject text,
  month text,
  situation text,
  related_tools text[] not null default '{}',
  related_icebreakers text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ツールの表示設定（本体のHTMLはリポジトリ側。ここでは公開/非公開と並び順のみ）
-- ============================================================================
create table if not exists tool_settings (
  slug text primary key,
  hidden boolean not null default false,
  sort_order integer,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Q&Aの通報（002_reports.sql 未実行のプロジェクトでも動くよう、ここで作る）
-- ============================================================================
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  answer_id uuid references answers(id) on delete cascade,
  reason text not null check (char_length(reason) <= 100),
  created_at timestamptz not null default now(),
  constraint reports_target_check check (
    (question_id is not null and answer_id is null)
    or (question_id is null and answer_id is not null)
  )
);

alter table reports enable row level security;

drop policy if exists "reports are publicly readable" on reports;
create policy "reports are publicly readable" on reports
  for select using (true);

drop policy if exists "anyone can insert reports" on reports;
create policy "anyone can insert reports" on reports
  for insert with check (true);

-- ============================================================================
-- Q&Aの非表示フラグ（管理画面から不適切な投稿を隠せるようにする）
-- ============================================================================
alter table questions add column if not exists hidden boolean not null default false;
alter table answers add column if not exists hidden boolean not null default false;

-- ============================================================================
-- updated_at の自動更新
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();

drop trigger if exists tool_settings_set_updated_at on tool_settings;
create trigger tool_settings_set_updated_at
  before update on tool_settings
  for each row execute function set_updated_at();

-- ============================================================================
-- 権限（RLS）
--   閲覧：公開済みの記事とツール設定は誰でも読める
--   編集：is_admin() に書いたメールアドレスでログインした人だけ
-- ============================================================================
alter table articles enable row level security;
alter table tool_settings enable row level security;

drop policy if exists "published articles are publicly readable" on articles;
create policy "published articles are publicly readable" on articles
  for select using (status = 'published');

drop policy if exists "admins can read all articles" on articles;
create policy "admins can read all articles" on articles
  for select using (is_admin());

drop policy if exists "admins can insert articles" on articles;
create policy "admins can insert articles" on articles
  for insert with check (is_admin());

drop policy if exists "admins can update articles" on articles;
create policy "admins can update articles" on articles
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete articles" on articles;
create policy "admins can delete articles" on articles
  for delete using (is_admin());

drop policy if exists "tool settings are publicly readable" on tool_settings;
create policy "tool settings are publicly readable" on tool_settings
  for select using (true);

drop policy if exists "admins can upsert tool settings" on tool_settings;
create policy "admins can upsert tool settings" on tool_settings
  for insert with check (is_admin());

drop policy if exists "admins can update tool settings" on tool_settings;
create policy "admins can update tool settings" on tool_settings
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete tool settings" on tool_settings;
create policy "admins can delete tool settings" on tool_settings
  for delete using (is_admin());

-- 非表示にした質問・回答は、そもそも一般の閲覧者には返さない
drop policy if exists "questions are publicly readable" on questions;
create policy "questions are publicly readable" on questions
  for select using (hidden = false);

drop policy if exists "admins can read hidden questions" on questions;
create policy "admins can read hidden questions" on questions
  for select using (is_admin());

drop policy if exists "answers are publicly readable" on answers;
create policy "answers are publicly readable" on answers
  for select using (hidden = false);

drop policy if exists "admins can read hidden answers" on answers;
create policy "admins can read hidden answers" on answers
  for select using (is_admin());

-- Q&Aの管理（非表示・削除）は管理者のみ
drop policy if exists "admins can update questions" on questions;
create policy "admins can update questions" on questions
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete questions" on questions;
create policy "admins can delete questions" on questions
  for delete using (is_admin());

drop policy if exists "admins can update answers" on answers;
create policy "admins can update answers" on answers
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete answers" on answers;
create policy "admins can delete answers" on answers
  for delete using (is_admin());

drop policy if exists "admins can delete reports" on reports;
create policy "admins can delete reports" on reports
  for delete using (is_admin());

-- ============================================================================
-- 今サイトに載っている記事を取り込む（管理画面から編集できるようにする）
-- ============================================================================

insert into articles (
  slug, title, category, summary, body, author, read_time, published_at,
  section, subject, month, situation, related_tools, related_icebreakers, status
) values
  ('getting-started-with-free-tools', 'まずはこの3つから。無料の自作ツールで校務の負担を減らす', 'ICT活用', 'このポータルで最初に公開する3つの無料ツール（時間割自動作成・筆算マスター・算数プリントメーカー）を、実際にどんな場面で使えるか紹介します。', array['このポータルでは現在、現場の負担を減らすことを目的にした3つの無料ツールを公開しています。どれもログイン不要・インストール不要で、ブラウザからすぐに使えます。まずはこの3つの使いどころを紹介します。', '【時間割自動作成ツール】学級や教科の条件を入力するだけで、時間割の案を作成できます。学期の始まりや担当変更のタイミングで、一から手作業で組んでいた時間割づくりの土台として使うことを想定しています。あくまで「たたき台」を作るツールなので、最終的な調整は必要ですが、ゼロから考える時間を減らせます。', '【筆算マスター】たし算・ひき算・かけ算・わり算の筆算をゲーム感覚で繰り返し練習できる、子ども向けのツールです。朝学習やすきま時間に、子ども自身がブラウザ上で取り組める形になっています。', '【算数プリントメーカー】単元や難易度を選ぶだけで、A4印刷を前提にした算数の練習プリントを自動生成します。印刷プレビューがA4サイズ基準になっているため、パソコンでの利用を推奨しています（スマートフォンでは横スクロールでの確認になります）。', '3つとも「開発者本人による自作ツール」として掲載しており、実際に教育現場での利用を想定して作られたものです。使ってみて気づいた点や、こういう機能が欲しいという要望があれば、ぜひこのサイト経由でフィードバックをお寄せください。今後もこうしたツールを増やしていく予定です。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-15', null, null, null, null, array['timetable-maker', 'written-calc-master', 'math-worksheet-maker']::text[], '{}', 'published'),
  ('five-minute-icebreakers', '準備1分・実施5分。すぐ使えるアイスブレイク3選', 'アイスブレイク', '道具も準備もほぼ不要で、朝の会や授業の導入にそのまま使えるアイスブレイクを3つ紹介します。', array['アイスブレイクは「盛り上げるため」だけでなく、子どもの声を出しやすくして授業に入りやすい空気を作るためのものでもあります。ここでは準備がほぼ不要で、5分以内に終えられるものを3つ紹介します。', '【共通点探しゲーム】2〜3人組を作り、「制限時間1分で、お互いの共通点を3つ見つける」だけのシンプルな活動です。好きな食べ物や好きな教科など、話すきっかけがなくても自然と会話が生まれます。ペアを毎回変えると、クラス替え直後の学級開きにも使えます。', '【後出しじゃんけん】先生が「グー」と出したあと、少し遅れて子どもに「先生に勝つ手」を出させます。慣れてきたら「先生に負ける手」に変えると、とっさに考える必要があり盛り上がります。立ったまま全員参加できるので、授業と授業の間の切り替えにも向いています。', '【1分間スピーチのお題引き】「好きな○○」「最近あった小さな出来事」など、軽いお題を紙に書いて引かせ、1分間だけ隣の人に話す活動です。話す内容を先生が決めておくことで、恥ずかしがる子でも話しやすくなります。', 'どれも「勝ち負けをはっきりさせすぎない」「話す内容のハードルを下げる」ことを意識しています。クラスの実態に合わせて、時間や人数を調整してお使いください。']::text[], '全国教員支援ポータル編集部', '3分で読める', '2026-08-15', 'lesson', '学級活動', null, null, '{}', array['common-point-pair', 'delayed-janken', 'one-minute-speech']::text[], 'published'),
  ('five-minute-learning-activities', 'スキマ時間5分でできる学習活動3選', '5分でできる活動', '授業の始まりや終わりに余った5分間を、準備なしで学びの時間に変える活動を3つ紹介します。', array['授業の最後に5分だけ時間が余った、という場面は意外と多くあります。ここでは、教材の準備をしなくてもその場でできる活動を紹介します。', '【今日の漢字リレー】黒板に今日習った漢字を1つ書き、それを使った熟語を順番に発表していきます。答えが出なくなったら先生がヒントを出す形にすると、最後まで盛り上がります。国語の授業の締めくくりに向いています。', '【逆さ計算タイム】このポータルの「筆算マスター」を使えば、端末があるクラスならその場で計算練習に切り替えられます。端末がない場合は、先生が黒板に簡単な計算式を出して口頭で答えさせるだけでも、頭の切り替えに効果的です。', '【今日の振り返り一言】「今日の授業で分かったこと」を、隣の人に15秒だけ話す活動です。書く時間を取らずに口頭だけで済ませることで、本当に5分以内に収まります。次の授業への引き継ぎとしても使えます。', 'いずれも「新しい教材を準備しない」ことを前提にしているので、急に時間が余ったときの引き出しとして覚えておくと便利です。']::text[], '全国教員支援ポータル編集部', '3分で読める', '2026-08-15', 'lesson', '総合', null, null, array['written-calc-master']::text[], '{}', 'published'),
  ('first-day-classroom-opening', '学級開き、最初の1日で何をすればいいか', '学級開き', '初めて担任する学級でも迷わないよう、学級開き当日にやることを時間の流れに沿って整理しました。', array['学級開きの1日は、その後1年間の学級の空気を決める大事な日です。「何を話すか」より先に、「何をどの順番でやるか」を決めておくと、当日は落ち着いて子どもに向き合えます。', '【自己紹介は短めに】先生の自己紹介は3分程度にとどめ、名前・好きなこと・今年頑張りたいことくらいで十分です。長く話すより、そのあと子ども一人ひとりの名前を呼んで顔を見る時間の方が印象に残ります。', '【最初のルールは3つまで】初日にたくさんのルールを説明しても定着しません。「話す人の方を見る」「困ったときは相談していい」など、本当に大事なものを2〜3個に絞って伝える方が、後々の指導もぶれません。', '【座席・持ち物などの事務連絡は紙にまとめておく】口頭だけで伝えると聞き逃す子が必ず出ます。座席表・提出物・翌日の持ち物は、簡単な紙やプリントにして渡すと、保護者への伝達もれも防げます。', '【最後に一言、前向きな言葉で締める】初日の終わりに「今日みんなの顔が見られてよかった」など、短くても前向きな一言があると、子どもは安心して帰ることができます。完璧な1日を目指す必要はありません。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-15', 'classroom', null, null, '学級開き', '{}', '{}', 'published'),
  ('talking-with-parents', '保護者に電話するとき、何を話せばいいか', '保護者対応', '特に気を遣う「電話での保護者対応」について、話す順番と気をつけたい言い回しを整理しました。', array['保護者への連絡、特に電話は「何をどの順番で話すか」を決めておくだけで、気持ちの負担がかなり軽くなります。ここでは基本的な流れを紹介します。', '【最初に良い面を一言】用件がトラブルの報告であっても、まず「いつも○○を頑張っていますね」など、良い面を短く伝えてから本題に入ると、保護者も身構えずに話を聞きやすくなります。', '【事実と先生の受け止めを分けて話す】「〇〇君が友達を叩いてしまいました」という事実と、「悪気があったわけではないと思います」という先生の見立ては、分けて伝えると誤解が減ります。事実を先に、解釈はその後に置くのが基本です。', '【今後どうするかを先生から提案する】「今後どうしましょうか」と保護者に丸投げするのではなく、「学校ではこう対応しようと思います。ご家庭でも一言お声かけいただけますか」など、先生側から具体的な提案をすると話がまとまりやすくなります。', '【感情的な言葉を避ける】「困っています」「大変です」といった先生側の感情の言葉は、事実の説明の後に最小限にとどめましょう。保護者は「先生が困っている」ことより「うちの子はどうなのか」を知りたがっています。', '電話対応に絶対の正解はありませんが、「事実→受け止め→提案」の順番を意識するだけで、話しやすさはかなり変わります。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-15', 'classroom', null, null, '保護者対応', '{}', '{}', 'published'),
  ('back-to-school-after-summer', '夏休み明けの学級開き、最初の1週間でやっておきたいこと', '夏休み明け', '長い休み明けは生活リズムも子ども同士の関係も揺らぎがち。最初の1週間で確認しておきたいことをまとめました。', array['夏休み明けは、生活リズムの乱れや、休み中にあった友達関係の変化が表面化しやすい時期です。最初の1週間は「授業を進める」より「様子を見る」ことを優先しましょう。', '【まず生活リズムの確認】初日は「早寝早起きできているか」「朝ごはんを食べてきたか」など、軽い会話の中でさりげなく確認します。無理に聞き出そうとせず、子どもの表情や声のトーンから体調の変化に気づけると理想的です。', '【夏休み明け特有のサインに注意】休み明けは、登校をしぶる・元気がない・友達との距離感が変わったなど、普段と違うサインが出やすい時期です。気になる様子があれば、初日〜3日目のうちに一言声をかけておくと、後の対応がしやすくなります。', '【夏休みの成果物は焦らず扱う】自由研究や日記などの提出物は、初日にまとめて回収するのではなく、2〜3日かけて確認する余裕を持たせると、先生自身の負担も減らせます。', '【学習は軽めから再開する】いきなり難しい内容から始めると、休み明けの子どもにはハードルが高くなります。最初の数日は、既習内容の復習や「筆算マスター」のような軽い練習から再開すると、無理なく学習モードに戻せます。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-15', 'event', null, '8月', null, array['written-calc-master']::text[], '{}', 'published'),
  ('first-week-of-april', '新年度、最初の1週間でやっておきたいこと', '新年度', '新しいクラスがスタートする4月最初の1週間。何を優先すればいいか、時期ごとに整理しました。', array['新年度の最初の1週間は、やることが多く優先順位に迷いがちです。ここでは「まず何から手をつけるか」を時期ごとに整理しました。', '【始業式前日まで】座席表・名簿・時間割の下準備は、始業式が始まる前にできる範囲で終わらせておきます。当日は子どもへの対応に集中できるよう、事務的な準備は前倒しがおすすめです。', '【始業式〜3日目】学級開き（自己紹介・最初のルール確認）と並行して、子どもの名前と顔を早く一致させることを意識します。座席順に軽く話しかけるだけでも、関係づくりの第一歩になります。', '【1週間目後半】そろそろ通常授業のペースをつかみ始める時期です。無理に詰め込まず、時間割通りに進めることを優先し、細かい学級のルールはこのタイミングで少しずつ増やしていきます。', '新年度は先生自身も余裕がない時期なので、「完璧にやろうとしない」ことも大切なポイントです。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-15', 'event', null, '4月', null, '{}', '{}', 'published'),
  ('kanji-and-composition-support', '作文が苦手な子への指導、何から始めればいいか', '国語', '「何を書けばいいか分からない」で止まってしまう子への、書き始める前のひと工夫を紹介します。', array['作文が苦手な子の多くは、文章力そのものより「何を書けばいいか決められない」段階でつまずいています。いきなり原稿用紙に向かわせるのではなく、書く前の準備を丁寧にすると、驚くほどスムーズに書き始められることがあります。', '【題材を絞ってあげる】「運動会について書いて」だけでは範囲が広すぎます。「一番がんばった種目を1つだけ」のように、書く範囲をこちらで狭めてあげると、何を書くか迷う時間が減ります。', '【口で話させてから書かせる】いきなり書かせず、まず隣の子やペアに「さっきの話」を1分間話させてから書き始めると、話した内容がそのまま文章の骨組みになります。話せる子は意外と書けることが多いです。', '【「はじめ・中・おわり」の3行だけ先に決める】本文を書く前に、3つの段落にそれぞれ何を書くかを一言だけメモさせます。「はじめ：練習をがんばった」「中：本番で緊張した」「おわり：走れてうれしかった」のように、骨組みが決まると肉付けは楽になります。', '【誤字・表現より「書けたこと」を先に認める】書き終えた直後に誤字や言い回しを指摘すると、次から書くことへの抵抗が強くなります。まず「最後まで書けたね」を伝えてから、直す部分は1〜2点に絞って伝えると、次への意欲につながります。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-19', 'lesson', '国語', null, null, '{}', '{}', 'published'),
  ('calculation-mistakes-support', '計算ミスが多い子への指導、何を確認すればいいか', '算数', '「ケアレスミス」で片付ける前に確認しておきたい、計算ミスの本当の原因の見つけ方を紹介します。', array['計算ミスが多い子を「ケアレスミス」の一言で片付けてしまうと、同じミスが繰り返されがちです。ミスには実はいくつかのパターンがあり、原因によって声のかけ方も変わります。', '【筆算のズレによるミスか確認する】桁がずれて足し算・引き算を間違えている場合は、理解ではなくノートの使い方の問題です。マス目のあるノートに変える、1マスに1文字だけ書かせるといった工夫だけで改善することが多くあります。', '【途中式を書いているか確認する】暗算に頼りすぎて途中式を省略している子は、複雑な問題になるほどミスが増えます。「途中式を書く」ことを一時的にルール化すると、どこで間違えたかが本人にも見えるようになります。', '【見直しの仕方を教える】「見直しなさい」と言うだけでは、多くの子はもう一度同じ間違え方で解き直してしまいます。「筆算をひっくり返して逆の計算で確かめる」など、具体的な見直しの手順を一緒に練習すると効果的です。', '【本当に理解できているかを別の形で確認する】同じ問題を繰り返すだけでなく、数字を変えた問題や文章題にして出してみると、計算の仕組みそのものが分かっていないのか、単なる書き間違いなのかを見分けやすくなります。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-19', 'lesson', '算数', null, null, '{}', '{}', 'published'),
  ('kids-trouble-mediation', '子ども同士のケンカ、仲裁のときに気をつけたいこと', '子ども同士のトラブル', '「どっちが悪いか」を急いで決めない、子ども同士のトラブル対応の基本的な流れを整理しました。', array['子ども同士のトラブルは毎日のように起こりますが、対応の順番を決めておくと、先生自身も落ち着いて向き合えます。急いで「どっちが悪い」を決めることより、まず何が起きたかを整理することが優先です。', '【まず1人ずつ、別々に話を聞く】その場で両方に一緒に話を聞くと、相手の目を気にして本当のことを話しにくくなります。可能であれば1人ずつ落ち着いた場所で話を聞くと、事実がつかみやすくなります。', '【事実と気持ちを分けて聞く】「何をされたか」という事実と、「そのときどう感じたか」という気持ちは、分けて質問すると整理しやすくなります。「〇〇された」ことと「悲しかった」ことは、どちらも大切ですが混ぜて聞くと話が広がりすぎることがあります。', '【「どっちが悪いか」を急いで結論づけない】多くのトラブルは、双方に言い分があります。先に結論を出そうとせず、両者の話がそろってから、何が問題だったかを一緒に整理する方が、納得感のある着地になります。', '【最後は「これからどうするか」で締める】謝罪の言葉だけで終わらせず、「次に同じことが起きそうになったらどうする？」を本人たちに考えさせると、その場限りの謝罪で終わらずに済みます。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-19', 'classroom', null, null, '子ども同士のトラブル', '{}', '{}', 'published'),
  ('noisy-classroom-atmosphere', '私語が多いクラス、当日からできる対応', '授業中の私語', '「静かにしなさい」を言い続けるだけでは変わらない、私語が多いクラスへの具体的な対応を紹介します。', array['私語が多いクラスに対して「静かにしなさい」を繰り返すだけでは、その場は収まってもすぐに元に戻ってしまいがちです。叱ることより、私語が起きにくい授業の進め方に目を向けると変化が出やすくなります。', '【指示は1つずつ、短く出す】一度にたくさんの指示を出すと、聞き取れなかった子から私語が始まります。「教科書を開く」「27ページを見る」のように、指示を1つずつ区切って出すだけで、聞く姿勢が変わることがあります。', '【全体への注意より、個別に近づく】私語をしている子を全体の前で名指しすると、注目を集めてしまい逆効果になることがあります。近くまで歩いていき、小さな声で個別に伝える方が、授業の流れを止めずに済みます。', '【「静かにする時間」と「話していい時間」の区切りをはっきりさせる】ペアワークなど話していい時間を意図的に作ると、それ以外の時間の私語が減ることがあります。メリハリがないと、いつ話していいのか子ども自身も分からなくなります。', '【できている瞬間を見逃さず伝える】静かに聞けている瞬間に「今のいいね」と一言伝えるだけで、クラス全体の空気が変わることがあります。私語を注意する回数より、良い状態を認める回数を増やす意識が効果的です。']::text[], '全国教員支援ポータル編集部', '4分で読める', '2026-08-19', 'classroom', null, null, '授業中の私語', '{}', '{}', 'published'),
  ('why-i-made-this-site', 'このサイトを作った理由', 'コラム', 'サイトを作ったGO！です。30歳を迎える夏休み、生成AIを触ってみたところから始まった経緯を書いてみます。', array['みなさんこんにちは。初めまして。サイトを作成してみたGO！です。', '今年、30歳になります。1学期なんとか働き抜き、手に入れた夏休み。せっかくなので何かに挑戦してみようと考えました。ずっと、なにかやろうなにかやろうと思いながらも行動にうつせず訪れた夏休み。せっかく時間があるので最近はやりの生成AIを触ってみることにしました。最初は「お金稼ぎをできないかな。」という思いもありました。公務員は基本的に副業禁止なのでよくない考えです笑', 'しかし、AIを使って何がしたいかを考えた時に、自分が働く中でのキーワードに「時間」がいつもありました。「なるべく早く帰りたい。」「事務的な仕事ではなく本質的な業務に時間を使いたい。」そういう思いが常にあったことを思い出しました。そこでもし、このサイトを見つけた人の働き方が「少しでも良いものになったらいいな。」という思いで夏休みを通してこのサイトを作ってみました。まだまだ粗削りで正直使えないかもしれません。しかしAIと協力しながら、このサイトを触って助言してくれる仲間と協力しながら、ゆくゆくは日本全国の教員の方の幸せに少しでもつながればと思います。', '少しずつ指示を出しながら形にしてきました。時間はかかるかもしれませんが、今後も改良していきます。', 'さて、この文章はAIでしょうか。読みながら考えてみてくださいね。それでは今後もよろしくお願いします。', '（活用した生成AIはClaude Codeです。課金しました。笑）']::text[], 'GO！', '2分で読める', '2026-08-20', 'column', null, null, null, '{}', '{}', 'published'),
  ('how-to-use-this-site', 'このサイトの使い方、簡単に紹介します', 'コラム', '公開してから少し経ちましたが、使い方をちゃんと説明していなかったので、今日は簡単にこのサイトの歩き方を紹介します。', array['公開してから少し経ちましたが使い方を説明していなかったなと気づきました。今日は簡単に、このサイトの使い方を紹介します。', 'まず、何か簡単なプリントを作ったり、児童が空いた時間で学力をつけられるようにしたいと思ったら、「先生の便利ツール」か「子どもの便利ツール」から探してみてください。「ツールを開く」を押すと新しいタブでツールだけが開くので、画面いっぱいで使えます。気に入ったツールは☆マークを押しておくと、「お気に入り」ページからすぐ戻ってこられます。ツールごとにURLをデスクトップに貼っておくとより使いやすいと思います。', '授業の隙間時間には「アイスブレイク大特集」もおすすめです。時間・人数・やり方が一目でわかるようにしてあるので、朝の会や授業の導入にそのまま使えると思います。みなさんのおすすめアイスブレイクもぜひ教えてください！', '何か困ったことを相談したいときは「Q&A」から気軽に投稿してください。ニックネームだけで、会員登録は不要です。', '使いながら「こんな機能があったらいいのに」と思ったら、それもぜひQ&Aで教えてください。少しずつ、みなさんと一緒に育てていきたいと思っています。']::text[], 'GO！', '2分で読める', '2026-08-24', 'column', null, null, null, '{}', '{}', 'published')
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  body = excluded.body,
  author = excluded.author,
  read_time = excluded.read_time,
  published_at = excluded.published_at,
  section = excluded.section,
  subject = excluded.subject,
  month = excluded.month,
  situation = excluded.situation,
  related_tools = excluded.related_tools,
  related_icebreakers = excluded.related_icebreakers,
  status = excluded.status;
