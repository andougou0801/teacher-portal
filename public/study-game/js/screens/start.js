// はじめの画面と「じぶんを えらぼう」。
// 文字入力は1か所もない（出席ばんごうと かおを えらぶだけ）。
import { $, el, clear, toast } from "../util.js";
import { face } from "../icons.js";
import {
  listSlots,
  createSlot,
  openSlot,
  MAX_SLOTS,
  state,
  deviceDay,
  saveSettings,
} from "../store.js";
import { limitSec } from "../session.js";
import { todaySubject, townName, forceSubject, SUBJECTS } from "../subject.js";
import { availableSubjects } from "../data.js";
import { isDebug } from "../debug.js";
import { refreshUnlocks } from "../srs.js";
import { go, applySettings } from "../app.js";
import { sfx } from "../audio.js";

let pickedNo = 0;
let pickedFace = -1;
let pressTimer = 0;

export function enterStart() {
  paintLogo();
  const box = $("#start-slots");
  clear(box);
  const slots = listSlots();
  slots.forEach((s) => {
    const btn = el("button", "slot-btn");
    btn.type = "button";
    btn.innerHTML = `<span class="slot-face">${face(s.face, "", 44)}</span><span>${s.no}ばん</span>`;
    btn.addEventListener("click", () => {
      // ★前の子が 行っていた まちを 引きつがない
      forceSubject("");
      openSlot(s.slot);
      refreshUnlocks();
      go("town");
    });
    box.appendChild(btn);
  });
  const newBtn = $("#btn-new");
  newBtn.disabled = slots.length >= MAX_SLOTS;
  newBtn.textContent = slots.length ? "ほかの ひと" : "はじめて あそぶ";
  $("#start-note").textContent = slots.length >= MAX_SLOTS
    ? "この タブレットは いっぱいです。せんせいに いってね"
    : "きろくは この タブレットの なかだけ。どこにも おくりません。";
}

/**
 * はじめの画面の 名前は「きょうの まち」。
 * ★ずっと「かずのまち」に して おくと、こくごの日に ひらいた子も
 *   先生も「このアプリは 算数だけ」と 思ってしまう。
 *   （きょうが どちらかは 日づけで きまる。子どもは えらべない）
 */
function paintLogo() {
  const subject = todaySubject(availableSubjects());
  const logo = $("#logo");
  if (logo) logo.textContent = townName(subject);
  const en = $(".logo-en");
  if (en) en.textContent = SUBJECTS[subject]?.en || "";
  const sub = $(".logo-sub");
  if (sub) {
    sub.textContent =
      subject === "japanese"
        ? "ことばを とりもどして まちを つくろう"
        : "かずを とりもどして まちを つくろう";
  }
}

