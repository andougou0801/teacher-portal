// 2年で つかう 絵。figure.js から よばれる。
// 画像ファイルは 持たない（ぜんぶ その場で SVGを 組み立てる）。
const ink = "#2B2A28";
const line = "#D9CDB6";

function wrap(inner, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
}

/**
 * ひっ算（たて書きの けいさん）
 *   { kind:"vcalc", a:35, b:27, op:"+" }
 *   { kind:"vcalc", a:52, b:18, op:"-", answer:"34" }  answer を 入れると 下に 書く
 * ★2年の いちばん 大事な ところ（A(2)ア(ア)「筆算の仕方について理解する」）。
 *   くらいを たてに そろえて 見せる。けたが ずれると 筆算の いみが なくなるので、
 *   1けたぶんの はばを きめて 右づめで ならべる。
 */
function vcalc(f) {
  const a = String(f.a ?? "");
  const b = String(f.b ?? "");
  const ans = f.answer != null ? String(f.answer) : "";
  const op = f.op === "-" ? "−" : "+";
  const cols = Math.max(a.length, b.length, ans.length);
  const cw = 46; // 1けたの はば
  const padL = 56; // ＋ や − を おく ぶん
  const w = padL + cols * cw + 20;
  const rowH = 52;
  const h = rowH * (ans ? 3 : 2) + 34;
  const digits = (str, y) => {
    let s = "";
    [...str].forEach((ch, i) => {
      const col = cols - str.length + i;
      s += `<text x="${padL + col * cw + cw / 2}" y="${y}" font-size="40" font-weight="700" text-anchor="middle" fill="${ink}">${ch}</text>`;
    });
    return s;
  };
  let inner = digits(a, rowH - 8);
  inner += `<text x="${padL - 30}" y="${rowH * 2 - 8}" font-size="40" font-weight="700" text-anchor="middle" fill="${ink}">${op}</text>`;
  inner += digits(b, rowH * 2 - 8);
  // よこ線
  inner += `<line x1="12" y1="${rowH * 2 + 6}" x2="${w - 12}" y2="${rowH * 2 + 6}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  if (ans) inner += digits(ans, rowH * 3 - 2);
  // くらいの めやす（うすい たて線）
  for (let c = 1; c < cols; c++) {
    const x = padL + c * cw;
    inner += `<line x1="${x}" y1="10" x2="${x}" y2="${rowH * 2 + 2}" stroke="${line}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  }
  return wrap(inner, w, h);
}

/**
 * ひょう（数を 分けて 整理した 表）
 *   { kind:"table", head:["どうぶつ","かず"], rows:[["ねこ","5"],["いぬ","3"]] }
 * ★D(1)ア「簡単な表やグラフを用いて表したり読み取ったり」。
 */
function table(f) {
  const head = f.head || [];
  const rows = f.rows || [];
  const cols = Math.max(head.length, ...rows.map((r) => r.length), 1);
  const cw = Math.max(110, Math.min(170, Math.round(420 / cols)));
  const rh = 46;
  const w = cols * cw + 20;
  const h = (rows.length + 1) * rh + 20;
  let inner = `<rect x="10" y="10" width="${cols * cw}" height="${(rows.length + 1) * rh}" rx="8" fill="#FFFDF6" stroke="${ink}" stroke-width="3"/>`;
  inner += `<rect x="10" y="10" width="${cols * cw}" height="${rh}" fill="#FFF0C9"/>`;
  const cell = (txt, c, r, bold) =>
    `<text x="${10 + c * cw + cw / 2}" y="${10 + r * rh + rh / 2 + 9}" font-size="25" text-anchor="middle" fill="${ink}" font-weight="${bold ? 700 : 400}">${txt}</text>`;
  head.forEach((t, c) => (inner += cell(t, c, 0, true)));
  rows.forEach((row, r) => row.forEach((t, c) => (inner += cell(t, c, r + 1, false))));
  for (let c = 1; c < cols; c++) {
    inner += `<line x1="${10 + c * cw}" y1="10" x2="${10 + c * cw}" y2="${10 + (rows.length + 1) * rh}" stroke="${ink}" stroke-width="2"/>`;
  }
  for (let r = 1; r <= rows.length; r++) {
    inner += `<line x1="10" y1="${10 + r * rh}" x2="${10 + cols * cw}" y2="${10 + r * rh}" stroke="${ink}" stroke-width="2"/>`;
  }
  return wrap(inner, w, h);
}

