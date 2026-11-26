// せってい と せんせいモード。
// せんせいモードは「タイトルを3びょう ながおし」＋4けたの あんしょうばんごう。
// かいほうコードは この中だけで 入れる（子どもは 画面に たどりつけない）。
import { $, el, clear, toast } from "../util.js";
import {
  state,
  save,
  saveNow,
  saveSettings,
  saveTeacher,
  listSlots,
  deleteSlot,
  exportJSON,
  importJSON,
  readSlotSrs,
  deviceDay,
  myGrade,
  setMyGrade,
} from "../store.js";
import { units, allSkills, skillMeta, availableSubjects, grades } from "../data.js";
import { moya } from "../icons.js";
import { runTrace } from "../trace.js";
import { subjectMode, setSubjectMode, subjectName } from "../subject.js";
import { isDebug, setDebug } from "../debug.js";
import { MAT_ORDER } from "../content.js";
import { dayKey, addDays } from "../util.js";
import { rec, refreshUnlocks } from "../srs.js";
import * as session from "../session.js";
import * as speech from "../speech.js";
import { makeCode, readCode } from "../savecode.js";
import { applySettings, go } from "../app.js";
import { sfx } from "../audio.js";

const SIZES = [
  { v: 1, label: "ふつう" },
  { v: 1.15, label: "おおきい" },
  { v: 1.3, label: "もっと おおきい" },
];

export function enterSettings() {
  const body = $("#settings-body");
  clear(body);

  body.appendChild(
    toggleRow("おと", state.settings.sound !== false, (on) => {
      state.settings.sound = on;
      saveSettings();
      applySettings();
      if (on) sfx.tap();
    }),
  );

  if (speech.available()) {
    body.appendChild(
      toggleRow("よみあげ ボタン", state.settings.speech !== false, (on) => {
        state.settings.speech = on;
        saveSettings();
        applySettings();
        enterSettings();
      }),
    );
    if (state.settings.speech !== false) {
      body.appendChild(
        toggleRow("もんだいを じどうで よむ", state.settings.autoSpeak === true, (on) => {
          state.settings.autoSpeak = on;
          saveSettings();
        }),
      );
      body.appendChild(
        el("p", "note", "教室で みんなが いっせいに 鳴らすと しじが とおりません。はじめは オフです。"),
      );
    }
  } else {
    body.appendChild(
      el("p", "note", "この タブレットには よみあげの こえが 入っていません（なくても あそべます）"),
    );
  }

  const sizeRow = el("div", "set-row");
  sizeRow.appendChild(el("span", "s-name", "もじの おおきさ"));
  const sizeWrap = el("div", "row");
  SIZES.forEach((s) => {
    const b = el("button", "toggle", s.label);
    b.type = "button";
    b.setAttribute("aria-pressed", String((state.settings.textSize || 1) === s.v));
    b.addEventListener("click", () => {
      state.settings.textSize = s.v;
      saveSettings();
      applySettings();
      enterSettings();
    });
    sizeWrap.appendChild(b);
  });
  sizeRow.appendChild(sizeWrap);
  body.appendChild(sizeRow);

  const info = el("div", "card kv");
  info.innerHTML = `
    <b>おうちの人・せんせいへ</b><br>
    ・きろくは この タブレットの 中だけに あります。どこにも おくっていません<br>
    ・1日 15ふんで おわります。のばすことは できません<br>
    ・ガチャ・課金・広告・外部リンクは ありません<br>
    ・入れるのは しゅっせきばんごうと かおだけ。なまえは 入れません<br>
    ・きぶんが わるい・目が つかれたら すぐ やめてください<br>
    ・タブレットを かえると きろくは うつりません（せんせいモードの セーブコードで うつせます）`;
  body.appendChild(info);

  const t = el("button", "btn", "せんせいモード");
  t.type = "button";
  t.addEventListener("click", () => {
    // ★あんしょうばんごうが まだ ないときは、ここからは 登録させない。
    //   ここから登録できると、子どもが 自分で 番号を きめて
    //   じゅぎょうタイマーや かいほうコードを さわれてしまう。
    if (!state.teacher.pin) {
      toast("せんせいが さいしょに とうろくします（タイトルを 3びょう ながおし）", 5000);
      return;
    }
    go("teacher");
  });
  body.appendChild(t);
}

