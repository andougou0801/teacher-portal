// 絵はぜんぶ自分で描く（SVG）。画像ファイルは置かない。
// どれも 100×100 の箱の中に描く。有名なキャラクターに似せない、オリジナルの形。
//
// もやもや（モンスター）と、あとから足した たてものの形は `moya-art.js` にある。
// 12体を「シルエット・頭の上のもの・おなかの印」で見分けられるように描き直したもの。
import { moyaArt, MOYA_NAMES_12, BUILDING_ART_FN } from "./moya-art.js";
import { BUILDING_ART_M2 } from "./building-art-m2.js";
import { BUILDING_ART_M3 } from "./building-art-m3.js";
import { moyaArtJp, MOYA_NAMES_JP, MOYA_ART_JP } from "./moya-art-jp.js";
import { moyaArtM2, MOYA_NAMES_M2, MOYA_ART_M2 } from "./moya-art-m2.js";
import { moyaArtM3, MOYA_NAMES_M3, MOYA_ART_M3 } from "./moya-art-m3.js";
import { moyaArtJp2, MOYA_NAMES_JP2, MOYA_ART_JP2 } from "./moya-art-jp2.js";
import { moyaArtJp3, MOYA_NAMES_JP3, MOYA_ART_JP3 } from "./moya-art-jp3.js";

const ink = "#2B2A28";

function svg(inner, size = 100) {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}

