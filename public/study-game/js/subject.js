// きょうは どの教科か（さんすう／こくご）
//
// ★決まり（安全担当の線引き）
//   ・1日15分は **2教科の合計**。教科ごとに15分には しない
//   ・同じ日に 両方を もとめない。「きょうは さんすうの日／こくごの日」と じどうで きまる
//   ・先生は せんせいモードで 片方に 固定できる（授業で つかうため）
//   ・レベル・ぶき・こうげきりょくは **1人に1つ**（教科で 分けない）
import { state } from "./store.js";
import { dayKey } from "./util.js";

export const SUBJECTS = {
  math: { id: "math", name: "さんすう", town: "かずのまち", en: "KAZU TOWN" },
  japanese: { id: "japanese", name: "こくご", town: "ことばのまち", en: "KOTOBA TOWN" },
};

/** 先生の設定（"auto" / "math" / "japanese"） */
export function subjectMode() {
  const m = state.settings?.subjectMode;
  return m === "math" || m === "japanese" ? m : "auto";
}

export function setSubjectMode(mode) {
  state.settings.subjectMode = mode;
}

/**
 * きょうの教科。
 * じどうのときは 日づけで 交互に きめる（子どもに 選ばせない）。
 * ※ こくごの単元が まだ 無いときは さんすうに なる（呼び出し側で 見る）。
 */
export function todaySubject(available = ["math", "japanese"]) {
  const mode = subjectMode();
  if (mode !== "auto") return available.includes(mode) ? mode : available[0];
  if (available.length <= 1) return available[0] || "math";
  // 日づけの 合計で 交互にする（きのう さんすうなら きょうは こくご）
  const key = dayKey();
  const n = Number(key.slice(0, 4)) + Number(key.slice(5, 7)) + Number(key.slice(8, 10));
  return available[n % available.length];
}

export const subjectName = (id) => SUBJECTS[id]?.name || "さんすう";
export const townName = (id) => SUBJECTS[id]?.town || "かずのまち";

/** 単元の id から 教科を 決める（u…＝さんすう／j…＝こくご） */
export function subjectOfUnit(unitId) {
  return String(unitId).startsWith("j") ? "japanese" : "math";
}
