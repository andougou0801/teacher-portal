/* ============================================================
   かずのまち ／ さんすう 3学期の もやもや 6体
   ------------------------------------------------------------
   ・決まりは さんすう（moya-art.js）・こくご（moya-art-jp.js）・
     2学期（moya-art-m2.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。
     こわい顔には しない（目は まるく、口は まっすぐか にっこり）。

   ・【既存25体は こういう形】
       さんすう12 … まんまる＋ぼんぼり／たてに3つ つみ上がった だんご／ふたこぶ／
         上がデコボコ4つ／右が まるく 欠けた丸＋目1つ／ドーナツ／よこ長の カプセル／
         高さちがいの ぼう3本／まるい三角／角丸四角＋ベル耳／コップ＋とって／
         よこ広たまご＋リボン
       こくご8 … たて長たまご＋はねの尾／ふだ3枚＋ひも／大きい楕円＋小さい子分／
         つぶ3つの三つ葉／丸＋てんの尾＋かぎかっこ／3つの玉が よこに よりそう／
         ふきだし／かいだん3だん
       2学期5 … 玉3つを ぼうに 通した たて／しずく＋上むき矢／右へ かたむいた板／
         つぶ12この あつまり／右が とがった 矢じるし

   ・【自分は こう変えた（かぶらせない ための めも）】
       hyakumoya   … たて長の 1つの体で、輪郭は なめらか。中に つぶが 12こ ならぶ。
                     おおかずもや（つぶ そのものが 体で へりが ぷつぷつ）とは
                     「つぶが 中か 外か」で ちがう。かずもや（丸＋ぼんぼり）とも
                     たて長の 体で 見分く。上に 1つ はみ出した つぶが 目じるし。
       ketamoya    … 体が 左右 2本の はしらに わかれ、まん中の 帯で つながる。
                     わけもや（1つの体の 頭だけ ふたこぶ）とは ちがい、
                     こちらは 体ぜんたいが 2つ。目も 1つずつ ついている。
       zumoya      … よこ長の 帯。ながさもや（かどが まるい カプセル＋目もり）とは
                     ちがえて、かどを 四角ばらせ、たての くぎり線で 2つに わけ、
                     右がわに テープ図の ます（3つ）を 置いた。
       retsumoya   … ちいさい体 4つが 手を つないで よこに ならぶ。
                     こくごの「3つの玉が よりそう」とは ちがい、体は はなれていて
                     あいだに うでと 手が 見える。大きさも ばらばら。
       itamoya     … 四角を かどで 立てた ひしがた。たてと よこの つなぎ目で
                     さんかくの いろいたが 4まいに なっている。かたちもや
                     （かどの まるい さんかく 1つ・1色）とは ひと目で ちがう。
       matomemoya  … いちばん 大きい まる（r=33）。中に うすい 輪が 1つ、
                     まわりに ＋ − ○ △ の 4つの しるし、よこに 手が 2つ。
                     かずもや（r=28・ぼんぼり・白い点5つ）、おさらいもや
                     （よこ広たまご・リボン）とは 大きさと しるしで 見分く。

   ・なかまの姿（friendSvg）の 見分けかたも 2学期と 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（さんすう・こくご・2学期と 同じもの） ---------- */

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

/* ---------- 小さい しるしを 作る てつだい ---------- */

