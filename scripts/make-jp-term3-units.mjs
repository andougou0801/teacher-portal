// 1年3学期（国語）の単元ファイルの ひな形を 作る。問題は まだ入れない。
//
//   使いかた： node scripts/make-jp-term3-units.mjs
//
// ★中身は 学習指導要領（平成29年告示・第2章第1節 国語・第1学年及び第2学年）で 確かめた。
//   1・2学期で ふれていない 項目は つぎのとおりで、3学期は ここを やる。
//     〔知技〕(1)エ … 第1学年の漢字80字のうち、j12・j13 で 出していない **31字**
//     〔知技〕(1)カ … 「文の中における**主語と述語**との関係に気付くこと」
//     〔知技〕(3)イ … 「長く親しまれている**言葉遊び**を通して，言葉の豊かさに気付くこと」
//     〔知技〕(3)ア … 「**昔話や神話・伝承**などの読み聞かせを聞くなどして…親しむこと」
//     〔知技〕(2)ア … 「**共通，相違，事柄の順序**など情報と情報との関係について理解すること」
//   ★3学期は 1月から3月で みじかいので、算数と 同じく **6単元**にした。
//   ★漢字は 決定33のとおり「文の中で 読めるか」だけ。書き取りは しない。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");
const manifestPath = join(root, "docs", "study-game", "questions", "manifest.json");

const KANA =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉっゃゅょ";
const KATA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォッャュョ";
const MARKS = "ー0123456789「」、。？ ";

/** 1年の漢字80字のうち、j12・j13 で まだ 出していない 31字 */
const REST_KANJI = "右円王音貝学休校左子糸字車出女正生青夕赤先早村男竹町入白文本名";

export const JP_TERM3 = [
  {
    unitId: "j17",
    order: 17,
    title: "かんじを よむ（がっこうと まち）",
    youryou: "〔知技〕(1)エ",
    monster: "machimoya",
    building: "kanjinohiroba",
    kanji: REST_KANJI,
    skills: [
      { id: "j17-gakkou", name: "がっこうの かんじ", power: "read" },
      { id: "j17-machi", name: "まちの かんじ", power: "read" },
      { id: "j17-bun", name: "ぶんの 中で よむ", power: "read" },
    ],
  },
  {
    unitId: "j18",
    order: 18,
    title: "ことばあそび",
    youryou: "〔知技〕(3)イ",
    monster: "asobimoya",
    building: "asobinohiroba",
    kanji: "",
    skills: [
      { id: "j18-shiritori", name: "しりとり", power: "word" },
      { id: "j18-kakure", name: "ことばの 中の ことば", power: "word" },
      { id: "j18-sakasa", name: "さかさから よんでも", power: "word" },
    ],
  },
  {
    unitId: "j19",
    order: 19,
    title: "しゅごと じゅつご",
    youryou: "〔知技〕(1)カ",
    monster: "tsunagimoya",
    building: "tsunaginohashi",
    kanji: "",
    skills: [
      { id: "j19-shugo", name: "「なにが」を さがす", power: "read" },
      { id: "j19-jutsugo", name: "「どうする」を さがす", power: "read" },
      { id: "j19-awase", name: "ちゃんと つながる ぶん", power: "read" },
    ],
  },
  {
    unitId: "j20",
    order: 20,
    title: "くらべて よむ",
    youryou: "〔知技〕(2)ア",
    monster: "kurabemoya",
    building: "kurabenoyagura",
    kanji: "",
    skills: [
      { id: "j20-onaji", name: "おなじ ところ", power: "read" },
      { id: "j20-chigau", name: "ちがう ところ", power: "read" },
      { id: "j20-junjo", name: "ことがらの じゅんじょ", power: "read" },
    ],
  },
  {
    unitId: "j21",
    order: 21,
    title: "むかしばなしを よむ",
    youryou: "〔知技〕(3)ア",
    monster: "mukashimoya",
    building: "mukashinoyado",
    kanji: "",
    skills: [
      { id: "j21-tojou", name: "でてくる ひと", power: "read" },
      { id: "j21-dekigoto", name: "おきた できごと", power: "read" },
      { id: "j21-owari", name: "おはなしの おわり", power: "read" },
    ],
  },
  {
    unitId: "j22",
    order: 22,
    title: "1ねんの まとめ",
    youryou: "第1学年ぜんたい",
    monster: "sotsumoya",
    building: "tabidachinomon",
    kanji: "一二三四五六七八九十百千日月火水木金土年上下大中小人口目耳手足見山川田花草林森空雨石玉犬虫天気立力",
    skills: [
      { id: "j22-moji", name: "もじの まとめ", power: "word" },
      { id: "j22-kotoba", name: "ことばの まとめ", power: "word" },
      { id: "j22-yomu", name: "よみとりの まとめ", power: "read" },
    ],
  },
];

function main() {
  let made = 0;
  for (const u of JP_TERM3) {
    const file = join(unitDir, `g1-japanese-${u.unitId}.json`);
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
          subject: "japanese",
          term: 3,
          order: u.order,
          title: u.title,
          allowedChars: KANA + KATA + MARKS,
          allowedKanji: u.kanji,
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
    console.log(`○ ${u.unitId} ${u.title}（${u.youryou}）${u.kanji ? ` 漢字${[...u.kanji].length}字` : ""}`);
  }

  const m = JSON.parse(readFileSync(manifestPath, "utf8"));
  let group = m.grades.find((g) => g.grade === 1 && g.subject === "japanese" && g.term === 3);
  if (!group) {
    group = { grade: 1, subject: "japanese", term: 3, units: [] };
    const i = m.grades.findIndex((g) => g.subject === "japanese" && g.term === 2);
    m.grades.splice(i + 1, 0, group);
  }
  for (const u of JP_TERM3) {
    if (group.units.some((x) => x.unitId === u.unitId)) continue;
    group.units.push({
      unitId: u.unitId,
      title: u.title,
      order: u.order,
      file: `units/g1-japanese-${u.unitId}.json`,
      monster: u.monster,
      building: u.building,
      skills: u.skills,
    });
  }
  group.units.sort((a, b) => a.order - b.order);
  m.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`\n作った単元：${made}／manifest の国語3学期：${group.units.length}単元`);
}

main();
