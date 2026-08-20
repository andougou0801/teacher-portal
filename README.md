# 全国教員支援ポータル（仮称）

## 🌐 公開URL

**https://teacher-portal-puce.vercel.app**

`master`ブランチにpushすると、Vercelが自動で再デプロイします。

コンセプトは「先生の困ったを、すぐ解決。」。小学校教員（特に忙しい若手〜中堅）が
「探す→見つける→すぐ使う」を最短距離でできる総合ポータルを目指すプロジェクトの実装です。
10カテゴリーで構成される拡張仕様のうち、Phase 1（サイト構造）と Phase 2（授業・教材アイデア／学級経営／
学校行事／AI活用／Q&Aの実コンテンツ）を実装しています。

## サイト構成（10カテゴリー）

`src/lib/categories.ts` が全カテゴリーの一覧管理を行っています（ホームのカードグリッド／フッターのサイトマップ共通）。

| カテゴリー | ルート | 状態 |
|---|---|---|
| 先生の便利ツール | `/tools` | **live** |
| 子どもの便利ツール | `/kids` | **live** |
| 授業・教材アイデア | `/lessons` | **live**（2記事） |
| 学級経営・子ども対応 | `/classroom` | **live**（2記事） |
| 学校行事・年間行事 | `/events` | **live**（2記事） |
| 便利な公式サイト集 | `/links` | **live** |
| 先生のコラム | `/column` | 準備中（仕組みは`/articles`と共通、未執筆） |
| 忙しい先生のためのページ | `/life` | 準備中 |
| 先生のAI活用 | `/ai` | **live**（2ガイド） |
| 先生の「困った」Q&A・コミュニティ | `/community`（`/qa`は自動リダイレクト） | **live**（要Supabase設定・下記参照） |

このほか `/articles`（記事）・`/about`（サイト概要）・`/search`（横断検索）が既存機能として存在します。

## 現在できること

- トップページ（新ヒーロー・カテゴリーカードグリッド・ツール/記事プレビュー）
- 自作ツールカタログ（`/tools`）：先生向け実働ツール9本（時間割自動作成／算数プリントメーカー／漢字テスト作成／座席表作成／班分けツール／授業用タイマー／抽選・あみだくじツール／名簿関連ツール／点数・平均計算）。「作成予定」ツールは現在なし
- 子ども向けツール一覧（`/kids`）：実働ツール5本（筆算マスター・都道府県マスターゲーム・100マス計算メーカー・漢字れんしゅう・タイピングれんしゅう）
- 授業・教材アイデア（`/lessons`）・学級経営（`/classroom`）・学校行事（`/events`）：それぞれ実記事2本ずつ
- 教員コミュニティQ&A（`/community`）：先生が質問を投稿し、他の先生が回答できる掲示板。
  カテゴリー分け（授業／学級経営／校務・書類／保護者対応／福利厚生／その他）、匿名投稿対応。
  **Supabaseの設定が完了するまでは「準備中」表示になります**（下記セットアップ手順を参照）
- AI活用ガイド（`/ai`）：「何ができる/どう使う/プロンプト例」形式のガイド2本
- 便利な公式サイト集（`/links`）：文部科学省・NHK for School等の実データ
- サイト内検索（`/search`）：ツール・記事・AIガイド・公式サイトを横断検索（コミュニティの投稿は別途掲示板内で探せます）
- 記事一覧（`/articles`）は実記事7本
- サイト概要・ロードマップ・参考事例・プライバシーポリシー（`/about`）

## コミュニティQ&Aのセットアップ（Supabase）

