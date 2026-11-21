// まちの画面（ハブ）。ここから全部へ1タップで行ける。
// ★町は「学んだぶん」だけ変わる。時間がたっても1ドットも変わらない。
import { $, el, clear, toast, sleep } from "../util.js";
import { buildingShapeMarkup, moya, MOYA_NAMES } from "../icons.js";
import { BUILDINGS, MATERIALS, MAT_ORDER, WEARS, TITLES, buildingByUnit } from "../content.js";
import { state, save } from "../store.js";
import { units, unitMeta } from "../data.js";
import { unitProgress, masteredCount, refreshUnlocks } from "../srs.js";
import * as session from "../session.js";
import { sfx } from "../audio.js";
import { go } from "../app.js";

const W = 1000;
const H = 560;

// なかまが 話すことば（子ども役の「なまえを よんでほしい」に こたえる）
const HELLO = [
  "{no}ばん、こんにちは！",
  "{no}ばん、きょうも きたね！",
  "まちが ひろく なったよ",
  "きょうの もんだい、がんばろう",
  "ぼく、ここに すんでるよ",
  "{no}ばんと いっしょだと たのしい",
];

function greetIndex(unitId) {
  // 日によって ことばが かわる（ランダムではなく、日づけと なかまで きまる）
  const day = new Date().getDate();
  let n = day;
  for (const ch of unitId) n += ch.charCodeAt(0);
  return n % HELLO.length;
}

function tree(x, y) {
  return `<g transform="translate(${x} ${y})">
    <rect x="-7" y="0" width="14" height="46" fill="#A9743C" stroke="#2B2A28" stroke-width="3"/>
    <circle cx="0" cy="-10" r="34" fill="#4E9B52" stroke="#2B2A28" stroke-width="3"/>
    <circle cx="-22" cy="6" r="22" fill="#5BBF6A" stroke="#2B2A28" stroke-width="3"/>
    <circle cx="22" cy="6" r="22" fill="#5BBF6A" stroke="#2B2A28" stroke-width="3"/>
  </g>`;
}

export function enter() {
  refreshUnlocks(units());
  render();
}

export function refresh() {
  if (!state.slot) return;
  render();
}

