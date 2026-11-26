// おぼえる仕組み（復習の間隔と、むずかしさの自動調整）。
// 日づけだけで管理する（時刻は使わない。端末の時計のずれで壊れないように）。
import { state, save, myGrade } from "./store.js";
import { dayKey, addDays, dayDiff, clamp } from "./util.js";
import { allSkills, unitMeta, skillMeta, units, allUnits, availableSubjects } from "./data.js";
import { subjectOfUnit } from "./subject.js";
import { isDebug } from "./debug.js";

/** stage ごとの「つぎに出す日」までの日数 */
const GAP = [1, 2, 4, 7, 14, 30];
/** 1回の復習でだす上限 */
export const REVIEW_CAP = 8;
/** 「ばっちりおぼえた」とみなす stage */
export const MASTER_STAGE = 2;

function def() {
  return {
    lv: 1,
    stage: 0,
    due: "",
    seen: 0,
    ok: 0,
    last5: 0,
    first: "",
    upDay: "",
    stageDay: "",
    downDay: "",
  };
}

export function rec(skillId) {
  let r = state.srs[skillId];
  if (!r || typeof r !== "object") {
    r = def();
    state.srs[skillId] = r;
  }
  if (typeof r.lv !== "number") r.lv = 1;
  if (typeof r.stage !== "number") r.stage = 0;
  return r;
}

export function isMastered(skillId) {
  const r = state.srs[skillId];
  return !!r && r.stage >= MASTER_STAGE;
}

/** 直近5問の正誤（下のビットが新しい） */
function pushLast5(r, correct) {
  r.last5 = ((r.last5 << 1) | (correct ? 1 : 0)) & 0b11111;
}

function bits(n) {
  let c = 0;
  for (let i = 0; i < 5; i++) if (n & (1 << i)) c++;
  return c;
}

/**
 * 1問答えたあとの更新。
 * - 正解：stage +1、つぎに出す日を先にのばす
 * - まちがい：stage −1（下は0）、つぎの日にもう一度
 * - レベルは「直近5問の8割以上 かつ 最後の3問が正解」で +1（2日続けて条件を満たしたときだけ）
 * - 「2問つづけてまちがい」で即 −1
 */
export function answer(skillId, correct) {
  const r = rec(skillId);
  const today = dayKey();
  const before = { lv: r.lv, stage: r.stage };
  r.seen++;
  if (correct) r.ok++;
  pushLast5(r, correct);

  // ★1日に1段までしか すすまない。
  // そうしないと、同じ日に3回あたっただけで「ばっちりおぼえた」になってしまい、
  // 日をあけて ためす という 仕組みが はたらかなくなる。
  if (correct) {
    if (r.stageDay !== today || isDebug()) {
      r.stage = clamp(r.stage + 1, 0, GAP.length - 1);
      r.stageDay = today;
    }
    r.due = addDays(today, GAP[r.stage]);
    if (!r.first) r.first = today;
  } else {
    // ★段を下げるのは「2問つづけて まちがえた」ときだけ、しかも1日1回まで。
    //   上げるのが1日1段なのに 下げるのが 何回でもだと、
    //   1回に同じスキルが 4〜16回 出る この作りでは、
    //   正答率95%未満の子の段が **一生 上がらない**（シミュレーションで確認）。
    if ((r.last5 & 0b11) === 0 && r.downDay !== today) {
      r.stage = clamp(r.stage - 1, 0, GAP.length - 1);
      r.downDay = today;
    }
    r.due = addDays(today, 1);
  }

  // レベルを上げる（あわてて上げない）
  const last3ok = (r.last5 & 0b111) === 0b111;
  const rate = r.seen >= 5 ? bits(r.last5) / 5 : 0;
  // レベルを上げるのは「きのうも きょうも 条件を みたした」ときだけ。
  // 何週間も前の1回を おぼえていて いきなり 上がる、ということが ないようにする。
  if (correct && last3ok && rate >= 0.8) {
    if (r.upDay && r.upDay !== today && dayDiff(today, r.upDay) <= 3) {
      r.lv = clamp(r.lv + 1, 1, 5);
      r.upDay = today;
    } else {
      r.upDay = today;
    }
  }
  // レベルを下げる（下げたことは画面に出さない）
  if (!correct && (r.last5 & 0b11) === 0) {
    r.lv = clamp(r.lv - 1, 1, 5);
  }

  // その単元を「どの日にやったか」を おぼえておく（単元の開放を 日数で しばるため）
  const unitId = skillMeta(skillId)?.unitId;
  if (unitId) {
    const days = state.progress.unitDays || (state.progress.unitDays = {});
    const list = days[unitId] || (days[unitId] = []);
    if (!list.includes(today)) {
      list.push(today);
      if (list.length > 3) list.shift();
    }
  }

  const newlyMastered = before.stage < MASTER_STAGE && r.stage >= MASTER_STAGE;
  save("srs", "progress");
  return { newlyMastered, levelUp: r.lv > before.lv, rec: r };
}