投稿・回答機能は[Supabase](https://supabase.com)（無料枠あり）を使っています。以下の手順で有効化できます。

1. https://supabase.com でアカウントを作成し、無料プランで新規プロジェクトを作成する
2. プロジェクトの「SQL Editor」を開き、[`supabase/schema.sql`](./supabase/schema.sql) の中身を貼り付けて実行する
   （テーブル作成・アクセス権限設定・既存FAQ5件のシードデータ投入まで行われます）
3. プロジェクトの「Settings → API」画面から `Project URL` と `anon public` キーをコピーする
4. `.env.local.example` を `.env.local` としてコピーし、上記2つの値を貼り付ける（`.env.local`はgit管理外です）
5. 開発サーバーを再起動すると `/community` が実際に動作します

設定前は `/community` に「準備中」の案内が表示されるだけで、ビルドやその他のページには影響しません。
荒らし・不適切投稿への対応は、管理画面（会員登録なしで匿名投稿を受け付ける設計のため）である
Supabaseの「Table Editor」から手動で該当行を削除する運用です。

## コンテンツの追加方法

- **記事・コラム・授業アイデア・学級経営・学校行事**：すべて`src/lib/articles.ts`の1ファイルで管理します。
  `section`（"column"/"lesson"/"classroom"/"event"）を指定すると、該当ページにも自動で表示されます。
- **Q&A・コミュニティ**：`/community`上で先生自身が投稿します（Supabaseに保存され、静的ファイルの編集は不要）。
  カテゴリーを増やしたい場合だけ`src/lib/qaCategories.ts`を編集します。
  旧`src/lib/qa.ts`は初期シードデータの参照用として残していますが、アプリからは参照していません。
- **AI活用ガイド**：`src/lib/aiGuides.ts`に「何ができる/どう使う/プロンプト例/注意点」を追加するだけです。
- **公式サイト**：`src/lib/officialLinks.ts`にサイト情報を追加するだけです。

いずれも「私に頼んで追加してもらう」か「該当ファイルの日本語部分を直接編集する」かのどちらかで運用できます。

## まだ実装していないこと（Phase 2残り/Phase 3）

- 先生のコラム（`/column`）・忙しい先生のためのページ（`/life`）の実コンテンツ
- 企画段階でリストアップされていたツールは全て実装済み（漢字テスト作成・漢字れんしゅうは小学1〜6年生の教育漢字1026字すべてに対応。文部科学省の学年別漢字配当表をもとに、学年ごとの正式な漢字リストと突き合わせて検証済み）
- 学年・教科フィルターUI
- 会員登録・ログイン、お気に入り、閲覧履歴、ランキング、広告等（Phase 3以降。投稿機能はコミュニティQ&Aとして実装済み）

## 開発サーバーの起動

Node.js が必要です（推奨: LTS版）。

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## ツールの追加・更新方法

`public/tools/` 内の各HTMLファイルは、デスクトップの元ファイル（例：`時間割メーカー.html`）への**ハードリンク**です。
コピーではなく実体を共有しているため、元ファイルを保存するだけで自動的にポータル側にも反映されます（コピーし直す作業は不要）。

| 元ファイル | ポータル内のファイル | 対象 |
|---|---|---|
| `時間割メーカー.html` | `teacher-portal/public/tools/timetable-maker.html` | 先生 |
| `算数プリントメーカー.html` | `teacher-portal/public/tools/math-worksheet-maker.html` | 先生 |
| `筆算マスター.html` | `teacher-portal/public/tools/written-calc-master.html` | 子ども |
| `都道府県マスターゲーム.html` | `teacher-portal/public/tools/prefecture-master-game.html` | 子ども |
| `座席表作成.html` | `teacher-portal/public/tools/seating-chart-maker.html` | 先生 |
| `授業用タイマー.html` | `teacher-portal/public/tools/class-timer.html` | 先生 |
| `抽選・あみだくじツール.html` | `teacher-portal/public/tools/lottery-tools.html` | 先生 |
| `班分けツール.html` | `teacher-portal/public/tools/group-divider.html` | 先生 |
| `漢字テスト作成.html` | `teacher-portal/public/tools/kanji-test-maker.html` | 先生 |
| `100マス計算メーカー.html` | `teacher-portal/public/tools/calc-practice.html` | 子ども |
| `名簿作成ツール.html` | `teacher-portal/public/tools/roster-tools.html` | 先生 |
| `タイピングれんしゅう.html` | `teacher-portal/public/tools/typing-practice.html` | 子ども |
| `漢字れんしゅう.html` | `teacher-portal/public/tools/kanji-practice.html` | 子ども |
| `点数・平均計算ツール.html` | `teacher-portal/public/tools/score-average-calculator.html` | 先生 |

> 旧`抽選ルーレット.html`・`あみだくじ.html`は`抽選・あみだくじツール.html`に統合されました（タブ切替で同じ機能を利用できます）。
> 元の2ファイルはデスクトップに残していますが、ポータルとのハードリンクは解除済みです。まだ一般公開前のため、
> 旧URL（`/tools/lottery-roulette`・`/tools/amidakuji`）は404になります。

> Write/Editツールでの編集はハードリンクを切ってしまうことがあるため、元ファイルを編集した後は
> `fsutil hardlink list <ファイル>` でリンクが1件しか表示されない場合、ポータル側のコピーを削除して
> `mklink /H` で張り直してください。

新しいツールを追加する場合は、

1. 元ファイルを `public/tools/` にハードリンクする（`mklink /H <リンク先> <元ファイル>`）
2. `src/lib/tools.ts` の `tools` 配列にエントリを追加する（slug, name, description, icon, tags, `audience`（teacher/student）, `status`（live/planned）, file）

ツールの対象（先生向け/子ども向け）を変更したいときは、`tools.ts`内の該当ツールの`audience`を書き換えるだけです（ファイルの移動は不要）。

これだけで `/tools` 一覧と `/tools/[slug]` 個別ページに反映されます。

> ハードリンクは同じドライブ内でのみ有効です。元ファイルを別ドライブに移動すると壊れるので注意してください。また `next build` で本番用に出力する際は、その時点の内容がスナップショットされます（公開前に最新化してからビルドしてください）。

## 技術スタック

Next.js（App Router）+ TypeScript + Tailwind CSS v4

## 関連ドキュメント

- [プロジェクト企画書](./docs/教員支援ポータル_立ち上げ企画書.docx)
- [初期モックアップ](./docs/mockup.html)
- [次のアクション（TODO）](./TODO.md)
