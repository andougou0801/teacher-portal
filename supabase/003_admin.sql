-- 全国教員支援ポータル - 管理画面（/admin）用の追加スキーマ
-- schema.sql / 002_reports.sql を実行済みのプロジェクトに対して、
-- Supabaseの「SQL Editor」に貼り付けて1回だけ実行してください。
--
-- 実行後、004_articles_seed.sql（既存の記事をデータベースへ移す用）も続けて実行してください。

create extension if not exists "pgcrypto";

-- =====================================================================
-- 記事・コラム
-- =====================================================================
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

-- =====================================================================
-- ツールの表示設定（本体のHTMLはリポジトリ側。ここでは公開/非公開と並び順のみ）
-- =====================================================================
create table if not exists tool_settings (
  slug text primary key,
  hidden boolean not null default false,
  sort_order integer,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Q&Aの非表示フラグ（管理画面から不適切な投稿を隠せるようにする）
-- =====================================================================
alter table questions add column if not exists hidden boolean not null default false;
alter table answers add column if not exists hidden boolean not null default false;

-- =====================================================================
-- updated_at の自動更新
-- =====================================================================
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

-- =====================================================================
-- 権限（RLS）
--   閲覧：公開済みの記事とツール設定は誰でも読める
--   編集：ログイン済み（＝管理者アカウント）のみ
-- =====================================================================
alter table articles enable row level security;
alter table tool_settings enable row level security;

drop policy if exists "published articles are publicly readable" on articles;
create policy "published articles are publicly readable" on articles
  for select using (status = 'published');

drop policy if exists "admins can read all articles" on articles;
create policy "admins can read all articles" on articles
  for select to authenticated using (true);

drop policy if exists "admins can insert articles" on articles;
create policy "admins can insert articles" on articles
  for insert to authenticated with check (true);

drop policy if exists "admins can update articles" on articles;
create policy "admins can update articles" on articles
  for update to authenticated using (true) with check (true);

drop policy if exists "admins can delete articles" on articles;
create policy "admins can delete articles" on articles
  for delete to authenticated using (true);

drop policy if exists "tool settings are publicly readable" on tool_settings;
create policy "tool settings are publicly readable" on tool_settings
  for select using (true);

drop policy if exists "admins can upsert tool settings" on tool_settings;
create policy "admins can upsert tool settings" on tool_settings
  for insert to authenticated with check (true);

drop policy if exists "admins can update tool settings" on tool_settings;
create policy "admins can update tool settings" on tool_settings
  for update to authenticated using (true) with check (true);

drop policy if exists "admins can delete tool settings" on tool_settings;
create policy "admins can delete tool settings" on tool_settings
  for delete to authenticated using (true);

-- 非表示にした質問・回答は、そもそも一般の閲覧者には返さない
drop policy if exists "questions are publicly readable" on questions;
create policy "questions are publicly readable" on questions
  for select using (hidden = false);

drop policy if exists "admins can read hidden questions" on questions;
create policy "admins can read hidden questions" on questions
  for select to authenticated using (true);

drop policy if exists "answers are publicly readable" on answers;
create policy "answers are publicly readable" on answers
  for select using (hidden = false);

drop policy if exists "admins can read hidden answers" on answers;
create policy "admins can read hidden answers" on answers
  for select to authenticated using (true);

-- Q&Aの管理（非表示・削除）はログイン済みのみ
drop policy if exists "admins can update questions" on questions;
create policy "admins can update questions" on questions
  for update to authenticated using (true) with check (true);

drop policy if exists "admins can delete questions" on questions;
create policy "admins can delete questions" on questions
  for delete to authenticated using (true);

drop policy if exists "admins can update answers" on answers;
create policy "admins can update answers" on answers
  for update to authenticated using (true) with check (true);

drop policy if exists "admins can delete answers" on answers;
create policy "admins can delete answers" on answers
  for delete to authenticated using (true);

drop policy if exists "admins can delete reports" on reports;
create policy "admins can delete reports" on reports
  for delete to authenticated using (true);
