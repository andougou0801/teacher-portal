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
    return {
      key: "review",
      title: "もういちどの もり",
      // ふくしゅう せんようの なかま（12体のうちの1体）
      monster: "osaraimoya",
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

  // ② まえに 正解した スキルの「たしかめ」（12問ぶん あとに もう一度 出す約束）
  //    この単元の ぶんだけ 取り出す（ほかの単元の 予約は のこしておく。
  //    取り出して 捨てると、その たしかめは 二度と 来なくなる）
  const confirms = takeDueConfirms(2, (skillId) => skills.some((s) => s.id === skillId));
  for (const c of confirms) {
    const picked = pickItems(unit, { skill: c.skill, level: rec(c.skill).lv, count: 1, exclude: used });
    if (picked[0]) {
      used.add(picked[0].id);
      queue.push(picked[0]);
    }
  }

  // ③ のこりは スキルを 1問ずつ 順ぐりに（どれか1つだけ 出ないことが ないように）
  //    すすんでいない スキルから さきに 出す
  const ordered = [...skills].sort((a, b) => {
    const ra = rec(a.id);
    const rb = rec(b.id);
    return ra.stage - rb.stage || ra.seen - rb.seen;
  });
  let guard = 0;
  while (queue.length < QUESTIONS_PER_STAGE && guard++ < 10) {
    let added = false;
    for (const s of ordered) {
      if (queue.length >= QUESTIONS_PER_STAGE) break;
      const picked = pickItems(unit, { skill: s.id, level: rec(s.id).lv, count: 1, exclude: used });
      if (picked[0]) {
        used.add(picked[0].id);
        queue.push(picked[0]);
        added = true;
      }
    }
    if (!added) break;
  }
  return {
    key: `focus:${unitId}`,
    title: meta?.title || "ぼうけん",
    monster: meta?.monster || "kazumoya",
    unitId,
    unitData: unit,
    back: meta?.title || "",
  };
}

/** 「12問あとに たしかめる」の予約から、いま出すぶんを 取り出す */
function takeDueConfirms(max, accept) {
  const list = state.today.pendingConfirm;
  if (!Array.isArray(list) || !list.length) return [];
  const now = state.today.items || 0;
  const due = list
    .filter((c) => c && typeof c.at === "number" && c.at <= now && (!accept || accept(c.skill)))
    .slice(0, max);
  if (due.length) {
    state.today.pendingConfirm = list.filter((c) => !due.includes(c));
    save("today");
  }
  return due;
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
  // 色だけだと 1年生には「あと いくつ」が わからないので、数でも 出す
  const count = el("span", "progress-count", `${Math.min(answered + 1, queue.length)} / ${queue.length}`);
  box.appendChild(count);
}

