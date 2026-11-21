// たたかう画面。もんだいを1問ずつ出す。
// ★「まける」は作らない。まちがえたら もやもやが へんしんして、おなじ型を もういちど出す。
import { $, el, clear, sleep, toast } from "../util.js";
import { moya } from "../icons.js";
import { MATERIALS } from "../content.js";
import { state, save } from "../store.js";
import { loadUnit, unitMeta, pickItems, skillMeta, units } from "../data.js";
import { rec, answer as srsAnswer, dueSkills, refreshUnlocks, unitProgress } from "../srs.js";
import * as session from "../session.js";
import { ask, showHintNow, cancel as cancelQuiz } from "../quiz.js";
import { sfx, resetStreak } from "../audio.js";
import { go } from "../app.js";
import { REWARD_BY_UNIT } from "./map.js";

const QUESTIONS_PER_STAGE = 8;
let running = false;
let stop = false;
let queue = [];
let stageInfo = null;
let answered = 0;
let correctCount = 0;
let gained = {};
let wrongTries = {};

export function enterBreak() {
  /* 中身は runBreak が書く */
}

export async function enter(params = {}) {
  if (params.resume) return;
  if (running) return;
  running = true;
  stop = false;
  answered = 0;
  correctCount = 0;
  gained = {};
  wrongTries = {};
  resetStreak();

  try {
    stageInfo = await buildQueue(params);
  } catch (err) {
    console.error(err);
    toast("もんだいが よみこめませんでした");
    running = false;
    go("town");
    return;
  }
  if (!queue.length) {
    toast("いまは もんだいが ありません");
    running = false;
    go("town");
    return;
  }
  paintMonster(stageInfo.monster, "normal");
  paintDots();
  await runLoop();
  running = false;
}

async function buildQueue(params) {
  queue = [];
  if (params.mode === "review") {
    const due = dueSkills();
    const byUnit = new Map();
    for (const d of due) {
      const unitId = d.skill.unitId;
      if (!byUnit.has(unitId)) byUnit.set(unitId, await loadUnit(unitId));
      const unit = byUnit.get(unitId);
      const picked = pickItems(unit, { skill: d.skill.id, level: rec(d.skill.id).lv, count: 1 });
      if (picked[0]) queue.push(picked[0]);
    }
    const first = due[0]?.skill?.unitId || "u01";
    return {
      key: "review",
      title: "ふくしゅうの もり",
      monster: unitMeta(first)?.monster || "kazumoya",
      unitId: null,
      back: "もどってきた もやもや",
    };
  }

  const unitId = params.unitId || "u01";
  const unit = await loadUnit(unitId);
  const meta = unitMeta(unitId);
  const skills = meta?.skills || [];
  const used = new Set();

  // ① ウォームアップ（かんたんに できるところから）
  const warm = pickItems(unit, { level: 1, count: 2, exclude: used });
  warm.forEach((it) => {
    used.add(it.id);
    queue.push(it);
  });

  // ② いまのレベルの もんだいを スキルごとに
  const per = Math.max(1, Math.ceil((QUESTIONS_PER_STAGE - warm.length) / Math.max(1, skills.length)));
  for (const s of skills) {
    const lv = rec(s.id).lv;
    const picked = pickItems(unit, { skill: s.id, level: lv, count: per, exclude: used });
    picked.forEach((it) => {
      used.add(it.id);
      queue.push(it);
    });
  }
  queue = queue.slice(0, QUESTIONS_PER_STAGE);
  return {
    key: `focus:${unitId}`,
    title: meta?.title || "ぼうけん",
    monster: meta?.monster || "kazumoya",
    unitId,
    back: meta?.title || "",
  };
}

function paintMonster(id, mood) {
  const box = $("#battle-monster");
  box.innerHTML = moya(id, mood, 110);
}

function paintDots() {
  const box = $("#battle-dots");
  clear(box);
  for (let i = 0; i < queue.length; i++) {
    const dot = el("i");
    if (i < answered) dot.className = "is-ok";
    else if (i === answered) dot.className = "is-now";
    box.appendChild(dot);
  }
}

async function showJudge(correct, item) {
  const judge = $("#judge");
  judge.hidden = false;
  judge.className = `judge ${correct ? "is-ok" : "is-ng"}`;
  clear(judge);
  const mark = el("div", "mark j-pop", correct ? "○" : "△");
  judge.appendChild(mark);
  if (correct) {
    judge.appendChild(el("div", "", "できた！"));
  } else {
    judge.appendChild(el("div", "", "もうすこし！"));
    const right = el("div", "proof");
    right.textContent = answerText(item);
    judge.appendChild(right);
  }
  await sleep(correct ? 650 : 2200);
  judge.hidden = true;
}

function answerText(item) {
  if (item.type === "choice") {
    const c = item.choices[item.answer];
    if (typeof c === "string") return `こたえ： ${c}`;
    if (c && c.label) return `こたえ： ${c.label}`;
    return "こたえを よく みてね";
  }
  if (item.type === "order") {
    return `こたえ： ${item.answer.map((i) => item.tokens[i]).join(" ")}`;
  }
  return `こたえ： ${item.answer}`;
}

