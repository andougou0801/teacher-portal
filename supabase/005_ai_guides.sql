-- ============================================================================
-- 先生のAI活用ガイドを、管理画面(/admin/ai)から編集できるようにする
--
-- これを実行すると ai_guides テーブルが作られ、いま src/lib/aiGuides.ts に入っている
-- 5件がそのまま登録されます。つながらないときは aiGuides.ts の内容に
-- もどるので、表示が消えることはありません。
--
-- Supabase の SQL Editor に貼り付けて実行してください。何度実行しても安全です。
-- ============================================================================

create table if not exists ai_guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tool text not null default '',
  summary text not null default '',
  what_it_does text not null default '',
  how_to_use text[] not null default '{}',
  sample_prompt text not null default '',
  caution text not null default '',
  sort_order integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ai_guides enable row level security;

drop policy if exists "ai guides are publicly readable" on ai_guides;
create policy "ai guides are publicly readable" on ai_guides
  for select using (not hidden);

drop policy if exists "admins can read all ai guides" on ai_guides;
create policy "admins can read all ai guides" on ai_guides
  for select using (is_admin());

drop policy if exists "admins can insert ai guides" on ai_guides;
create policy "admins can insert ai guides" on ai_guides
  for insert with check (is_admin());

drop policy if exists "admins can update ai guides" on ai_guides;
create policy "admins can update ai guides" on ai_guides
  for update using (is_admin()) with check (is_admin());

drop policy if exists "admins can delete ai guides" on ai_guides;
create policy "admins can delete ai guides" on ai_guides
  for delete using (is_admin());

