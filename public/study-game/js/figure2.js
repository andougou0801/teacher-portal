// 2学期で つかう 絵。figure.js から よばれる。
// 画像ファイルは 持たない（ぜんぶ その場で SVGを 組み立てる）。
import { iconShape } from "./icons.js";

const ink = "#2B2A28";

function wrap(inner, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
}

function at(name, x, y, size) {
  const s = size / 100;
  return `<g transform="translate(${x} ${y}) scale(${s})">${iconShape(name)}</g>`;
}

/**
 * とけい
 *   1年：{ kind:"clock", hour:3, half:true }   なんじ／なんじはん だけ
 *   2年：{ kind:"clock", hour:3, min:25 }      なんじなんぷん（C(2)ア「日，時，分」）
 * ★min を かくと 1分きざみで 読める。half は min:30 と おなじ。
 *   2年からは 5分ごとの めもりの 数字も 出す（長いはりを 読むため）。
 */
function clock(f) {
  const hour = (((f.hour | 0) + 11) % 12) + 1;
  const hasMin = typeof f.min === "number";
  const min = hasMin ? Math.max(0, Math.min(59, f.min | 0)) : f.half ? 30 : 0;
  const cx = 150;
  const cy = 150;
  const R = 118;
  let inner = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#FFFDF6" stroke="${ink}" stroke-width="6"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const big = i % 3 === 0;
    const r1 = R - (big ? 18 : 11);
    inner += `<line x1="${(cx + Math.cos(a) * r1).toFixed(1)}" y1="${(cy + Math.sin(a) * r1).toFixed(1)}" x2="${(cx + Math.cos(a) * (R - 4)).toFixed(1)}" y2="${(cy + Math.sin(a) * (R - 4)).toFixed(1)}" stroke="${ink}" stroke-width="${big ? 5 : 3}" stroke-linecap="round"/>`;
    if (big) {
      const tr = R - 40;
      inner += `<text x="${(cx + Math.cos(a) * tr).toFixed(1)}" y="${(cy + Math.sin(a) * tr + 10).toFixed(1)}" font-size="30" font-weight="700" text-anchor="middle" fill="${ink}">${i}</text>`;
    }
  }
  // ★2年は 長いはりを 読むので、5分ごとの 数字を 小さく そえる
  if (hasMin) {
    for (let i = 0; i < 12; i++) {
      const a = ((i * 30 - 90) * Math.PI) / 180;
      const tr = R - 13;
      inner += `<text x="${(cx + Math.cos(a) * tr).toFixed(1)}" y="${(cy + Math.sin(a) * tr + 5).toFixed(1)}" font-size="13" text-anchor="middle" fill="#9A8F7B">${i * 5}</text>`;
    }
  }
  // みじかい はり（じ）。ふんの ぶんだけ つぎの数字へ すすむ
  const ha = ((((hour % 12) + min / 60) * 30 - 90) * Math.PI) / 180;
  inner += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(ha) * 60).toFixed(1)}" y2="${(cy + Math.sin(ha) * 60).toFixed(1)}" stroke="${ink}" stroke-width="12" stroke-linecap="round"/>`;
  // ながい はり（ふん）
  const ma = ((min * 6 - 90) * Math.PI) / 180;
  inner += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(ma) * 92).toFixed(1)}" y2="${(cy + Math.sin(ma) * 92).toFixed(1)}" stroke="#E4564B" stroke-width="8" stroke-linecap="round"/>`;
  inner += `<circle cx="${cx}" cy="${cy}" r="10" fill="${ink}"/>`;
  return wrap(inner, 300, 300);
}

/**
 * かさくらべ（コップ なんばいぶん）
 *   { kind:"cups", a:5, b:3 }
 * ★入れものの かたちで まよわせない。コップの 数で くらべる
 *   （指導要領 C(1)ア(イ)「大きさを単位として、その幾つ分か」）。
 */
