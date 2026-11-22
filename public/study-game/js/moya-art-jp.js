/* ============================================================
   ことばのまち ／ こくごの もやもや 8体
   ------------------------------------------------------------
   ・決まりは さんすう（moya-art.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。オリジナルの かたち。
   ・さんすうの12体と かたちが かぶらないように している：
       さんすうで つかった形 … まんまる＋ぼんぼり／たて3段のだんご／ふたこぶ／
         デコボコ4つ／右が欠けた丸／ドーナツ／よこ長のカプセル／たて棒3本／
         まるい三角／角丸四角＋ベル耳／コップ／よこ広たまご＋リボン
       こくごで つかう形 … たてのたまご＋はねの尾／ふだ3枚＋ひも／
         大きい楕円＋小さい子分／つぶ3つの三つ葉／丸＋てんの尾＋かぎかっこ／
         3色がよりそった3つの玉／ふきだし／かいだん3だん
   ・なかまの姿（friendSvg）の 見分けかたも 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（さんすうと 同じもの） ---------- */

function eyesOpen(eyes) {
  return eyes
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>` +
        `<circle cx="${x}" cy="${y}" r="${(r * 0.44).toFixed(1)}" fill="${INK}"/>`,
    )
    .join("");
}

function eyesClosed(eyes) {
  return eyes
    .map(
      ([x, y, r]) =>
        `<path d="M${x - r} ${y + 1}q${r} ${(-r * 1.7).toFixed(1)} ${r * 2} 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    )
    .join("");
}

function mouthFlat([x, y]) {
  return `<path d="M${x - 8} ${y}h16" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
}

function mouthSmile([x, y]) {
  return `<path d="M${x - 8} ${y - 2}q8 9 16 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
}

function puffs(soft, drop = 0) {
  return (
    `<circle cx="27" cy="${86 + drop}" r="5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="50" cy="${92 + drop}" r="4" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="73" cy="${85 + drop}" r="5.5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>`
  );
}

function ground(color, feet, y) {
  return (
    `<ellipse cx="50" cy="${y + 7}" rx="22" ry="4.5" fill="#E7DCC4"/>` +
    feet
      .map(
        (fx) =>
          `<ellipse cx="${fx}" cy="${y}" rx="9" ry="6" fill="${color}" stroke="${INK}" stroke-width="2.5"/>`,
      )
      .join("")
  );
}

function sprout(x, y) {
  return (
    `<path d="M${x} ${y}v-9" fill="none" stroke="#4E9B52" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M${x} ${y - 9}q10-8 15-2-6 8-15 2z" fill="#5BBF6A" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M${x} ${y - 4}q-9-6-13-1 5 6 13 1z" fill="#7ED18A" stroke="${INK}" stroke-width="2.5"/>`
  );
}

function cheeks(list) {
  return list
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#F0A6A0" opacity=".75"/>`)
    .join("");
}

function sparkle(x, y, s = 8) {
  const q = s * 0.28;
  const n = (v) => Number(v.toFixed(1));
  return (
    `<path d="M${n(x)} ${n(y - s)}L${n(x + q)} ${n(y - q)}L${n(x + s)} ${n(y)}` +
    `L${n(x + q)} ${n(y + q)}L${n(x)} ${n(y + s)}L${n(x - q)} ${n(y + q)}` +
    `L${n(x - s)} ${n(y)}L${n(x - q)} ${n(y - q)}Z" fill="#F2B23C" stroke="${INK}" stroke-width="1.8"/>`
  );
}

function sparkles() {
  return sparkle(14, 24, 8) + sparkle(87, 26, 6.5) + sparkle(84, 70, 5.5);
}

/* ---------- 8体のパーツ表 ---------- */
/* mouthNormal / mouthFriend を書いた子は、口を じぶんで もつ（だれもや） */

