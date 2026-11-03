-- ============================================================================
-- 一覧ページの「見出し・紹介文・今後扱っていくテーマ」を、
-- 管理画面(/admin/pages)から編集できるようにする
--
-- これを実行すると page_texts テーブルが作られ、
-- 「授業・教材アイデア」「学級経営・子ども対応」「先生のAI活用」の3ページぶんが
-- いま src/lib/pageTexts.ts に入っている内容のまま登録されます。
--
-- つながらないときは pageTexts.ts の内容にもどるので、表示が消えることはありません。
-- Supabase の SQL Editor に貼り付けて実行してください。何度実行しても安全です。
-- ============================================================================

create table if not exists page_texts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  eyebrow text not null default '',
  emoji text not null default '',
  heading text not null,
  lead text not null default '',
  topics_title text not null default '今後扱っていくテーマ（例）',
  topics text[] not null default '{}',
  cards jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table page_texts enable row level security;

drop policy if exists "page texts are publicly readable" on page_texts;
create policy "page texts are publicly readable" on page_texts for select using (true);
drop policy if exists "admins can read all page texts" on page_texts;
create policy "admins can read all page texts" on page_texts for select using (is_admin());
drop policy if exists "admins can insert page texts" on page_texts;
create policy "admins can insert page texts" on page_texts for insert with check (is_admin());
drop policy if exists "admins can update page texts" on page_texts;
create policy "admins can update page texts" on page_texts for update using (is_admin()) with check (is_admin());
drop policy if exists "admins can delete page texts" on page_texts;
create policy "admins can delete page texts" on page_texts for delete using (is_admin());

insert into page_texts (slug, eyebrow, emoji, heading, lead, topics_title, topics, cards, sort_order)
select * from (values
  (
    'lessons', 'Lessons', '📚', '授業・教材アイデア',
    '「明日の授業に使える」を合言葉に、教科別・場面別のアイデアを紹介していきます。',
    '今後扱っていくテーマ（例）',
    array['国語','算数','理科','社会','体育','音楽','図工','道徳','授業開き','授業終わり'],
    '[
      {"href":"/lessons/icebreakers","emoji":"🎉","title":"アイスブレイク大特集","description":"時間・場所・人数・やり方が一目でわかる、すぐ使えるアイスブレイク集","countFrom":"icebreakers"},
      {"href":"/lessons/recreations","emoji":"🏃","title":"学級レク特集","description":"〇〇鬼などのそとあそびから、ハンカチ落としのような室内レクまで。「お楽しみ会」「雨の日」など場面・場所・学年で絞り込めます","countFrom":"recreations"}
    ]'::jsonb,
    1
  ),
  (
    'classroom', 'Classroom', '🏫', '学級経営・子ども対応',
    '教員が日々困りやすい場面から探せるページを目指しています。',
    '今後扱っていくテーマ（例）',
    array['班活動','係活動','掃除','給食','褒め方','叱り方','子ども同士のトラブル','授業中の私語','個人懇談'],
    '[]'::jsonb,
    2
  ),
  (
    'ai', 'AI for Teachers', '🤖', '先生のAI活用',
    '「何ができる？」「どう使う？」「実際のプロンプト」まで、初心者にも分かる形で紹介します。',
    '今後扱っていくテーマ（例）',
    array['Claude Code','Canva','AIによるアイデア出し','AIを使った学級経営','教育現場でのAI活用事例'],
    '[]'::jsonb,
    3
  )
) as seed(slug, eyebrow, emoji, heading, lead, topics_title, topics, cards, sort_order)
where not exists (select 1 from page_texts);
