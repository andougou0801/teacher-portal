// 1日の時間の管理。
// ・1秒ごとに数えて、すぐ保存する（タブを閉じても巻きもどらない）
// ・画面がかくれたとき、60秒さわらなかったときは止める
// ・時間を使いきったら「れんしゅうモード」になり、ざいりょうも建物も増えない（延長はできない）
import { state, save, saveNow, bumpDeviceDay, newToday } from "./store.js";
import { dayKey, dayDiff } from "./util.js";
import { DEFAULT_MINUTES, DAILY_MATERIAL_CAP } from "./content.js";

let tick = 0;
let lastTouch = Date.now();
const listeners = new Set();

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* 1つが失敗しても他を止めない */
    }
  });
}

export function limitSec() {
  const t = state.teacher || {};
  const minutes = t.classTimer > 0 ? t.classTimer : t.minutes > 0 ? t.minutes : DEFAULT_MINUTES;
  return minutes * 60;
}

export function usedSec() {
  return state.today?.sec || 0;
}

export function remainSec() {
  return Math.max(0, limitSec() - usedSec());
}

export function isOver() {
  return remainSec() <= 0;
}

/** れんしゅうモード（時間を使いきったあと）＝ごほうびは出ないが、○はつく */
export function isPractice() {
  return isOver();
}

export function canGetMaterial() {
  return !isPractice() && (state.today.mats || 0) < DAILY_MATERIAL_CAP;
}

export function touch() {
  lastTouch = Date.now();
}

export function start() {
  stop();
  touch();
  tick = setInterval(() => {
    if (!state.today) return;
    if (document.hidden) return;
    if (Date.now() - lastTouch > 60000) return; // 60秒さわっていない＝止める
    if (state.today.day !== dayKey()) {
      // 時計を まえに もどされたときは、新しい1日に しない
      if (dayDiff(dayKey(), state.today.day) < 0) {
        state.today.sec = 24 * 3600;
        saveNow();
        emit();
        return;
      }
      // 日がかわったので、きょうの分をリセットする
      // 何もしていない日は 記録に のこさない
      if (state.today.items > 0) {
        state.days.push({
          d: state.today.day,
          items: state.today.items,
          ok: state.today.ok,
          newSkills: state.today.newSkills || [],
        });
        if (state.days.length > 60) state.days = state.days.slice(-60);
      }
      // ★形は store.js の newToday() に そろえる（ここで 手書きすると 中身が ずれる）
      state.today = newToday();
      saveNow();
      emit();
      return;
    }
    const was = isOver();
    state.today.sec = (state.today.sec || 0) + 1;
    // 端末ぜんたいの合計（枠を作り直して やり直すのを 見つけるため）。
    // 毎秒 書くと 古い端末では おもいので、5秒ごとに まとめて 書く。
    if (state.today.sec % 5 === 0) bumpDeviceDay(5);
    save("today");
    // おわりが とつぜん 来ると びっくりするので、2分前に 1回だけ 知らせる
    if (remainSec() === 120) {
      document.dispatchEvent(new CustomEvent("time-soon"));
    }
    if (!was && isOver()) emit();
    if (state.today.sec % 10 === 0) emit();
  }, 1000);
  document.addEventListener("pointerdown", touch, { passive: true });
  document.addEventListener("keydown", touch, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveNow();
    else touch();
  });
}

export function stop() {
  clearInterval(tick);
  tick = 0;
}

/**
 * じゅぎょうタイマー（せんせいモードでだけ差しかえ。終わったら元にもどる）
 * ★ここで「きょう つかった時間」を 0 にもどしてはいけない。
 *   もどすと、タイマーを 押すだけで 何時間でも 遊べてしまう（延長はできない、という決まりが こわれる）。
 */
export function setClassTimer(minutes) {
  state.teacher.classTimer = minutes | 0;
  saveNow();
  emit();
}

export function clearClassTimer() {
  state.teacher.classTimer = 0;
  saveNow();
  emit();
}
