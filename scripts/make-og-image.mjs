// SNSに貼ったときのカード画像（public/og.png・1200×630）を作り直す。
//
// なぜこの作り方か：
//   Next.js の opengraph-image（ImageResponse）で作る方法もあるが、日本語を出すには
//   フォントのファイルを読み込ませる必要があり、本番のビルドが外部の配信元に依存する。
//   ここではパソコンのChromeに描かせて**画像を1枚作って置いておく**形にした。
//   ビルドは画像を置くだけなので失敗しようがない。
//
// 使い方（文字を変えたくなったら下の TEXT を直して実行する）:
//   node scripts/make-og-image.mjs
//
// 追加のインストールは不要。Chromeの撮影機能だけを使う。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = path.join(process.cwd(), "public", "og.png");

const TEXT = {
  title: "全国教員支援ポータル",
  lead: "先生の「やらなくていい作業」を減らすために。",
  items: ["無料の授業・校務ツール", "学級経営の記事", "先生のQ&A"],
  url: "teacher-portal-puce.vercel.app",
};

// 色はサイトの globals.css と同じものを使う。
const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; gap: 28px; padding: 0 86px;
    background: linear-gradient(135deg, #1b4965 0%, #102e42 100%);
    color: #fff;
    font-family: "Yu Gothic UI", "Yu Gothic", "Meiryo", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .bar { width: 108px; height: 12px; border-radius: 6px; background: #c2551e; }
  h1 { font-size: 86px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.1; }
  .lead { font-size: 34px; font-weight: 500; color: #d8e6ee; }
  .items { display: flex; gap: 14px; margin-top: 6px; }
  .items span {
    font-size: 25px; font-weight: 700; padding: 11px 22px; border-radius: 999px;
    background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.28);
  }
  .url { position: absolute; left: 86px; bottom: 54px; font-size: 25px; color: #9fc0d2; letter-spacing: 0.04em; }
</style></head><body>
  <div class="bar"></div>
  <h1>${TEXT.title}</h1>
  <div class="lead">${TEXT.lead}</div>
  <div class="items">${TEXT.items.map((t) => `<span>${t}</span>`).join("")}</div>
  <div class="url">${TEXT.url}</div>
</body></html>`;

const tmp = path.join(os.tmpdir(), `og-${Date.now()}.html`);
fs.writeFileSync(tmp, html, "utf8");

if (!fs.existsSync(CHROME)) {
  console.error(`Chromeが見つかりません: ${CHROME}`);
  process.exit(1);
}

execFileSync(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  `--screenshot=${OUT}`,
  pathToFileURL(tmp).href,
], { stdio: "inherit" });

fs.unlinkSync(tmp);
const { size } = fs.statSync(OUT);
console.log(`できました: ${OUT}（${Math.round(size / 1024)}KB）`);
