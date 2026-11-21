// RPGの手ごたえ（第1段：敵のHP・武器・レベル）
//
// ★いちばん大事な決まり
//   もやもやのHP = こうげきりょく × (1体の問題数 + 3)
//   こうげきりょくが 式の両がわに 入っているので、
//   武器を どれだけ 強くしても HPが 同じだけ 上がり、
//   **1体を たおすのに かかる 問題数は かわらない**。
//   （強くなるほど 勉強の量が へる、という さかさまを ふせぐため）
//
// 第2段で入れる予定：けいけんち・MP・必殺技
// 第3段で入れる予定：つえのきたえ・なかまのどうぐ
import { state, save } from "./store.js";
import { masteredCount, unitProgress } from "./srs.js";
import { units } from "./data.js";

/** 1体あたりの問題数（学年で決まる。強さでは かわらない） */
export const QUESTIONS_BY_GRADE = { 1: 8, 2: 8, 3: 10, 4: 10, 5: 12, 6: 12 };

/** HPの倍率（問題数 + 3） */
export const HP_MARGIN = 3;

/**
 * 武器は「答え方」。単元をぜんぶ ばっちりに すると 1本 もらえる。
 * 運では 出さない。地図で「この単元を おぼえたら これ」と 先に 見せる。
 */
export const WEAPONS = [
  { id: "kinobo", name: "きのぼう", unit: null, atk: 0, note: "はじめから もっている" },
  { id: "kazunotsue", name: "かずのつえ", unit: "u01", atk: 2, note: "10までの かず" },
  { id: "narabiken", name: "ならびのけん", unit: "u02", atk: 4, note: "なんばんめ" },
  { id: "wakehammer", name: "わけっこハンマー", unit: "u03", atk: 6, note: "いくつと いくつ" },
  { id: "tasublade", name: "たしざんブレード", unit: "u04", atk: 8, note: "たしざん" },
  { id: "hikiyari", name: "ひきざんのやり", unit: "u05", atk: 10, note: "ひきざん" },
  { id: "zerohoshi", name: "ゼロのほし", unit: "u06", atk: 12, note: "0の けいさん" },
  { id: "monosashi", name: "ものさしぼう", unit: "u07", atk: 14, note: "ながさくらべ" },
  { id: "shirabetsue", name: "しらべのつえ", unit: "u08", atk: 16, note: "かずしらべ" },
];

export const weaponById = (id) => WEAPONS.find((w) => w.id === id) || WEAPONS[0];
export const weaponForUnit = (unitId) => WEAPONS.find((w) => w.unit === unitId) || null;

/**
 * レベル＝「ばっちり おぼえた」スキルの数 ＋ 1。
 * 第1段では けいけんちを 作らない（画面に 出す数字を ふやしすぎないため）。
 * 1学期の おわりで だいたい Lv20〜24 になる。
 */
export function level() {
  return 1 + masteredCount();
}

/** いま もっている 武器のうち、つけているもの */
export function equipped() {
  const id = state.progress?.weapon;
  const have = state.progress?.weapons || [];
  if (id && (id === "kinobo" || have.includes(id))) return weaponById(id);
  return WEAPONS[0];
}

/** こうげきりょく＝1問で けずれる HPの量 */
export function atk() {
  return 10 + 2 * (level() - 1) + equipped().atk;
}

/** その学年の「1体の問題数」 */
export function questionsPerMonster(grade = 1) {
  return QUESTIONS_BY_GRADE[grade] || 8;
}

/** もやもやのHP（問題数が かわらないことの 保証） */
export function monsterHp(questions) {
  return atk() * (questions + HP_MARGIN);
}

/**
 * 単元を ぜんぶ ばっちりに した子に、武器を わたす。
 * わたしたものを 返す（なければ null）。
 */
export function grantWeaponIfCleared(unitId) {
  const w = weaponForUnit(unitId);
  if (!w) return null;
  const p = state.progress;
  p.weapons = p.weapons || [];
  if (p.weapons.includes(w.id)) return null;
  if (unitProgress(unitId) < 1) return null;
  p.weapons.push(w.id);
  // 強いほうを じどうで つける（子どもが まよわないように）
  if (w.atk >= equipped().atk) p.weapon = w.id;
  save("progress");
  return w;
}

/** まだ もっていない武器のうち、つぎに もらえるもの（地図の予告に つかう） */
export function nextWeapon() {
  const have = new Set(state.progress?.weapons || []);
  for (const u of units()) {
    const w = weaponForUnit(u.unitId);
    if (w && !have.has(w.id)) return { weapon: w, unitId: u.unitId, progress: unitProgress(u.unitId) };
  }
  return null;
}