function giveMaterial(item, correct) {
  if (!session.canGetMaterial()) return null;
  const skill = skillMeta(item.skill);
  const unitId = skill?.unitId || stageInfo?.unitId || "u01";
  const mat = correct ? item.reward || REWARD_BY_UNIT[unitId] || "ki" : "nendo";
  state.progress.materials[mat] = (state.progress.materials[mat] || 0) + 1;
  state.today.mats = (state.today.mats || 0) + 1;
  gained[mat] = (gained[mat] || 0) + 1;
  return mat;
}

function floatGain(mat) {
  if (!mat) return;
  const node = el("div", "gain");
  node.innerHTML = `<span style="display:inline-block;width:18px;height:18px;border-radius:5px;background:${MATERIALS[mat].color};vertical-align:-2px"></span> ${MATERIALS[mat].name} +1`;
  $("#s-battle").appendChild(node);
  setTimeout(() => node.remove(), 450);
}

async function runBreak() {
  state.today.breakDone = true;
  save("today");
  go("break");
  const label = $("#break-count");
  for (let t = 20; t > 0; t--) {
    label.textContent = String(t);
    await sleep(1000);
    if (stop) break;
  }
  go("battle", { resume: true });
}

async function runLoop() {
  while (answered < queue.length && !stop) {
    const item = queue[answered];
    paintDots();
    const res = await ask(item);
    if (stop || res.cancelled) break;

    state.today.items = (state.today.items || 0) + 1;
    const out = srsAnswer(item.skill, res.correct);
    if (res.correct) {
      correctCount++;
      state.today.ok = (state.today.ok || 0) + 1;
      sfx.correct();
      const plain = answerPlain(item);
      // 「できたしょうこ」として見せるので、こたえまで書ける問題だけを えらぶ
      if (plain.includes("→") && (!state.today.hardest || (item.level || 1) >= (state.today.hardest.level || 0))) {
        state.today.hardest = { text: plain, level: item.level || 1 };
      }
      if (out.newlyMastered && !state.today.newSkills.includes(item.skill)) {
        state.today.newSkills.push(item.skill);
      }
      const mat = giveMaterial(item, true);
      $("#battle-monster").classList.add("is-hit");
      setTimeout(() => $("#battle-monster").classList.remove("is-hit"), 260);
      await showJudge(true, item);
      floatGain(mat);
      if (mat) sfx.item();
    } else {
      sfx.again();
      showHintNow(item);
      const mat = giveMaterial(item, false);
      await showJudge(false, item);
      floatGain(mat);
      // もやもやが へんしんして、おなじ型を あとで もういちど
      wrongTries[item.skill] = (wrongTries[item.skill] || 0) + 1;
      if (wrongTries[item.skill] <= 2) {
        const unitId = skillMeta(item.skill)?.unitId;
        if (unitId) {
          try {
            const unit = await loadUnit(unitId);
            const again = pickItems(unit, {
              skill: item.skill,
              level: Math.max(1, rec(item.skill).lv),
              count: 1,
              exclude: new Set([item.id]),
            });
            if (again[0]) {
              const at = Math.min(queue.length, answered + 3);
              queue.splice(at, 0, again[0]);
            }
          } catch {
            /* よみこめなくても 止めない */
          }
        }
        $("#battle-monster").classList.add("is-henshin");
        sfx.henshin();
        setTimeout(() => $("#battle-monster").classList.remove("is-henshin"), 320);
      }
    }
    answered++;
    save("today", "progress");
    paintDots();

    // 1回の まんなかで 20びょうの やすみ（10分より みじかい回には 入れない）
    if (
      !state.today.breakDone &&
      session.limitSec() >= 600 &&
      session.usedSec() >= session.limitSec() / 2 &&
      session.remainSec() >= 180 && // おわりまぎわには 入れない
      answered < queue.length
    ) {
      await runBreak();
    }
  }
  if (stop) return;
  finishStage();
}

function answerPlain(item) {
  const q = item.prompt.join(" ");
  if (item.type === "input") return `${q} → ${item.answer}`;
  if (item.type === "order") return `${q} → ${item.answer.map((i) => item.tokens[i]).join(" ")}`;
  const c = item.choices?.[item.answer];
  const label = typeof c === "string" ? c : c?.label || "";
  return label ? `${q} → ${label}` : q;
}

function finishStage() {
  state.today.stages = state.today.stages || {};
  state.today.stages[stageInfo.key] = true;

  // もやもやが なかまになる（その単元が 半分 すすんだとき）
  let newFriend = null;
  if (stageInfo.unitId) {
    const p = state.progress;
    if (unitProgress(stageInfo.unitId) >= 0.5 && !(p.friends || []).includes(stageInfo.unitId)) {
      p.friends.push(stageInfo.unitId);
      newFriend = stageInfo.unitId;
    }
  }
  refreshUnlocks(units());
  save();
  go("result", {
    title: stageInfo.title,
    monster: stageInfo.monster,
    answered,
    correctCount,
    gained,
    newFriend,
  });
}

$("#btn-quit").addEventListener("click", () => {
  stop = true;
  running = false;
  cancelQuiz();
  $("#judge").hidden = true;
  go("town");
});