function cups(f) {
  const cw = 34;
  let inner = "";
  const rows = [
    [Math.max(0, f.a | 0), 26, "#F2B23C", f.nameA || "あか"],
    [Math.max(0, f.b | 0), 104, "#7FD4E8", f.nameB || "あお"],
  ];
  for (const [n, y, color, name] of rows) {
    inner += `<text x="8" y="${y + 26}" font-size="22" fill="${ink}">${name}</text>`;
    for (let i = 0; i < n; i++) {
      const x = 70 + i * (cw + 6);
      inner += `<path d="M${x} ${y} l4 34 h${cw - 8} l4 -34 z" fill="${color}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
    }
  }
  return wrap(inner, 400, 170);
}

/**
 * 入れものの 水の かさを じかに くらべる
 *   { kind:"vessels", a:70, b:40 }   a・b は 水の たかさ（0〜100）
 * ★同じ かたちの 入れものに する。かたちが ちがうと
 *   「たかい ほうが おおい」が 成り立たなくなり、1年生には むずかしすぎる。
 */
function vessels(f) {
  const bw = 96;
  const bh = 140;
  let inner = "";
  const rows = [
    [Math.max(0, Math.min(100, f.a | 0)), 34, f.nameA || "あか"],
    [Math.max(0, Math.min(100, f.b | 0)), 190, f.nameB || "あお"],
  ];
  for (const [v, x, name] of rows) {
    const fh = ((bh - 8) * v) / 100;
    inner += `<rect x="${x}" y="${(30 + bh - fh).toFixed(1)}" width="${bw}" height="${fh.toFixed(1)}" fill="#7FD4E8"/>`;
    inner += `<rect x="${x}" y="30" width="${bw}" height="${bh}" rx="8" fill="none" stroke="${ink}" stroke-width="4"/>`;
    inner += `<text x="${x + bw / 2}" y="190" font-size="22" text-anchor="middle" fill="${ink}">${name}</text>`;
  }
  return wrap(inner, 320, 200);
}

/**
 * ひろさくらべ（ます なんこぶん）
 *   { kind:"area", a:6, b:8 }
 */
function area(f) {
  const cell = 26;
  const block = (n, x0, y0, color) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const c = i % 4;
      const r = Math.floor(i / 4);
      s += `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell}" height="${cell}" fill="${color}" stroke="${ink}" stroke-width="2.5"/>`;
    }
    return s;
  };
  let inner = `<text x="72" y="24" font-size="22" text-anchor="middle" fill="${ink}">${f.nameA || "あか"}</text>`;
  inner += `<text x="282" y="24" font-size="22" text-anchor="middle" fill="${ink}">${f.nameB || "あお"}</text>`;
  inner += block(Math.max(0, f.a | 0), 20, 36, "#F2B23C");
  inner += block(Math.max(0, f.b | 0), 230, 36, "#7FD4E8");
  return wrap(inner, 400, 170);
}

