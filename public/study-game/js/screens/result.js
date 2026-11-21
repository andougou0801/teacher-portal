// ステージの けっか と きょうの まとめ。
// ★点数・正答率・順位は 出さない。「できるようになったこと」で見せる。
import { $, el, clear } from "../util.js";
import { moya, MOYA_NAMES } from "../icons.js";
import { MATERIALS } from "../content.js";
import { state } from "../store.js";
import { skillMeta, unitMeta } from "../data.js";
import { buildableList } from "./town.js";
import * as session from "../session.js";
import { sfx } from "../audio.js";
import { go } from "../app.js";

export function enterResult(params = {}) {
  const wrap = $("#result-wrap");
  clear(wrap);
  sfx.levelup();

  wrap.appendChild(el("h2", "", `${params.title || "ぼうけん"} クリア！`));

  const mon = el("div", "friend-pop");
  mon.innerHTML = moya(params.monster || "kazumoya", params.newFriend ? "friend" : "sad", 140);
  wrap.appendChild(mon);

  if (params.newFriend) {
    const name = MOYA_NAMES[unitMeta(params.newFriend)?.monster] || "もやもや";
    wrap.appendChild(el("div", "", `${name}が なかまに なった！`));
    wrap.appendChild(el("p", "note", "まちで いっしょに くらすよ"));
  } else {
    wrap.appendChild(el("div", "", `${params.correctCount || 0} もん できた`));
  }

  const gains = el("div", "gain-list");
  const got = params.gained || {};
  const keys = Object.keys(got);
  if (keys.length) {
    for (const m of keys) {
      const chip = el("div", "gain-chip");
      chip.innerHTML = `<span style="display:inline-block;width:18px;height:18px;border-radius:5px;background:${MATERIALS[m].color}"></span>${MATERIALS[m].name} +${got[m]}`;
      gains.appendChild(chip);
    }
  } else {
    gains.appendChild(el("div", "note", "れんしゅうだから ざいりょうは なし。でも まるは ついたよ"));
  }
  wrap.appendChild(gains);

  const next = el("button", "btn btn-main", "つぎへ");
  next.type = "button";
  next.addEventListener("click", () => {
    const stages = Object.keys(state.today.stages || {}).length;
    if (session.isOver() || stages >= 3) go("summary");
    else go("map");
  });
  wrap.appendChild(next);
}

/** 画面から はなれる出口。紙でやる3もん（答えは書かない） */
function paperThree() {
  const seed = (state.today.items || 0) % 5;
  const sets = [
    "3 + 4 ／ 2 + 6 ／ 10 - 4",
    "5 + 2 ／ 7 - 3 ／ 10 は 6と いくつ",
    "4 + 5 ／ 9 - 2 ／ 10 は 3と いくつ",
    "2 + 7 ／ 8 - 5 ／ 6 は 2と いくつ",
    "6 + 3 ／ 10 - 7 ／ 5 は 1と いくつ",
  ];
  return sets[seed];
}

export function enterSummary() {
  const wrap = $("#summary-wrap");
  clear(wrap);
  const over = session.isOver();
  wrap.appendChild(el("h2", "", over ? "きょうは おしまい" : "きょうの まとめ"));

  // できるようになったこと（動詞で、3つまで）
  const list = el("ul", "can-do card");
  const names = (state.today.newSkills || [])
    .map((id) => skillMeta(id)?.name)
    .filter(Boolean)
    .slice(0, 3);
  if (names.length) {
    names.forEach((n) => list.appendChild(el("li", "", `${n} が じぶんで できた`)));
  } else {
    list.appendChild(el("li", "", `${state.today.ok || 0} もん できた`));
    list.appendChild(el("li", "", "つづけると「ばっちり」に なるよ"));
  }
  wrap.appendChild(list);

  // きょう いちばん むずかしかった もんだい（できたしょうこ）
  if (state.today.hardest?.text) {
    const proof = el("div", "proof");
    proof.textContent = state.today.hardest.text;
    wrap.appendChild(el("p", "note", "きょう いちばん むずかしかった もんだい"));
    wrap.appendChild(proof);
  }

  // まちの かわったところ
  const built = state.today.built || [];
  if (built.length) {
    wrap.appendChild(el("div", "", `まちに ${built.length}つ たてた`));
  }

  // あしたの よこく（止めるのではなく、つぎを 見せて おわる）
  const nextB = buildableList()[0];
  if (nextB) {
    const need = Math.max(0, nextB.cost - nextB.have);
    wrap.appendChild(
      el(
        "p",
        "tomorrow",
        need === 0
          ? `あしたは ${nextB.name}を たてられるよ`
          : `あしたは ${nextB.name}まで ${MATERIALS[nextB.mat].name} あと ${need}`,
      ),
    );
  } else {
    wrap.appendChild(el("p", "tomorrow", "あしたは あたらしい ところへ いけるよ"));
  }

  if (over) {
    wrap.appendChild(
      el("p", "note", "15ふんで おしまいです。のばすことは できません。つづきは あした。"),
    );
    const paper = el("div", "card");
    paper.appendChild(el("div", "", "もっと やりたい子は、かみで この3もんを やってみよう"));
    const three = el("div", "proof", paperThree());
    paper.appendChild(three);
    wrap.appendChild(paper);
    const close = el("button", "btn btn-main", "とじる");
    close.type = "button";
    close.addEventListener("click", () => {
      sfx.close();
      go("town");
    });
    wrap.appendChild(close);
  } else {
    const back = el("button", "btn btn-main", "まちへ もどる");
    back.type = "button";
    back.addEventListener("click", () => go("town"));
    wrap.appendChild(back);
  }
}
