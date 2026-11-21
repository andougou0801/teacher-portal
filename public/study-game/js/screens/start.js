// はじめの画面と「じぶんを えらぼう」。
// 文字入力は1か所もない（出席ばんごうと かおを えらぶだけ）。
import { $, el, clear, toast } from "../util.js";
import { face } from "../icons.js";
import { listSlots, createSlot, openSlot, MAX_SLOTS, state } from "../store.js";
import { units } from "../data.js";
import { refreshUnlocks } from "../srs.js";
import { go } from "../app.js";
import { sfx } from "../audio.js";

let pickedNo = 0;
let pickedFace = -1;
let pressTimer = 0;

export function enterStart() {
  const box = $("#start-slots");
  clear(box);
  const slots = listSlots();
  slots.forEach((s) => {
    const btn = el("button", "slot-btn");
    btn.type = "button";
    btn.innerHTML = `<span class="slot-face">${face(s.face, "", 44)}</span><span>${s.no}ばん</span>`;
    btn.addEventListener("click", () => {
      openSlot(s.slot);
      refreshUnlocks(units());
      go("town");
    });
    box.appendChild(btn);
  });
  const newBtn = $("#btn-new");
  newBtn.disabled = slots.length >= MAX_SLOTS;
  newBtn.textContent = slots.length ? "ほかの ひとが はじめる" : "はじめて あそぶ";
  $("#start-note").textContent = slots.length >= MAX_SLOTS
    ? "この タブレットは いっぱいです。せんせいに いってね"
    : "きろくは この タブレットの なかだけ。どこにも おくりません。";
}

export function enterWho() {
  pickedNo = 0;
  pickedFace = -1;
  const nums = $("#who-numbers");
  clear(nums);
  for (let i = 1; i <= 40; i++) {
    const b = el("button", "", String(i));
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      pickedNo = i;
      [...nums.children].forEach((c) => c.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      updateOk();
    });
    nums.appendChild(b);
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
  $("#who-ok").disabled = !(pickedNo > 0 && pickedFace >= 0);
}

function install() {
  $("#btn-new").addEventListener("click", () => go("who"));
  $("#who-ok").addEventListener("click", () => {
    if (pickedNo <= 0 || pickedFace < 0) return;
    const slot = createSlot(pickedNo, pickedFace);
    if (!slot) {
      toast("この タブレットは いっぱいです");
      return;
    }
    openSlot(slot);
    refreshUnlocks(units());
    sfx.levelup();
    go("town");
  });

  // タイトルを3秒ながおしで せんせいモード（子どもは気づかない入口）
  const logo = $("#logo");
  const start = () => {
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      if (!state.slot) {
        const slots = listSlots();
        if (slots.length) openSlot(slots[slots.length - 1].slot);
      }
      sfx.item();
      go("teacher");
    }, 3000);
  };
  const stop = () => clearTimeout(pressTimer);
  logo.addEventListener("pointerdown", start, { passive: true });
  logo.addEventListener("pointerup", stop, { passive: true });
  logo.addEventListener("pointercancel", stop, { passive: true });
  logo.addEventListener("pointerleave", stop, { passive: true });
}

install();
