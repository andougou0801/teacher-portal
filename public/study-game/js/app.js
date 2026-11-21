// 起動と画面の切りかえ。
import { $, $$, installPressFeedback, toast } from "./util.js";
import * as audio from "./audio.js";
import * as speech from "./speech.js";
import { state, meta, openSlot, saveNow } from "./store.js";
import { loadManifest, units } from "./data.js";
import * as session from "./session.js";
import { refreshUnlocks } from "./srs.js";

import * as startScreen from "./screens/start.js";
import * as townScreen from "./screens/town.js";
import * as mapScreen from "./screens/map.js";
import * as battleScreen from "./screens/battle.js";
import * as resultScreen from "./screens/result.js";
import * as collectionScreen from "./screens/collection.js";
import * as settingsScreen from "./screens/settings.js";

const SCREENS = {
  start: startScreen.enterStart,
  who: startScreen.enterWho,
  town: townScreen.enter,
  map: mapScreen.enter,
  battle: battleScreen.enter,
  break: battleScreen.enterBreak,
  result: resultScreen.enterResult,
  summary: resultScreen.enterSummary,
  avatar: collectionScreen.enterAvatar,
  zukan: collectionScreen.enterZukan,
  record: collectionScreen.enterRecord,
  settings: settingsScreen.enterSettings,
  teacher: settingsScreen.enterTeacher,
};

let current = "start";

export function go(name, params = {}) {
  const next = $(`#app .screen[data-screen="${name}"]`);
  if (!next) return;
  const prev = $(`#app .screen.is-active`);
  if (prev && prev !== next) {
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    setTimeout(() => prev.classList.remove("is-leaving"), 200);
  }
  next.classList.remove("is-leaving");
  next.classList.add("is-active");
  current = name;
  session.touch();
  const fn = SCREENS[name];
  if (fn) {
    try {
      fn(params);
    } catch (err) {
      console.error(err);
      toast("うまく ひらけませんでした");
    }
  }
}

export function currentScreen() {
  return current;
}

export function applySettings() {
  const size = state.settings.textSize || 1;
  document.documentElement.style.setProperty("--scale", String(size));
  audio.setEnabled(state.settings.sound !== false);
  speech.setEnabled(state.settings.speech !== false);
}

async function boot() {
  installPressFeedback((btn) => {
    audio.unlock();
    if (!btn.classList.contains("choice") && !btn.classList.contains("token")) audio.sfx.tap();
  });

  // どの画面でも data-go で移動できるようにする（戻る導線は常に同じ場所）
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (!btn) return;
    audio.sfx.close();
    go(btn.dataset.go);
  });

  applySettings();
  speech.init();
  document.addEventListener("speech-ready", () => {
    const b = $("#btn-speak");
    if (b) b.hidden = !(speech.available() && speech.isEnabled());
  });

  try {
    await loadManifest();
  } catch (err) {
    console.error(err);
    toast("もんだいが よみこめませんでした。もう一度 ひらいてね", 5000);
  }

  // 前に遊んだ枠があればそれを開けておく（起動1タップで続きから）
  const slots = meta().slots;
  if (slots.length) {
    openSlot(slots[slots.length - 1].slot);
    refreshUnlocks(units());
  }
  session.start();
  session.onChange(() => {
    if (current === "town") townScreen.refresh();
  });

  window.addEventListener("pagehide", saveNow);
  window.addEventListener("beforeunload", saveNow);

  go("start");

  // オフラインで遊べるようにする（この /study-game/ の中だけ）
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    try {
      await navigator.serviceWorker.register("sw.js?v=1");
    } catch {
      /* 使えなくてもゲームは動く */
    }
  }
}

boot();

// 画面のどこかで落ちても、黙って止まらないようにする
window.addEventListener("error", (e) => {
  console.error(e.error || e.message);
});

export { $$ };