/**
 * ものさし（cm と mm の めもり）
 *   { kind:"ruler", cm:8, mark:35 }   mark は mm（35mm＝3cm5mm）
 * ★C(1)ア「長さの単位（mm, cm, m）について知り，測定の意味を理解する」。
 */
function ruler(f) {
  const cm = Math.max(1, Math.min(12, f.cm | 0 || 8));
  const unit = 36; // 1cm の はば
  const w = cm * unit + 40;
  const h = 150;
  const y0 = 60;
  let inner = `<rect x="20" y="${y0}" width="${cm * unit}" height="44" fill="#FFF0C9" stroke="${ink}" stroke-width="3"/>`;
  for (let i = 0; i <= cm * 10; i++) {
    const x = 20 + (i * unit) / 10;
    const big = i % 10 === 0;
    const mid = i % 5 === 0;
    inner += `<line x1="${x.toFixed(1)}" y1="${y0}" x2="${x.toFixed(1)}" y2="${y0 + (big ? 22 : mid ? 15 : 9)}" stroke="${ink}" stroke-width="${big ? 2.5 : 1.5}"/>`;
    if (big) {
      inner += `<text x="${x.toFixed(1)}" y="${y0 + 38}" font-size="18" text-anchor="middle" fill="${ink}">${i / 10}</text>`;
    }
  }
  if (f.mark != null) {
    const mx = 20 + ((f.mark | 0) * unit) / 10;
    // はかる もの（テープ）を 0 から mark まで
    inner += `<rect x="20" y="${y0 - 34}" width="${(mx - 20).toFixed(1)}" height="24" rx="5" fill="#7FD4E8" stroke="${ink}" stroke-width="3"/>`;
    inner += `<line x1="${mx.toFixed(1)}" y1="${y0 - 40}" x2="${mx.toFixed(1)}" y2="${y0 + 26}" stroke="#E4564B" stroke-width="3" stroke-dasharray="5 4"/>`;
  }
  return wrap(inner, w, h);
}

/**
 * かさの ます（1L＝10dL）
 *   { kind:"liters", dl:14 }        14dL＝1L4dL
 *   { kind:"liters", dl:14, cap:10 } 1つの ますが 何dLか（きめないと 10dL）
 * ★C(1)ア「かさの単位（mL, dL, L）について知り…」。
 *   1Lますを いくつ ぶんか で 見せる。
 */
function liters(f) {
  const cap = Math.max(1, f.cap | 0 || 10);
  const dl = Math.max(0, f.dl | 0);
  const full = Math.floor(dl / cap);
  const rest = dl % cap;
  const boxes = full + (rest ? 1 : 0) || 1;
  const bw = 72;
  const bh = 110;
  const gap = 16;
  const w = Math.min(460, boxes * (bw + gap) + 20);
  const h = bh + 50;
  let inner = "";
  for (let i = 0; i < boxes; i++) {
    const x = 14 + i * (bw + gap);
    const n = i < full ? cap : rest;
    const fh = (bh - 8) * (n / cap);
    inner += `<rect x="${x}" y="${(14 + bh - fh).toFixed(1)}" width="${bw}" height="${fh.toFixed(1)}" fill="#7FD4E8"/>`;
    // めもり（1dLずつ）
    for (let k = 1; k < cap; k++) {
      const y = 14 + bh - (bh * k) / cap;
      inner += `<line x1="${x}" y1="${y.toFixed(1)}" x2="${x + (k % 5 === 0 ? bw : 16)}" y2="${y.toFixed(1)}" stroke="${ink}" stroke-width="1.5"/>`;
    }
    inner += `<rect x="${x}" y="14" width="${bw}" height="${bh}" rx="6" fill="none" stroke="${ink}" stroke-width="3.5"/>`;
    inner += `<text x="${x + bw / 2}" y="${h - 12}" font-size="20" text-anchor="middle" fill="${ink}">${n}dL</text>`;
  }
  return wrap(inner, w, h);
}

export const KINDS3 = { vcalc, table, ruler, liters };
