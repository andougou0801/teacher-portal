-- 全国教員支援ポータル（仮称） - Q&Aの通報機能 追加スキーマ
-- schema.sql を実行済みのプロジェクトに対して、追加でこのファイルを
-- Supabaseの「SQL Editor」に貼り付けて1回だけ実行してください。

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

-- 通報件数を数えるために誰でも閲覧可（通報理由の中身は管理画面でのみ確認想定）
create policy "reports are publicly readable" on reports
  for select using (true);

-- 誰でも通報できる（更新・削除はクライアントから不可）
create policy "anyone can insert reports" on reports
  for insert with check (true);

-- 運用イメージ：
-- 同じ質問・回答への通報が3件以上たまると、サイト側で自動的に本文を隠し
-- 「内容を確認中です」と表示するようにしています（コードの実装のみで完結、
-- DB側の追加設定は不要です）。実際に削除するかどうかは、これまで通り
-- Supabaseの「Table Editor」で questions / answers テーブルから
-- 手動で行ってください。通報自体を大量に消したい場合は reports テーブルから
-- 該当行を削除してください。
