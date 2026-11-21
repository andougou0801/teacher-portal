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
} from "../store.js";
import { units, allSkills } from "../data.js";
import { rec, refreshUnlocks } from "../srs.js";
import * as session from "../session.js";
import * as speech from "../speech.js";
import { makeCode, readCode } from "../savecode.js";
import { applySettings, go } from "../app.js";
import { sfx } from "../audio.js";

const SIZES = [
  { v: 1, label: "ふつう" },
  { v: 1.15, label: "大きい" },
  { v: 1.3, label: "もっと大きい" },
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
  sizeRow.appendChild(el("span", "s-name", "もじの 大きさ"));
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
    ・ガチャ・かきん・こうこく・そとへの リンクは ありません<br>
    ・入れるのは しゅっせきばんごうと かおだけ。なまえは 入れません<br>
    ・きぶんが わるい・目が つかれたら すぐ やめてください<br>
    ・タブレットを かえると きろくは うつりません（せんせいモードの セーブコードで うつせます）`;
  body.appendChild(info);

  const t = el("button", "btn", "せんせいモード");
  t.type = "button";
  t.addEventListener("click", () => go("teacher"));
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

export function enterTeacher() {
  const body = $("#teacher-body");
  clear(body);
  if (!state.teacher.pin) {
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
  day.appendChild(el("div", "s-name", "1日の めやす（まいにちの 上限）"));
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
  unlock.appendChild(el("div", "s-name", "かいほうコード（てんにゅう・けっせきの子を 追いつかせる）"));
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
    state.progress.teacherUnlock = unitNo;
    const openIds = list.slice(0, unitNo).map((u) => u.unitId);
    for (const s of allSkills()) {
      if (!openIds.includes(s.unitId)) continue;
      const r = rec(s.id);
      r.lv = Math.max(r.lv, Math.min(5, Math.max(1, step)));
    }
    save();
    refreshUnlocks(list);
    toast(`${list[unitNo - 1].title} まで ひらきました`);
  });
  unlock.appendChild(codeBtn);
  const table = el("p", "note");
  table.innerHTML = units()
    .map((u, i) => `${String(i + 1).padStart(2, "0")} ${u.title}`)
    .join("　／　");
  unlock.appendChild(table);
  body.appendChild(unlock);

  // セーブコード
  const code = el("div", "card");
  code.appendChild(el("div", "s-name", "セーブコード（タブレットを かえるとき）"));
  if (state.slot) {
    const show = el("div", "savecode", makeCode());
    code.appendChild(show);
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
      refreshUnlocks(units());
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
      refreshUnlocks(units());
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
}

function renderTeacherReload() {
  const body = $("#teacher-body");
  clear(body);
  renderTeacher(body);
}
