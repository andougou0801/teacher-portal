// 1日の時間の管理。
// ・1秒ごとに数えて、すぐ保存する（タブを閉じても巻きもどらない）
// ・画面がかくれたとき、60秒さわらなかったときは止める
// ・時間を使いきったら「れんしゅうモード」になり、ざいりょうも建物も増えない（延長はできない）
import { state, save, saveNow } from "./store.js";
import { dayKey } from "./util.js";
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
      // 日がかわったので、きょうの分をリセットする
      state.days.push({
        d: state.today.day,
        items: state.today.items,
        ok: state.today.ok,
        newSkills: state.today.newSkills || [],
      });
      if (state.days.length > 60) state.days = state.days.slice(-60);
      state.today = {
        day: dayKey(),
        sec: 0,
        items: 0,
        ok: 0,
        mats: 0,
        stages: {},
        breakDone: false,
        newSkills: [],
        hardest: null,
        finished: false,
        built: [],
      };
      saveNow();
      emit();
      return;
    }
    const was = isOver();
    state.today.sec = (state.today.sec || 0) + 1;
    save("today");
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

/** じゅぎょうタイマー（せんせいモードでだけ差しかえ。終わったら元にもどる） */
export function setClassTimer(minutes) {
  state.teacher.classTimer = minutes | 0;
  state.today.sec = 0;
  state.today.finished = false;
  saveNow();
  emit();
}

export function clearClassTimer() {
  state.teacher.classTimer = 0;
  saveNow();
  emit();
}