/* ================= もののえ ================= */
const SHAPES = {
  apple: `<path d="M50 24c-10 0-22 8-22 24 0 18 12 30 22 30s22-12 22-30c0-16-12-24-22-24z" fill="#E4564B" stroke="${ink}" stroke-width="3"/>
    <path d="M50 26V14" stroke="#7A5230" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 18c6-8 16-8 16-8 0 8-8 12-16 10z" fill="#5BBF6A" stroke="${ink}" stroke-width="2.5"/>`,
  candy: `<circle cx="50" cy="50" r="21" fill="#F58BB0" stroke="${ink}" stroke-width="3"/>
    <path d="M71 50 92 38v24z" fill="#F58BB0" stroke="${ink}" stroke-width="3"/>
    <path d="M29 50 8 38v24z" fill="#F58BB0" stroke="${ink}" stroke-width="3"/>
    <circle cx="44" cy="44" r="5" fill="#fff" opacity=".7"/>`,
  balloon: `<ellipse cx="50" cy="40" rx="22" ry="26" fill="#6FBBE8" stroke="${ink}" stroke-width="3"/>
    <path d="M50 66c-4 10 8 16 0 26" stroke="${ink}" stroke-width="3" fill="none"/>
    <ellipse cx="42" cy="32" rx="6" ry="8" fill="#fff" opacity=".6"/>`,
  star: `<path d="M50 14 60 40l28 2-21 18 7 27-24-15-24 15 7-27-21-18 28-2z" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>`,
  flower: `<g stroke="${ink}" stroke-width="3">
      <circle cx="50" cy="28" r="11" fill="#F58BB0"/>
      <circle cx="30" cy="42" r="11" fill="#F58BB0"/>
      <circle cx="70" cy="42" r="11" fill="#F58BB0"/>
      <circle cx="38" cy="62" r="11" fill="#F58BB0"/>
      <circle cx="62" cy="62" r="11" fill="#F58BB0"/>
      <circle cx="50" cy="47" r="9" fill="#F2B23C"/>
    </g>
    <path d="M50 58v34" stroke="#4E9B52" stroke-width="5" stroke-linecap="round"/>`,
  cat: `<path d="M26 34 22 14l20 10z" fill="#C9A06A" stroke="${ink}" stroke-width="3"/>
    <path d="M74 34 78 14 58 24z" fill="#C9A06A" stroke="${ink}" stroke-width="3"/>
    <circle cx="50" cy="52" r="26" fill="#D9B383" stroke="${ink}" stroke-width="3"/>
    <circle cx="40" cy="48" r="3.4" fill="${ink}"/><circle cx="60" cy="48" r="3.4" fill="${ink}"/>
    <path d="M44 60q6 6 12 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M22 52h12M78 52H66" stroke="${ink}" stroke-width="2.5"/>`,
  dog: `<path d="M24 30q-10 4-8 20 2 14 10 12z" fill="#A9743C" stroke="${ink}" stroke-width="3"/>
    <path d="M76 30q10 4 8 20-2 14-10 12z" fill="#A9743C" stroke="${ink}" stroke-width="3"/>
    <circle cx="50" cy="52" r="25" fill="#C78E4A" stroke="${ink}" stroke-width="3"/>
    <circle cx="41" cy="48" r="3.4" fill="${ink}"/><circle cx="59" cy="48" r="3.4" fill="${ink}"/>
    <ellipse cx="50" cy="60" rx="7" ry="5" fill="${ink}"/>`,
  rabbit: `<ellipse cx="38" cy="24" rx="7" ry="18" fill="#F0E4D4" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="62" cy="24" rx="7" ry="18" fill="#F0E4D4" stroke="${ink}" stroke-width="3"/>
    <circle cx="50" cy="58" r="24" fill="#FAF2E6" stroke="${ink}" stroke-width="3"/>
    <circle cx="41" cy="55" r="3.2" fill="${ink}"/><circle cx="59" cy="55" r="3.2" fill="${ink}"/>
    <path d="M50 62v4m-5 4q5 4 10 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  fish: `<path d="M64 50q-14-20-34 0 20 20 34 0z" fill="#6FBBE8" stroke="${ink}" stroke-width="3"/>
    <path d="M64 50 86 36v28z" fill="#4FA3E3" stroke="${ink}" stroke-width="3"/>
    <circle cx="38" cy="47" r="3" fill="${ink}"/>`,
  car: `<path d="M16 62V50l10-14h30l12 14h14v12z" fill="#E4564B" stroke="${ink}" stroke-width="3"/>
    <path d="M30 38h22l8 10H28z" fill="#BFE3FB" stroke="${ink}" stroke-width="2.5"/>
    <circle cx="32" cy="66" r="9" fill="#4A4540" stroke="${ink}" stroke-width="3"/>
    <circle cx="68" cy="66" r="9" fill="#4A4540" stroke="${ink}" stroke-width="3"/>`,
  clip: `<path d="M34 24v44a16 16 0 0 0 32 0V34" stroke="#8C98A4" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M50 30v34" stroke="#8C98A4" stroke-width="7" fill="none" stroke-linecap="round"/>`,
};

export const ICON_NAMES = Object.keys(SHAPES);

export function icon(name, size = 100) {
  const shape = SHAPES[name] || SHAPES.star;
  return svg(shape, size);
}

export function iconShape(name) {
  return SHAPES[name] || SHAPES.star;
}

/* ================= じぶんの かお ================= */
const FACE_SKIN = ["#F6D6B8", "#EFC39A", "#E0AC82", "#F8E0C8", "#E8BE9A", "#D9A074"];
const FACE_HAIR = ["#3C2A1E", "#6B4A2A", "#2B2A28", "#8A5A2B", "#4A3A5A", "#5A3A2A"];
const FACE_CAP = ["#4FA3E3", "#5BBF6A", "#F2B23C", "#E4564B", "#9A7FD1", "#45B6A8"];