/** かたち 1つぶん（はこ・つつ・ボール・さんかくのはこ） */
function solid(name, x, y, s) {
  const S = (v) => (v * s).toFixed(1);
  if (name === "tube") {
    return `<g transform="translate(${x} ${y})">
      <rect x="${S(10)}" y="${S(16)}" width="${S(56)}" height="${S(58)}" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>
      <ellipse cx="${S(38)}" cy="${S(74)}" rx="${S(28)}" ry="${S(10)}" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>
      <ellipse cx="${S(38)}" cy="${S(16)}" rx="${S(28)}" ry="${S(10)}" fill="#FFE08A" stroke="${ink}" stroke-width="3"/>
    </g>`;
  }
  if (name === "ball") {
    return `<g transform="translate(${x} ${y})">
      <circle cx="${S(38)}" cy="${S(45)}" r="${S(30)}" fill="#E4564B" stroke="${ink}" stroke-width="3"/>
      <path d="M${S(16)} ${S(34)} q${S(22)} ${S(12)} ${S(44)} 0" fill="none" stroke="${ink}" stroke-width="2.5"/>
    </g>`;
  }
  if (name === "prism") {
    return `<g transform="translate(${x} ${y})">
      <path d="M${S(38)} ${S(14)} L${S(68)} ${S(66)} H${S(8)} Z" fill="#5BBF6A" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${S(38)} ${S(14)} L${S(50)} ${S(22)} L${S(78)} ${S(70)} H${S(68)} Z" fill="#8FD79B" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    </g>`;
  }
  return `<g transform="translate(${x} ${y})">
    <rect x="${S(8)}" y="${S(26)}" width="${S(52)}" height="${S(44)}" fill="#7FD4E8" stroke="${ink}" stroke-width="3"/>
    <path d="M${S(8)} ${S(26)} l${S(14)} -${S(14)} h${S(52)} l-${S(14)} ${S(14)} z" fill="#B7E6F4" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${S(60)} ${S(26)} l${S(14)} -${S(14)} v${S(44)} l-${S(14)} ${S(14)} z" fill="#9BDCEE" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
  </g>`;
}

/**
 * かたち（はこ・つつ・ボール・さんかくのはこ）
 *   { kind:"solids", items:["box","tube","ball","prism"] }
 */
function solids(f) {
  const items = (f.items || []).slice(0, 4);
  const slot = 100;
  let inner = "";
  items.forEach((name, i) => {
    inner += solid(name, 14 + i * slot, 16, 1.25);
  });
  return wrap(inner, Math.max(200, items.length * slot + 20), 130);
}

/**
 * ものの いち（まえ・うしろ／みぎ・ひだり）
 *   { kind:"place", icons:["neko","inu","tori"], mark:1, head:"まえ", tail:"うしろ" }
 * ★どちらが「まえ」かを 画面に 書く。書かないと 子どもは まよう。
 */
function place(f) {
  if (f.dir === "v") return placeV(f);
  const list = (f.icons || []).slice(0, 6);
  const size = 56;
  const gap = 18;
  const w = Math.max(300, list.length * (size + gap) + 140);
  const h = 130;
  const x0 = 70;
  let inner = `<text x="30" y="${h / 2 + 8}" font-size="22" text-anchor="middle" fill="${ink}">${f.head || "まえ"}</text>`;
  list.forEach((name, i) => {
    const x = x0 + i * (size + gap);
    if (i === f.mark) {
      inner += `<rect x="${x - 6}" y="24" width="${size + 12}" height="${size + 12}" rx="14" fill="#FFF0C9" stroke="#E4564B" stroke-width="4"/>`;
    }
    inner += at(name, x, 30, size);
  });
  inner += `<text x="${w - 30}" y="${h / 2 + 8}" font-size="22" text-anchor="middle" fill="${ink}">${f.tail || "うしろ"}</text>`;
  return wrap(inner, w, h);
}

/**
 * ものの いち（うえと した）。place の たて向き。
 *   { kind:"place", dir:"v", icons:["cat","dog","rabbit"], mark:1 }
 * ★よこ1れつの 絵に「うえ」「した」と 書くと、1年生は 上下を とりちがえる。
 *   うえ・した を きくときは、ほんとうに たてに ならべる。
 */
function placeV(f) {
  const list = (f.icons || []).slice(0, 6);
  const size = 54;
  const gap = 10;
  const w = 300;
  const y0 = 40;
  const h = y0 + list.length * (size + gap) + 34;
  const cx = w / 2;
  let inner = `<text x="${cx}" y="26" font-size="22" text-anchor="middle" fill="${ink}">${f.head || "うえ"}</text>`;
  list.forEach((name, i) => {
    const y = y0 + i * (size + gap);
    if (i === f.mark) {
      inner += `<rect x="${cx - size / 2 - 8}" y="${y - 6}" width="${size + 16}" height="${size + 12}" rx="14" fill="#FFF0C9" stroke="#E4564B" stroke-width="4"/>`;
    }
    inner += at(name, cx - size / 2, y, size);
  });
  inner += `<text x="${cx}" y="${h - 8}" font-size="22" text-anchor="middle" fill="${ink}">${f.tail || "した"}</text>`;
  return wrap(inner, w, h);
}