async function showJudge(correct, item) {
  const judge = $("#judge");
  judge.hidden = false;
  judge.className = `judge ${correct ? "is-ok" : "is-ng"}`;
  clear(judge);
  // まちがいの印は ×や△に しない（せめられている ように 見えるため）
  const mark = el("div", "mark j-pop", correct ? "○" : "🌱");
  judge.appendChild(mark);
  if (correct) {
    judge.appendChild(el("div", "", "できた！"));
  } else {
    judge.appendChild(el("div", "", "もうすこし！"));
    const right = el("div", "proof");
    right.textContent = answerText(item);
    judge.appendChild(right);
  }
  // 待たされるのが いちばん いやなので、4ひょうし（0.4秒）すぎたら
  // どこを おしても つぎへ 行けるようにする
  const wait = correct ? 650 : 2200;
  const next = el("button", "btn", "つぎへ");
  next.type = "button";
  next.style.marginTop = "10px";
  next.style.visibility = "hidden";
  judge.appendChild(next);
  let done = false;
  const skip = () => {
    done = true;
  };
  setTimeout(() => {
    if (judge.hidden) return;
    next.style.visibility = "visible";
    judge.addEventListener("click", skip, { once: true });
  }, 400);
  const started = Date.now();
  while (!done && Date.now() - started < wait) await sleep(60);
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
  // 材料は「単元の表」を正とする（問題JSONの reward は ふるい 予備）
  const mat = correct ? REWARD_BY_UNIT[unitId] || item.reward || "ki" : "nendo";
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
  let rescued = false;
  while (answered < queue.length && !stop) {
    let item = queue[answered];
    // うまくいっていない日は、のこりを やさしくして「できた」で おわらせる
    if (rescued) {
      // ふくしゅう（いろいろな単元）でも きくように、その問題の単元から えらび直す
      const unitId = skillMeta(item.skill)?.unitId;
      try {
        const u = unitId ? await loadUnit(unitId) : stageInfo.unitData;
        const easier = u
          ? pickItems(u, {
              skill: item.skill,
              level: 1,
              count: 1,
              // いま並んでいる問題と おなじものを 出さない
              exclude: new Set(queue.map((q) => q.id)),
            })
          : [];
        if (easier[0]) {
          item = easier[0];
          queue[answered] = item;
        }
      } catch {
        /* よみこめなくても そのままの問題を 出す */
      }
    }
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
      // 「できた」の直後に その日の はじめての正解なら、12問あとに もう一度 たしかめる
      if (out.rec.stage === 1 && out.rec.ok <= 2) {
        state.today.pendingConfirm = state.today.pendingConfirm || [];
        if (!state.today.pendingConfirm.some((c) => c.skill === item.skill)) {
          state.today.pendingConfirm.push({ skill: item.skill, at: (state.today.items || 0) + 12 });
        }
      }
      const mat = giveMaterial(item, true);
      $("#battle-monster").classList.add("is-hit");
      setTimeout(() => $("#battle-monster").classList.remove("is-hit"), 260);
      floatGain(mat);
      if (mat) sfx.item();
      await showJudge(true, item);
    } else {
      sfx.again();
      showHintNow(item);
      const mat = giveMaterial(item, false);
      floatGain(mat);
      await showJudge(false, item);
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
              exclude: new Set(queue.map((q) => q.id)),
            });
            // ★入れ足すのではなく、あとの1問と 入れかえる。
            //   足すと まるの数が ふえて、まちがえた子ほど ゴールが とおくなって見える。
            //   ただし「まだ1回も出ていないスキル」を けずらない（けずると その単元が
            //   いつまでも おわらない）。けずれる場所が なければ、2問までなら 足す。
            if (again[0]) {
              const seenSkills = new Set(queue.slice(0, answered + 1).map((q) => q.skill));
              let at = -1;
              for (let i = answered + 3; i < queue.length; i++) {
                if (seenSkills.has(queue[i].skill)) {
                  at = i;
                  break;
                }
              }
              if (at >= 0) queue[at] = again[0];
              else if (queue.length < QUESTIONS_PER_STAGE + 2) queue.push(again[0]);
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

    // 4問こえて 正答率が6わりを 下回ったら、のこりを やさしくする（1回だけ）
    if (!rescued && answered >= 4 && correctCount / answered < 0.6) {
      rescued = true;
    }

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
  // ★れんしゅうモード（きょうの ぶんが おわったあと）では、なかまも つぎの場所も ふえない。
  //   「おわり」と言いながら ごほうびが 出つづけると、おわれなくなるため。
  let newFriend = null;
  if (!session.isPractice()) {
    if (stageInfo.unitId) {
      const p = state.progress;
      if (unitProgress(stageInfo.unitId) >= 0.5 && !(p.friends || []).includes(stageInfo.unitId)) {
        p.friends.push(stageInfo.unitId);
        newFriend = stageInfo.unitId;
      }
    }
    refreshUnlocks(units());
  }
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
  // とちゅうで やめると ステージは 最初からに なる。だまって 消えると
  // 1年生には「きえた」と 見えるので、ひとこと 出す。
  toast("また さいしょから だよ。とけた ぶんは のこるよ", 4000);
  go("town");
});