/* よこ×たて に ならぶ まるい つぶ（ひゃくもやの おなか） */
function dotGrid(xs, ys, r, fill) {
  let out = "";
  for (const y of ys) {
    for (const x of xs) {
      out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="1.8"/>`;
    }
  }
  return out;
}

/* ちいさな 点の 目＋にっこり（れつもやの なかまたち） */
function tinyFace(x, y, w) {
  return (
    `<circle cx="${x - w}" cy="${y}" r="1.9" fill="${INK}"/>` +
    `<circle cx="${x + w}" cy="${y}" r="1.9" fill="${INK}"/>` +
    `<path d="M${x - 3.5} ${y + 5}q3.5 3 7 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
  );
}

/* ---------- 6体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* u17 120までの かず
     － たて長の 体に つぶが 12こ。いちばん上に 1つだけ はみ出した つぶ */
  hyakumoya: {
    color: "#7C9BE0",
    soft: "#C6D4F4",
    topBefore: `<circle cx="50" cy="10" r="7" fill="#7C9BE0" stroke="${INK}" stroke-width="3"/>`,
    body: `<rect x="28" y="14" width="44" height="70" rx="14" fill="#7C9BE0" stroke="${INK}" stroke-width="3"/>`,
    mark: dotGrid([36, 45, 54, 63], [58, 68, 78], 3.4, "#FFF4E2"),
    eyes: [[40, 33, 5], [59, 33, 5]],
    mouth: [49, 45],
    cheek: [[33, 42], [66, 42]],
    sproutAt: [66, 18],
    feet: [40, 60],
    feetY: 90,
  },

  /* u18 100までの たしざん ひきざん
     － 体が たてに 2つ（左＝十のくらい／右＝一のくらい）。まん中の 帯で つながる */
  ketamoya: {
    color: "#E0A23C",
    soft: "#F6D79B",
    topBefore: `<rect x="44" y="38" width="14" height="28" rx="4" fill="#E0A23C" stroke="${INK}" stroke-width="2.5"/>`,
    body:
      `<rect x="14" y="22" width="34" height="62" rx="12" fill="#E0A23C" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="54" y="22" width="32" height="62" rx="12" fill="#E0A23C" stroke="${INK}" stroke-width="3"/>`,
    /* 左の 十のくらいは 10この 点が まとまって 1まいの ふだに、
       右の 一のくらいは ばらばらの 点が 3つ。 */
    mark:
      `<rect x="19" y="62" width="24" height="17" rx="5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      dotGrid([23, 27.5, 32, 36.5, 41], [67.5, 73.5], 1.8, INK) +
      `<circle cx="64" cy="64" r="4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="76" cy="64" r="4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="70" cy="74" r="4" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[31, 44, 5.5], [70, 44, 5.5]],
    mouth: [51, 62],
    cheek: [[18, 56], [83, 56]],
    sproutAt: [31, 22],
    feet: [30, 70],
    feetY: 90,
  },

  /* u19 ずを つかって かんがえよう
     － よこ長の 帯。まん中に くぎりの せん、右がわに テープ図の ます */
  zumoya: {
    color: "#D98C62",
    soft: "#F2C6AC",
    topBefore: "",
    body: `<rect x="8" y="34" width="84" height="42" rx="6" fill="#D98C62" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M50 34v42" fill="none" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="50" cy="39" r="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="56" y="46" width="30" height="16" rx="3" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M66 46v16M76 46v16" fill="none" stroke="${INK}" stroke-width="1.8"/>`,
    eyes: [[24, 48, 5], [38, 48, 5]],
    mouth: [31, 62],
    cheek: [[16, 59], [44, 59]],
    sproutAt: [24, 34],
    feet: [30, 60],
    feetY: 84,
    drop: -4,
  },

  /* u20 ものと ひとの かず
     － ちいさい体 4つが 手を つないで よこに ならぶ。顔は 左から2ばんめ */
  retsumoya: {
    color: "#B07FC9",
    soft: "#E0C6EC",
    topBefore: `<path d="M20 56h10M52 56h10M74 56h8" fill="none" stroke="#B07FC9" stroke-width="5" stroke-linecap="round"/>`,
    body:
      `<rect x="6" y="44" width="16" height="24" rx="8" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="28" y="34" width="26" height="34" rx="11" fill="#B07FC9" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="60" y="42" width="16" height="26" rx="8" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="80" y="46" width="15" height="22" rx="7" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>`,
    topAfter:
      `<circle cx="25" cy="56" r="4" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="57" cy="56" r="4" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="78" cy="56" r="3.5" fill="#B07FC9" stroke="${INK}" stroke-width="2.5"/>`,
    mark: tinyFace(14, 52, 3) + tinyFace(68, 50, 3.5) + tinyFace(87, 55, 3),
    eyes: [[36, 48, 5], [47, 48, 5]],
    mouth: [41, 59],
    cheek: [[31, 57], [52, 57]],
    sproutAt: [41, 34],
    feet: [36, 48],
    feetY: 76,
    drop: -15,
  },

  /* u21 かたちづくり
     － 四角を かどで 立てた ひしがた。さんかくの いろいたが 4まい */
  itamoya: {
    color: "#5EC0A8",
    soft: "#B6E5DB",
    topBefore: "",
    body:
      `<path d="M50 16 16 52h34z" fill="#F2B23C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M50 16 84 52H50z" fill="#5EC0A8" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M50 84 16 52h34z" fill="#7C9BE0" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M50 84 84 52H50z" fill="#E99A8E" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M50 16 84 52 50 84 16 52z" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    /* 4まいが 出あう まん中の ピンと、まだ つかっていない よぶんの いた1まい */
    mark:
      `<circle cx="50" cy="52" r="3.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M6 90h14L13 78z" fill="#F2B23C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    eyes: [[39, 43, 5], [61, 43, 5]],
    mouth: [50, 61],
    cheek: [[30, 56], [70, 56]],
    sproutAt: [50, 18],
    feet: [40, 60],
    feetY: 90,
  },

  /* u22 1ねんの まとめ
     － いちばん 大きい まる。うすい 輪と ＋ − ○ △ の しるし、よこに 手が2つ */
  matomemoya: {
    color: "#F2C14E",
    soft: "#FBE3A8",
    topBefore:
      `<circle cx="12" cy="58" r="6.5" fill="#F2C14E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="88" cy="58" r="6.5" fill="#F2C14E" stroke="${INK}" stroke-width="2.5"/>`,
    body: `<circle cx="50" cy="52" r="33" fill="#F2C14E" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="50" cy="52" r="28.5" fill="none" stroke="#FFF4E2" stroke-width="2.2"/>` +
      `<path d="M31 34v8M27 38h8" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M65 38h8" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="31" cy="66" r="4.5" fill="none" stroke="#FFF4E2" stroke-width="3"/>` +
      `<path d="M69 61 74 70H64z" fill="none" stroke="#FFF4E2" stroke-width="3" stroke-linejoin="round"/>`,
    eyes: [[41, 48, 5.5], [59, 48, 5.5]],
    mouth: [50, 63],
    cheek: [[34, 57], [66, 57]],
    sproutAt: [50, 19],
    feet: [40, 60],
    feetY: 90,
  },
};

