// ゲームの JavaScript に 文法の まちがいが ないかを 見る。
//
//   使いかた： node scripts/check-study-game-js.mjs
//
// ★なぜ いるか
//   `npm run lint` と `npm run build` は public/ の中を 見ていない。
//   だから public/study-game/ の js に 文法の まちがいが あっても 両方とも 通る。
//   じっさい、同じ名前の const を 2回 書いただけで アプリ ぜんたいが
//   まっ白に なったのに、lint も build も 気づかなかった。
import { readdirSync, statSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = join(root, "public", "study-game");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".js")) out.push(p);
  }
  return out;
}

const files = walk(base);
const tmp = mkdtempSync(join(tmpdir(), "sgjs-"));
const bad = [];

for (const f of files) {
  // node --check は 拡張子で 見かたを 決める。
  // .js は むかしの 書きかた あつかいに なり import/export で 落ちるので、
  // .mjs に うつしてから 見る。
  const copy = join(tmp, "x.mjs");
  writeFileSync(copy, readFileSync(f, "utf8"), "utf8");
  try {
    execFileSync(process.execPath, ["--check", copy], { stdio: "pipe" });
  } catch (err) {
    const msg = String(err.stderr || err.message)
      .split("\n")
      .filter((l) => l.includes("Error") || l.includes("^"))
      .slice(0, 2)
      .join(" / ");
    bad.push(`${relative(root, f)}: ${msg}`);
  }
}
rmSync(tmp, { recursive: true, force: true });

console.log(`見たファイル：${files.length}`);
if (bad.length) {
  console.log(`\n■ 文法の まちがい：${bad.length}件`);
  for (const b of bad) console.log("  ×" + b);
  process.exit(1);
}
console.log("文法の まちがい なし");
