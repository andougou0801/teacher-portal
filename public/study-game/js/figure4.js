// 2年2学期で つかう 絵（かけ算・かたち）。figure.js から よばれる。
import { iconShape } from "./icons.js";

const ink = "#2B2A28";
const line = "#D9CDB6";

function wrap(inner, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
}

function at(name, x, y, size) {
  const s = size / 100;
  return `<g transform="translate(${x} ${y}) scale(${s})">${iconShape(name)}</g>`;
}

/**
 * かけ算の 絵（おなじ かずの まとまりが いくつ分か）
 *   { kind:"times", groups:4, each:3, icon:"apple" }
 * ★A(3)ア(ア)「乗法の意味について理解し，それが用いられる場合について知る」。
 *   かけ算は「おなじ かずずつ」が いのち。
 *   ばらばらに ならべると ただの たし算に 見えるので、
 *   **まとまりを はこで かこって** 見せる。
 */
function times(f) {
  const groups = Math.max(1, Math.min(9, f.groups | 0));
  const each = Math.max(1, Math.min(9, f.each | 0));
  const size = 34;
  const gap = 4;
  const pad = 8;
  const cols = Math.min(each, 5);
  const rows = Math.ceil(each / cols);
  const bw = cols * (size + gap) - gap + pad * 2;
  const bh = rows * (size + gap) - gap + pad * 2;
  const perRow = Math.min(groups, 4);
  const gRows = Math.ceil(groups / perRow);
  const gGap = 12;
  const w = perRow * (bw + gGap) - gGap + 20;
  const h = gRows * (bh + gGap) - gGap + 20;
  let inner = "";
  for (let g = 0; g < groups; g++) {
    const gx = 10 + (g % perRow) * (bw + gGap);
    const gy = 10 + Math.floor(g / perRow) * (bh + gGap);
    inner += `<rect x="${gx}" y="${gy}" width="${bw}" height="${bh}" rx="10" fill="#FFFDF6" stroke="${ink}" stroke-width="2.5"/>`;
    for (let i = 0; i < each; i++) {
      inner += at(f.icon, gx + pad + (i % cols) * (size + gap), gy + pad + Math.floor(i / cols) * (size + gap), size);
    }
  }
  return wrap(inner, w, h);
}

/** かたち 1つぶん（へいめんの 図形） */
function shape2d(name, x, y, s, color) {
  const S = (v) => (v * s).toFixed(1);
  const stroke = `fill="${color}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"`;
  if (name === "triangle") return `<path d="M${S(40)} ${S(8)} L${S(74)} ${S(70)} H${S(6)} Z" ${stroke} transform="translate(${x} ${y})"/>`;
  if (name === "rtriangle") {
    // ちょっかく三角形（右下が ちょっかく）
    return (
      `<path d="M${S(8)} ${S(8)} V${S(70)} H${S(72)} Z" ${stroke} transform="translate(${x} ${y})"/>` +
      `<path d="M${S(8)} ${S(58)} h${S(12)} v${S(12)}" fill="none" stroke="${ink}" stroke-width="2.5" transform="translate(${x} ${y})"/>`
    );
  }
  if (name === "square") return `<rect x="${S(12)}" y="${S(12)}" width="${S(56)}" height="${S(56)}" ${stroke} transform="translate(${x} ${y})"/>`;
  if (name === "rect") return `<rect x="${S(4)}" y="${S(20)}" width="${S(72)}" height="${S(40)}" ${stroke} transform="translate(${x} ${y})"/>`;
  if (name === "quad") {
    // ただの 四角形（へんの ながさが そろっていない）
    return `<path d="M${S(10)} ${S(16)} L${S(70)} ${S(8)} L${S(64)} ${S(70)} L${S(16)} ${S(60)} Z" ${stroke} transform="translate(${x} ${y})"/>`;
  }
  if (name === "pentagon") {
    return `<path d="M${S(40)} ${S(6)} L${S(74)} ${S(31)} L${S(61)} ${S(71)} H${S(19)} L${S(6)} ${S(31)} Z" ${stroke} transform="translate(${x} ${y})"/>`;
  }
  if (name === "circle") return `<circle cx="${S(40)}" cy="${S(40)}" r="${S(32)}" ${stroke} transform="translate(${x} ${y})"/>`;
  // まるい かど（四角形では ない）
  return `<rect x="${S(10)}" y="${S(16)}" width="${S(60)}" height="${S(48)}" rx="${S(22)}" ${stroke} transform="translate(${x} ${y})"/>`;
}

