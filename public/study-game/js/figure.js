// 問題の絵。JSONの figure の指示どおりにSVGを組み立てる（画像ファイルを持たない）。
import { iconShape, icon } from "./icons.js";
import { KINDS2 } from "./figure2.js";
import { KINDS3 } from "./figure3.js";
import { KINDS4 } from "./figure4.js";

const ink = "#2B2A28";
const line = "#D9CDB6";

function wrap(inner, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
}

function at(name, x, y, size) {
  const s = size / 100;
  return `<g transform="translate(${x} ${y}) scale(${s})">${iconShape(name)}</g>`;
}

/** ばらばらに置く位置（毎回同じ場所になるように、数から決める） */
function scatterPos(i, count, w, h, size) {
  const cols = Math.ceil(Math.sqrt(count));
  const cell = Math.min((w - 20) / cols, (h - 20) / Math.ceil(count / cols));
  const col = i % cols;
  const row = Math.floor(i / cols);
  const jitterX = ((i * 37) % 13) - 6;
  const jitterY = ((i * 53) % 11) - 5;
  return [
    10 + col * cell + (cell - size) / 2 + jitterX,
    10 + row * cell + (cell - size) / 2 + jitterY,
  ];
}

function dots(f) {
  const n = Math.max(0, f.count | 0);
  if (f.scatter) {
    const w = 400;
    const h = n > 6 ? 230 : 180;
    let inner = "";
    for (let i = 0; i < n; i++) {
      const [x, y] = scatterPos(i, n, w, h, 68);
      inner += at(f.icon, x, y, 68);
    }
    return wrap(inner, w, h);
  }
  const perRow = 5;
  const size = n > 5 ? 64 : 72;
  const rows = Math.ceil(n / perRow) || 1;
  const w = 400;
  const h = rows * (size + 12) + 8;
  let inner = "";
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / perRow);
    const c = i % perRow;
    const inThisRow = Math.min(perRow, n - r * perRow);
    const rowW = inThisRow * (size + 8) - 8;
    const x0 = (w - rowW) / 2;
    inner += at(f.icon, x0 + c * (size + 8), 4 + r * (size + 12), size);
  }
  return wrap(inner, w, h);
}

function row(f) {
  const icons = f.icons || [];
  const size = icons.length > 5 ? 58 : 66;
  const w = 400;
  const gap = 6;
  const rowW = icons.length * (size + gap) - gap;
  const x0 = (w - rowW) / 2;
  let inner = "";
  icons.forEach((name, i) => {
    inner += at(name, x0 + i * (size + gap), 12, size);
  });
  const y = size + 28;
  if (f.dir === "back") {
    inner += `<path d="M${x0 + rowW} ${y} H${x0} l16 -10 M${x0} ${y} l16 10" stroke="${ink}" stroke-width="4" fill="none" stroke-linejoin="round"/>
      <text x="${x0 + rowW - 4}" y="${y + 26}" font-size="20" text-anchor="end" fill="${ink}">うしろ</text>`;
  } else {
    inner += `<path d="M${x0} ${y} H${x0 + rowW} l-16 -10 M${x0 + rowW} ${y} l-16 10" stroke="${ink}" stroke-width="4" fill="none" stroke-linejoin="round"/>
      <text x="${x0 + 4}" y="${y + 26}" font-size="20" fill="${ink}">まえ</text>`;
  }
  return wrap(inner, w, y + 34);
}

function tenframe(f) {
  const total = f.total | 0;
  const filled = f.filled | 0;
  const perRow = total > 5 ? 5 : total;
  const rows = Math.ceil(total / perRow);
  const cell = 56;
  const w = perRow * cell + 20;
  const h = rows * cell + 20;
  let inner = "";
  for (let i = 0; i < total; i++) {
    const c = i % perRow;
    const r = Math.floor(i / perRow);
    const x = 10 + c * cell;
    const y = 10 + r * cell;
    inner += `<rect x="${x}" y="${y}" width="${cell - 6}" height="${cell - 6}" rx="10" fill="#fff" stroke="${line}" stroke-width="3"/>`;
    if (i < filled) {
      inner += `<circle cx="${x + (cell - 6) / 2}" cy="${y + (cell - 6) / 2}" r="17" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>`;
    }
  }
  return wrap(inner, w, h);
}

