// 1年2学期（算数）の単元ファイルの ひな形を 作る。問題は まだ入れない。
//
//   使いかた： node scripts/make-term2-units.mjs
//
// ★単元の中身は 学習指導要領（平成29年告示・第2章第3節 算数・第1学年）で 確かめた。
//   出典は 国立教育政策研究所の HTML。くわしくは docs/study-game/design.md。
//   2学期という くぎりは 指導要領では なく 教科書の ならびに 合わせている。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");
const manifestPath = join(root, "docs", "study-game", "questions", "manifest.json");

export const TERM2 = [
  {
    unitId: "u09",
    order: 9,
    title: "3つの かずの けいさん",
    youryou: "A(2)ア(ア)(イ)",
    monster: "mitsumoya",
    building: "mitsubashi",
    skills: [
      { id: "u09-add3", name: "3つ たす", power: "count" },
      { id: "u09-sub3", name: "3つ ひく", power: "count" },
      { id: "u09-mix3", name: "たして ひく", power: "read" },
    ],
  },
  {
    unitId: "u10",
    order: 10,
    title: "どちらが おおい",
    youryou: "C(1)ア(ア)(イ)",
    monster: "kasamoya",
    building: "mizunoie",
    skills: [
      { id: "u10-kasa", name: "かさを くらべる", power: "compare" },
      { id: "u10-cup", name: "コップ なんばいぶん", power: "compare" },
      { id: "u10-hiro", name: "ひろさを くらべる", power: "compare" },
    ],
  },
  {
    unitId: "u11",
    order: 11,
    title: "たしざん（くりあがり）",
    youryou: "A(2)ア(ウ)",
    monster: "kuriagarimoya",
    building: "tounotou",
    skills: [
      { id: "u11-make10", name: "10を つくって たす", power: "count" },
      { id: "u11-add-9", name: "9や 8に たす", power: "count" },
      { id: "u11-add-any", name: "くりあがりの たしざん", power: "count" },
    ],
  },
  {
    unitId: "u12",
    order: 12,
    title: "かたち",
    youryou: "B(1)ア(ア)(イ)",
    monster: "katachimoya",
    building: "katachihiroba",
    skills: [
      { id: "u12-nakama", name: "おなじ かたちの なかま", power: "shape" },
      { id: "u12-tokucho", name: "かたちの とくちょう", power: "shape" },
      { id: "u12-tsukuru", name: "かたちを つくる", power: "shape" },
    ],
  },
  {
    unitId: "u13",
    order: 13,
    title: "ひきざん（くりさがり）",
    youryou: "A(2)ア(ウ)",
    monster: "kurisagarimoya",
    building: "tounotobira",
    skills: [
      { id: "u13-break10", name: "10から ひく", power: "count" },
      { id: "u13-sub-9", name: "9や 8を ひく", power: "count" },
      { id: "u13-sub-any", name: "くりさがりの ひきざん", power: "count" },
    ],
  },
  {
    unitId: "u14",
    order: 14,
    title: "おおきい かず",
    youryou: "A(1)ア(オ)(キ)",
    monster: "ookazumoya",
    building: "tounokura",
    skills: [
      { id: "u14-tens", name: "10の まとまりで みる", power: "count" },
      { id: "u14-read", name: "2けたの かずを よむ", power: "count" },
      { id: "u14-order", name: "かずの ならびと 大小", power: "compare" },
    ],
  },
  {
    unitId: "u15",
    order: 15,
    title: "なんじ なんじはん",
    youryou: "C(2)ア(ア)",
    monster: "tokeimoya",
    building: "tokeidai",
    skills: [
      { id: "u15-hour", name: "なんじを よむ", power: "read" },
      { id: "u15-half", name: "なんじはんを よむ", power: "read" },
      { id: "u15-life", name: "1日の できごとと 時こく", power: "read" },
    ],
  },
  {
    unitId: "u16",
    order: 16,
    title: "ものの いち",
    youryou: "B(1)ア(ウ)",
    monster: "ichimoya",
    building: "michishirube",
    skills: [
      { id: "u16-maeushiro", name: "まえと うしろ", power: "shape" },
      { id: "u16-migihidari", name: "みぎと ひだり", power: "shape" },
      { id: "u16-ueshita", name: "うえと した", power: "shape" },
    ],
  },
];

function main() {
  let made = 0;
  for (const u of TERM2) {
    const file = join(unitDir, `g1-math-${u.unitId}.json`);
    if (existsSync(file)) {
      console.log(`・${u.unitId} は すでに ある（さわらない）`);
      continue;
    }
    const data = {
      schemaVersion: 1,
      unitId: u.unitId,
      grade: 1,
      subject: "math",
      term: 2,
      order: u.order,
      title: u.title,
      monster: u.monster,
      building: u.building,
      skills: u.skills,
      items: [],
    };
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
    made++;
    console.log(`○ ${u.unitId} ${u.title}（${u.youryou}）`);
  }

  // manifest に 2学期の かたまりを 足す
  const m = JSON.parse(readFileSync(manifestPath, "utf8"));
  let group = m.grades.find((g) => g.grade === 1 && g.subject === "math" && g.term === 2);
  if (!group) {
    group = { grade: 1, subject: "math", term: 2, units: [] };
    const i = m.grades.findIndex((g) => g.subject === "math" && g.term === 1);
    m.grades.splice(i + 1, 0, group);
  }
  for (const u of TERM2) {
    if (group.units.some((x) => x.unitId === u.unitId)) continue;
    group.units.push({
      unitId: u.unitId,
      title: u.title,
      order: u.order,
      file: `units/g1-math-${u.unitId}.json`,
      monster: u.monster,
      building: u.building,
      skills: u.skills,
    });
  }
  group.units.sort((a, b) => a.order - b.order);
  m.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`\n作った単元：${made}／manifest の2学期：${group.units.length}単元`);
}

main();
