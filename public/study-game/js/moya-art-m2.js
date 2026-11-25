/* ============================================================
   かずのまち ／ さんすう 2学期の もやもや 5体
   ------------------------------------------------------------
   ・決まりは さんすう（moya-art.js）・こくご（moya-art-jp.js）と まったく 同じ。
     100×100、<path> <circle> <ellipse> <rect> だけ、輪郭 #2B2A28 の 2.5〜3、
     filter / mask / gradient / <g> は つかわない。ぜんぶ 自分で 考えた かたち。
     実在の キャラクターや 有名ゲームの てきには 似せていない。

   ・2学期の8単元のうち 3体（かさ・かたち・とけい）は moya-art.js に
     すでに いる（u09/u10/u11 ぶんとして 描いてあった かさもや・かたちもや・
     とけいもや）。それを そのまま 使うので、ここで 描くのは のこりの 5体だけ。

   ・【既存20体は こういう形】
       さんすう12 … まんまる＋ぼんぼり／たてに3つ つみ上がった だんご（ふれあって
         いる ひらたい 楕円）／ふたこぶ／上がデコボコ4つ／右が まるく 欠けた丸＋
         目1つ／ドーナツ／よこ長の カプセル／高さちがいの ぼう3本／まるい三角／
         角丸四角＋ベル耳／コップ＋とって／よこ広たまご＋リボン
       こくご8 … たて長たまご＋はねの尾／ふだ3枚＋ひも／大きい楕円＋小さい子分／
         つぶ3つの三つ葉／丸＋てんの尾＋かぎかっこ／3つの玉が よこに よりそう／
         ふきだし／かいだん3だん

   ・【自分は こう変えた】
       mitsumoya      … たての3つ。ならびもや（ひらたい楕円が ふれあって つみ上がる・
                        顔は いちばん上）とは ちがえて、まるい玉が すきまを あけて
                        1本の ぼうに 通してあり、顔は まん中の 大きい玉。すきまに
                        ＋ と − の ふだが ついている（＝3つの かずの けいさん）。
                        なかまもや（よこ3つ）とも むきで ちがう。
       kuriagarimoya  … 下が ふくらみ 上が とがって のびる しずく型（＋上むき）。
                        たすもや（デコボコ4つの ふとった体）とは ぜんぜん ちがう形。
                        かずもや（丸＋真上の ぼんぼり）と まちがえないように、
                        体を 丸ではなく たての しずくに して、くりあがる 1は
                        右うえに はなれて うかぶ 白い玉に した。
       kurisagarimoya … 上が ひろく 右へ かたむいた 板（＋下むき）。
                        かたむいた体は 20体に 1つも ない。くりあがりもやと 対に
                        なるので、やじるしの むき・とがった ほうの むき・玉が
                        うえに あるか したに 落ちているかで ひと目で 見分く。
       ookazumoya     … ちいさい つぶ12こが 集まって 1つの大きい体。わけもや
                        （ふたこぶ）や じょしもや（つぶ3つ）より ずっと 数が 多く、
                        へりが ぷつぷつ して いるので 小さくても わかる。
                        左手に 10この 点の ふだ（＝10の まとまり）を もつ。
       ichimoya       … 左は まっすぐな かべ、右は とがって いる 矢じるし型。
                        左右が ちがう ので むきが わかる。ひきもや（右が まるく
                        欠けた丸）とは ちがい、こちらは 右が 外へ とび出している。

   ・なかまの姿（friendSvg）の 見分けかたも 同じ4点：
       ①もやのつぶで浮く → かげの上に あし2本で立つ
       ②白目＋黒目 → とじた にこにこ目
       ③口が まっすぐ → にっこり
       ④頭に はっぱの め ＋ ほお ＋ きらきら
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（さんすう・こくごと 同じもの） ---------- */

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

/* ---------- 5体のパーツ表 ---------- */
/* topBefore … 体より先に描く／body … 体／mark … しるし／topAfter … 体より後に描く */