function twoGroups(f) {
  const a = f.a | 0;
  const b = f.b | 0;
  const size = 62;
  const gap = 6;
  const cols = (n) => (n <= 2 ? Math.max(1, n) : n <= 4 ? 2 : 3);
  const rows = (n) => Math.ceil(Math.max(n, 1) / cols(n));
  const blockW = (n) => cols(n) * (size + gap) - gap;
  // ★はばは 中身から 決める。
  //   前は 440 に 決めうちで、5こ以上の まとまりが 左右 18pxずつ 切れていた
  //   （85問のうち 43問が そうなっていた）。
  const pad = 10;
  const signW = 64;
  const wa = blockW(a);
  const wb = blockW(b);
  const w = pad * 2 + wa + signW + wb;
  const h = Math.max(rows(a), rows(b)) * (size + gap) + 16;
  const drawGroup = (n, x0) => {
    const c = cols(n);
    let s2 = "";
    for (let i = 0; i < n; i++) {
      s2 += at(f.icon, x0 + (i % c) * (size + gap), 8 + Math.floor(i / c) * (size + gap), size);
    }
    return s2;
  };
  const signX = pad + wa + signW / 2;
  let inner = drawGroup(a, pad) + drawGroup(b, pad + wa + signW);
  inner += `<path d="M${signX - 16} ${h / 2} h32 M${signX} ${h / 2 - 16} v32" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`;
  return wrap(inner, w, h);
}

function takeAway(f) {
  const total = f.total | 0;
  const gone = f.gone | 0;
  const size = total > 5 ? 56 : 66;
  const perRow = 5;
  const rows = Math.ceil(total / perRow) || 1;
  const w = 400;
  const h = rows * (size + 10) + 10;
  let inner = "";
  for (let i = 0; i < total; i++) {
    const c = i % perRow;
    const r = Math.floor(i / perRow);
    const inThisRow = Math.min(perRow, total - r * perRow);
    const rowW = inThisRow * (size + 6) - 6;
    const x = (w - rowW) / 2 + c * (size + 6);
    const y = 6 + r * (size + 10);
    const isGone = i < gone;
    inner += `<g opacity="${isGone ? 0.3 : 1}">${at(f.icon, x, y, size)}</g>`;
    if (isGone) {
      inner += `<path d="M${x + 8} ${y + 8} l${size - 16} ${size - 16} M${x + size - 8} ${y + 8} l${-(size - 16)} ${size - 16}" stroke="#D94B3F" stroke-width="5" stroke-linecap="round"/>`;
    }
  }
  return wrap(inner, w, h);
}

function twoRows(f) {
  const size = 52;
  const w = 400;
  const h = 2 * (size + 16) + 10;
  const draw = (name, n, y) => {
    let s = "";
    for (let i = 0; i < n; i++) s += at(name, 16 + i * (size + 4), y, size);
    return s;
  };
  let inner = draw(f.iconA, f.a | 0, 6) + draw(f.iconB, f.b | 0, 6 + size + 16);
  return wrap(inner, w, h);
}

function sticks(f) {
  const lens = f.lengths || [100, 100];
  const offs = f.offsets || [0, 0];
  const w = 430;
  const h = 150;
  const scale = 1.6;
  const base = 76; // ひだりに「うえ・した」の文字を 入れるぶん
  let inner = `<line x1="${base}" y1="20" x2="${base}" y2="${h - 20}" stroke="${line}" stroke-width="3" stroke-dasharray="6 6"/>`;
  lens.forEach((len, i) => {
    const y = 40 + i * 54;
    const x = base + (offs[i] || 0);
    const width = len * scale;
    inner += `<rect x="${x}" y="${y}" width="${Math.min(width, w - x - 16)}" height="26" rx="13" fill="${i === 0 ? "#F2B23C" : "#7FD4E8"}" stroke="${ink}" stroke-width="3"/>`;
    inner += `<text x="${base - 8}" y="${y + 20}" font-size="20" text-anchor="end" fill="${ink}">${i === 0 ? "うえ" : "した"}</text>`;
  });
  return wrap(inner, w, h);
}

