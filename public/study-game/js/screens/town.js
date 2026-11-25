// まちの画面（ハブ）。ここから全部へ1タップで行ける。
// ★町は「学んだぶん」だけ変わる。時間がたっても1ドットも変わらない。
import { $, el, clear, toast, sleep } from "../util.js";
import { buildingShapeMarkup, moya, MOYA_NAMES, iconShape } from "../icons.js";
import { BUILDINGS, MATERIALS, MAT_ORDER, WEARS, TITLES } from "../content.js";
import { state, save } from "../store.js";
import { unitMeta } from "../data.js";
import { unitProgress, masteredCount, refreshUnlocks } from "../srs.js";
import {
  todaySubject,
  subjectOfUnit,
  townName,
  forceSubject,
  forcedSubject,
  canSwitchSubject,
  SUBJECTS,
} from "../subject.js";
import { isDebug } from "../debug.js";
import { availableSubjects } from "../data.js";
import * as session from "../session.js";
import { sfx } from "../audio.js";
import { go } from "../app.js";

const W = 1000;
const H = 560;

// いま見ている まち（教科ごとに1つ。きょうの教科から はじまる）
let viewSubject = "math";

// なかまが 話すことば（子ども役の「なまえを よんでほしい」に こたえる）
const HELLO = [
  "{no}ばん、こんにちは！",
  "{no}ばん、きょうも きたね！",
  "まちが ひろく なったよ",
  "きょうも いっしょに やろうね",
  "ぼく、ここに すんでるよ",
  "{no}ばんと いっしょだと たのしい",
  "はなが ふえて きれいだね",
  "きのう できたこと、すごかったね",
  "つぎは なにを たてるのかな",
  "ここから まちが よく みえるよ",
  "{no}ばん、ゆっくりで いいよ",
  "やあ、{no}ばん！",
  "{no}ばん、あそぼう！",
  "たからもの みつけたよ",
  "いっしょに まちを あるこう",
  "{no}ばん、すごいね！",
  "ぼく、ここが すき",
  "あした また あおうね",
  "みてみて、ぴょんっ！",
];

// おすたびに つぎの ことばに かわる（なかまごとに おぼえておく）
const greetCount = new Map();