/** きょう復習に出すスキル（期限ぎれが古い順。上限8） */
export function dueSkills(limit = REVIEW_CAP) {
  const today = dayKey();
  const list = [];
  for (const s of allSkills()) {
    const r = state.srs[s.id];
    if (!r || !r.due) continue;
    const over = dayDiff(today, r.due);
    if (over >= 0) list.push({ skill: s, over, rec: r });
  }
  list.sort((a, b) => b.over - a.over);
  return list.slice(0, limit);
}

/** その単元の進み具合（0〜1）。stage を2で頭打ちにして数える */
export function unitProgress(unitId) {
  const meta = unitMeta(unitId);
  if (!meta || !meta.skills?.length) return 0;
  let sum = 0;
  for (const s of meta.skills) {
    const r = state.srs[s.id];
    sum += Math.min(r ? r.stage : 0, MASTER_STAGE);
  }
  return sum / (meta.skills.length * MASTER_STAGE);
}

/** その力で「ばっちりおぼえた」スキルの数 */
export function masteredByPower(power) {
  return allSkills().filter((s) => s.power === power && isMastered(s.id)).length;
}

/** その力に いくつ スキルが あるか（星の満点を 出すのに つかう） */
export function totalByPower(power) {
  return allSkills().filter((s) => s.power === power).length;
}

export function masteredCount() {
  return allSkills().filter((s) => isMastered(s.id)).length;
}

/** きょう取り組む単元（まだ終わっていない、いちばん前の単元） */
export function focusUnit(subject = "math") {
  // ★その子の 学年の 単元だけを 見る。前の学年に もどらせない（決定60）。
  const mine = new Set(units(subject, myGrade()).map((u) => u.unitId));
  const all = state.progress.unlockedUnits || ["u01"];
  const open = all.filter((id) => subjectOfUnit(id) === subject && mine.has(id));
  if (!open.length) {
    // その教科を まだ 1つも ひらいていない＝その学年の さいしょの単元
    const first = units(subject, myGrade())[0];
    return first ? first.unitId : "u01";
  }
  // まだ半分も すすんでいない単元を いちばん前から
  for (const id of open) {
    if (unitProgress(id) < 0.5) return id;
  }
  // つぎに、半分はすすんだが まだ終わっていない単元
  for (const id of open) {
    if (unitProgress(id) < 1) return id;
  }
  // ★ぜんぶ終わったあと、いつも最後の単元を出すと、同じ材料しか たまらない。
  //   日によって かわる ようにして、材料が かたよらないようにする。
  if (open.length) {
    const day = Number(dayKey().slice(-2)) || 1;
    return open[day % open.length];
  }
  return "u01";
}

/** 単元の自動開放：いまの単元が半分すすんだら、つぎの単元をひらく */
/**
 * 単元の自動開放。教科ごとに、前から じゅんに ひらいていく。
 * ★「半分すすんだ」だけだと 1日で ぜんぶ 開いてしまうので、
 *   その単元を **ちがう日に2回以上** やっていることも 条件にする。
 */
export function refreshUnlocks() {
  const open = new Set(state.progress.unlockedUnits || ["u01"]);
  let changed = false;
  if (isDebug()) {
    // かくにんモード：ぜんぶの単元を ひらく
    for (const u of allUnits()) {
      if (!open.has(u.unitId)) {
        open.add(u.unitId);
        changed = true;
      }
    }
  }
  for (const subject of availableSubjects(myGrade())) {
    const list = units(subject, myGrade());
    if (!list.length) continue;
    // その教科の さいしょの単元は いつでも ひらいている
    if (!open.has(list[0].unitId)) {
      open.add(list[0].unitId);
      changed = true;
    }
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      if (!open.has(u.unitId)) continue;
      const days = (state.progress.unitDays || {})[u.unitId] || [];
      if (unitProgress(u.unitId) >= 0.5 && days.length >= 2 && list[i + 1] && !open.has(list[i + 1].unitId)) {
        open.add(list[i + 1].unitId);
        changed = true;
      }
    }
    // せんせいモードのコードで ひらいた分（累積開放）
    const upto = state.progress.teacherUnlock | 0;
    if (subject === "math") {
      for (let i = 0; i < Math.min(upto, list.length); i++) {
        if (!open.has(list[i].unitId)) {
          open.add(list[i].unitId);
          changed = true;
        }
      }
    }
  }
  if (changed) {
    const order = allUnits().map((u) => u.unitId);
    state.progress.unlockedUnits = order.filter((id) => open.has(id));
    save("progress");
  }
  return state.progress.unlockedUnits;
}