/**
 * 10の まとまりと ばら（おおきい かず）
 *   { kind:"blocks10", tens:3, ones:4 }
 */
function blocks10(f) {
  const tens = Math.max(0, Math.min(12, f.tens | 0));
  const ones = Math.max(0, Math.min(9, f.ones | 0));
  const cw = 22;
  let inner = "";
  for (let t = 0; t < tens; t++) {
    const x = 14 + (t % 6) * (cw + 14);
    const y = 12 + Math.floor(t / 6) * 78;
    for (let k = 0; k < 10; k++) {
      inner += `<rect x="${x}" y="${y + k * 6}" width="${cw}" height="6" fill="#F2B23C" stroke="${ink}" stroke-width="1.6"/>`;
    }
    inner += `<rect x="${x}" y="${y}" width="${cw}" height="60" fill="none" stroke="${ink}" stroke-width="3"/>`;
  }
  for (let o = 0; o < ones; o++) {
    inner += `<rect x="${260 + (o % 5) * 26}" y="${14 + Math.floor(o / 5) * 26}" width="20" height="20" fill="#7FD4E8" stroke="${ink}" stroke-width="2.5"/>`;
  }
  return wrap(inner, 420, 170);
}

/**
 * かたちづくり（いろいた・ます）
 *   { kind:"tiles", pattern:["1a","b."], color:"#F2B23C" }
 * 1ます＝1もじ。
 *   "1" ■ぜんぶ／"a" ◣ひだり下／"b" ◥みぎ上／"c" ◤ひだり上／"d" ◢みぎ下／"." なし
 * ★1年生の「いろいた」は 正方形を ななめに 半分に した さんかく。
 *   それを ならべて かたちを 作る（指導要領 B(1)ア(イ)）。
 */
function tiles(f) {
  const pat = (f.pattern || []).slice(0, 6);
  const cell = 46;
  const cols = Math.max(1, ...pat.map((r) => r.length));
  const w = Math.max(160, cols * cell + 24);
  const h = Math.max(100, pat.length * cell + 24);
  const color = f.color || "#F2B23C";
  let inner = "";
  pat.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      const x = 12 + c * cell;
      const y = 12 + r * cell;
      const e = cell;
      if (ch === ".") return;
      let d = null;
      if (ch === "1") d = `M${x} ${y} h${e} v${e} h-${e} z`;
      if (ch === "a") d = `M${x} ${y} v${e} h${e} z`;
      if (ch === "b") d = `M${x} ${y} h${e} v${e} z`;
      if (ch === "c") d = `M${x} ${y} h${e} L${x} ${y + e} z`;
      if (ch === "d") d = `M${x + e} ${y} v${e} h-${e} z`;
      if (d) inner += `<path d="${d}" fill="${color}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
    });
  });
  // うすい ますめ（どこに おくか わかるように）
  let gridSvg = "";
  for (let r = 0; r <= pat.length; r++) {
    gridSvg += `<line x1="12" y1="${12 + r * cell}" x2="${12 + cols * cell}" y2="${12 + r * cell}" stroke="#E4D9C4" stroke-width="1.5"/>`;
  }
  for (let c = 0; c <= cols; c++) {
    gridSvg += `<line x1="${12 + c * cell}" y1="12" x2="${12 + c * cell}" y2="${12 + pat.length * cell}" stroke="#E4D9C4" stroke-width="1.5"/>`;
  }
  return wrap(gridSvg + inner, w, h);
}

export const KINDS2 = { clock, cups, vessels, area, solids, place, blocks10, tiles };
