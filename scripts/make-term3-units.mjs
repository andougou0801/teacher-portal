// 1年3学期（算数）の単元ファイルの ひな形を 作る。問題は まだ入れない。
//
//   使いかた： node scripts/make-term3-units.mjs
//
// ★中身は 学習指導要領（平成29年告示・第2章第3節 算数・第1学年）で 確かめた。
//   3学期に あてたのは、1・2学期で まだ ふれていない 次の3つ。
//     A(1)ア(カ) 簡単な場合について，３位数の表し方を知ること
//     A(2)ア(エ) 簡単な場合について，２位数などについても加法及び減法ができることを知ること
//     B(1)ア(イ) 具体物を用いて形を作ったり分解したりすること
//   ★3学期は 1月から3月までで みじかいので、**8単元ではなく6単元**にした。
//     学期の くぎりは 指導要領には なく、教科書の ならびに 合わせている。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");
const manifestPath = join(root, "docs", "study-game", "questions", "manifest.json");

export const TERM3 = [
  {
    unitId: "u17",
    order: 17,
    title: "120までの かず",
    youryou: "A(1)ア(カ)(キ)",
    monster: "hyakumoya",
    building: "hyakunotou",
    skills: [
      { id: "u17-over100", name: "100より おおきい かず", power: "count" },
      { id: "u17-line", name: "かずの せんで みる", power: "count" },
      { id: "u17-compare", name: "どちらが おおきい", power: "compare" },
    ],
  },
  {
    unitId: "u18",
    order: 18,
    title: "100までの たしざん ひきざん",
    youryou: "A(2)ア(エ)",
    monster: "ketamoya",
    building: "ketanokoya",
    skills: [
      { id: "u18-tens", name: "10の まとまりで たす ひく", power: "count" },
      { id: "u18-ones", name: "ばらを たす ひく", power: "count" },
      { id: "u18-mix", name: "2けたの けいさん", power: "count" },
    ],
  },
  {
    unitId: "u19",
    order: 19,
    title: "ずを つかって かんがえよう",
    youryou: "A(2)ア(イ)・イ(ア)",
    monster: "zumoya",
    building: "zunohiroba",
    skills: [
      { id: "u19-fueru", name: "ふえた ばめん", power: "read" },
      { id: "u19-heru", name: "へった ばめん", power: "read" },
      { id: "u19-shiki", name: "ずから しきを つくる", power: "read" },
    ],
  },
  {
    unitId: "u20",
    order: 20,
    title: "ものと ひとの かず",
    youryou: "A(1)ア(ア)・B(1)ア(ウ)",
    monster: "retsumoya",
    building: "narabinohiroba",
    skills: [
      { id: "u20-maeushiro", name: "まえと うしろを あわせる", power: "read" },
      { id: "u20-aida", name: "あいだの かず", power: "read" },
      { id: "u20-tairitsu", name: "ものと ひとを くらべる", power: "compare" },
    ],
  },
  {
    unitId: "u21",
    order: 21,
    title: "かたちづくり",
    youryou: "B(1)ア(イ)",
    monster: "itamoya",
    building: "itanokoubou",
    skills: [
      { id: "u21-count", name: "いろいたは なんまい", power: "shape" },
      { id: "u21-make", name: "かたちを つくる", power: "shape" },
      { id: "u21-split", name: "かたちを わける", power: "shape" },
    ],
  },
  {
    unitId: "u22",
    order: 22,
    title: "1ねんの まとめ",
    youryou: "第1学年ぜんたい",
    monster: "matomemoya",
    building: "omoidenomon",
    skills: [
      { id: "u22-kazu", name: "かずの まとめ", power: "count" },
      { id: "u22-keisan", name: "けいさんの まとめ", power: "count" },
      { id: "u22-katachi", name: "かたちと りょうの まとめ", power: "shape" },
    ],
  },
];

function main() {
  let made = 0;
  for (const u of TERM3) {
    const file = join(unitDir, `g1-math-${u.unitId}.json`);
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
          grade: 1,
          subject: "math",
          term: 3,
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
  let group = m.grades.find((g) => g.grade === 1 && g.subject === "math" && g.term === 3);
  if (!group) {
    group = { grade: 1, subject: "math", term: 3, units: [] };
    const i = m.grades.findIndex((g) => g.subject === "math" && g.term === 2);
    m.grades.splice(i + 1, 0, group);
  }
  for (const u of TERM3) {
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
  console.log(`\n作った単元：${made}／manifest の3学期：${group.units.length}単元`);
}

main();
