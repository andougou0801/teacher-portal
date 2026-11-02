-- ============================================================================
-- トップページのカテゴリー（名前・説明・並び順）を、管理画面(/admin/categories)から
-- 編集できるようにする
--
-- これを実行すると site_categories テーブルが作られ、いまの10件が登録されます。
-- つながらないときは categories.ts の内容にもどるので、表示が消えることはありません。
--
-- Supabase の SQL Editor に貼り付けて実行してください。何度実行しても安全です。
-- ============================================================================

create table if not exists site_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  icon text not null default '',
  description text not null default '',
  href text not null,
  status text not null default 'live',
  sort_order integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table site_categories enable row level security;

drop policy if exists "categories are publicly readable" on site_categories;
create policy "categories are publicly readable" on site_categories
  for select using (not hidden);
drop policy if exists "admins can read all categories" on site_categories;
create policy "admins can read all categories" on site_categories for select using (is_admin());
drop policy if exists "admins can insert categories" on site_categories;
create policy "admins can insert categories" on site_categories for insert with check (is_admin());
drop policy if exists "admins can update categories" on site_categories;
create policy "admins can update categories" on site_categories for update using (is_admin()) with check (is_admin());
drop policy if exists "admins can delete categories" on site_categories;
create policy "admins can delete categories" on site_categories for delete using (is_admin());

insert into site_categories (slug, label, icon, description, href, status, sort_order)
select * from (values
  ('teacher-tools', '先生の便利ツール', '🧰', '採点・プリント作成・時間割など、仕事をすぐ効率化できるツール。', '/tools', 'live', 1),
  ('kids-tools', '子どもの便利ツール', '🎮', '漢字・計算・タイピングなど、子どもが学校や家庭で使える学習ツール。', '/kids', 'live', 2),
  ('lessons', '授業・教材アイデア', '📚', '「明日の授業に使える」教科別・場面別のアイデア集。', '/lessons', 'live', 3),
  ('classroom', '学級経営・子ども対応', '🏫', '学級開き・トラブル対応・保護者対応など、困った場面から探せるページ。', '/classroom', 'live', 4),
  ('events', '学校行事・年間行事', '📅', '時期ごとに必要な情報を探せる、年間行事の準備ガイド。', '/events', 'live', 5),
  ('links', '便利な公式サイト集', '🔗', '文部科学省・教育委員会など、教員が必要とする公式サイトをまとめて紹介。', '/links', 'live', 6),
  ('column', '先生のコラム', '✏️', '学級経営や授業実践について、運営者自身の視点で発信するコラム。', '/column', 'live', 7),
  ('life', '忙しい先生のためのページ', '💼', '福利厚生・休暇・手当など、先生自身の生活を支える制度情報。', '/life', 'live', 8),
  ('ai', '先生のAI活用', '🤖', 'ChatGPT・Claudeなど、生成AIを授業準備や校務に活かすための入門ガイド。', '/ai', 'live', 9),
  ('qa', '先生の「困った」Q&A・コミュニティ', '💬', '気軽に質問を投稿し、他の先生から回答をもらえる掲示板。', '/community', 'live', 10)
) as seed(slug, label, icon, description, href, status, sort_order)
where not exists (select 1 from site_categories);