-- 既存の5件を登録する（すでに中身があるときは何もしない）
insert into ai_guides (slug, title, tool, summary, what_it_does, how_to_use, sample_prompt, caution, sort_order)
select * from (values
  ('lesson-plan-drafting', '授業案づくりの「たたき台」をAIに手伝ってもらう', 'ChatGPT / Claude', 'ゼロから授業案を考える時間を減らすため、AIに構成案のたたき台を出してもらう使い方を紹介します。', '学年・教科・単元を伝えると、授業の流れ（導入・展開・まとめ）の案をいくつか提示してくれます。あくまで「たたき台」なので、実際のクラスの実態に合わせて先生が調整することが前提です。', array['学年・教科・単元名・授業時間（何分か）をまず伝える', '出てきた案の中から「導入だけ詳しく」「展開部分を3パターン出して」のように、部分的に深掘りして絞り込んでいく', '最終的にはクラスの実態（人数、理解度、時間配分）に合わせて自分で手直しする']::text[], '小学4年生の算数、「わり算の筆算」の単元です。45分授業の指導案の骨子（導入・展開・まとめ）を3パターン考えてください。導入は5分程度で、子どもが興味を持てる導入にしてください。', 'AIが出す案はあくまで一般的な内容です。学習指導要領や学校独自のカリキュラムと照らし合わせ、最終判断は必ず先生自身が行ってください。', 1),
  ('report-card-comment-drafting', '所見・通知表コメントの下書きにAIを使う', 'ChatGPT / Claude', '毎学期時間がかかる所見の下書きを、キーワードから文章化する形でAIに手伝ってもらう使い方です。', '「頑張っていたこと」「今後の課題」などのキーワードを箇条書きで伝えると、通知表・所見に使える文章の形に整えてくれます。文章を1から書く手間を減らせます。', array['その子について伝えたいポイントを箇条書きでメモする（例：係活動に積極的、漢字の読みが苦手、友達に優しい）', '文字数の目安（例：150字程度）を指定して文章化してもらう', '出てきた文章をそのまま使わず、その子らしい表現に必ず手直しする']::text[], '以下のキーワードを、小学校の通知表の所見欄に使える文章に整えてください。150字程度、前向きな表現でお願いします。キーワード：係活動に積極的、漢字の読みが苦手、友達に優しく声をかけられる', '児童生徒の氏名や、特定できる詳しい個人情報は入力しないでください。キーワードだけを伝え、文章が完成したあとに手元で名前を当てはめる使い方が安全です。', 2),
  ('class-newsletter-drafting', '学級通信・お便りの文案をAIに手伝ってもらう', 'ChatGPT / Claude', '毎回ゼロから文章を考えがちな学級通信・保護者向けお便りを、伝えたい内容から下書きしてもらう使い方です。', '「今週あった出来事」「お願いしたいこと」などを箇条書きで伝えると、学級通信・お便りに使える文章の形にまとめてくれます。文章の硬さ（丁寧すぎない／かしこまった文体など）も指定できます。', array['今週伝えたい内容を箇条書きでメモする（例：運動会の練習が始まった、持ち物のお願い、来週の行事予定）', '文字数の目安と文体（やわらかめ／丁寧めなど）を指定して文章化してもらう', '学校名・地域独自の行事名など、AIが知らない固有名詞は自分で補って仕上げる']::text[], '以下の内容を、小学校の学級通信に使える文章にまとめてください。400字程度、保護者向けのやわらかい文体でお願いします。内容：今週から運動会の練習が始まった、水筒と着替えの準備をお願いしたい、来週火曜日に授業参観がある', '児童生徒の氏名や、個人が特定できるエピソードの詳細は入力しないでください。学校・学年全体の一般的な内容にとどめ、個別のエピソードは自分の言葉で書き足す使い方が安全です。', 3),
  ('parent-meeting-prep', '保護者面談の質問リスト・進行メモをAIに作ってもらう', 'ChatGPT / Claude', '何を聞けばいいか毎回悩みがちな保護者面談の準備を、目的を伝えるだけで進行メモの形にしてもらう使い方です。', '面談の目的（学習面の相談、生活面の相談など）を伝えると、聞いておきたい質問や、話す順番の案を出してくれます。初めて担任を持つ先生でも、面談の骨組みを短時間で用意できます。', array['面談の目的とだいたいの時間（例：10分、学習面が中心）を伝える', '出てきた質問リストから、そのクラス・その子に合わないものを削って調整する', '「事実→良い面→相談したいこと」のような話す順番も一緒に相談すると、当日の進行がスムーズになる']::text[], '小学校の個人懇談（10分程度）の進行メモを作ってください。学習面と友達関係の両方について、保護者に聞いておきたい質問リストと、話す順番の案を出してください。', '児童生徒の氏名や個人が特定できる詳細なエピソードは入力しないでください。あくまで「質問の型」を借りるだけにして、当日の内容はその子に合わせて先生自身が判断してください。', 4),
  ('worksheet-idea-brainstorm', '授業の振り返り活動のアイデア出しにAIを使う', 'ChatGPT / Claude', '単元の終わりの振り返り活動、毎回同じパターンになりがちな悩みを、複数案を一気に出してもらうことで解消する使い方です。', '学年・教科・単元を伝えると、授業の振り返り（まとめ）に使える活動のアイデアを複数案出してくれます。「書く活動」「話す活動」など、活動の種類を指定して幅出しすることもできます。', array['学年・教科・単元名と、振り返りにかけられる時間（例：10分）を伝える', '「書く活動を3つ」「話す活動を3つ」のように、活動の種類ごとに案を出してもらう', 'クラスの実態（人数、机の配置、端末の有無）に合わせて、実施しやすい案を選んで手直しする']::text[], '小学5年生の理科、「植物の発芽と成長」の単元の振り返り活動を考えてください。10分程度で実施できる、書く活動と話す活動をそれぞれ3案ずつ出してください。', '出てきた案はあくまで一般的な発想の引き出しです。学習指導要領のねらいと合っているか、そのクラスの実態に合うかは、必ず先生自身で確認してから使ってください。', 5)
) as seed(slug, title, tool, summary, what_it_does, how_to_use, sample_prompt, caution, sort_order)
where not exists (select 1 from ai_guides);