export function face(index, wearing, size = 100) {
  const i = ((index | 0) % 6 + 6) % 6;
  const skin = FACE_SKIN[i];
  const hair = FACE_HAIR[i];
  let extra = "";
  if (wearing === "hat") {
    extra += `<path d="M24 34q26-22 52 0z" fill="${FACE_CAP[i]}" stroke="${ink}" stroke-width="3"/>
      <path d="M18 36h64" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  }
  if (wearing === "ribbon") {
    extra += `<path d="M66 28 78 20v16z" fill="#F58BB0" stroke="${ink}" stroke-width="2.5"/>
      <circle cx="66" cy="28" r="4" fill="#F2B23C" stroke="${ink}" stroke-width="2"/>`;
  }
  if (wearing === "glasses") {
    extra += `<g stroke="${ink}" stroke-width="3" fill="none"><circle cx="40" cy="50" r="9"/><circle cx="62" cy="50" r="9"/><path d="M49 50h4"/></g>`;
  }
  if (wearing === "crown") {
    extra += `<path d="M28 32 34 18l8 10 8-12 8 12 8-10 6 14z" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>`;
  }
  if (wearing === "mantle") {
    extra += `<path d="M18 92q14-26 32-26t32 26z" fill="#9A7FD1" stroke="${ink}" stroke-width="3"/>`;
  }
  if (wearing === "scarf") {
    extra += `<path d="M30 80q20 10 40 0v8q-20 8-40 0z" fill="#45B6A8" stroke="${ink}" stroke-width="3"/>`;
  }
  if (wearing === "badge") {
    extra += `<circle cx="74" cy="78" r="9" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>
      <path d="M74 73v10M69 78h10" stroke="${ink}" stroke-width="2.5"/>`;
  }
  if (wearing === "stick") {
    extra += `<path d="M82 86 70 44" stroke="#A9743C" stroke-width="5" stroke-linecap="round"/>
      <circle cx="69" cy="40" r="7" fill="#F2B23C" stroke="${ink}" stroke-width="3"/>`;
  }
  const inner = `
    <path d="M22 50a28 28 0 0 1 56 0z" fill="${hair}" stroke="${ink}" stroke-width="3"/>
    <circle cx="50" cy="54" r="26" fill="${skin}" stroke="${ink}" stroke-width="3"/>
    <path d="M24 46a26 26 0 0 1 52 0q-26-12-52 0z" fill="${hair}" stroke="${ink}" stroke-width="3"/>
    <circle cx="41" cy="54" r="3.6" fill="${ink}"/><circle cx="59" cy="54" r="3.6" fill="${ink}"/>
    <path d="M43 64q7 6 14 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="62" r="4" fill="#F0A6A0" opacity=".7"/>
    <circle cx="68" cy="62" r="4" fill="#F0A6A0" opacity=".7"/>
    ${extra}`;
  return svg(inner, size);
}

/* ================= もやもや（モンスター） ================= */
// もやもや（モンスター）の絵は moya-art.js にある（12体・形で見分けられる）
// さんすう1学期12体＋こくご1学期8体＋さんすう2学期5体＋さんすう3学期6体
// ＋こくご2学期8体（moya-art-jp2.js）＋こくご3学期6体（moya-art-jp3.js）＝45体
// 2学期の かさ・かたち・とけい は moya-art.js の 3体を そのまま 使う。
export const MOYA_NAMES = {
  ...MOYA_NAMES_12,
  ...MOYA_NAMES_JP,
  ...MOYA_NAMES_M2,
  ...MOYA_NAMES_M3,
  ...MOYA_NAMES_JP2,
  ...MOYA_NAMES_JP3,
};

export function moya(id, mood = "normal", size = 100) {
  if (MOYA_ART_JP[id]) return moyaArtJp(id, mood, size);
  if (MOYA_ART_M2[id]) return moyaArtM2(id, mood, size);
  if (MOYA_ART_M3[id]) return moyaArtM3(id, mood, size);
  if (MOYA_ART_JP2[id]) return moyaArtJp2(id, mood, size);
  if (MOYA_ART_JP3[id]) return moyaArtJp3(id, mood, size);
  return moyaArt(id, mood, size);
}

/* ================= たてもの ================= */
export const BUILDING_COLORS = ["#E4564B", "#4FA3E3", "#5BBF6A", "#F2B23C", "#9A7FD1", "#45B6A8"];

function houseShape(color) {
  return `<path d="M20 90V46l30-22 30 22v44z" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M14 48 50 20l36 28z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="42" y="64" width="16" height="26" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="26" y="56" width="12" height="12" fill="#BFE3FB" stroke="${ink}" stroke-width="2.5"/>
    <rect x="62" y="56" width="12" height="12" fill="#BFE3FB" stroke="${ink}" stroke-width="2.5"/>`;
}

function towerShape(color) {
  return `<path d="M32 90V38h36v52z" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M26 38 50 14l24 24z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="42" y="46" width="16" height="14" fill="#BFE3FB" stroke="${ink}" stroke-width="2.5"/>
    <rect x="42" y="68" width="16" height="22" fill="${color}" stroke="${ink}" stroke-width="3"/>`;
}

function barnShape(color) {
  return `<path d="M16 90V52q34-18 68 0v38z" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M14 54q36-20 72 0" stroke="${ink}" stroke-width="3" fill="${color}"/>
    <rect x="38" y="64" width="24" height="26" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <path d="M38 64 62 90M62 64 38 90" stroke="${ink}" stroke-width="2"/>`;
}

function wellShape(color) {
  return `<ellipse cx="50" cy="76" rx="26" ry="12" fill="#BFE3FB" stroke="${ink}" stroke-width="3"/>
    <path d="M24 76V60h52v16" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M30 60 50 34l20 26z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <path d="M50 34v-8" stroke="${ink}" stroke-width="3"/>`;
}

function gateShape(color) {
  return `<path d="M22 90V40h12v50zM66 90V40h12v50z" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M14 40h72l-6 12H20z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <path d="M34 66h32" stroke="${ink}" stroke-width="3"/>`;
}

function fieldShape(color) {
  return `<rect x="10" y="56" width="80" height="34" rx="8" fill="#C98A4B" stroke="${ink}" stroke-width="3"/>
    <path d="M14 66h72M14 76h72" stroke="#A9743C" stroke-width="3"/>
    <g fill="${color}" stroke="${ink}" stroke-width="2.5">
      <circle cx="26" cy="52" r="8"/><circle cx="50" cy="48" r="9"/><circle cx="74" cy="52" r="8"/>
    </g>
    <path d="M26 56v8M50 53v11M74 56v8" stroke="#4E9B52" stroke-width="3"/>`;
}

function paddyShape(color) {
  return `<rect x="8" y="54" width="84" height="36" rx="10" fill="#9FD8F2" stroke="${ink}" stroke-width="3"/>
    <path d="M14 72q10-6 20 0t20 0 20 0" stroke="#6FBBE8" stroke-width="3" fill="none"/>
    <g stroke="${color}" stroke-width="4" stroke-linecap="round">
      <path d="M24 62v-12M24 50l-6-6M24 50l6-6"/>
      <path d="M50 60v-14M50 46l-6-6M50 46l6-6"/>
      <path d="M76 62v-12M76 50l-6-6M76 50l6-6"/>
    </g>`;
}

function shopShape(color) {
  return `<rect x="18" y="48" width="64" height="42" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M12 48h76l-8 14H20z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <path d="M28 62v-14M44 62v-14M60 62v-14M76 62v-14" stroke="${ink}" stroke-width="2"/>
    <rect x="28" y="68" width="18" height="16" rx="3" fill="#C98A4B" stroke="${ink}" stroke-width="2.5"/>
    <rect x="54" y="68" width="18" height="16" rx="3" fill="#C98A4B" stroke="${ink}" stroke-width="2.5"/>`;
}

function pencilShopShape(color) {
  return `<rect x="20" y="52" width="60" height="38" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M14 52 50 30l36 22z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="38" y="64" width="24" height="26" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <g transform="translate(50 42) rotate(-20)">
      <rect x="-5" y="-16" width="10" height="24" fill="#F2B23C" stroke="${ink}" stroke-width="2.5"/>
      <path d="M-5 8h10l-5 8z" fill="#E4564B" stroke="${ink}" stroke-width="2.5"/>
    </g>`;
}

function postShape(color) {
  return `<rect x="18" y="50" width="64" height="40" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M12 50h76l-6 10H18z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="34" y="64" width="32" height="22" rx="3" fill="#FFFFFF" stroke="${ink}" stroke-width="3"/>
    <path d="M34 64l16 12 16-12" fill="none" stroke="${ink}" stroke-width="3"/>`;
}

function libraryShape(color) {
  return `<rect x="16" y="46" width="68" height="44" fill="#F4EADA" stroke="${ink}" stroke-width="3"/>
    <path d="M10 46h80l-6 10H16z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <g stroke="${ink}" stroke-width="2.5">
      <rect x="26" y="62" width="10" height="24" fill="#E4564B"/>
      <rect x="38" y="58" width="10" height="28" fill="#4FA3E3"/>
      <rect x="50" y="64" width="10" height="22" fill="#5BBF6A"/>
      <rect x="62" y="60" width="10" height="26" fill="#F2B23C"/>
    </g>`;
}

function monumentShape(color) {
  return `<ellipse cx="50" cy="86" rx="30" ry="8" fill="#5BBF6A" stroke="${ink}" stroke-width="3"/>
    <path d="M34 84V40q16-14 32 0v44z" fill="#D8D2C6" stroke="${ink}" stroke-width="3"/>
    <path d="M42 54h16M42 64h16M42 74h10" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
}

function stageShape(color) {
  return `<rect x="10" y="40" width="80" height="12" rx="4" fill="#A9743C" stroke="${ink}" stroke-width="3"/>
    <rect x="16" y="52" width="68" height="30" fill="#FFF6E0" stroke="${ink}" stroke-width="3"/>
    <path d="M16 52h22q-4 18-10 30H16z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <path d="M84 52H62q4 18 10 30h12z" fill="${color}" stroke="${ink}" stroke-width="3"/>
    <rect x="10" y="82" width="80" height="8" rx="3" fill="#C98A4B" stroke="${ink}" stroke-width="3"/>`;
}

const BUILDING_SHAPES = {
  field: fieldShape,
  paddy: paddyShape,
  shop: shopShape,
  pencilshop: pencilShopShape,
  post: postShape,
  library: libraryShape,
  monument: monumentShape,
  stage: stageShape,
  // あとから足した3種（moya-art.js）。これで8棟ぜんぶ ちがう形になる
  twinhouse: BUILDING_ART_FN.twinhouse,
  factory: BUILDING_ART_FN.factory,
  lighthouse: BUILDING_ART_FN.lighthouse,
  house: houseShape,
  tower: towerShape,
  barn: barnShape,
  well: wellShape,
  gate: gateShape,
  // 1年2学期（算数）の8棟
  ...BUILDING_ART_M2,
  // 1年3学期（算数）の6棟
  ...BUILDING_ART_M3,
};

export function building(shape, colorIndex = 0, size = 100) {
  const fn = BUILDING_SHAPES[shape] || houseShape;
  const color = BUILDING_COLORS[((colorIndex | 0) % BUILDING_COLORS.length + BUILDING_COLORS.length) % BUILDING_COLORS.length];
  return svg(fn(color), size);
}

export function buildingShapeMarkup(shape, colorIndex = 0) {
  const fn = BUILDING_SHAPES[shape] || houseShape;
  const color = BUILDING_COLORS[((colorIndex | 0) % BUILDING_COLORS.length + BUILDING_COLORS.length) % BUILDING_COLORS.length];
  return fn(color);
}

/* ================= ざいりょう ================= */
export function matSwatch(color) {
  return `<i style="background:${color}"></i>`;
}
