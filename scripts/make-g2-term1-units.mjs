// 2年1学期（算数）の単元ファイルの ひな形を 作る。問題は まだ入れない。
//
//   使いかた： node scripts/make-g2-term1-units.mjs
//
// ★中身は 学習指導要領（平成29年告示・第2章第3節 算数・第2学年）で 確かめた。
//   2年から 変わるところ：
//     〔用語・記号〕に **× ＞ ＜** が 入る（1年では つかえなかった）
//     内容の取扱い(2) 「（ ）や□などを用いることができる」
//     A(1)ア(イ) ４位数まで／内容の取扱い(1) 1万についても
//   ★単元の id は **v01〜**（1年の算数は u、1年の国語は j）。
//     教科は manifest の subject で 見るので、あたまの文字では 決めていない。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");
const manifestPath = join(root, "docs", "study-game", "questions", "manifest.json");

export const G2_TERM1 = [
  {
    unitId: "v01",
    order: 1,
    title: "ひょうと グラフ",
    youryou: "D(1)ア(ア)",
    monster: "hyoumoya",
    building: "shirabenoyakata",
    skills: [
      { id: "v01-yomu", name: "ひょうを よむ", power: "read" },
      { id: "v01-graph", name: "グラフを よむ", power: "read" },
      { id: "v01-kurabe", name: "おおい すくないを くらべる", power: "compare" },
    ],
  },
  {
    unitId: "v02",
    order: 2,
    title: "たしざんの ひっ算",
    youryou: "A(2)ア(ア)",
    monster: "hissanmoya",
    building: "hissankoubou",
    skills: [
      { id: "v02-nocarry", name: "くりあがりの ない ひっ算", power: "count" },
      { id: "v02-carry", name: "くりあがりの ある ひっ算", power: "count" },
      { id: "v02-bun", name: "たしざんの ばめん", power: "read" },
    ],
  },
  {
    unitId: "v03",
    order: 3,
    title: "ひきざんの ひっ算",
    youryou: "A(2)ア(ア)",
    monster: "kurisagemoya",
    building: "hikizanyagura",
    skills: [
      { id: "v03-nocarry", name: "くりさがりの ない ひっ算", power: "count" },
      { id: "v03-carry", name: "くりさがりの ある ひっ算", power: "count" },
      { id: "v03-bun", name: "ひきざんの ばめん", power: "read" },
    ],
  },
  {
    unitId: "v04",
    order: 4,
    title: "ながさ（cm と mm）",
    youryou: "C(1)ア(ア)(イ)",
    monster: "monosashimoya",
    building: "monosashinotou",
    skills: [
      { id: "v04-yomu", name: "ものさしを よむ", power: "compare" },
      { id: "v04-tani", name: "cm と mm", power: "compare" },
      { id: "v04-keisan", name: "ながさの けいさん", power: "count" },
    ],
  },
  {
    unitId: "v05",
    order: 5,
    title: "1000までの かず",
    youryou: "A(1)ア(イ)(ウ)",
    monster: "senmoya",
    building: "sennokura",
    skills: [
      { id: "v05-kurai", name: "くらいを 見る", power: "count" },
      { id: "v05-yomu", name: "3けたの かずを よむ", power: "count" },
      { id: "v05-daisho", name: "かずの 大小", power: "compare" },
    ],
  },
  {
    unitId: "v06",
    order: 6,
    title: "かさ（L と dL と mL）",
    youryou: "C(1)ア(ア)(イ)",
    monster: "masumoya",
    building: "masunoie",
    skills: [
      { id: "v06-yomu", name: "ますを よむ", power: "compare" },
      { id: "v06-tani", name: "L と dL と mL", power: "compare" },
      { id: "v06-keisan", name: "かさの けいさん", power: "count" },
    ],
  },
  {
    unitId: "v07",
    order: 7,
    title: "たしざんと ひきざんの かんけい",
    youryou: "A(2)ア(エ)",
    monster: "sakamoya",
    building: "ikikaerinohashi",
    skills: [
      { id: "v07-tashikame", name: "こたえの たしかめ", power: "count" },
      { id: "v07-kakure", name: "かくれた かずを 見つける", power: "count" },
      { id: "v07-zu", name: "ずに あう しき", power: "read" },
    ],
  },
  {
    unitId: "v08",
    order: 8,
    title: "けいさんの くふう",
    youryou: "A(2)ア(ウ)・内容の取扱い(3)",
    monster: "kufumoya",
    building: "kufunokoubou",
    skills: [
      { id: "v08-irekae", name: "じゅんばんを かえても おなじ", power: "count" },
      { id: "v08-matome", name: "まとめて たす", power: "count" },
      { id: "v08-hayaku", name: "はやく とける くふう", power: "count" },
    ],
  },
];

function main() {
  let made = 0;
  for (const u of G2_TERM1) {
    const file = join(unitDir, `g2-math-${u.unitId}.json`);
    if (existsSync(file)) {
      console.log(`・${u.unitId} は すでに ある（さわらない）`);
      continue;
    }
    writeFileSync(
      file,
      JSON.stringify(
        {
          schemaVersion: 1,
          unitId: u.unitId,
          grade: 2,
          subject: "math",
          term: 1,
          order: u.order,
          title: u.title,
          monster: u.monster,
          building: u.building,
          skills: u.skills,
          items: [],
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
    made++;
    console.log(`○ ${u.unitId} ${u.title}（${u.youryou}）`);
  }

  const m = JSON.parse(readFileSync(manifestPath, "utf8"));
  let group = m.grades.find((g) => g.grade === 2 && g.subject === "math" && g.term === 1);
  if (!group) {
    group = { grade: 2, subject: "math", term: 1, units: [] };
    m.grades.push(group);
  }
  for (const u of G2_TERM1) {
    if (group.units.some((x) => x.unitId === u.unitId)) continue;
    group.units.push({
      unitId: u.unitId,
      title: u.title,
      order: u.order,
      file: `units/g2-math-${u.unitId}.json`,
      monster: u.monster,
      building: u.building,
      skills: u.skills,
    });
  }
  group.units.sort((a, b) => a.order - b.order);
  m.grades.sort((a, b) => a.grade - b.grade || (a.subject === "math" ? 0 : 1) - (b.subject === "math" ? 0 : 1) || a.term - b.term);
  m.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`\n作った単元：${made}／manifest の2年算数1学期：${group.units.length}単元`);
}

main();