export function enterWho() {
  pickedNo = 0;
  pickedFace = -1;
  const nums = $("#who-numbers");
  clear(nums);
  // 40こ ならべると 1年生は 自分の ばんごうを さがせないので、10ずつに くぎる
  for (let start = 1; start <= 40; start += 10) {
    const label = el("div", "numgroup", `${start} 〜 ${start + 9}`);
    nums.appendChild(label);
    for (let i = start; i < start + 10; i++) {
      const b = el("button", "", String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        pickedNo = i;
        nums.querySelectorAll("button").forEach((c) => c.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        updateOk();
      });
      nums.appendChild(b);
    }
  }
  const faces = $("#who-faces");
  clear(faces);
  for (let i = 0; i < 6; i++) {
    const b = el("button");
    b.type = "button";
    b.innerHTML = face(i, "", 72);
    b.setAttribute("aria-pressed", "false");
    b.setAttribute("aria-label", `${i + 1}ばんめの かお`);
    b.addEventListener("click", () => {
      pickedFace = i;
      [...faces.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      updateOk();
    });
    faces.appendChild(b);
  }
  updateOk();
}

function updateOk() {
  // ★「おせないボタン」に しない。1年生には 理由が わからないため。
  //   おしたら、まだ えらんでいない ところへ つれていく。
  const btn = $("#who-ok");
  btn.disabled = false;
  btn.textContent = pickedNo > 0 ? `${pickedNo}ばんで はじめる` : "これで はじめる";
}

/** 「あなたは ○ばん で いいですか？」の たしかめ画面 */
function confirmWho() {
  const overlay = $("#overlay");
  overlay.hidden = false;
  clear(overlay);
  const sheet = el("div", "sheet who-confirm");
  sheet.innerHTML = `
    <h3>これで いい？</h3>
    <div class="who-big">${face(pickedFace, "", 140)}</div>
    <div class="who-no">${pickedNo}ばん</div>
    <p class="note">じぶんの ばんごうと かおか、たしかめてね。<br>ちがう ときは「なおす」を おしてね。</p>`;
  const row = el("div", "row");
  const ok = el("button", "btn btn-main", "これで いい");
  ok.type = "button";
  ok.addEventListener("click", () => {
    overlay.hidden = true;
    // ★新しい枠を つくって 1日を やり直す、という 抜け道を ふさぐ。
    //   1台を 何人かで つかう学校が あるので、ふつうに つかうぶんには 止めない
    //   （めやすの2倍を こえたときだけ 止める）。
    if (!isDebug() && deviceDay().sec > limitSec() * 2) {
      toast("きょうは この タブレットで たくさん あそびました。せんせいに いってね", 5000);
      return;
    }
    const slot = createSlot(pickedNo, pickedFace);
    if (!slot) {
      toast("この タブレットは いっぱいです");
      return;
    }
    forceSubject("");
    openSlot(slot);
    refreshUnlocks();
    sfx.levelup();
    go("town");
  });
  const back = el("button", "btn", "なおす");
  back.type = "button";
  back.addEventListener("click", () => {
    overlay.hidden = true;
  });
  row.appendChild(ok);
  row.appendChild(back);
  sheet.appendChild(row);
  overlay.appendChild(sheet);
}

function install() {
  $("#btn-new").addEventListener("click", () => go("who"));

  // 音は はじめ オフ（教室で いっせいに 鳴らないように）。
  // 家で あそぶ子が すぐ つけられるよう、はじめの画面に 大きなボタンを 置く。
  const soundBtn = $("#btn-sound");
  const paintSound = () => {
    const on = state.settings.sound !== false;
    soundBtn.textContent = on ? "🔊 おと オン" : "🔈 おと オフ";
    soundBtn.setAttribute("aria-pressed", String(on));
  };
  paintSound();
  soundBtn.addEventListener("click", () => {
    state.settings.sound = state.settings.sound === false;
    saveSettings();
    applySettings();
    paintSound();
    if (state.settings.sound) sfx.item();
  });
  $("#who-ok").addEventListener("click", () => {
    if (pickedNo <= 0) {
      toast("① じぶんの ばんごうを えらんでね");
      $("#who-numbers")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (pickedFace < 0) {
      toast("② じぶんの かおを えらんでね");
      $("#who-faces")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    // ★ばんごうの とりちがえを ふせぐ：大きく出して、もう一度 たしかめる
    confirmWho();
  });

  // タイトルを3秒ながおしで せんせいモード（子どもは気づかない入口）
  const logo = $("#logo");
  const start = () => {
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      // ★ここで だれかの記録を かってに 開かない（前の子の まちが 見えてしまう）。
      //   子どもを えらぶ必要の ある きのうは、せんせいモードの 中で 知らせる。
      sfx.item();
      go("teacher", { setup: true });
    }, 3000);
  };
  const stop = () => clearTimeout(pressTimer);
  logo.addEventListener("pointerdown", start, { passive: true });
  logo.addEventListener("pointerup", stop, { passive: true });
  logo.addEventListener("pointercancel", stop, { passive: true });
  logo.addEventListener("pointerleave", stop, { passive: true });
}

install();
