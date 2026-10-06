-- 全国教員支援ポータル（仮称） - ツールの説明文を管理画面から編集できるようにする
-- admin_setup.sql を実行済みのプロジェクトに対して、追加でこのファイルを
-- Supabaseの「SQL Editor」に貼り付けて1回だけ実行してください。

-- 説明文の上書き。NULL または空文字のときは src/lib/tools.ts に書かれた既定の説明を使う。
-- （ツール本体の追加はコード側の作業なので、既定の説明はこれまでどおりコードが持つ）
alter table tool_settings add column if not exists description text;

-- カード一覧の見た目が崩れるほど長い文章を保存できないようにしておく
alter table tool_settings drop constraint if exists tool_settings_description_length;
alter table tool_settings add constraint tool_settings_description_length
  check (description is null or char_length(description) <= 1000);
