// 勉強ゲーム「かずのまち」の問題データを、原本から公開フォルダへコピーする。
//
//   原本：docs/study-game/questions/（ここを直す）
//   公開：public/study-game/data/（こちらは自動で作る。直接直さない）
//
// 使い方：node scripts/sync-study-game-questions.mjs
//
// コピーのついでに形を検査する（漢字が混ざっていないか、答えの形が合っているか）。
// 問題を足すときは、原本に単元のJSONを置き、manifest.json に1行足して、これを実行するだけ。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "docs", "study-game", "questions");
const outDir = join(root, "public", "study-game", "data");

const KANJI = /[一-鿿]/;
const TYPES = new Set(["choice", "input", "order", "trace"]);
const errors = [];
const warnings = [];

function readJSON(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function checkItem(unitId, item) {
  const where = `${unitId} ${item.id}`;
  if (!item.id) errors.push(`${where}: id がない`);
  if (!TYPES.has(item.type)) errors.push(`${where}: しらない type「${item.type}」`);
  if (!Array.isArray(item.prompt) || !item.prompt.length) {
    errors.push(`${where}: prompt が配列でない`);
    return;
  }
  if (item.prompt.length > 2) warnings.push(`${where}: prompt が3行以上`);
  for (const line of item.prompt) {
    if (KANJI.test(line)) errors.push(`${where}: 漢字が入っている「${line}」`);
    if ([...line].length > 24) warnings.push(`${where}: 1行が長い(${[...line].length}字)`);
  }
  if (item.type === "choice") {
    if (!Array.isArray(item.choices) || item.choices.length < 2) errors.push(`${where}: choices がない`);
    else if (typeof item.answer !== "number" || item.answer < 0 || item.answer >= item.choices.length) {
      errors.push(`${where}: answer が choices の範囲外`);
    }
  } else if (item.type === "input") {
    if (!/^\d+$/.test(String(item.answer))) errors.push(`${where}: answer が数字でない`);
  } else if (item.type === "trace") {
    if (!item.char || [...item.char].length !== 1) errors.push(`${where}: trace の char が 1文字でない`);
  } else if (item.type === "order") {
    if (!Array.isArray(item.tokens) || !Array.isArray(item.answer)) errors.push(`${where}: tokens / answer がない`);
    else if (item.tokens.length !== item.answer.length) errors.push(`${where}: tokens と answer の数が合わない`);
    else {
      const sorted = [...item.answer].sort((a, b) => a - b).join(",");
      const want = item.tokens.map((_, i) => i).join(",");
      if (sorted !== want) errors.push(`${where}: answer が 0..n-1 の並べ替えでない`);
    }
  }
  if (!item.skill) warnings.push(`${where}: skill がない`);
}

function main() {
  if (!existsSync(srcDir)) {
    console.error(`原本のフォルダがありません: ${srcDir}`);
    process.exit(1);
  }
  const manifest = readJSON(join(srcDir, "manifest.json"));
  const files = [];
  for (const grade of manifest.grades || []) {
    for (const unit of grade.units || []) files.push(unit);
  }

  mkdirSync(join(outDir, "units"), { recursive: true });
  let total = 0;
  const skillIds = new Set();

  for (const unit of files) {
    const path = join(srcDir, unit.file);
    if (!existsSync(path)) {
      errors.push(`${unit.unitId}: ファイルがない ${unit.file}`);
      continue;
    }
    const data = readJSON(path);
    if (data.unitId !== unit.unitId) errors.push(`${unit.unitId}: manifest と unitId が合わない`);
    for (const s of data.skills || []) {
      skillIds.add(s.id);
      if (!(unit.skills || []).some((x) => x.id === s.id)) {
        errors.push(`${unit.unitId}: manifest の skills に ${s.id} がない`);
      }
    }
    for (const item of data.items || []) {
      checkItem(unit.unitId, item);
      if (item.skill && !(data.skills || []).some((s) => s.id === item.skill)) {
        errors.push(`${unit.unitId} ${item.id}: しらない skill「${item.skill}」`);
      }
    }
    total += (data.items || []).length;
    writeFileSync(join(outDir, unit.file), JSON.stringify(data), "utf8");
  }

  // 原本に置いてあるのに manifest に書き忘れているファイルを見つける
  const unitDir = join(srcDir, "units");
  if (existsSync(unitDir)) {
    const listed = new Set(files.map((u) => u.file.replace(/^units\//, "")));
    for (const name of readdirSync(unitDir)) {
      if (name.endsWith(".json") && !listed.has(name)) {
        warnings.push(`${name}: manifest.json に書かれていないので使われません`);
      }
    }
  }

  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest), "utf8");

  console.log(`単元 ${files.length}／問題 ${total}／スキル ${skillIds.size}`);
  warnings.forEach((w) => console.log(`注意: ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`エラー: ${e}`));
    console.error(`${errors.length}件のエラーがあります。公開フォルダは更新しましたが、直してください。`);
    process.exit(1);
  }
  console.log("検査: 問題なし");
}

main();
