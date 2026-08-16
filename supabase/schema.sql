-- 全国教員支援ポータル（仮称） - 教員コミュニティQ&A スキーマ
-- Supabaseの SQL Editor にこのファイルの中身を貼り付けて実行してください。
-- 実行は1回だけでOKです（すでに実行済みの場合は再実行するとエラーになります）。

create extension if not exists "pgcrypto";

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  nickname text,
  question text not null check (char_length(question) <= 300),
  created_at timestamptz not null default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  nickname text,
  answer text not null check (char_length(answer) <= 1000),
  created_at timestamptz not null default now()
);

alter table questions enable row level security;
alter table answers enable row level security;

-- 誰でも閲覧できる
create policy "questions are publicly readable" on questions
  for select using (true);
create policy "answers are publicly readable" on answers
  for select using (true);

-- 誰でも投稿できる（更新・削除はクライアントから不可。荒らし対応はSupabase管理画面から手動で行う）
create policy "anyone can insert questions" on questions
  for insert with check (true);
create policy "anyone can insert answers" on answers
  for insert with check (true);

-- 初期コンテンツ：既存のFAQ（src/lib/qa.ts）を「編集部」名義で投入
insert into questions (category, nickname, question, created_at) values
  ('授業', '編集部', '授業中に子どもが話を聞かない', now() - interval '5 days'),
  ('学級経営', '編集部', 'クラスがざわざわして落ち着かない', now() - interval '4 days'),
  ('授業', '編集部', '宿題をやってこない子への対応', now() - interval '3 days'),
  ('学級経営', '編集部', '子ども同士のトラブルが起きたときの初期対応', now() - interval '2 days'),
  ('その他', '編集部', '初任者だけど、最初に何を準備すればいい？', now() - interval '1 days');

insert into answers (question_id, nickname, answer, created_at)
select id, '編集部',
  case question
    when '授業中に子どもが話を聞かない' then
      'まず「聞ける状態」を作ってから話し始めることを意識してみてください。声を張り上げて注意を引くより、「静かになるまで待つ」「合図（手を挙げる・電気を消すなど）を決めておく」方が、結果的に早く集中を取り戻せることが多いです。毎回同じ合図を使い続けることで、子どもたちも「この合図が出たら切り替える」というルールとして覚えていきます。効果が出るまで数週間かかることもあるので、根気強く続けることが大切です。'
    when 'クラスがざわざわして落ち着かない' then
      '「静かにしなさい」と全体に注意するより、落ち着いて座っている子を具体的に褒める方が効果的なことが多いです。「〇〇さん、もう準備できていますね」のように、望ましい行動を名指しで伝えると、周りの子も真似しやすくなります。ざわつきが続く場合は、活動の切り替えのタイミングに原因があることも。指示を一度に出しすぎず、「まず1つ目だけやってみましょう」と小さく区切ると、落ち着きを取り戻しやすくなります。'
    when '宿題をやってこない子への対応' then
      'まずは「なぜやってこなかったか」を頭ごなしに責めず確認しましょう。忘れていた、量が多すぎた、家庭環境で難しかったなど、理由はさまざまです。理由によって対応も変わってきます。頻繁に続く場合は、宿題の量や難易度が合っていない可能性もあります。保護者と情報共有しながら、その子に合った量に一時的に調整することも選択肢の一つです。'
    when '子ども同士のトラブルが起きたときの初期対応' then
      'まず双方から個別に状況を聞き、その場で「どちらが悪いか」を即断しないことが大切です。感情が高ぶっている状態で結論を急ぐと、どちらか一方が納得できないまま終わってしまうことがあります。事実確認ができたら、双方の言い分を先生の言葉で整理して伝え、「どうすればよかったか」を一緒に考える時間を取りましょう。必要に応じて保護者にも当日中に経緯を伝えておくと、後のトラブルを防げます。'
    when '初任者だけど、最初に何を準備すればいい？' then
      '最初から完璧を目指す必要はありません。優先すべきは「子どもの名前を早く覚えること」「時間割・提出物などの事務的な流れを把握すること」の2つです。授業の完成度は、経験を積みながら少しずつ上げていけば十分です。分からないことがあれば、学年主任や近くの先輩教員にすぐ相談できる関係を作っておくことも大切です。一人で抱え込まないことが、結果的に子どもにとっても良い環境につながります。'
  end,
  created_at + interval '1 hour'
from questions
where nickname = '編集部';