function paintMats() {
  const box = $("#town-mats");
  clear(box);
  // 0のものまで ならべると、せまい画面で 2段に なって 町が つぶれる。
  // 持っているものだけ、多い順に 3つまで。
  const have = MAT_ORDER.map((m) => ({ m, n: state.progress.materials[m] || 0 }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);
  for (const { m, n } of have) {
    const chip = el("div", "mat");
    chip.innerHTML = `<i style="background:${MATERIALS[m].color}"></i><span>${MATERIALS[m].name} ${n}</span>`;
    box.appendChild(chip);
  }
}

/**
 * これから建てる建物の一覧（まだ建っていない・その単元がひらいているもの）。
 * ready が true なら ざいりょうが そろっている。
 * ★「単元をどれだけ進めたか」では しばらない。ざいりょう自体が 正解の数なので、
 *   二重に しばると 何を あつめているのか 子どもに 見えなくなる。
 */
export function buildableList() {
  const open = state.progress.unlockedUnits || ["u01"];
  const out = [];
  for (const b of BUILDINGS) {
    if (state.progress.buildings[b.id]?.built) continue;
    if (!open.includes(b.unit)) continue;
    const have = state.progress.materials[b.mat] || 0;
    out.push({ ...b, have, ready: have >= b.cost });
  }
  return out;
}

function render() {
  const stage = $("#town-stage");
  const p = state.progress;
  $("#town-name").textContent = `${state.profile?.no ?? ""}ばんの まち`;
  paintMats();

  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="#BFE3FB"/>`;
  svg += `<circle cx="880" cy="80" r="46" fill="#FFE08A" stroke="#2B2A28" stroke-width="3"/>`;
  svg += `<path d="M0 300q160-90 320 0t340-20 340 30v250H0z" fill="#7FCB84" stroke="#2B2A28" stroke-width="3"/>`;
  svg += `<rect x="0" y="330" width="${W}" height="${H - 330}" fill="#5BBF6A"/>`;
  svg += `<path d="M0 420q250 30 500 0t500 0" stroke="#C98A4B" stroke-width="22" fill="none"/>`;

  // 木と池（うごかない かざり。ずっと動く背景は 入れない）
  svg += tree(690, 296) + tree(960, 300) + tree(240, 530);

  const built = BUILDINGS.filter((b) => p.buildings[b.id]?.built);
  const open = p.unlockedUnits || ["u01"];
  const nextUp = buildableList()[0];
  for (const b of BUILDINGS) {
    const x = (b.x / 100) * W;
    const y = (b.y / 100) * H;
    const info = p.buildings[b.id];
    const scale = 1.9;
    const place = `translate(${x - 50 * scale} ${y - 70 * scale}) scale(${scale})`;
    if (info?.built) {
      svg += `<g class="b-built" data-id="${b.id}" transform="${place}">${buildingShapeMarkup(b.shape, info.color || 0)}</g>`;
    } else if (open.includes(b.unit)) {
      // まだ たっていない たてものは、うすい かげで 見せる（なにを あつめているか 分かるように）
      svg += `<g class="b-ghost" opacity="0.3" transform="${place}">${buildingShapeMarkup(b.shape, 0)}</g>`;
      if (nextUp && nextUp.id === b.id) {
        const need = Math.max(0, b.cost - (p.materials[b.mat] || 0));
        svg += `<g transform="translate(${x} ${y + 24})">
          <rect x="-72" y="-22" width="144" height="42" rx="21" fill="#FFFFFF" stroke="#2B2A28" stroke-width="3"/>
          <rect x="-58" y="-12" width="22" height="22" rx="6" fill="${MATERIALS[b.mat].color}" stroke="#2B2A28" stroke-width="3"/>
          <text x="6" y="8" font-size="26" text-anchor="middle" fill="#2B2A28" font-weight="700">あと ${need}</text>
        </g>`;
      }
    }
  }

  // なかま（たおした もやもやが まちで くらす）
  (p.friends || []).forEach((unitId, i) => {
    const b = buildingByUnit(unitId);
    const bx = b ? (b.x / 100) * W : 200 + i * 90;
    const by = b ? (b.y / 100) * H : 460;
    // そとの g で 位置を きめ、なかの g を はねさせる
    // （おなじ g に transform を 2つ 書くと、CSSのほうが 位置を 消してしまうため）
    svg += `<g data-friend="${unitId}" transform="translate(${bx + 58} ${by + 2}) scale(0.9)"><g class="friend-body">${moya(
      unitMeta(unitId)?.monster || "kazumoya",
      "friend",
    ).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></g>`;
  });

  svg += "</svg>";
  stage.innerHTML = svg;

  // なかまを タップすると あいさつする
  stage.querySelectorAll("[data-friend]").forEach((node) => {
    node.addEventListener("click", () => {
      const id = node.getAttribute("data-friend");
      const monster = unitMeta(id)?.monster;
      sfx.item();
      // おされたら 1回だけ ぴょんと はねる（ずっと動く 背景には しない）
      const body = node.querySelector(".friend-body") || node;
      body.classList.remove("is-hop");
      void body.getBoundingClientRect();
      body.classList.add("is-hop");
      setTimeout(() => body.classList.remove("is-hop"), 500);
      toast(`${MOYA_NAMES[monster] || "なかま"}「${HELLO[greetIndex(id)]}」`.replace("{no}", state.profile.no));
    });
  });

  // 建物を タップすると いろを かえられる
  stage.querySelectorAll(".b-built").forEach((node) => {
    node.addEventListener("click", () => openColorSheet(node.getAttribute("data-id")));
  });

  const tip = el("div", "town-tip");
  const ready = buildableList().filter((b) => b.ready);
  if (session.isPractice()) {
    tip.textContent = "きょうの ぶんは おわり。れんしゅうは できるよ";
  } else if (ready.length) {
    tip.textContent = `${ready[0].name}が たてられる！`;
  } else {
    const next = buildableList()[0];
    if (next) {
      tip.textContent = `つぎは ${next.name}（${MATERIALS[next.mat].name} あと ${Math.max(0, next.cost - next.have)}）`;
    } else if (built.length >= BUILDINGS.length) {
      tip.textContent = "まちが ぜんぶ できた！すごい！";
    } else {
      tip.textContent = "ぼうけんに いって つぎの ばしょを ひらこう";
    }
  }
  stage.appendChild(tip);

  const goBtn = $("#btn-go");
  if (session.isPractice()) {
    goBtn.textContent = "れんしゅう する";
  } else {
    const left = Math.ceil(session.remainSec() / 60);
    goBtn.textContent = `きょうの ぼうけん（あと ${left}ふん）`;
  }

  if (ready.length) showBuildButton(ready[0]);
}

function showBuildButton(b) {
  const stage = $("#town-stage");
  const btn = el("button", "btn btn-main");
  btn.type = "button";
  btn.style.position = "absolute";
  btn.style.left = "50%";
  btn.style.top = "12px";
  btn.style.transform = "translateX(-50%)";
  btn.textContent = `${b.name}を たてる`;
  btn.addEventListener("click", () => buildNow(b.id));
  stage.appendChild(btn);
}

export async function buildNow(id) {
  const b = BUILDINGS.find((x) => x.id === id);
  if (!b) return;
  const p = state.progress;
  if (p.buildings[b.id]?.built) return;
  if ((p.materials[b.mat] || 0) < b.cost) {
    toast(`${MATERIALS[b.mat].name}が たりないよ`);
    return;
  }
  if (session.isPractice()) {
    toast("きょうの ぶんは おわり。あしたの おたのしみ！");
    return;
  }
  p.materials[b.mat] -= b.cost;
  p.buildings[b.id] = { built: true, color: 0, anim: false };
  state.today.built = state.today.built || [];
  state.today.built.push(b.id);

  // 建てると「みにつけるもの」と「しょうごう」が ひとつ ふえる
  const mastered = masteredCount();
  const wear = WEARS.find((w) => w.need <= mastered && !(p.wears || []).includes(w.id));
  if (wear) {
    p.wears.push(wear.id);
    if (!p.wearing) p.wearing = wear.id;
  }
  const title = TITLES.find((t) => t.unit === b.unit);
  if (title && !state.profile.titles.includes(title.id) && unitProgress(b.unit) >= 0.5) {
    state.profile.titles.push(title.id);
  }
  save();
  sfx.build();

  const stage = $("#town-stage");
  const pop = el("div", "build-pop");
  pop.innerHTML = `${b.name}が できた！${wear ? `<br>${wear.name}も もらった！` : ""}`;
  stage.appendChild(pop);
  // 初回だけ ゆっくり（1.2秒）、どこを おしても とばせる
  let done = false;
  const skip = () => {
    done = true;
  };
  pop.addEventListener("click", skip);
  for (let i = 0; i < 12 && !done; i++) await sleep(100);
  render();
}

function openColorSheet(id) {
  const info = state.progress.buildings[id];
  if (!info) return;
  const overlay = $("#overlay");
  overlay.hidden = false;
  clear(overlay);
  const sheet = el("div", "sheet");
  const b = BUILDINGS.find((x) => x.id === id);
  sheet.innerHTML = `<h3>${b?.name ?? "たてもの"}の いろ</h3>`;
  const row = el("div", "wear-grid");
  for (let i = 0; i < 6; i++) {
    const btn = el("button", "zukan-cell");
    btn.type = "button";
    btn.innerHTML = `<svg viewBox="0 0 100 100" width="56" height="56">${buildingShapeMarkup(b.shape, i)}</svg>`;
    btn.addEventListener("click", () => {
      info.color = i;
      save("progress");
      sfx.tap();
      overlay.hidden = true;
      render();
    });
    row.appendChild(btn);
  }
  sheet.appendChild(row);
  const close = el("button", "btn", "とじる");
  close.type = "button";
  close.addEventListener("click", () => {
    overlay.hidden = true;
  });
  sheet.appendChild(close);
  overlay.appendChild(sheet);
}

$("#btn-go").addEventListener("click", () => go("map"));
