// 1年2学期（国語）の単元ファイルの ひな形を 作る。問題は まだ入れない。
//
//   使いかた： node scripts/make-jp-term2-units.mjs
//
// ★中身は 学習指導要領（平成29年告示・第2章第1節 国語・第1学年及び第2学年）で 確かめた。
//   1学期（j01〜j08）で ふれていない 項目は つぎのとおりで、2学期は ここを やる。
//     〔知技〕(1)ウ …「平仮名及び**片仮名**を読み，書くとともに，
//                     **片仮名で書く語の種類**を知り，文や文章の中で使うこと」
//     〔知技〕(1)エ …「第1学年に配当されている**漢字**を読み，漸次書き，
//                     文や文章の中で使うこと」
//     〔知技〕(1)キ …「**丁寧な言葉と普通の言葉**との違いに気を付けて使う」
//     Ｃ読むこと(1)ウ…「文章の中の**重要な語や文**を考えて選び出すこと」
//     Ｃ読むこと(1)イエ…「**場面の様子や登場人物の行動**，内容の大体を捉える」
//   ★学期の くぎりは 指導要領には なく、教科書の ならびに 合わせている。
//   ★漢字は 決定33のとおり「**文の中で読めるか**」だけ。書き取りは しない。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = join(root, "docs", "study-game", "questions", "units");
const manifestPath = join(root, "docs", "study-game", "questions", "manifest.json");

/** 1学期で つかっていた ひらがな（小さい字・ー・、。も ふくむ） */
const KANA =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
  "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ" +
  "ぁぃぅぇぉっゃゅょ";
/** 2学期から つかう かたかな */
const KATA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ" +
  "ァィゥェォッャュョ";
const MARKS = "ー0123456789「」、。？ ";

export const JP_TERM2 = [
  {
    unitId: "j09",
    order: 9,
    title: "かたかなを よむ",
    youryou: "〔知技〕(1)ウ",
    monster: "katamoya",
    building: "katanoie",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j09-mikake", name: "にた かたかなを みわける", power: "word" },
      { id: "j09-yomu", name: "かたかなの ことばを よむ", power: "read" },
      { id: "j09-hiragana", name: "ひらがなと くらべる", power: "word" },
    ],
  },
  {
    unitId: "j10",
    order: 10,
    title: "かたかなを ゆびで かく",
    youryou: "〔知技〕(1)ウ・(3)ウ(イ)",
    monster: "hitsumoya",
    building: "fudenoyakata",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j10-nazori", name: "ゆびで なぞって かく", power: "write" },
      { id: "j10-nazori2", name: "むずかしい かたかなを なぞる", power: "write" },
      { id: "j10-junban", name: "かく じゅんばん", power: "write" },
    ],
  },
  {
    unitId: "j11",
    order: 11,
    title: "かたかなで かく ことば",
    youryou: "〔知技〕(1)ウ（片仮名で書く語の種類）",
    monster: "gaimoya",
    building: "minatonokura",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j11-erabu", name: "かたかなで かく ものを えらぶ", power: "word" },
      { id: "j11-oto", name: "おとの ことば", power: "word" },
      { id: "j11-bun", name: "ぶんの 中の かたかな", power: "read" },
    ],
  },
  {
    unitId: "j12",
    order: 12,
    title: "かんじを よむ（かずと ひ）",
    youryou: "〔知技〕(1)エ",
    monster: "kanjimoya",
    building: "kanjinomon",
    chars: KANA + KATA + MARKS,
    kanji: "一二三四五六七八九十百千日月火水木金土年上下大中小",
    skills: [
      { id: "j12-kazu", name: "かずの かんじ", power: "read" },
      { id: "j12-hi", name: "ようびの かんじ", power: "read" },
      { id: "j12-bun", name: "ぶんの 中で よむ", power: "read" },
    ],
  },
  {
    unitId: "j13",
    order: 13,
    title: "かんじを よむ（ひとと しぜん）",
    youryou: "〔知技〕(1)エ",
    monster: "shizenmoya",
    building: "morinoyakata",
    chars: KANA + KATA + MARKS,
    kanji: "人口目耳手足見山川田花草木林森空雨石玉犬虫天気立力",
    skills: [
      { id: "j13-hito", name: "からだの かんじ", power: "read" },
      { id: "j13-shizen", name: "しぜんの かんじ", power: "read" },
      { id: "j13-bun", name: "ぶんの 中で よむ", power: "read" },
    ],
  },
  {
    unitId: "j14",
    order: 14,
    title: "ていねいな ことば",
    youryou: "〔知技〕(1)キ",
    monster: "teineimoya",
    building: "aisatsunomichi",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j14-desu", name: "です・ます", power: "word" },
      { id: "j14-tsukaiwake", name: "だれに はなすか", power: "read" },
      { id: "j14-aisatsu", name: "あいさつの ことば", power: "word" },
    ],
  },
  {
    unitId: "j15",
    order: 15,
    title: "だいじな ことばを さがす",
    youryou: "Ｃ読むこと(1)ウ",
    monster: "sagashimoya",
    building: "shiorinoie",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j15-toi", name: "といの ぶんを さがす", power: "read" },
      { id: "j15-kotae", name: "こたえの ぶんを さがす", power: "read" },
      { id: "j15-daiji", name: "だいじな ことばを えらぶ", power: "read" },
    ],
  },
  {
    unitId: "j16",
    order: 16,
    title: "ばめんと とうじょうじんぶつ",
    youryou: "Ｃ読むこと(1)イ・エ",
    monster: "ohanashimoya",
    building: "monogatarinoniwa",
    chars: KANA + KATA + MARKS,
    kanji: "",
    skills: [
      { id: "j16-dare", name: "だれが でてくる", power: "read" },
      { id: "j16-doko", name: "どこの はなし", power: "read" },
      { id: "j16-kimochi", name: "どんな きもち", power: "read" },
    ],
  },
];

function main() {
  let made = 0;
  for (const u of JP_TERM2) {
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
          term: 2,
          order: u.order,
          title: u.title,
          allowedChars: u.chars,
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
  let group = m.grades.find((g) => g.grade === 1 && g.subject === "japanese" && g.term === 2);
  if (!group) {
    group = { grade: 1, subject: "japanese", term: 2, units: [] };
    const i = m.grades.findIndex((g) => g.subject === "japanese" && g.term === 1);
    m.grades.splice(i + 1, 0, group);
  }
  for (const u of JP_TERM2) {
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
  console.log(`\n作った単元：${made}／manifest の国語2学期：${group.units.length}単元`);
}

main();
