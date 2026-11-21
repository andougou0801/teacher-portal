// こまごました道具。
// 押した感じは pointerdown（見た目と音）、実際の動きは click に統一している。
// こうしないと、iPadで1回のタップが2回ぶんになることがある。

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** 1日の区切りは午前4時。夜ふかしの「もう1回」を作らないため。 */
export function dayKey(now = new Date()) {
  const d = new Date(now.getTime());
  if (d.getHours() < 4) d.setDate(d.getDate() - 1);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export function dayDiff(a, b) {
  const toTime = (k) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  };
  return Math.round((toTime(a) - toTime(b)) / 86400000);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let toastTimer = 0;
export function toast(message, ms = 2200) {
  const node = $("#toast");
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    node.hidden = true;
  }, ms);
}

/** 押した瞬間に沈む見た目をつける（全部のボタン共通） */
export function installPressFeedback(onPress) {
  const target = (e) => e.target.closest("button");
  document.addEventListener(
    "pointerdown",
    (e) => {
      const btn = target(e);
      if (!btn || btn.disabled) return;
      btn.classList.add("is-press");
      if (onPress) onPress(btn);
    },
    { passive: true },
  );
  const off = (e) => {
    const btn = target(e);
    if (btn) btn.classList.remove("is-press");
    document
      .querySelectorAll("button.is-press")
      .forEach((b) => b.classList.remove("is-press"));
  };
  document.addEventListener("pointerup", off, { passive: true });
  document.addEventListener("pointercancel", off, { passive: true });
  document.addEventListener("pointerleave", off, { passive: true });
}

/** まぜる（出題の順番を変えるため。報酬には使わない） */
export function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