/**
 * へいめんの かたち（三角形・四角形・正方形・長方形・ちょっかく三角形）
 *   { kind:"shapes2d", items:["triangle","square","rect","quad"], mark:1 }
 * つかえる 名前：triangle（三角形）／rtriangle（ちょっかく三角形）／
 *   square（正方形）／rect（長方形）／quad（ただの四角形）／
 *   pentagon（五角形）／circle（まる）／round（かどが まるい）
 * ★B(1)ア(ア)(イ)。「へんの かず」「かどの かず」で 見分けるのが ねらいなので、
 *   まちがいの ほうにも ちゃんと した かたちを 出す。
 */
function shapes2d(f) {
  const items = (f.items || []).slice(0, 4);
  const s = 1.1;
  const slot = 100;
  const w = Math.max(200, items.length * slot + 20);
  const h = 110;
  const colors = ["#7FD4E8", "#F2B23C", "#5BBF6A", "#E4564B"];
  let inner = "";
  items.forEach((name, i) => {
    const x = 12 + i * slot;
    if (i === f.mark) {
      inner += `<rect x="${x - 4}" y="6" width="${slot - 8}" height="${h - 14}" rx="12" fill="#FFF0C9" stroke="#E4564B" stroke-width="4"/>`;
    }
    inner += shape2d(name, x, 10, s, colors[i % colors.length]);
  });
  return wrap(inner, w, h);
}

/**
 * ますめの 上の かたち（かどの かずを 数えるとき）
 *   { kind:"grid", cols:5, rows:4, path:"0,0 4,0 4,3 0,3" }
 * ★B(1)ア「図形を構成する要素に着目し」。ますめが あると へんと かどが 数えられる。
 */
function grid(f) {
  const cols = Math.max(1, Math.min(10, f.cols | 0 || 5));
  const rows = Math.max(1, Math.min(8, f.rows | 0 || 4));
  const cell = 34;
  const w = cols * cell + 24;
  const h = rows * cell + 24;
  let inner = "";
  for (let r = 0; r <= rows; r++) {
    inner += `<line x1="12" y1="${12 + r * cell}" x2="${12 + cols * cell}" y2="${12 + r * cell}" stroke="${line}" stroke-width="1.5"/>`;
  }
  for (let c = 0; c <= cols; c++) {
    inner += `<line x1="${12 + c * cell}" y1="12" x2="${12 + c * cell}" y2="${12 + rows * cell}" stroke="${line}" stroke-width="1.5"/>`;
  }
  if (f.path) {
    const pts = String(f.path)
      .trim()
      .split(/\s+/)
      .map((p) => p.split(",").map(Number))
      .filter((p) => p.length === 2 && p.every((n) => !Number.isNaN(n)));
    if (pts.length >= 3) {
      const d = pts.map((p, i) => `${i ? "L" : "M"}${12 + p[0] * cell} ${12 + p[1] * cell}`).join(" ") + " Z";
      inner += `<path d="${d}" fill="#7FD4E8" fill-opacity="0.75" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/>`;
      for (const p of pts) {
        inner += `<circle cx="${12 + p[0] * cell}" cy="${12 + p[1] * cell}" r="5" fill="#FFFFFF" stroke="${ink}" stroke-width="2.5"/>`;
      }
    }
  }
  return wrap(inner, w, h);
}

export const KINDS4 = { times, shapes2d, grid };
