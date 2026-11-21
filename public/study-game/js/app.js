// 起動と画面の切りかえ。
import { $, $$, installPressFeedback, toast } from "./util.js";
import * as audio from "./audio.js";
import * as speech from "./speech.js";
import { state, saveNow } from "./store.js";
import { loadManifest } from "./data.js";
import * as session from "./session.js";

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
  // せんせいモードから はなれたら、もう一度 あんしょうばんごうが いるようにする
  if (current === "teacher" && name !== "teacher") settingsScreen.lockTeacher();
  const prev = $(`#app .screen.is-active`);
  if (prev && prev !== next) {
    prev.classList.remove("is-active", "is-in");
    prev.classList.add("is-leaving");
    setTimeout(() => prev.classList.remove("is-leaving"), 200);
  }
  next.classList.remove("is-leaving", "is-in");
  next.classList.add("is-active");
  // 1コマ おいてから 動かす（同じコマだと アニメーションが 動かない）。
  // ★タブが うしろに あるときは requestAnimationFrame が 止まるので、
  //   タイマーでも 同じことを する。これが ないと 画面が まっ白のままになる。
  let shown = false;
  const showIt = () => {
    if (shown) return;
    shown = true;
    next.classList.add("is-in");
  };
  requestAnimationFrame(() => requestAnimationFrame(showIt));
  setTimeout(showIt, 60);
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

  // ★起動しただけでは だれの記録も 開かない。
  //   自動で開くと、つぎに つかう子に 前の子の まち・きろくが 見えてしまう。
  //   「はじめの画面」で 自分の ばんごうを 1回 おせば 続きから はじまる。
  session.start();
  session.onChange(() => {
    if (current === "town") townScreen.refresh();
  });
  document.addEventListener("time-soon", () => {
    toast("あと 2ふんで きょうは おしまい。あわてなくて だいじょうぶ", 4000);
    audio.sfx.close();
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
