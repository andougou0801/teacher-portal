// ちず。きょう行ける ところは3つだけ（えらぶのは 子ども）。
// ★なにが もらえるかは 先に見せる（運ではないから 予告できる）。
import { $, el, clear } from "../util.js";
import { moya, icon } from "../icons.js";
import { MATERIALS } from "../content.js";
import { state } from "../store.js";
import { unitMeta, availableSubjects } from "../data.js";
import { todaySubject, subjectName, subjectOfUnit, forcedSubject } from "../subject.js";
import { isDebug } from "../debug.js";
import { dueSkills, focusUnit, unitProgress } from "../srs.js";
import * as session from "../session.js";
import { go } from "../app.js";
import { sfx } from "../audio.js";

const REWARD_BY_UNIT = {
  u01: "ki",
  u02: "ki",
  u03: "ishi",
  u04: "ki",
  u05: "ishi",
  u06: "glass",
  u07: "glass",
  u08: "glass",
  // こくご（ことばのまち）
  j01: "ki",
  j02: "ki",
  j03: "ki",
  j04: "ishi",
  j05: "ishi",
  j06: "nendo",
  j07: "nendo",
  j08: "glass",
};

export function enter() {
  if (!state.slot) {
    go("start");
    return;
  }
  const body = $("#map-body");
  clear(body);

  if (session.isPractice()) {
    const note = el("div", "card");
    note.innerHTML =
      "<b>きょうの ぶんは おわりました。</b><br>ここからは れんしゅう。ざいりょうは もらえないけど、まるは つくよ。";
    body.appendChild(note);
  }

  // きょうの教科（じどうで 交互。せんせいモードで 片方に 固定できる）
  // ★この関数の 下のほうで open を べつの いみで つかっている。
  //   同じ名前に すると アプリ ぜんたいが 止まる（const の 二重宣言）。
  const openSubjects = availableSubjects();
  // ちずも まちと 同じ教科を 出す（かくにんモードで 町を かえたとき）
  const subject =
    (isDebug() && openSubjects.includes(forcedSubject()) && forcedSubject()) || todaySubject(openSubjects);
  const due = dueSkills();
  const focus = focusUnit(subject);
  const done = state.today.stages || {};

  if (availableSubjects().length > 1) {
    const head = el("div", "card kv");
    head.innerHTML = `きょうは <b>${subjectName(subject)}</b> の ひ`;
    body.appendChild(head);
  }

  // ① ふくしゅう
  if (due.length > 0) {
    body.appendChild(
      stageCard({
        key: "review",
        title: "もういちどの もり",
        sub: `もういちど やる もんだい ${due.length}もん`,
        iconHtml: moya("osaraimoya", "normal", 64),
        reward: "nendo",
        done: !!done.review,
        onGo: () => go("battle", { mode: "review" }),
      }),
    );
  }

  // ② きょうの しごと
  const fm = unitMeta(focus);
  if (fm) {
    body.appendChild(
      stageCard({
        key: `focus:${focus}`,
        title: `きょうの しごと：${fm.title}`,
        sub: `${Math.round(unitProgress(focus) * 100)}% すすんだ`,
        iconHtml: moya(fm.monster, "normal", 64),
        reward: REWARD_BY_UNIT[focus] || "ki",
        done: !!done[`focus:${focus}`],
        onGo: () => go("battle", { mode: "unit", unitId: focus, kind: "focus" }),
      }),
    );
  }

  // ③ えらんで ぼうけん（ひらいている単元から じぶんで えらぶ）
  const open = (state.progress.unlockedUnits || [])
    .filter((u) => u !== focus && subjectOfUnit(u) === subject);
  if (open.length) {
    const card = el("button", "stage-card");
    card.type = "button";
    card.innerHTML = `
      <span class="sc-icon">${icon("car", 64)}</span>
      <span class="sc-main">
        <span class="sc-title">えらんで ぼうけん</span>
        <span class="sc-sub">いった ところを もういちど。ざいりょうを えらべる</span>
      </span>`;
    card.addEventListener("click", () => openPicker(open));
    body.appendChild(card);
  }

  const back = el("p", "note", "ぜんぶ いかなくても だいじょうぶ。1つでも おわったら きろくに のこるよ。");
  body.appendChild(back);
}

function stageCard({ title, sub, iconHtml, reward, done, onGo }) {
  const card = el("button", `stage-card${done ? " is-done" : ""}`);
  card.type = "button";
  card.innerHTML = `
    <span class="sc-icon">${iconHtml}</span>
    <span class="sc-main">
      <span class="sc-title">${title}</span>
      <span class="sc-sub">${sub}</span>
    </span>
    <span class="sc-reward"><i style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${MATERIALS[reward].color}"></i>${MATERIALS[reward].name}</span>`;
  card.addEventListener("click", () => {
    sfx.tap();
    onGo();
  });
  return card;
}

function openPicker(openUnits) {
  const overlay = $("#overlay");
  overlay.hidden = false;
  clear(overlay);
  const sheet = el("div", "sheet");
  sheet.innerHTML = "<h3>どこへ いく？</h3>";
  for (const id of openUnits) {
    const m = unitMeta(id);
    if (!m) continue;
    const btn = el("button", "stage-card");
    btn.type = "button";
    btn.style.marginBottom = "10px";
    btn.innerHTML = `
      <span class="sc-icon">${moya(m.monster, "normal", 56)}</span>
      <span class="sc-main"><span class="sc-title">${m.title}</span>
      <span class="sc-sub">${Math.round(unitProgress(id) * 100)}% すすんだ</span></span>
      <span class="sc-reward"><i style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${MATERIALS[REWARD_BY_UNIT[id] || "ki"].color}"></i>${MATERIALS[REWARD_BY_UNIT[id] || "ki"].name}</span>`;
    btn.addEventListener("click", () => {
      overlay.hidden = true;
      go("battle", { mode: "unit", unitId: id, kind: "free" });
    });
    sheet.appendChild(btn);
  }
  const close = el("button", "btn", "とじる");
  close.type = "button";
  close.addEventListener("click", () => {
    overlay.hidden = true;
  });
  sheet.appendChild(close);
  overlay.appendChild(sheet);
}

export { REWARD_BY_UNIT };
