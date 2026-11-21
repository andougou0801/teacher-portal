// じぶん（アバター）・ずかん・きろく。
// ★「れんぞく○日」は 出さない。くらべるのは きのうの じぶんだけ。
import { $, el, clear } from "../util.js";
import { face, moya, MOYA_NAMES, building } from "../icons.js";
import { BUILDINGS, WEARS, TITLES, POWERS, starsFor } from "../content.js";
import { state, save } from "../store.js";
import { units, unitMeta, skillMeta } from "../data.js";
import { masteredByPower, masteredCount, isMastered } from "../srs.js";
import { sfx } from "../audio.js";

export function enterAvatar() {
  const body = $("#avatar-body");
  clear(body);
  const p = state.progress;

  const faceBox = el("div", "avatar-face");
  faceBox.innerHTML = face(state.profile.face, p.wearing, 160);
  body.appendChild(faceBox);
  body.appendChild(el("div", "", `${state.profile.no}ばん`));

  const titles = state.profile.titles || [];
  if (titles.length) {
    const t = TITLES.find((x) => x.id === titles[titles.length - 1]);
    if (t) body.appendChild(el("div", "", `しょうごう：${t.name}`));
  }

  // ちから（星5つ。中の かずは 見せない）
  const powers = el("div", "powers card");
  for (const key of Object.keys(POWERS)) {
    const n = masteredByPower(key);
    const row = el("div", "power-row");
    row.innerHTML = `<span class="p-name">${POWERS[key]}</span><span class="stars">${"★".repeat(
      starsFor(n),
    )}${"☆".repeat(5 - starsFor(n))}</span>`;
    powers.appendChild(row);
  }
  body.appendChild(powers);
  body.appendChild(
    el("p", "note", "ちからは「ばっちり おぼえた」が ふえると のびるよ"),
  );

  // みにつけるもの（見た目だけ。学習の じゃまを しない）
  body.appendChild(el("h3", "", "みにつけるもの"));
  const grid = el("div", "wear-grid");
  const mastered = masteredCount();
  for (const w of WEARS) {
    const has = (p.wears || []).includes(w.id);
    const btn = el("button", `zukan-cell${has ? "" : " is-locked"}`);
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(p.wearing === w.id));
    btn.innerHTML = `${face(state.profile.face, w.id, 56)}<span>${has ? w.name : `あと ${Math.max(0, w.need - mastered)}`}</span>`;
    if (has) {
      btn.addEventListener("click", () => {
        p.wearing = p.wearing === w.id ? "" : w.id;
        save("progress");
        sfx.tap();
        enterAvatar();
      });
    }
    grid.appendChild(btn);
  }
  body.appendChild(grid);
}

export function enterZukan() {
  const body = $("#zukan-body");
  clear(body);
  const p = state.progress;

  body.appendChild(el("h3", "", "なかま"));
  const friends = el("div", "zukan-grid");
  for (const u of units()) {
    const has = (p.friends || []).includes(u.unitId);
    const cell = el("div", `zukan-cell${has ? "" : " is-locked"}`);
    cell.innerHTML = `${moya(u.monster, has ? "friend" : "normal", 56)}<span>${
      has ? MOYA_NAMES[u.monster] || "なかま" : "？？？"
    }</span>`;
    friends.appendChild(cell);
  }
  body.appendChild(friends);

  body.appendChild(el("h3", "", "たてもの"));
  const builds = el("div", "zukan-grid");
  for (const b of BUILDINGS) {
    const info = p.buildings[b.id];
    const cell = el("div", `zukan-cell${info?.built ? "" : " is-locked"}`);
    cell.innerHTML = `${building(b.shape, info?.color || 0, 56)}<span>${info?.built ? b.name : "？？？"}</span>`;
    builds.appendChild(cell);
  }
  body.appendChild(builds);

  body.appendChild(el("h3", "", "できるように なったこと"));
  const skills = el("div", "card");
  const done = [];
  for (const u of units()) {
    for (const s of u.skills || []) {
      if (isMastered(s.id)) done.push(`${s.name}（${u.title}）`);
    }
  }
  if (done.length) {
    const ul = el("ul", "can-do");
    done.forEach((d) => ul.appendChild(el("li", "", d)));
    skills.appendChild(ul);
  } else {
    skills.appendChild(el("div", "note", "まだ ないよ。ぼうけんに いこう！"));
  }
  body.appendChild(skills);
  body.appendChild(el("p", "note", "とりのこしは いつでも あとから あつめられるよ"));
}

export function enterRecord() {
  const body = $("#record-body");
  clear(body);

  const doneDays = new Set((state.days || []).filter((d) => d.items > 0).map((d) => d.d));
  if ((state.today?.items || 0) > 0) doneDays.add(state.today.day);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();

  body.appendChild(el("h3", "", `${month + 1}がつ`));
  const cal = el("div", "cal card");
  ["にち", "げつ", "か", "すい", "もく", "きん", "ど"].forEach((w) => {
    const h = el("div", "is-pad", w);
    cal.appendChild(h);
  });
  for (let i = 0; i < first.getDay(); i++) cal.appendChild(el("div", "is-pad", ""));
  for (let d = 1; d <= days; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const cell = el("div", doneDays.has(key) ? "is-done" : "", doneDays.has(key) ? "⭐" : String(d));
    cell.title = String(d);
    cal.appendChild(cell);
  }
  body.appendChild(cal);

  const total = (state.days || []).reduce((a, d) => a + (d.ok || 0), 0) + (state.today?.ok || 0);
  const newTotal = new Set();
  (state.days || []).forEach((d) => (d.newSkills || []).forEach((s) => newTotal.add(s)));
  (state.today?.newSkills || []).forEach((s) => newTotal.add(s));

  const card = el("div", "card kv");
  card.innerHTML = `いままでに できた もんだい： <b>${total}</b>もん<br>できるように なったこと： <b>${newTotal.size}</b>こ`;
  body.appendChild(card);

  if (newTotal.size) {
    const ul = el("ul", "can-do card");
    [...newTotal]
      .map((id) => skillMeta(id)?.name)
      .filter(Boolean)
      .forEach((n) => ul.appendChild(el("li", "", n)));
    body.appendChild(ul);
  }
  body.appendChild(el("p", "note", "きょう できた ぶんは、ここに ⭐ が つくよ"));
}

export { unitMeta };