/* ---------- 組み立て（さんすう・こくご・2学期と 同じ） ---------- */

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
   さんすう 3学期の もやもや 6体
   ============================================================ */
export const MOYA_ART_M3 = {
  hyakumoya: {
    name: "ひゃくもや",
    unit: "u17",
    note: "120までのかず。たて長の 体に つぶが 12こ ならび、いちばん上に 1つだけ はみ出した つぶ",
    svg: normalArt(PARTS.hyakumoya),
    friendSvg: friendArt(PARTS.hyakumoya),
    color: PARTS.hyakumoya.color,
  },
  ketamoya: {
    name: "けたもや",
    unit: "u18",
    note: "100までの けいさん。体が たてに 2つ（左が 十のくらい・右が 一のくらい）、まん中の 帯で つながる",
    svg: normalArt(PARTS.ketamoya),
    friendSvg: friendArt(PARTS.ketamoya),
    color: PARTS.ketamoya.color,
  },
  zumoya: {
    name: "ずもや",
    unit: "u19",
    note: "ずを つかって かんがえよう。よこ長の 帯の体、まん中に くぎりの せん、右に テープ図の ますが3つ",
    svg: normalArt(PARTS.zumoya),
    friendSvg: friendArt(PARTS.zumoya),
    color: PARTS.zumoya.color,
  },
  retsumoya: {
    name: "れつもや",
    unit: "u20",
    note: "ものと ひとの かず。ちいさい体 4つが 手を つないで よこに ならぶ、顔は 左から2ばんめ",
    svg: normalArt(PARTS.retsumoya),
    friendSvg: friendArt(PARTS.retsumoya),
    color: PARTS.retsumoya.color,
  },
  itamoya: {
    name: "いたもや",
    unit: "u21",
    note: "かたちづくり。四角を かどで 立てた ひしがたの体が、さんかくの いろいた 4まいに わかれている",
    svg: normalArt(PARTS.itamoya),
    friendSvg: friendArt(PARTS.itamoya),
    color: PARTS.itamoya.color,
  },
  matomemoya: {
    name: "まとめもや",
    unit: "u22",
    note: "1ねんの まとめ。いちばん 大きい まるい体、うすい 輪と ＋ − ○ △ の しるし、よこに 手が2つ",
    svg: normalArt(PARTS.matomemoya),
    friendSvg: friendArt(PARTS.matomemoya),
    color: PARTS.matomemoya.color,
  },
};

export const MOYA_ORDER_M3 = [
  "hyakumoya",
  "ketamoya",
  "zumoya",
  "retsumoya",
  "itamoya",
  "matomemoya",
];

export const MOYA_NAMES_M3 = Object.fromEntries(
  MOYA_ORDER_M3.map((id) => [id, MOYA_ART_M3[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtM3(id, mood = "normal", size = 100) {
  const a = MOYA_ART_M3[id] || MOYA_ART_M3.hyakumoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