function toggleRow(name, on, onChange) {
  const row = el("div", "set-row");
  row.appendChild(el("span", "s-name", name));
  const btn = el("button", "toggle", on ? "オン" : "オフ");
  btn.type = "button";
  btn.setAttribute("aria-pressed", String(on));
  btn.addEventListener("click", () => {
    const next = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(next));
    btn.textContent = next ? "オン" : "オフ";
    onChange(next);
  });
  row.appendChild(btn);
  return row;
}

/* ================= せんせいモード ================= */
let unlocked = false;

async function digest(text) {
  try {
    if (!window.crypto?.subtle) return `plain:${text}`;
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  } catch {
    return `plain:${text}`;
  }
}

/** 画面を はなれたら かぎを かけ直す（開けっぱなしに しない） */
export function lockTeacher() {
  unlocked = false;
}

export function enterTeacher(params = {}) {
  const body = $("#teacher-body");
  clear(body);
  if (!state.teacher.pin) {
    if (!params.setup) {
      body.appendChild(
        el(
          "div",
          "card kv",
          "あんしょうばんごうは、タイトルの もじを 3びょう ながおしすると とうろくできます（せんせい用）。",
        ),
      );
      return;
    }
    body.appendChild(pinForm("あんしょうばんごうを きめてください（4けた）", async (pin) => {
      state.teacher.pin = await digest(pin);
      saveTeacher();
      unlocked = true;
      enterTeacher();
    }));
    return;
  }
  if (!unlocked) {
    body.appendChild(pinForm("あんしょうばんごう（4けた）", async (pin) => {
      if ((await digest(pin)) === state.teacher.pin) {
        unlocked = true;
        enterTeacher();
      } else {
        toast("ばんごうが ちがいます");
      }
    }));
    return;
  }
  renderTeacher(body);
}

function pinForm(label, onOk) {
  const box = el("div", "card");
  box.appendChild(el("div", "s-name", label));
  const view = el("div", "answer-box");
  let value = "";
  box.appendChild(view);
  const pad = el("div", "numpad");
  const paint = () => {
    view.textContent = "•".repeat(value.length);
  };
  for (let d = 1; d <= 9; d++) addKey(String(d));
  addKey("0");
  const del = el("button", "np-del", "けす");
  del.type = "button";
  del.addEventListener("click", () => {
    value = "";
    paint();
  });
  pad.appendChild(del);
  const ok = el("button", "np-ok", "けってい");
  ok.type = "button";
  ok.addEventListener("click", () => {
    if (value.length !== 4) {
      toast("4けた 入れてください");
      return;
    }
    onOk(value);
  });
  pad.appendChild(ok);
  box.appendChild(pad);
  return box;

  function addKey(ch) {
    const b = el("button", "", ch);
    b.type = "button";
    b.addEventListener("click", () => {
      if (value.length >= 4) return;
      value += ch;
      paint();
    });
    pad.appendChild(b);
  }
}

