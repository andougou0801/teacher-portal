// 1問を画面に出して、こたえを受け取るところ。
// ・こたえ方は「えらぶ」「かずを入れる」「ならべる」の3つ
// ・制限時間はつけない。36秒こまっていたら、だまって「ヒント みる？」を出す
import { $, el, clear } from "./util.js";
import { renderFigure } from "./figure.js";
import { icon } from "./icons.js";
import { sfx } from "./audio.js";
import * as speech from "./speech.js";
import { state } from "./store.js";

const HINT_MS = 36000;

// いま出している問題の「おわり」。やめたときに、ここから片づける。
let activeFinish = null;

/** とちゅうでやめたとき（やめるボタン）。待っているところを きれいに終わらせる。 */
export function cancel() {
  if (activeFinish) activeFinish(false, "", true);
}

function promptText(item) {
  return item.prompt.join(" ");
}

function renderChoices(item, box, done) {
  const wrap = el("div", "choices");
  (item.choices || []).forEach((c, i) => {
    const btn = el("button", "choice");
    btn.type = "button";
    if (typeof c === "string") {
      btn.textContent = c;
    } else if (c && c.icon) {
      btn.innerHTML = icon(c.icon, 72);
      btn.setAttribute("aria-label", `${i + 1}ばんめ`);
    } else if (c && c.label) {
      btn.innerHTML = `<span class="c-label">${c.label}</span>`;
    }
    btn.addEventListener("click", () => {
      if (box.dataset.locked) return;
      box.dataset.locked = "1";
      const correct = i === item.answer;
      btn.classList.add(correct ? "is-ok" : "is-ng");
      if (!correct) {
        const right = wrap.children[item.answer];
        if (right) right.classList.add("is-ok");
      }
      done(correct);
    });
    wrap.appendChild(btn);
  });
  box.appendChild(wrap);
}

function renderInput(item, box, done) {
  const view = el("div", "answer-box");
  view.textContent = "";
  box.appendChild(view);
  const pad = el("div", "numpad");
  let value = "";
  const paint = () => {
    view.textContent = value === "" ? "" : value;
  };
  const press = (label, cls, fn) => {
    const b = el("button", cls, label);
    b.type = "button";
    b.addEventListener("click", fn);
    pad.appendChild(b);
    return b;
  };
  for (let d = 1; d <= 9; d++) {
    press(String(d), "", () => {
      if (box.dataset.locked) return;
      if (value.length >= 2) return;
      value += String(d);
      paint();
    });
  }
  press("0", "", () => {
    if (box.dataset.locked) return;
    if (value.length >= 2) return;
    value += "0";
    paint();
  });
  press("けす", "np-del", () => {
    if (box.dataset.locked) return;
    value = "";
    paint();
  });
  const ok = press("これ！", "np-ok", () => {
    if (box.dataset.locked) return;
    if (value === "") return;
    box.dataset.locked = "1";
    done(value === String(item.answer), value);
  });
  ok.setAttribute("aria-label", "これでいい");
  box.appendChild(pad);

  // キーボードがある端末では、数字キーとEnterも使えるようにする
  const onKey = (e) => {
    if (box.dataset.locked) return;
    if (/^[0-9]$/.test(e.key) && value.length < 2) {
      value += e.key;
      paint();
    } else if (e.key === "Backspace") {
      value = value.slice(0, -1);
      paint();
    } else if (e.key === "Enter" && value !== "") {
      box.dataset.locked = "1";
      done(value === String(item.answer), value);
    }
  };
  box._onKey = onKey;
  document.addEventListener("keydown", onKey);
}

function renderOrder(item, box, done) {
  const need = item.answer.length;
  const slots = el("div", "order-slots");
  const picked = [];
  for (let i = 0; i < need; i++) slots.appendChild(el("div", "order-slot", ""));
  box.appendChild(slots);
  const tokens = el("div", "order-tokens");
  (item.tokens || []).forEach((t, i) => {
    const b = el("button", "token", t);
    b.type = "button";
    b.addEventListener("click", () => {
      if (box.dataset.locked) return;
      if (b.classList.contains("is-used")) return;
      b.classList.add("is-used");
      picked.push(i);
      const slot = slots.children[picked.length - 1];
      slot.textContent = t;
      slot.classList.add("is-filled");
      sfx.tap();
      if (picked.length === need) {
        box.dataset.locked = "1";
        const correct = picked.every((v, k) => v === item.answer[k]);
        done(correct, picked.join(","));
      }
    });
    tokens.appendChild(b);
  });
  box.appendChild(tokens);
  const undo = el("button", "btn", "もどす");
  undo.type = "button";
  undo.addEventListener("click", () => {
    if (box.dataset.locked) return;
    const last = picked.pop();
    if (last == null) return;
    tokens.children[last].classList.remove("is-used");
    const slot = slots.children[picked.length];
    slot.textContent = "";
    slot.classList.remove("is-filled");
  });
  undo.style.marginTop = "10px";
  box.appendChild(undo);
}

/**
 * 1問出して、こたえが返るまで待つ。
 * @returns {Promise<{correct:boolean, ms:number, value:string}>}
 */
export function ask(item) {
  const qtext = $("#qtext");
  const qfig = $("#qfigure");
  const qans = $("#qanswer");
  const qhint = $("#qhint");
  const speak = $("#btn-speak");

  clear(qtext);
  item.prompt.forEach((lineText, i) => {
    if (i > 0) qtext.appendChild(document.createElement("br"));
    qtext.appendChild(document.createTextNode(lineText));
  });
  const figureHtml = renderFigure(item.figure);
  qfig.innerHTML = figureHtml;
  $("#qcard").classList.toggle("no-figure", !figureHtml);
  clear(qans);
  qans.removeAttribute("data-locked");
  qhint.hidden = true;
  qhint.textContent = "";

  const canSpeak = speech.available() && speech.isEnabled();
  speak.hidden = !canSpeak;
  if (canSpeak) {
    speak.onclick = () => speech.say(promptText(item));
    // じどうで よむのは、せんせいが オンに したときだけ
    // （30人が いっせいに 鳴ると、しじが とおらなくなるため）
    if (state.settings.autoSpeak) speech.say(promptText(item));
  }

  // 動作確認のときだけ、いまの問題を見られるようにする（localhost のときだけ）
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    window.__kazuItem = item;
  }

  const started = performance.now();
  let hintTimer = 0;

  return new Promise((resolve) => {
    const finish = (correct, value = "", cancelled = false) => {
      clearTimeout(hintTimer);
      if (qans._onKey) {
        document.removeEventListener("keydown", qans._onKey);
        qans._onKey = null;
      }
      speak.onclick = null;
      speech.stop();
      activeFinish = null;
      resolve({ correct, ms: performance.now() - started, value, cancelled });
    };
    activeFinish = finish;

    if (item.type === "choice") renderChoices(item, qans, finish);
    else if (item.type === "order") renderOrder(item, qans, finish);
    else renderInput(item, qans, finish);

    if (item.hint) {
      hintTimer = setTimeout(() => {
        if (qans.dataset.locked) return;
        qhint.hidden = false;
        qhint.textContent = `ヒント： ${item.hint}`;
        sfx.hint();
        if (canSpeak) speech.say(item.hint);
      }, HINT_MS);
    }
  });
}

export function showHintNow(item) {
  const qhint = $("#qhint");
  if (!item.hint) return;
  qhint.hidden = false;
  qhint.textContent = `ヒント： ${item.hint}`;
}
