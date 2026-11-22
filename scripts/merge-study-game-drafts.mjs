// 下書きの問題を、単元ファイルに とりこむ。
//
//   使いかた： node scripts/merge-study-game-drafts.mjs
//
//   docs/study-game/questions/drafts/*.json を すべて読み、
//   { "j06": [ …items… ] } の中身を docs/study-game/questions/units/ の
//   その単元ファイルの items の うしろに 足す。
//
//   ★同じ id が すでに ある問題は 足さない（二重にならない）。
//     だから 何回 走らせても 同じ結果になる。
//   ★とりこむ前に、必ず node scripts/check-study-game-questions.mjs を
//     下書きに かけて エラー0 にしておくこと。
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const draftDir = join(root, "docs", "study-game", "questions", "drafts");
const unitDir = join(root, "docs", "study-game", "questions", "units");

if (!existsSync(draftDir)) {
  console.log("下書きのフォルダが ありません:", draftDir);
  process.exit(0);
}

const unitFiles = readdirSync(unitDir).filter((n) => n.endsWith(".json"));
let added = 0;
let skipped = 0;

for (const name of readdirSync(draftDir).filter((n) => n.endsWith(".json"))) {
  const draft = JSON.parse(readFileSync(join(draftDir, name), "utf8"));
  const groups = Array.isArray(draft.items) ? { [draft.unitId]: draft.items } : draft;

  for (const [unitId, items] of Object.entries(groups)) {
    if (!Array.isArray(items)) continue;
    const file = unitFiles.find((n) => n.endsWith(`-${unitId}.json`));
    if (!file) {
      console.log(`× ${name}: 単元 ${unitId} のファイルが ありません`);
      process.exitCode = 1;
      continue;
    }
    const path = join(unitDir, file);
    const unit = JSON.parse(readFileSync(path, "utf8"));
    const have = new Set((unit.items || []).map((x) => x.id));
    const skillIds = new Set((unit.skills || []).map((s) => s.id));

    const fresh = [];
    for (const it of items) {
      if (have.has(it.id)) {
        skipped++;
        continue;
      }
      if (!skillIds.has(it.skill)) {
        console.log(`× ${unitId} ${it.id}: しらないスキル「${it.skill}」`);
        process.exitCode = 1;
        continue;
      }
      fresh.push(it);
      have.add(it.id);
    }
    if (!fresh.length) {
      console.log(`・${unitId}: 足すものは ありません（${skipped}問は すでに ある）`);
      continue;
    }
    unit.items = [...(unit.items || []), ...fresh];
    writeFileSync(path, JSON.stringify(unit, null, 2) + "\n", "utf8");
    added += fresh.length;
    console.log(`○ ${unitId}: ${fresh.length}問 足した（ぜんぶで ${unit.items.length}問）`);
  }
}

console.log(`\n足した問題：${added}問` + (skipped ? `（すでに あった ${skipped}問は とばした）` : ""));
if (added) {
  console.log("つぎに：");
  console.log("  node scripts/check-study-game-questions.mjs");
  console.log("  node scripts/sync-study-game-questions.mjs");
}