const PARTS = {
  /* j01 ひらがなを よむ － たてに長い たまご＋右上に「はね」の しっぽ */
  mojimoya: {
    color: "#E8805F",
    soft: "#F7BFAC",
    topBefore: `<path d="M56 34q14-8 28-6-10 12-24 14z" fill="#E8805F" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    body: `<ellipse cx="46" cy="54" rx="22" ry="28" fill="#E8805F" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M34 68q8-8 16-2t0 10" fill="none" stroke="#FFF4E2" stroke-width="4" stroke-linecap="round"/>`,
    eyes: [[37, 48, 5.5], [55, 48, 5.5]],
    mouth: [46, 61],
    cheek: [[28, 58], [64, 58]],
    sproutAt: [40, 29],
    feet: [36, 58],
    feetY: 84,
  },

  /* j02 ひらがなの ならび － ふだが3枚、ひもで つながった体 */
  narabekotoba: {
    color: "#D9B07A",
    soft: "#EFDAB9",
    topBefore: `<path d="M16 44q34-18 68 0" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
    body:
      `<rect x="8" y="44" width="25" height="34" rx="6" fill="#D9B07A" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="67" y="44" width="25" height="34" rx="6" fill="#D9B07A" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="36" y="38" width="28" height="42" rx="7" fill="#D9B07A" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="20" cy="50" r="2.6" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="79" cy="50" r="2.6" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="50" cy="44" r="2.6" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M14 62h13M14 70h8" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M73 62h13M78 70h8" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>`,
    eyes: [[44, 55, 4.6], [56, 55, 4.6]],
    mouth: [50, 66],
    cheek: [[39, 63], [61, 63]],
    sproutAt: [50, 38],
    feet: [30, 70],
    feetY: 84,
  },

  /* j03 のばす じと ちいさい じ － よこに のびた大きい体＋小さい子分が1つ */
  nobashimoya: {
    color: "#6FC9B4",
    soft: "#B4E5DA",
    topBefore: "",
    body:
      `<ellipse cx="40" cy="44" rx="32" ry="21" fill="#6FC9B4" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="78" cy="72" r="13" fill="#6FC9B4" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<rect x="22" y="54" width="36" height="5" rx="2.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="72" y="77" width="12" height="4" rx="2" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="74" cy="69" r="2.2" fill="${INK}"/>` +
      `<circle cx="82" cy="69" r="2.2" fill="${INK}"/>`,
    eyes: [[30, 40, 5.5], [50, 40, 5.5]],
    mouth: [40, 50],
    cheek: [[18, 48], [62, 48]],
    sproutAt: [40, 24],
    feet: [28, 52],
    feetY: 78,
    drop: -4,
  },

  /* j04 は を へ － 小さい つぶが3つ くっついた 三つ葉の体 */
  joshimoya: {
    color: "#A8D86A",
    soft: "#D5EDB4",
    topBefore: "",
    body:
      `<circle cx="34" cy="42" r="16" fill="#A8D86A" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="66" cy="42" r="16" fill="#A8D86A" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="50" cy="70" r="16" fill="#A8D86A" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M29 48v9M25 51h9M37 47v12" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M61 47q8 0 8 5t-8 5q7 2 9-1" fill="none" stroke="#FFF4E2" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M43 80q7-8 14 1" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>`,
    eyes: [[34, 38, 5], [66, 38, 5]],
    mouth: [50, 68],
    cheek: [[24, 50], [76, 50]],
    sproutAt: [34, 26],
    feet: [38, 62],
    feetY: 90,
    drop: 4,
  },

  /* j05 、と。と「」 － まるい体に てんの しっぽ、りょうわきに かぎかっこ */
  tenmarumoya: {
    color: "#E79FD8",
    soft: "#F5CFEE",
    topBefore: `<path d="M36 70q-7 13-18 18 16-2 22-13z" fill="#E79FD8" stroke="${INK}" stroke-width="2.5"/>`,
    body: `<circle cx="48" cy="50" r="26" fill="#E79FD8" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M8 30h14v5h-9v13H8z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M92 70H78v-5h9V52h5z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="62" cy="64" r="3.6" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[39, 46, 5.5], [57, 46, 5.5]],
    mouth: [46, 60],
    cheek: [[30, 58], [66, 54]],
    sproutAt: [46, 25],
    feet: [36, 58],
    feetY: 82,
  },

  /* j06 ことばの なかま － 3色の たまが よりそった体（まん中が おにいさん） */
  nakamamoya: {
    color: "#9CC9F0",
    soft: "#CFE6FA",
    topBefore: "",
    body:
      `<circle cx="26" cy="58" r="16" fill="#F4A9A9" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="74" cy="58" r="16" fill="#BFE08A" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="50" cy="50" r="22" fill="#9CC9F0" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="20" cy="56" r="2.2" fill="${INK}"/>` +
      `<circle cx="28" cy="56" r="2.2" fill="${INK}"/>` +
      `<path d="M20 64q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<circle cx="72" cy="56" r="2.2" fill="${INK}"/>` +
      `<circle cx="80" cy="56" r="2.2" fill="${INK}"/>` +
      `<path d="M72 64q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
    eyes: [[43, 46, 5], [57, 46, 5]],
    mouth: [50, 59],
    cheek: [[37, 56], [63, 56]],
    sproutAt: [50, 29],
    feet: [38, 62],
    feetY: 82,
  },

  /* j07 だれが どうする － ふきだしの体。目が大きく、口が ぱっくり あいている */
  daremoya: {
    color: "#F7C04A",
    soft: "#FBE3A8",
    topBefore: "",
    body: `<path d="M22 26h56a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H70l5 14-19-14H22a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10z" fill="#F7C04A" stroke="${INK}" stroke-width="3"/>`,
    mark: "",
    eyes: [[36, 46, 9], [62, 46, 9]],
    mouth: [49, 64],
    mouthNormal: `<ellipse cx="49" cy="64" rx="8" ry="6.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>`,
    mouthFriend: `<path d="M38 60q11 14 22 0z" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>`,
    cheek: [[24, 60], [74, 60]],
    sproutAt: [50, 27],
    feet: [30, 50],
    feetY: 86,
    drop: 2,
  },

  /* j08 じゅんばん － 1・2・3の かいだんに なった体（点の数が だんの ばんごう） */
  junbanmoya: {
    color: "#6FA8D8",
    soft: "#BBD9EF",
    topBefore: "",
    body: `<path d="M14 86V68q0-4 4-4h16v-16q0-4 4-4h16V30q0-4 4-4h18q4 0 4 4v56z" fill="#6FA8D8" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="24" cy="75" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="40" cy="58" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="48" cy="58" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="62" cy="70" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="70" cy="70" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="66" cy="78" r="2.8" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[61, 44, 4.8], [73, 44, 4.8]],
    mouth: [67, 58],
    cheek: [[57, 54], [80, 54]],
    sproutAt: [67, 27],
    feet: [26, 62],
    feetY: 90,
    drop: 4,
  },
};

/* ---------- 組み立て（さんすうと 同じ） ---------- */

function normalArt(p) {
  return (
    (p.topBefore || "") +
    p.body +
    (p.mark || "") +
    (p.topAfter || "") +
    eyesOpen(p.eyes) +
    (p.mouthNormal || mouthFlat(p.mouth)) +
    puffs(p.soft, p.drop || 0)
  );
}

function friendArt(p) {
  return (
    ground(p.color, p.feet, p.feetY) +
    (p.topBefore || "") +
    p.body +
    (p.mark || "") +
    (p.topAfter || "") +
    sprout(p.sproutAt[0], p.sproutAt[1]) +
    eyesClosed(p.eyes) +
    (p.mouthFriend || mouthSmile(p.mouth)) +
    cheeks(p.cheek) +
    sparkles()
  );
}

/* ============================================================
   こくごの もやもや 8体
   ============================================================ */
export const MOYA_ART_JP = {
  mojimoya: {
    name: "もじもや",
    unit: "j01",
    note: "ひらがなを よむ。たてに長い たまごの体、右上に 字の「はね」の しっぽ、おなかに 字の くるん",
    svg: normalArt(PARTS.mojimoya),
    friendSvg: friendArt(PARTS.mojimoya),
    color: PARTS.mojimoya.color,
  },
  narabekotoba: {
    name: "ならべことば",
    unit: "j02",
    note: "ひらがなの ならび。ふだが3枚、上の ひもで つながった体（まん中の ふだが 顔）",
    svg: normalArt(PARTS.narabekotoba),
    friendSvg: friendArt(PARTS.narabekotoba),
    color: PARTS.narabekotoba.color,
  },
  nobashimoya: {
    name: "のばしもや",
    unit: "j03",
    note: "のばす じと ちいさい じ。よこに のびた 大きい体＋右下に 小さい子分が1つ、どちらにも「ー」の ぼう",
    svg: normalArt(PARTS.nobashimoya),
    friendSvg: friendArt(PARTS.nobashimoya),
    color: PARTS.nobashimoya.color,
  },
  joshimoya: {
    name: "じょしもや",
    unit: "j04",
    note: "は を へ。小さい つぶが3つ くっついた 三つ葉の体、つぶごとに は・を・へ の しるし",
    svg: normalArt(PARTS.joshimoya),
    friendSvg: friendArt(PARTS.joshimoya),
    color: PARTS.joshimoya.color,
  },
  tenmarumoya: {
    name: "てんまるもや",
    unit: "j05",
    note: "、と。と「」。まるい体（。）に てんの しっぽ（、）、りょうわきに かぎかっこの かど",
    svg: normalArt(PARTS.tenmarumoya),
    friendSvg: friendArt(PARTS.tenmarumoya),
    color: PARTS.tenmarumoya.color,
  },
  nakamamoya: {
    name: "なかまもや",
    unit: "j06",
    note: "ことばの なかま。ピンク・みず色・みどりの たま3つが よりそった体、わきの2人にも 顔がある",
    svg: normalArt(PARTS.nakamamoya),
    friendSvg: friendArt(PARTS.nakamamoya),
    color: PARTS.nakamamoya.color,
  },
  daremoya: {
    name: "だれもや",
    unit: "j07",
    note: "だれが どうする。ふきだしの かたちの体、目が とても大きく、口が ぱっくり あいている",
    svg: normalArt(PARTS.daremoya),
    friendSvg: friendArt(PARTS.daremoya),
    color: PARTS.daremoya.color,
  },
  junbanmoya: {
    name: "じゅんばんもや",
    unit: "j08",
    note: "じゅんばん。1・2・3の かいだんに なった体、だんの 点の数が そのまま ばんごう",
    svg: normalArt(PARTS.junbanmoya),
    friendSvg: friendArt(PARTS.junbanmoya),
    color: PARTS.junbanmoya.color,
  },
};

export const MOYA_ORDER_JP = [
  "mojimoya",
  "narabekotoba",
  "nobashimoya",
  "joshimoya",
  "tenmarumoya",
  "nakamamoya",
  "daremoya",
  "junbanmoya",
];

export const MOYA_NAMES_JP = Object.fromEntries(
  MOYA_ORDER_JP.map((id) => [id, MOYA_ART_JP[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtJp(id, mood = "normal", size = 100) {
  const a = MOYA_ART_JP[id] || MOYA_ART_JP.mojimoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