function renderTeacher(body) {
  // ① この端末の子の「つまずいているところ」（サーバーが無いので、この端末ぶんだけ）
  const stuck = el("div", "card");
  stuck.appendChild(el("div", "s-name", "つまずいているところ（この タブレットの子）"));
  const rows = [];
  for (const s of listSlots()) {
    const srs = readSlotSrs(s.slot);
    const bad = Object.entries(srs)
      .filter(([, r]) => r && r.seen >= 3 && r.ok / r.seen < 0.6)
      .sort((a, b) => a[1].ok / a[1].seen - b[1].ok / b[1].seen)
      .slice(0, 3)
      .map(([id]) => skillMeta(id)?.name || id);
    if (bad.length) rows.push(`${s.no}ばん：${bad.join("／")}`);
  }
  if (rows.length) {
    const ul = el("div", "kv");
    ul.innerHTML = rows.map((r) => `・${r}`).join("<br>");
    stuck.appendChild(ul);
  } else {
    stuck.appendChild(el("p", "note", "いまのところ、つまずいている子は いません（3回以上やって正答6割未満のものを出します）"));
  }
  stuck.appendChild(
    el(
      "p",
      "note",
      `この タブレットで きょう あそんだ 合計：${Math.floor(deviceDay().sec / 60)}分`,
    ),
  );
  body.appendChild(stuck);

  // じゅぎょうタイマー
  const timer = el("div", "card");
  timer.appendChild(el("div", "s-name", "じゅぎょうタイマー（おわると もとに もどります）"));
  const row = el("div", "row");
  [5, 10, 15, 20, 45].forEach((m) => {
    const b = el("button", "toggle", `${m}ふん`);
    b.type = "button";
    b.setAttribute("aria-pressed", String(state.teacher.classTimer === m));
    b.addEventListener("click", () => {
      session.setClassTimer(m);
      toast(`${m}ふんに しました`);
      renderTeacherReload();
    });
    row.appendChild(b);
  });
  const off = el("button", "toggle", "もとに もどす");
  off.type = "button";
  off.addEventListener("click", () => {
    session.clearClassTimer();
    toast("1日のめやすに もどしました");
    renderTeacherReload();
  });
  row.appendChild(off);
  timer.appendChild(row);
  timer.appendChild(
    el(
      "p",
      "note",
      `いま つかった 時間：${Math.floor(session.usedSec() / 60)}ふん ／ めやす ${Math.floor(
        session.limitSec() / 60,
      )}ふん`,
    ),
  );
  body.appendChild(timer);

  // 1日のめやす
  const day = el("div", "card");
  day.appendChild(el("div", "s-name", "1日の学習時間（上限）"));
  const dayRow = el("div", "row");
  [10, 15, 20].forEach((m) => {
    const b = el("button", "toggle", `${m}ふん`);
    b.type = "button";
    b.setAttribute("aria-pressed", String((state.teacher.minutes || 15) === m));
    b.addEventListener("click", () => {
      state.teacher.minutes = m;
      saveTeacher();
      renderTeacherReload();
    });
    dayRow.appendChild(b);
  });
  day.appendChild(dayRow);
  body.appendChild(day);

  // かいほうコード
  const unlock = el("div", "card");
  unlock.appendChild(el("div", "s-name", "単元ひらきコード（4けた・転入や欠席の子を追いつかせる）"));
  unlock.appendChild(
    el(
      "p",
      "note",
      "4けた：まえの2けたが 単元のばんごう、うしろの2けたが 段（1〜5）。例 0402＝単元4の段2まで。そこまで ぜんぶ ひらきます。ふだんは 子どもの すすみぐあいで じどうに ひらくので、入れなくてだいじょうぶです。",
    ),
  );
  const codeInput = el("input", "code-input");
  codeInput.type = "text";
  codeInput.inputMode = "numeric";
  codeInput.maxLength = 4;
  codeInput.placeholder = "0402";
  unlock.appendChild(codeInput);
  const codeBtn = el("button", "btn", "ひらく");
  codeBtn.type = "button";
  codeBtn.addEventListener("click", () => {
    const v = codeInput.value.replace(/[^0-9]/g, "");
    if (v.length !== 4) {
      toast("4けたの すうじを 入れてください");
      return;
    }
    const unitNo = parseInt(v.slice(0, 2), 10);
    const step = parseInt(v.slice(2), 10);
    const list = units();
    if (unitNo < 1 || unitNo > list.length) {
      toast("その 単元は ありません");
      return;
    }
    openUpTo(unitNo, step);
    toast(`${list[unitNo - 1].title} まで ひらきました`);
  });
  unlock.appendChild(codeBtn);
  // コードを 覚えていなくても、単元を おすだけで 開けるようにする
  unlock.appendChild(el("p", "note", "単元を おして ひらくこともできます（そこまで ぜんぶ 開きます）"));
  const unitRow = el("div", "row");
  units().forEach((u, i) => {
    const b = el("button", "toggle");
    b.type = "button";
    b.style.minWidth = "auto";
    // 絵（その単元の もやもや）も つけて、ぱっと 見分けられるようにする
    b.innerHTML = `<span style="display:inline-block;width:26px;height:26px;vertical-align:-6px">${moya(
      u.monster,
      "normal",
      26,
    )}</span> ${String(i + 1).padStart(2, "0")} ${u.title}`;
    b.addEventListener("click", () => {
      openUpTo(i + 1, 2);
      toast(`${u.title} まで ひらきました`);
    });
    unitRow.appendChild(b);
  });
  unlock.appendChild(unitRow);
  body.appendChild(unlock);

  // セーブコード
  const code = el("div", "card");
  code.appendChild(el("div", "s-name", "セーブコード（タブレットを かえるとき）"));
  if (state.slot) {
    const text = makeCode();
    const show = el("div", "savecode", text);
    code.appendChild(show);
    const copy = el("button", "btn", "コードを コピー");
    copy.type = "button";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        toast("コピーしました");
      } catch {
        // コピーが つかえない端末では、えらびやすいように 全部 えらんでおく
        const range = document.createRange();
        range.selectNodeContents(show);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        toast("ながおしして コピーしてください");
      }
    });
    code.appendChild(copy);
    code.appendChild(
      el("p", "note", "紙に ひかえて おくと、きろくが きえても ここから もどせます。なまえは 入っていません。"),
    );
  } else {
    code.appendChild(el("p", "note", "先に 子どもを えらぶと コードが 出ます"));
  }
  const codeIn = el("input", "code-input");
  codeIn.type = "text";
  codeIn.placeholder = "コードを 入れて もどす";
  code.appendChild(codeIn);
  const codeApply = el("button", "btn", "この コードで もどす");
  codeApply.type = "button";
  codeApply.addEventListener("click", () => {
    if (!state.slot) {
      toast("先に 子どもを えらんでください");
      return;
    }
    try {
      readCode(codeIn.value);
      refreshUnlocks();
      toast("もどしました");
      renderTeacherReload();
    } catch (err) {
      toast(err.message || "コードが よめません", 4000);
    }
  });
  code.appendChild(codeApply);
  body.appendChild(code);

  // 書き出し・読みこみ
  const file = el("div", "card");
  file.appendChild(el("div", "s-name", "きろくの 書き出し・読みこみ（学期の おわりに）"));
  const outBtn = el("button", "btn", "ファイルに 書き出す");
  outBtn.type = "button";
  outBtn.addEventListener("click", () => {
    if (!state.slot) {
      toast("先に 子どもを えらんでください");
      return;
    }
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kazunomachi-${state.profile.no}ban.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  file.appendChild(outBtn);
  const inLabel = el("label", "btn", "ファイルから 読みこむ");
  const inFile = document.createElement("input");
  inFile.type = "file";
  inFile.accept = "application/json,.json";
  inFile.style.display = "none";
  inFile.addEventListener("change", async () => {
    const f = inFile.files?.[0];
    if (!f) return;
    try {
      importJSON(await f.text());
      refreshUnlocks();
      toast("読みこみました");
      renderTeacherReload();
    } catch (err) {
      toast(err.message || "この ファイルは つかえません", 4000);
    }
  });
  inLabel.appendChild(inFile);
  file.appendChild(inLabel);
  body.appendChild(file);

  // 保存枠の かんり
  const slots = el("div", "card");
  slots.appendChild(el("div", "s-name", "この タブレットの 子ども（さいだい6人）"));
  const list = listSlots();
  if (!list.length) slots.appendChild(el("p", "note", "まだ だれも いません"));
  list.forEach((s) => {
    const row = el("div", "set-row");
    row.appendChild(el("span", "s-name", `${s.no}ばん（さいご：${s.updated || "-"}）`));
    const del = el("button", "toggle danger", "けす");
    del.type = "button";
    del.addEventListener("click", () => {
      if (del.dataset.sure !== "1") {
        del.dataset.sure = "1";
        del.textContent = "ほんとに けす？";
        return;
      }
      deleteSlot(s.slot);
      saveNow();
      toast(`${s.no}ばんの きろくを けしました`);
      renderTeacherReload();
    });
    row.appendChild(del);
    slots.appendChild(row);
  });
  slots.appendChild(
    el(
      "p",
      "note",
      "学年の おわりは、ここで 全員を けしてください（タブレットを 次の学年に わたす前に）。",
    ),
  );
  body.appendChild(slots);

  // この子の 学年
  body.appendChild(gradeCard());

  // きょうの教科（さんすう／こくご）
  const subj = el("div", "card");
  subj.appendChild(el("div", "s-name", "きょうの教科"));
  subj.appendChild(
    el(
      "p",
      "note",
      "1日15分は2教科の合計です。「じどう」にしておくと、さんすうとこくごが日ごとに入れかわります（同じ日に両方はやらせません）。授業で使うときだけ、片方に固定してください。",
    ),
  );
  const subjRow = el("div", "row");
  for (const [mode, label] of [
    ["auto", "じどう"],
    ["math", "さんすう"],
    ["japanese", "こくご"],
  ]) {
    const b = el("button", "toggle", label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(subjectMode() === mode));
    b.addEventListener("click", () => {
      setSubjectMode(mode);
      saveSettings();
      toast(`${label} に しました`);
      renderTeacherReload();
    });
    subjRow.appendChild(b);
  }
  subj.appendChild(subjRow);
  subj.appendChild(
    el("p", "note", `いま ひらいている教科：${availableSubjects().map((s) => subjectName(s)).join("・")}`),
  );
  body.appendChild(subj);

  // ★かくにんモード（おとな用の裏モード）
  body.appendChild(debugCard());

  // なぞり書きの しさく（国語を 入れる前の ためし）
  const trace = el("div", "card");
  trace.appendChild(el("div", "s-name", "なぞり書きの ためし（国語の しさく）"));
  trace.appendChild(
    el(
      "p",
      "note",
      "指で なぞって ためせます。ゆびの 太さで 通りにくくないか、1年生の 指で 通せるかを 見てください。",
    ),
  );
  const traceRow = el("div", "row");
  for (const ch of ["あ", "い", "う"]) {
    const b = el("button", "btn", ch);
    b.type = "button";
    b.addEventListener("click", () => openTrace(ch));
    traceRow.appendChild(b);
  }
  trace.appendChild(traceRow);
  body.appendChild(trace);

  // あんしょうばんごうの 変更（子どもに 見られたときのため）
  const pin = el("div", "card");
  pin.appendChild(el("div", "s-name", "あんしょうばんごうを かえる"));
  const pinBtn = el("button", "btn", "かえる");
  pinBtn.type = "button";
  pinBtn.addEventListener("click", () => {
    clear(body);
    body.appendChild(
      pinForm("あたらしい あんしょうばんごう（4けた）", async (next) => {
        state.teacher.pin = await digest(next);
        saveTeacher();
        toast("かえました");
        renderTeacherReload();
      }),
    );
  });
  pin.appendChild(pinBtn);
  pin.appendChild(
    el(
      "p",
      "note",
      "わすれたときは、この タブレットの ブラウザの「サイトのデータを消去」で 全部 消すと 初めからになります（子どもの きろくも 消えます）。",
    ),
  );
  body.appendChild(pin);
}

/**
 * かくにんモード（おとな用の裏モード）。
 * ふだんの しばり（1日15分・1日12個・単元はじゅんに開放・1日1段）を 外して、
 * ぜんぶの機能を 一気に 確かめるためのもの。
 * ★先生モードの中だけに置く（子どもは あんしょうばんごうが ないと 入れない）。
 */
/**
 * この子は 何年生か。
 * ★学年は「どこから はじめるか」だけを きめる（決定60）。
 *   前の学年を やり直させない。学校で もう 習っているため。
 *   町も きろくも 学年を またいで のこる（決定63）。
 */
function gradeCard() {
  const card = el("div", "card");
  card.appendChild(el("div", "s-name", "この子の 学年"));
  if (!state.slot) {
    card.appendChild(el("p", "note", "先に 子どもを えらんでください。"));
    return card;
  }
  const have = grades();
  card.appendChild(
    el(
      "p",
      "note",
      "その学年の さいしょの単元から はじまります。前の学年は やり直させません（学校で もう ならっているため）。まちと きろくは 学年が 上がっても のこります。",
    ),
  );
  const row = el("div", "row");
  for (let g = 1; g <= 6; g++) {
    const b = el("button", "toggle", `${g}年`);
    b.type = "button";
    const ready = have.includes(g);
    b.disabled = !ready;
    b.setAttribute("aria-pressed", String(myGrade() === g));
    if (!ready) b.title = "この学年の もんだいは まだ ありません";
    b.addEventListener("click", () => {
      setMyGrade(g);
      refreshUnlocks();
      toast(`${g}年生に しました`);
      renderTeacherReload();
    });
    row.appendChild(b);
  }
  card.appendChild(row);
  const missing = [1, 2, 3, 4, 5, 6].filter((g) => !have.includes(g));
  if (missing.length) {
    card.appendChild(
      el("p", "note", `もんだいが あるのは ${have.join("・")}年だけです（${missing.join("・")}年は これから）。`),
    );
  }
  return card;
}

function debugCard() {
  const card = el("div", "card");
  card.appendChild(el("div", "s-name", "かくにんモード（おとな用）"));
  card.appendChild(
    el(
      "p",
      "note",
      "オンにすると、1日15分・1日の材料12個・単元の開放・1日1段のしばりが すべて外れます。ぜんぶの単元がひらき、何問でも続けられます。子どもに使わせないでください。オンの間は、画面の上に帯が出ます。",
    ),
  );
  const row = el("div", "row");
  const toggle = el("button", "toggle", isDebug() ? "オン" : "オフ");
  toggle.type = "button";
  toggle.setAttribute("aria-pressed", String(isDebug()));
  toggle.addEventListener("click", () => {
    setDebug(!isDebug());
    toast(isDebug() ? "かくにんモードを オンに しました" : "ふつうに もどしました");
    renderTeacherReload();
  });
  row.appendChild(toggle);
  card.appendChild(row);

  if (!isDebug()) return card;

  // ---- オンのときだけ出す、確かめ用の道具 ----
  card.appendChild(el("p", "note", "— 確かめ用（この子の記録を書きかえます）—"));
  const tools = el("div", "row");

  const tool = (label, fn) => {
    const b = el("button", "btn", label);
    b.type = "button";
    b.addEventListener("click", () => {
      if (!state.slot) {
        toast("先に 子どもを えらんでください");
        return;
      }
      fn();
      saveNow();
      renderTeacherReload();
    });
    tools.appendChild(b);
  };

  tool("きょうの分をリセット", () => {
    state.today.sec = 0;
    state.today.stages = {};
    state.today.mats = 0;
    state.today.breakDone = false;
    toast("きょうの時間・ステージ・材料を 0に もどしました");
  });

  tool("ざいりょう +100", () => {
    for (const m of MAT_ORDER) state.progress.materials[m] = (state.progress.materials[m] || 0) + 100;
    toast("材料を 100ずつ ふやしました");
  });

  tool("ふくしゅうを いま出す", () => {
    const today = dayKey();
    let n = 0;
    for (const r of Object.values(state.srs || {})) {
      if (r && r.stage > 0) {
        r.due = today;
        n++;
      }
    }
    toast(`${n}この スキルを ふくしゅうに 出しました`);
  });

  tool("ぜんぶ ばっちりに", () => {
    const today = dayKey();
    for (const s of allSkills()) {
      const r = rec(s.id);
      r.stage = 5;
      r.lv = 5;
      r.seen = Math.max(r.seen, 10);
      r.ok = Math.max(r.ok, 10);
      r.first = r.first || today;
      r.due = addDays(today, 30);
    }
    refreshUnlocks();
    toast("ぜんぶのスキルを「ばっちり」に しました（武器・称号・レベルが そろいます）");
  });

  tool("この子を まっさらに", () => {
    state.srs = {};
    state.days = [];
    state.progress.materials = { ki: 0, ishi: 0, glass: 0, nendo: 0 };
    state.progress.buildings = {};
    state.progress.friends = [];
    state.progress.weapons = [];
    state.progress.weapon = "kinobo";
    state.progress.wears = [];
    state.progress.wearing = "";
    state.progress.unitDays = {};
    state.progress.unlockedUnits = ["u01"];
    state.profile.titles = [];
    state.today.sec = 0;
    state.today.stages = {};
    state.today.mats = 0;
    state.today.items = 0;
    state.today.ok = 0;
    state.today.newSkills = [];
    state.today.built = [];
    refreshUnlocks();
    toast("この子の きろくを まっさらに しました");
  });

  card.appendChild(tools);
  return card;
}

/** なぞり書きを ためす（国語を 入れる前の しさく） */
function openTrace(ch) {
  const overlay = $("#overlay");
  overlay.hidden = false;
  clear(overlay);
  const sheet = el("div", "sheet trace-sheet");
  sheet.appendChild(el("h3", "", `「${ch}」を なぞろう`));
  sheet.appendChild(el("p", "note", "オレンジの 点から、ばんごうの じゅんに なぞってね"));
  const pad = el("div", "");
  sheet.appendChild(pad);
  const msg = el("div", "trace-msg", "");
  sheet.appendChild(msg);
  const row = el("div", "row");
  const again = el("button", "btn", "もういちど");
  again.type = "button";
  const close = el("button", "btn", "とじる");
  close.type = "button";
  row.appendChild(again);
  row.appendChild(close);
  sheet.appendChild(row);
  overlay.appendChild(sheet);

  let cleanup = () => {};
  const start = () => {
    msg.textContent = "";
    cleanup();
    cleanup = runTrace(pad, ch, () => {
      msg.textContent = "できた！";
      sfx.levelup();
    });
  };
  again.addEventListener("click", start);
  close.addEventListener("click", () => {
    cleanup();
    overlay.hidden = true;
  });
  start();
}

/** その単元まで まとめて ひらく（累積開放。欠席・転入の子が 1回で 追いつける） */
function openUpTo(unitNo, step) {
  if (!state.slot) {
    toast("先に 子どもを えらんでください（はじめの画面で ばんごうを おす）", 4000);
    return;
  }
  const list = units();
  state.progress.teacherUnlock = unitNo;
  const openIds = list.slice(0, unitNo).map((u) => u.unitId);
  for (const s of allSkills()) {
    if (!openIds.includes(s.unitId)) continue;
    const r = rec(s.id);
    r.lv = Math.max(r.lv, Math.min(5, Math.max(1, step)));
  }
  save();
  refreshUnlocks();
}

function renderTeacherReload() {
  const body = $("#teacher-body");
  clear(body);
  renderTeacher(body);
}