function clips(f) {
  const n = Math.max(1, f.count | 0);
  const unit = 36;
  const w = 400;
  const h = 150;
  const barW = n * unit;
  const x0 = (w - barW) / 2;
  let inner = `<rect x="${x0}" y="30" width="${barW}" height="28" rx="6" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>
    <path d="M${x0 + barW} 30 l16 14 -16 14z" fill="#E4564B" stroke="${ink}" stroke-width="3"/>`;
  for (let i = 0; i < n; i++) {
    inner += `<g transform="translate(${x0 + i * unit + 2} 76) scale(0.32)">${iconShape("clip")}</g>`;
    inner += `<line x1="${x0 + i * unit}" y1="30" x2="${x0 + i * unit}" y2="74" stroke="${line}" stroke-width="2" stroke-dasharray="4 4"/>`;
  }
  inner += `<line x1="${x0 + barW}" y1="30" x2="${x0 + barW}" y2="74" stroke="${line}" stroke-width="2" stroke-dasharray="4 4"/>`;
  return wrap(inner, w, h);
}

function graph(f) {
  const rows = f.rows || [];
  const size = 36;
  const w = 400;
  const h = rows.length * (size + 10) + 16;
  let inner = "";
  rows.forEach((r, i) => {
    const y = 8 + i * (size + 10);
    inner += at(r.icon, 6, y, size);
    inner += `<line x1="${size + 14}" y1="${y + size}" x2="${w - 8}" y2="${y + size}" stroke="${line}" stroke-width="2"/>`;
    for (let k = 0; k < r.count; k++) {
      inner += `<rect x="${size + 18 + k * 30}" y="${y + 4}" width="26" height="${size - 6}" rx="6" fill="#5BBF6A" stroke="${ink}" stroke-width="2.5"/>`;
    }
  });
  return wrap(inner, w, h);
}

function numline(f) {
  const from = f.from | 0;
  const to = f.to | 0;
  const w = 400;
  const h = 110;
  const span = to - from || 1;
  const step = (w - 60) / span;
  let inner = `<line x1="30" y1="60" x2="${w - 30}" y2="60" stroke="${ink}" stroke-width="4"/>`;
  for (let v = from; v <= to; v++) {
    const x = 30 + (v - from) * step;
    const isMark = v === (f.mark | 0);
    inner += `<line x1="${x}" y1="52" x2="${x}" y2="68" stroke="${ink}" stroke-width="3"/>`;
    inner += `<text x="${x}" y="${92}" font-size="22" text-anchor="middle" fill="${ink}" font-weight="${isMark ? 700 : 400}">${v}</text>`;
    if (isMark) {
      inner += `<circle cx="${x}" cy="60" r="14" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>
        <text x="${x}" y="${34}" font-size="22" text-anchor="middle" fill="${ink}">▼</text>`;
    }
  }
  return wrap(inner, w, h);
}

const KINDS = {
  dots,
  row,
  tenframe,
  "two-groups": twoGroups,
  "take-away": takeAway,
  "two-rows": twoRows,
  sticks,
  clips,
  graph,
  numline,
  ...KINDS2,
  ...KINDS3,
  ...KINDS4,
};

/** 知らない kind は何も描かない（その1問が解けなくならないように、絵だけ省く） */
export function renderFigure(f) {
  if (!f || !f.kind) return "";
  const fn = KINDS[f.kind];
  if (!fn) return "";
  try {
    return fn(f);
  } catch {
    return "";
  }
}

export { icon };
