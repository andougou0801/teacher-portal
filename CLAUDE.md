@AGENTS.md

## 本番サイト

公開URL: https://teacher-portal-puce.vercel.app
（`master`ブランチにpushすると、Vercelが自動で再デプロイします。このURLは毎回聞き返さず、この記載を参照してください。）

## 管理画面（/admin）

記事・コラム、ツールの表示設定、Q&Aの管理は、ユーザー自身が `/admin` から操作できる。
セットアップ手順と設計方針は `supabase/README.md`、SQLは `supabase/admin_setup.sql` を参照。

- 編集権限は `is_admin()`（`admin_setup.sql` 内）に書かれたメールアドレスのみ。
  匿名キーで誰でもサインアップできてしまうため、「ログイン済みなら誰でも編集可」にしないこと。

- 記事はSupabaseの `articles` テーブルが正。`src/lib/articles.ts` はDBに接続できないときの
  フォールバック用スナップショットなので、記事の追加依頼が来ても基本はこのファイルを編集しない
  （ユーザーが管理画面から追加できる）。
- ツールは `src/lib/tools.ts` が正で、`tool_settings` テーブルは公開/非公開と並び順のみを上書きする。
  **新しいツールの追加は従来通りコード側の作業**（HTMLの配置＋tools.tsへの追記）。
- サイト側のページは `src/lib/content.ts` の `getPublishedArticles()` / `getVisibleTools()` 経由で
  コンテンツを取得する。新しくコンテンツを表示するページを作るときも、直接 `articles.ts` /
  `tools.ts` をimportせず、この関数を使うこと。
- コンテンツを表示するページには `export const revalidate = 60;` を付ける（管理画面での変更が
  最大1分で反映されるようにするため）。

## 運用ルール：編集が完了したら自分でpushする

このリポジトリで`public/tools/*.html`（ツール本体）や`src/`配下のコンテンツ・コードを編集した場合、
ユーザーから明示的な依頼がなくても、**作業が完了したと判断できた時点で**以下を自分で行い、
本番へ反映してください（毎回「pushしますか？」と聞き返す必要はありません）。ただし、
まだ動作確認前・修正の途中だと分かる場合はpushしないでください。

1. `teacher-portal`ディレクトリで `npm run lint` と `npm run build` を実行し、
   エラーなく成功することを確認する（**失敗した場合は絶対にpushしない**。原因を直すか、
   直せなければユーザーに報告する）。
2. `public/tools/*.html` を編集した場合、デスクトップの元ファイルとのハードリンクが
   切れていないか確認する（`fsutil hardlink list <ファイル>` でリンクが1件しか出ない場合は切れている）。
   切れていたら、`public/tools/`側のファイルを削除し `mklink /H <リンク先> <元ファイル>` で張り直す。
3. `git status` で変更内容を確認し、**自分が意図して変更したファイルだけ**を`git add`する
   （`git add -A`や`git add .`は使わない。他のセッションが並行して作業中の未完成ファイルを
   巻き込まないため）。
4. 変更内容が分かる日本語のコミットメッセージでコミットし、`git push origin master`する。
5. 完了したら、何をpushしたかを一言でユーザーに報告する（本番URLは上記を参照すればよく、
   聞き返す必要はない）。

このルールは「壊れたものを本番に出さない」ことを最優先にしています。lint/buildが通らない、
判断に迷う、影響範囲が大きい（サイト構造の変更など）といった場合は、pushを保留してユーザーに確認してください。

## ツールを改良するときのユーザーデータ保護（最優先）

ツールの保存データは**利用者のブラウザのlocalStorage**にある。オリジン
（`teacher-portal-puce.vercel.app`）が同じ限り、HTMLを差し替えても**デプロイでは消えない**。
消えるのは、こちらが次のどれかをやったときだけ。**絶対に避けること。**

1. **保存キーの名前を変えない・消さない。** `timetable_subjects` のようなキー名は、
   見栄えが悪くても変更しない。改名＝利用者にとっては全消去と同じ。
2. **データの形を変えるときは、旧キーから読んで変換する。** 新しい形にするなら
   `_v2` の新キーを作り、初回読み込み時に旧キーの内容を変換して書き込む。旧キーは消さない。
   手本: `public/tools/seating-chart-maker.html` の `LEGACY_STORAGE_KEY`（v1→v2の引き継ぎ）。
3. **読み込みは必ず try/catch ＋ 形の検査**（`Array.isArray` など）を通し、失敗しても
   既存データを初期値で上書き保存しない。
4. **改良後の動作確認は「旧版でデータを作る→新版で開く」の順で行う。** 新版だけで
   試すと、データ引き継ぎの不具合に気づけない。
5. 利用者の入力が貯まるツールには、**書き出し/読み込み（バックアップ）を付ける**。
   手本: `public/tools/timetable-maker.html`（JSON書き出し＋最終バックアップ日の警告）。
6. **独自ドメインへ移す場合、全利用者のデータが消える**（localStorageはドメイン単位のため）。
   移行するなら利用者が増える前に。移行するときは事前告知とバックアップ案内が必須。

## ツールの段階的な公開について

`getVisibleTools()` は、`tool_settings` に行が無ければ**表示**する（既定は公開）。
さらに**DBに接続できないときは `tools.ts` の全ツールをそのまま返す**ため、
管理画面で非表示にしただけのツールは、Supabaseの障害・休止中に全部表示されてしまう。
確実に未公開にしておきたいツールは、`tools.ts` の `status` を `"planned"` にすること
（`"planned"` のツールは一覧に出るが「作成予定」と表示され、本体は開けない）。

## DBに列やテーブルを増やす変更をしたときは、その場でSQL実行を案内する

**本番のSupabaseは、こちらがSQLファイルを書いただけでは変わらない。**
ユーザーがダッシュボードで実行して初めて反映される（パスワードが必要なため代行できない）。

実際に起きた事故：2026-10-06 に「説明文を管理画面から編集する機能」を追加したが、
必要なSQL（`003_tool_descriptions.sql`）の実行を案内しなかったため、本番DBに
`description` 列が無いまま4日間、管理画面で編集しても保存されない状態になっていた。

そのため、**列・テーブル・ポリシーを追加する変更をしたら、同じ返信の中で必ず**：

1. 実行するSQLファイルをメモ帳で開く
   （`Start-Process notepad.exe -ArgumentList "<パス>"`）
2. SQL Editorの直リンクを貼る
   https://supabase.com/dashboard/project/eyakvgrrbbjbnyuzqrcj/sql/new
3. 実行後、**匿名キーで実データを読んで反映を確認する**（推測で終わらせない）

```bash
URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2- | tr -d '\r')
KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2- | tr -d '\r')
curl -s "$URL/rest/v1/tool_settings?select=slug,description" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
```

`tool_settings`・`articles`・`questions` などは匿名キーで読めるので、
「保存されない」という相談を受けたときも、まずこの方法で実データを見ると原因が早く分かる。