const PARTS = {
  /* u09 3つの かずの けいさん
     － まるい玉3つが 1本の ぼうに 通っていて、すきまに ＋ と − の ふだ */
  mitsumoya: {
    color: "#5FB8C9",
    soft: "#B7E2EA",
    topBefore: `<rect x="46" y="16" width="8" height="64" rx="4" fill="#5FB8C9" stroke="${INK}" stroke-width="2.5"/>`,
    body:
      `<circle cx="50" cy="22" r="10" fill="#5FB8C9" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="50" cy="76" r="10" fill="#5FB8C9" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="50" cy="49" r="13" fill="#5FB8C9" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="29" cy="34" r="7.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M29 30v8M25 34h8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="29" cy="64" r="7.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M25 64h8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
    eyes: [[44, 46, 4.6], [56, 46, 4.6]],
    mouth: [50, 56],
    cheek: [[36, 52], [64, 52]],
    sproutAt: [50, 12],
    feet: [40, 60],
    feetY: 90,
    drop: 4,
  },

  /* u11 たしざん（くりあがり）
     － 下が ふくらみ、上が とがって のびる しずく。やじるしは 上むき、
       くりあがる 1は 右うえに うかぶ 白い玉 */
  kuriagarimoya: {
    color: "#EF8C5A",
    soft: "#F9C9AC",
    topBefore: "",
    body: `<path d="M50 14q7 10 7 18 0 8-3 12 20 6 20 22 0 16-24 16t-24-16q0-16 20-22-3-4-3-12 0-8 7-18z" fill="#EF8C5A" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M50 52V34" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M44 40 50 33l6 7" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="75" cy="21" r="7.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="75" cy="21" r="2.6" fill="${INK}"/>` +
      `<path d="M58 27q5-4 9-5" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 4"/>`,
    eyes: [[41, 58, 5.5], [59, 58, 5.5]],
    mouth: [50, 70],
    cheek: [[30, 66], [70, 66]],
    sproutAt: [50, 14],
    feet: [40, 62],
    feetY: 88,
    drop: 2,
  },

  /* u13 ひきざん（くりさがり）
     － 上が ひろく、右へ かたむいた 板。やじるしは 下むき、
       10から くずれた ぶんが 右へ こぼれ落ちている */
  kurisagarimoya: {
    color: "#C98FB8",
    soft: "#E8C3DA",
    topBefore: "",
    body: `<path d="M26 80l16-50q2-7 9-7h17q7 0 5 7l-13 50q-2 6-9 6H32q-7 0-6-6z" fill="#C98FB8" stroke="${INK}" stroke-width="3"/>`,
    topAfter: `<ellipse cx="59" cy="23" rx="8.5" ry="3.4" fill="#E8C3DA" stroke="${INK}" stroke-width="2.5"/>`,
    mark:
      `<path d="M38 38h32" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="4 4"/>` +
      `<path d="M48 68v12" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M42 74 48 81l6-7" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="80" cy="34" r="7.5" fill="#C98FB8" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="88" cy="54" r="4.5" fill="#C98FB8" stroke="${INK}" stroke-width="2.2"/>` +
      `<circle cx="82" cy="70" r="3" fill="#C98FB8" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[43, 50, 5], [57, 50, 5]],
    mouth: [49, 61],
    cheek: [[34, 58], [64, 55]],
    sproutAt: [59, 20],
    feet: [40, 62],
    feetY: 90,
    drop: 4,
  },

  /* u14 おおきい かず
     － ちいさい つぶ12こが 集まって 1つの体。左手に 10この 点の ふだ */
  ookazumoya: {
    color: "#6DBE8E",
    soft: "#BCE3CD",
    topBefore: "",
    body:
      `<circle cx="50" cy="26" r="10" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="30" cy="34" r="10" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="70" cy="34" r="10" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="20" cy="50" r="10" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="80" cy="50" r="10" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="40" cy="76" r="9" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="60" cy="76" r="9" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="28" cy="64" r="11" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="72" cy="64" r="11" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="44" cy="44" r="11" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="66" cy="44" r="11" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="50" cy="60" r="11" fill="#6DBE8E" stroke="${INK}" stroke-width="2.5"/>`,
    /* 10の まとまりは「10こ 入った ふだを 左手に もつ」。
       口の すぐ下に ならべると 歯に 見えてしまうので わきへ よけた。 */
    mark:
      `<rect x="7" y="34" width="16" height="42" rx="7" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="12" cy="40" r="2" fill="${INK}"/>` +
      `<circle cx="18" cy="40" r="2" fill="${INK}"/>` +
      `<circle cx="12" cy="48" r="2" fill="${INK}"/>` +
      `<circle cx="18" cy="48" r="2" fill="${INK}"/>` +
      `<circle cx="12" cy="55" r="2" fill="${INK}"/>` +
      `<circle cx="18" cy="55" r="2" fill="${INK}"/>` +
      `<circle cx="12" cy="63" r="2" fill="${INK}"/>` +
      `<circle cx="18" cy="63" r="2" fill="${INK}"/>` +
      `<circle cx="12" cy="70" r="2" fill="${INK}"/>` +
      `<circle cx="18" cy="70" r="2" fill="${INK}"/>`,
    eyes: [[42, 50, 5.5], [62, 50, 5.5]],
    mouth: [52, 64],
    cheek: [[30, 58], [76, 56]],
    sproutAt: [50, 16],
    feet: [38, 62],
    feetY: 90,
    drop: 4,
  },

  /* u16 ものの いち
     － 左は まっすぐな かべ＋左へ出た 手、右は とがった 矢じるし。
       おなかの 白い やじるしが 右を さす */
  ichimoya: {
    color: "#E1736E",
    soft: "#F3B9B6",
    topBefore: `<rect x="9" y="44" width="14" height="14" rx="4" fill="#E1736E" stroke="${INK}" stroke-width="3"/>`,
    body: `<path d="M20 28q0-4 4-4h26q3 0 5 2l22 22q3 3 0 6l-22 22q-2 2-5 2H24q-4 0-4-4z" fill="#E1736E" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M33 66h21" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M48 60l7 6-7 6" fill="none" stroke="#FFF4E2" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="29" cy="31" r="2.6" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="29" cy="71" r="2.6" fill="#FFF4E2" stroke="${INK}" stroke-width="1.8"/>`,
    eyes: [[36, 42, 5], [54, 42, 5]],
    mouth: [44, 54],
    cheek: [[27, 51], [61, 49]],
    sproutAt: [38, 24],
    feet: [36, 60],
    feetY: 84,
  },
};

/* ---------- 組み立て（さんすう・こくごと 同じ） ---------- */

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
   さんすう 2学期の もやもや 5体
   （かさもや・かたちもや・とけいもや は moya-art.js の ぶんを そのまま 使う）
   ============================================================ */
export const MOYA_ART_M2 = {
  mitsumoya: {
    name: "みつもや",
    unit: "u09",
    note: "3つの かずの けいさん。まるい玉3つが 1本の ぼうに たてに 通った体、すきまに ＋ と − の ふだ、顔は まん中の 大きい玉",
    svg: normalArt(PARTS.mitsumoya),
    friendSvg: friendArt(PARTS.mitsumoya),
    color: PARTS.mitsumoya.color,
  },
  kuriagarimoya: {
    name: "くりあがりもや",
    unit: "u11",
    note: "たしざん（くりあがり）。下が ふくらみ 上が とがって のびる しずくの体、上むきの やじるし、右うえに くりあがる 1の 白い玉",
    svg: normalArt(PARTS.kuriagarimoya),
    friendSvg: friendArt(PARTS.kuriagarimoya),
    color: PARTS.kuriagarimoya.color,
  },
  kurisagarimoya: {
    name: "くりさがりもや",
    unit: "u13",
    note: "ひきざん（くりさがり）。上が ひろく 右へ かたむいた 板の体、下むきの やじるし、右へ こぼれ落ちる 玉が3つ",
    svg: normalArt(PARTS.kurisagarimoya),
    friendSvg: friendArt(PARTS.kurisagarimoya),
    color: PARTS.kurisagarimoya.color,
  },
  ookazumoya: {
    name: "おおかずもや",
    unit: "u14",
    note: "おおきい かず。ちいさい つぶ12こが 集まって 1つの体、へりが ぷつぷつ、左手に 10この 点の ふだ",
    svg: normalArt(PARTS.ookazumoya),
    friendSvg: friendArt(PARTS.ookazumoya),
    color: PARTS.ookazumoya.color,
  },
  ichimoya: {
    name: "いちもや",
    unit: "u16",
    note: "ものの いち。左は まっすぐな かべで 手が1本、右は とがった 矢じるし。おなかの やじるしが 右を さす",
    svg: normalArt(PARTS.ichimoya),
    friendSvg: friendArt(PARTS.ichimoya),
    color: PARTS.ichimoya.color,
  },
};

export const MOYA_ORDER_M2 = [
  "mitsumoya",
  "kuriagarimoya",
  "kurisagarimoya",
  "ookazumoya",
  "ichimoya",
];

export const MOYA_NAMES_M2 = Object.fromEntries(
  MOYA_ORDER_M2.map((id) => [id, MOYA_ART_M2[id].name]),
);

/* さんすうの moyaArt(id, mood, size) と 同じ使い方 */
export function moyaArtM2(id, mood = "normal", size = 100) {
  const a = MOYA_ART_M2[id] || MOYA_ART_M2.mitsumoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}