function greetIndex(unitId) {
  const day = new Date().getDate();
  let n = day;
  for (const ch of unitId) n += ch.charCodeAt(0);
  const extra = greetCount.get(unitId) || 0;
  greetCount.set(unitId, extra + 1);
  return (n + extra) % HELLO.length;
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
  // 子どもを えらんでいないのに ひらかれたら、はじめの画面へ もどす
  // （先生モードの セットアップ直後などに ここへ 来ることがある）
  if (!state.slot) {
    go("start");
    return;
  }
  refreshUnlocks();
  const open = availableSubjects();
  // 自分で となりの まちへ 行っていれば そのまま。
  // 行っていなければ きょうの まち（日づけで きまる）。
  const picked = forcedSubject();
  const keep = picked && open.includes(picked) && (isDebug() || canSwitchSubject(open));
  viewSubject = keep ? picked : todaySubject(open);
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
export function buildableList(subject = viewSubject) {
  const open = state.progress.unlockedUnits || ["u01"];
  const out = [];
  for (const b of BUILDINGS) {
    if (state.progress.buildings[b.id]?.built) continue;
    if (!open.includes(b.unit)) continue;
    if (subject && subjectOfUnit(b.unit) !== subject) continue;
    const have = state.progress.materials[b.mat] || 0;
    out.push({ ...b, have, ready: have >= b.cost });
  }
  return out;
}

/**
 * 「となりの まちへ」ボタン。
 * ★先生が 教科を 固定している あいだは 出さない（授業中に 行かれると こまる）。
 *   かくにんモードでは いつでも 出す。
 */
function paintSubjectSwitch() {
  const top = $(".town-top");
  let btn = document.getElementById("btn-subject");
  const open = availableSubjects();
  if (!(isDebug() || canSwitchSubject(open)) || open.length < 2) {
    btn?.remove();
    return;
  }
  if (!btn) {
    btn = el("button", "btn btn-small");
    btn.id = "btn-subject";
    btn.type = "button";
    btn.addEventListener("click", () => {
      const next = open[(open.indexOf(viewSubject) + 1) % open.length];
      forceSubject(next);
      viewSubject = next;
      render();
    });
    top.appendChild(btn);
  }
  const next = open[(open.indexOf(viewSubject) + 1) % open.length];
  btn.textContent = `${SUBJECTS[next].town} へ`;
}

function render() {
  const stage = $("#town-stage");
  const p = state.progress;
  $("#town-name").textContent = `${state.profile?.no ?? ""}ばんの ${townName(viewSubject)}`;
  paintMats();
  paintSubjectSwitch();

  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="#BFE3FB"/>`;
  svg += `<circle cx="932" cy="54" r="34" fill="#FFE08A" stroke="#2B2A28" stroke-width="3"/>`;
  // ★おくの おか。2学期の たてものは ここに たつ。
  //   手前から おくへ そだっていくので、まちが ひろがって 見える。
  svg += `<path d="M0 198q170-28 340 4t330-10 330 14v360H0z" fill="#A6DBA9" stroke="#2B2A28" stroke-width="3"/>`;
  svg += `<path d="M0 300q160-90 320 0t340-20 340 30v250H0z" fill="#7FCB84" stroke="#2B2A28" stroke-width="3"/>`;
  svg += `<rect x="0" y="330" width="${W}" height="${H - 330}" fill="#5BBF6A"/>`;
  svg += `<path d="M0 420q250 30 500 0t500 0" stroke="#C98A4B" stroke-width="22" fill="none"/>`;

  // 木（うごかない かざり。ずっと動く背景は 入れない）
  // 木は、たてもの・なかま・下の帯と かさならない ところに おく
  svg += tree(690, 300) + tree(955, 320) + tree(450, 335);

  // ★「ばっちり おぼえた」が 1つ ふえるごとに、まちに 花が 1つ ふえる。
  //   たてものは なかなか 建たないので、毎日の すこしの がんばりが
  //   目に見えるように するため（時間では 1つも ふえない）。
  const mastered = masteredCount();
  // たてものが ぜんぶ たったあとも、まちは そだちつづける
  // （5つ おぼえるごとに、まちの どうぶつが 1ひき ふえる）
  const animals = ["cat", "dog", "rabbit", "fish"];
  for (let i = 0; i < Math.floor(mastered / 5); i++) {
    const ax = 150 + ((i * 211) % 760);
    const ay = 470 + ((i * 67) % 70);
    svg += `<g transform="translate(${ax} ${ay}) scale(0.5)">${iconShape(animals[i % animals.length])}</g>`;
  }

  const flowers = mastered;
  for (let i = 0; i < flowers; i++) {
    const fx = 60 + ((i * 137) % 880);
    const fy = 440 + ((i * 53) % 90);
    const color = ["#F58BB0", "#F2B23C", "#E4564B", "#9A7FD1"][i % 4];
    svg += `<g transform="translate(${fx} ${fy}) scale(0.5)">
      <path d="M0 26V8" stroke="#4E9B52" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="8" fill="${color}" stroke="#2B2A28" stroke-width="2.5"/>
      <circle cx="-9" cy="6" r="7" fill="${color}" stroke="#2B2A28" stroke-width="2.5"/>
      <circle cx="9" cy="6" r="7" fill="${color}" stroke="#2B2A28" stroke-width="2.5"/>
      <circle cx="0" cy="7" r="4" fill="#FFE08A" stroke="#2B2A28" stroke-width="2"/>
    </g>`;
  }

  // いま見ている まち（教科）の たてものだけ 出す
  const here = BUILDINGS.filter((b) => subjectOfUnit(b.unit) === viewSubject);
  const built = here.filter((b) => p.buildings[b.id]?.built);
  const open = p.unlockedUnits || ["u01"];
  const nextUp = buildableList()[0];
  // おくに ある ものから 先に 描く（手前の たてものが うしろに かくれないように）
  const inOrder = [...here].sort((p1, p2) => p1.y - p2.y);
  for (const b of inOrder) {
    const x = (b.x / 100) * W;
    const y = (b.y / 100) * H;
    const info = p.buildings[b.id];
    // おくの だんは 小さく えがく（とおくに あるように 見せる）
    // とおい ものほど 小さく。おく(2学期) → まんなか(1学期上・3学期) → 手前(1学期下)
    const scale = b.y < 42 ? 1.15 : b.y < 68 ? 1.5 : 1.9;
    const place = `translate(${x - 50 * scale} ${y - 70 * scale}) scale(${scale})`;
    if (info?.built) {
      svg += `<g class="b-built" data-id="${b.id}" transform="${place}">${buildingShapeMarkup(b.shape, info.color || 0)}</g>`;
    } else if (open.includes(b.unit)) {
      // まだ たっていない たてものは「？」で 見せる。
      // うすい たてものだと「もう あるのかな？」と まぎらわしいので、
      // 「ここに なにかが たつ」と はっきり わかる かたちに する。
      const w = b.y < 42 ? 70 : b.y < 68 ? 88 : 112;
      svg += `<g class="b-unknown" transform="translate(${x - w / 2} ${y - w * 0.77})">
        <rect x="0" y="0" width="${w}" height="${w}" rx="20" fill="#FFFFFF" fill-opacity="0.72"
              stroke="#2B2A28" stroke-width="4" stroke-dasharray="12 9"/>
        <text x="${w / 2}" y="${w / 2 + w * 0.21}" font-size="${Math.round(w * 0.57)}" font-weight="700"
              text-anchor="middle" fill="#2B2A28" opacity="0.72">？</text>
      </g>`;
      if (nextUp && nextUp.id === b.id) {
        const need = Math.max(0, b.cost - (p.materials[b.mat] || 0));
        // 札は その たてものの 足もとに 出す（どの たてものの ことか すぐ分かるように）。
        // 下の 帯に かくれないよう、下がりすぎないようにも する
        const labelY = Math.min(y + 48, 468);
        svg += `<g transform="translate(${x} ${labelY})">
          <rect x="-72" y="-22" width="144" height="42" rx="21" fill="#FFFFFF" stroke="#2B2A28" stroke-width="3"/>
          <rect x="-58" y="-12" width="22" height="22" rx="6" fill="${MATERIALS[b.mat].color}" stroke="#2B2A28" stroke-width="3"/>
          <text x="6" y="8" font-size="26" text-anchor="middle" fill="#2B2A28" font-weight="700">あと ${need}</text>
        </g>`;
      }
    }
  }

  // なかま（たおした もやもやが まちで くらす）
  // なかまは「みちぞい」に ならべる。
  // たてものの となりに おくと、「？」の はこや 木と かさなって しまうため。
  const friendList = (p.friends || []).filter((id) => subjectOfUnit(id) === viewSubject);
  friendList.forEach((unitId, i) => {
    const span = 760;
    const step = friendList.length > 1 ? span / (friendList.length - 1) : 0;
    const bx = 110 + i * step - 58;
    const by = 398;
    // そとの g で 位置を きめ、なかの g を はねさせる
    // （おなじ g に transform を 2つ 書くと、CSSのほうが 位置を 消してしまうため）
    svg += `<g data-friend="${unitId}" transform="translate(${bx + 58} ${by + 2}) scale(0.78)"><g class="friend-body">${moya(
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
    } else if (built.length >= here.length) {
      tip.textContent = "まちが ぜんぶ できた！ おぼえるたびに はなと どうぶつが ふえるよ";
    } else {
      tip.textContent = "ぼうけんに いって つぎの ばしょを ひらこう";
    }
  }
  stage.appendChild(tip);

  const goBtn = $("#btn-go");
  if (session.isPractice()) {
    goBtn.textContent = "れんしゅう する";
  } else {
    // のこり時間は 出さない（急かされているように 見えるため）。
    // おわる2分前に 1回だけ 知らせる仕組みが 別にある。
    goBtn.textContent = "きょうの ぼうけん";
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
