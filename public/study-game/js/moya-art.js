/* ============================================================
   かずのまち ／ 絵のふやしかた（アートディレクション案）
   ------------------------------------------------------------
   ・ぜんぶ 100×100 の箱の中。使うのは <path> <circle> <ellipse> <rect> だけ。
     filter / mask / gradient / <g> は使わない（古い端末で重くなる）。
   ・輪郭は #2B2A28、太さ 2.5〜3。塗りはやさしい色。とがった牙・血・暗い色なし。
   ・有名なキャラクターには似せない。すべてオリジナル。
   ・色は文字列の中に直接書く（SVGの中では CSS変数が使えない）。

   【いちばん大事な直しかた】
   いまの もやもや は「色・デコボコの数・目の数」しか違わないので
   子どもには同じに見える。そこで 12種を
     （1）そもそもの かたち（まる／たてにつみ木／ふたこぶ／ドーナツ／ぼうグラフ…）
     （2）頭の上のもの（ぼんぼり／ベル／リボン／なし）
     （3）おなかの しるし（5つの点／やじるし／＋／−／ものさしの目／とけい…）
   の3つで見分けられるようにした。色は「おまけの手がかり」にしている。
   ============================================================ */

const INK = "#2B2A28";

/* ---------- 共通のパーツ（目・口・あし・きらきら） ---------- */

function eyesOpen(eyes) {
  return eyes
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>` +
        `<circle cx="${x}" cy="${y}" r="${(r * 0.44).toFixed(1)}" fill="${INK}"/>`,
    )
    .join("");
}

/* なかま＝目をとじて にこっ（白目が消えるので ひと目で わかる） */
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

/* ふつうの姿＝地面につかず、まわりに もやの つぶが ふわふわ */
function puffs(soft, drop = 0) {
  return (
    `<circle cx="27" cy="${86 + drop}" r="5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="50" cy="${92 + drop}" r="4" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="73" cy="${85 + drop}" r="5.5" fill="${soft}" stroke="${INK}" stroke-width="2.5"/>`
  );
}

/* なかまの姿＝地面に立つ（かげ＋まるい あし2つ） */
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

/* なかまの姿＝頭に はっぱの めが出る（もやが町の いきものになった印） */
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

/* ---------- 12体のパーツ表 ---------- */
/* topBefore … 体より先に描く（頭の上のもの）
   body      … 体の輪郭
   mark      … おなかの しるし（どの単元の子かが わかる印）
   topAfter  … 体より後に描く 頭のもの
   eyes/mouth/cheek/sproutAt/feet/drop … 顔とあしの位置 */

const PARTS = {
  /* 1. u01 10までのかず －「まんまる」＋おなかに5つの点 */
  kazumoya: {
    color: "#8FB8D8",
    soft: "#C7DCEC",
    topBefore: `<circle cx="50" cy="22" r="8" fill="#8FB8D8" stroke="${INK}" stroke-width="3"/>`,
    body: `<circle cx="50" cy="52" r="28" fill="#8FB8D8" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="34" cy="72" r="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="42" cy="72" r="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="50" cy="72" r="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="58" cy="72" r="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="66" cy="72" r="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[41, 48, 5.5], [59, 48, 5.5]],
    mouth: [50, 62],
    cheek: [[29, 60], [71, 60]],
    sproutAt: [50, 14],
    feet: [38, 62],
    feetY: 84,
  },

  /* 2. u02 なんばんめ －「たてに3つ つみ上がった」体＋まえを向く やじるし */
  narabimoya: {
    color: "#B49BE0",
    soft: "#DCCFF2",
    topBefore: "",
    body:
      `<ellipse cx="50" cy="70" rx="20" ry="13" fill="#B49BE0" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="50" cy="50" rx="17" ry="12" fill="#B49BE0" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="50" cy="31" rx="14" ry="11" fill="#B49BE0" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<path d="M60 50H40m6-5-6 5 6 5" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` +
      `<circle cx="40" cy="70" r="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="50" cy="70" r="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="60" cy="70" r="3" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[45, 29, 4.4], [56, 29, 4.4]],
    mouth: [50, 38],
    cheek: [[38, 36], [62, 36]],
    sproutAt: [50, 20],
    feet: [38, 62],
    feetY: 86,
    drop: 4,
  },

  /* 3. u03 いくつと いくつ －「頭が ふたこぶ」に わかれた体＋点線 */
  wakemoya: {
    color: "#8FD3A8",
    soft: "#C6EBD5",
    topBefore: "",
    body:
      `<path d="M22 58c0-16 6-28 15-28 6 0 10 7 13 20 3-13 7-20 13-20 9 0 15 12 15 28 0 14-13 22-28 22S22 72 22 58z" fill="#8FD3A8" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M22 62 11 68M78 62 89 68" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
    mark:
      `<path d="M50 52v9" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="4 4"/>` +
      `<circle cx="39" cy="72" r="3.4" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="61" cy="72" r="3.4" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[36, 45, 5], [64, 45, 5]],
    mouth: [50, 64],
    cheek: [[27, 58], [73, 58]],
    sproutAt: [37, 31],
    feet: [38, 62],
    feetY: 84,
  },

  /* 4. u04 たしざん －「ふとって上がデコボコ4つ」＋左手に ＋ のあめ */
  tasumoya: {
    color: "#F7B377",
    soft: "#FBD8B6",
    topBefore: "",
    body:
      `<path d="M22 62 12 46M78 62 88 48" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M16 58Q16 44 28 40Q34 26 40 40Q46 26 52 40Q58 26 64 40Q70 26 76 42Q84 46 84 58Q84 80 50 80Q16 80 16 58Z" fill="#F7B377" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="11" cy="40" r="8" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M11 35v10M6 40h10" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="90" cy="44" r="5" fill="#F7B377" stroke="${INK}" stroke-width="2.5"/>`,
    eyes: [[40, 54, 5.5], [62, 54, 5.5]],
    mouth: [51, 67],
    cheek: [[28, 64], [74, 64]],
    sproutAt: [52, 38],
    feet: [38, 64],
    feetY: 84,
  },

  /* 5. u05 ひきざん －「右がわが まるく かけた」体＋目が1つ＋とれた − */
  hikimoya: {
    color: "#A9B6C6",
    soft: "#D4DBE4",
    topBefore: "",
    body: `<path d="M50 24c12 0 22 7 26 17-10 1-16 6-16 13s6 12 15 12c-4 9-14 14-25 14-17 0-28-11-28-28s11-28 28-28z" fill="#A9B6C6" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<rect x="64" y="48" width="21" height="7" rx="3.5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="88" cy="36" r="3" fill="#D4DBE4" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="84" cy="66" r="2.6" fill="#D4DBE4" stroke="${INK}" stroke-width="2"/>`,
    eyes: [[45, 50, 9]],
    mouth: [45, 68],
    cheek: [[31, 62], [58, 66]],
    sproutAt: [48, 24],
    feet: [38, 60],
    feetY: 84,
  },

  /* 6. u06 0の けいさん －「ドーナツ」。まん中に 大きな あな＝0 */
  zeromoya: {
    color: "#E0D29B",
    soft: "#F0E8C8",
    topBefore: "",
    body: `<path d="M22 52a28 28 0 1 0 56 0a28 28 0 1 0-56 0zM39 52a11 11 0 1 0 22 0a11 11 0 1 0-22 0z" fill="#E0D29B" fill-rule="evenodd" stroke="${INK}" stroke-width="3"/>`,
    mark: "",
    eyes: [[36, 42, 5], [64, 42, 5]],
    mouth: [50, 72],
    cheek: [[26, 56], [74, 56]],
    sproutAt: [50, 24],
    feet: [36, 64],
    feetY: 84,
  },

  /* 7. u07 ながさくらべ －「よこに長い のっぽ」＋背中に ものさしの目 */
  nagasamoya: {
    color: "#7FD4E8",
    soft: "#BFEBF5",
    topBefore: "",
    body: `<rect x="10" y="44" width="80" height="30" rx="15" fill="#7FD4E8" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M26 44v10M42 44v7M58 44v10M74 44v7" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
    eyes: [[25, 60, 5], [37, 60, 5]],
    mouth: [31, 70],
    cheek: [[18, 68], [45, 68]],
    sproutAt: [25, 45],
    feet: [30, 72],
    feetY: 78,
    drop: -6,
  },

  /* 8. u08 かずしらべ －「高さちがいの ぼう3本」＝ぼうグラフの体 */
  shirabemoya: {
    color: "#F09FB5",
    soft: "#F8CFDA",
    topBefore: "",
    body:
      `<rect x="18" y="52" width="20" height="30" rx="9" fill="#F09FB5" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="40" y="34" width="20" height="48" rx="9" fill="#F09FB5" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="62" y="44" width="20" height="38" rx="9" fill="#F09FB5" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M10 82h6M10 68h6M10 54h6M13 84V50" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    eyes: [[46, 46, 4.4], [55, 46, 4.4]],
    mouth: [50, 58],
    cheek: [[28, 64], [72, 60]],
    sproutAt: [50, 34],
    feet: [30, 70],
    feetY: 86,
    drop: 2,
  },

  /* 9. u09 かたちあそび（あたらしい）－「まるい さんかく」＋まる と しかくの しるし */
  katachimoya: {
    color: "#F3D06A",
    soft: "#F9E7B4",
    topBefore: "",
    body: `<path d="M50 20q6 0 9 6l22 44q4 8-5 10H24q-9-2-5-10l22-44q3-6 9-6z" fill="#F3D06A" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="34" cy="72" r="5" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="59" y="67" width="10" height="10" rx="2" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>`,
    eyes: [[42, 58, 5], [58, 58, 5]],
    mouth: [50, 70],
    cheek: [[33, 60], [67, 60]],
    sproutAt: [50, 21],
    feet: [38, 62],
    feetY: 84,
  },

  /* 10. u10 なんじ なんじはん（あたらしい）－「かどのまるい しかく」＋ベルの耳2つ＋とけい */
  tokeimoya: {
    color: "#BFD98F",
    soft: "#DFECC7",
    topBefore:
      `<circle cx="30" cy="26" r="8" fill="#BFD98F" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="70" cy="26" r="8" fill="#BFD98F" stroke="${INK}" stroke-width="3"/>`,
    body: `<rect x="22" y="28" width="56" height="52" rx="16" fill="#BFD98F" stroke="${INK}" stroke-width="3"/>`,
    mark:
      `<circle cx="50" cy="69" r="9" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M50 69V63M50 69h5.5" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    eyes: [[40, 46, 5], [60, 46, 5]],
    mouth: [50, 57],
    cheek: [[31, 54], [69, 54]],
    sproutAt: [50, 29],
    feet: [38, 62],
    feetY: 84,
  },

  /* 11. u11 かさくらべ（あたらしい）－「コップのかたち」＋とって＋みずの線 */
  kasamoya: {
    color: "#9AA8E8",
    soft: "#CDD4F4",
    topBefore: `<path d="M74 46q13 2 13 13t-13 13" fill="none" stroke="${INK}" stroke-width="3"/>`,
    body:
      `<path d="M24 36h52l-6 38q-1 6-7 6H37q-6 0-7-6z" fill="#9AA8E8" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="50" cy="36" rx="26" ry="7" fill="#CDD4F4" stroke="${INK}" stroke-width="3"/>`,
    mark: `<path d="M32 50q6 5 12 0t12 0 12 0" fill="none" stroke="#FFF4E2" stroke-width="3.5" stroke-linecap="round"/>`,
    eyes: [[41, 58, 5], [59, 58, 5]],
    mouth: [50, 69],
    cheek: [[32, 64], [68, 64]],
    sproutAt: [50, 30],
    feet: [40, 60],
    feetY: 86,
  },

  /* 12. おさらい（ふくしゅう番）－「よこに ひろい たまご」＋頭に リボン＋ぬい目＋チェックの あてぬの */
  osaraimoya: {
    color: "#F2A3A0",
    soft: "#F8D1CF",
    topBefore: "",
    body: `<ellipse cx="50" cy="54" rx="29" ry="26" fill="#F2A3A0" stroke="${INK}" stroke-width="3"/>`,
    topAfter:
      `<path d="M50 30q-20-13-18 3 2 11 18-3z" fill="#F2A3A0" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M50 30q20-13 18 3-2 11-18-3z" fill="#F2A3A0" stroke="${INK}" stroke-width="2.5"/>` +
      `<circle cx="50" cy="29" r="6" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>`,
    mark:
      `<path d="M34 32q-8 23 0 45" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="5 5"/>` +
      `<circle cx="67" cy="66" r="8" fill="#FFF4E2" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M63 66l3.5 4 5-7" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    eyes: [[41, 48, 5.5], [60, 48, 5.5]],
    mouth: [50, 61],
    cheek: [[29, 58], [72, 54]],
    sproutAt: [30, 38],
    feet: [38, 62],
    feetY: 84,
  },
};

/* ---------- ふつうの姿／なかまの姿 を組み立てる ---------- */

function normalArt(p) {
  return (
    (p.topBefore || "") +
    p.body +
    (p.mark || "") +
    (p.topAfter || "") +
    eyesOpen(p.eyes) +
    mouthFlat(p.mouth) +
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
    mouthSmile(p.mouth) +
    cheeks(p.cheek) +
    sparkles()
  );
}

/* ============================================================
   もやもや12種
   svg        … ふつうの姿（まだ もやもや している）
   friendSvg  … なかまになった姿
   ============================================================ */
export const MOYA_ART = {
  kazumoya: {
    name: "かずもや",
    unit: "u01",
    note: "10までのかず。まんまるの体に ぼんぼりが1つ、おなかに 白い点が5つ ならぶ",
    svg: normalArt(PARTS.kazumoya),
    friendSvg: friendArt(PARTS.kazumoya),
    color: PARTS.kazumoya.color,
  },
  narabimoya: {
    name: "ならびもや",
    unit: "u02",
    note: "なんばんめ。だんごが たてに3つ つみ上がった体、おなかに まえを さす やじるし",
    svg: normalArt(PARTS.narabimoya),
    friendSvg: friendArt(PARTS.narabimoya),
    color: PARTS.narabimoya.color,
  },
  wakemoya: {
    name: "わけもや",
    unit: "u03",
    note: "いくつと いくつ。頭が ふたこぶに わかれていて、まん中に 点線と 2つの玉",
    svg: normalArt(PARTS.wakemoya),
    friendSvg: friendArt(PARTS.wakemoya),
    color: PARTS.wakemoya.color,
  },
  tasumoya: {
    name: "たすもや",
    unit: "u04",
    note: "たしざん。ふっくらして 上が デコボコ4つ、左手に ＋ のあめを もっている",
    svg: normalArt(PARTS.tasumoya),
    friendSvg: friendArt(PARTS.tasumoya),
    color: PARTS.tasumoya.color,
  },
  hikimoya: {
    name: "ひきもや",
    unit: "u05",
    note: "ひきざん。右がわが まるく かけている体、目は1つ、とれた ぶんが − になって うかぶ",
    svg: normalArt(PARTS.hikimoya),
    friendSvg: friendArt(PARTS.hikimoya),
    color: PARTS.hikimoya.color,
  },
  zeromoya: {
    name: "ぜろもや",
    unit: "u06",
    note: "0のけいさん。まん中に 大きな あなが あいた ドーナツの体（あなが そのまま 0）",
    svg: normalArt(PARTS.zeromoya),
    friendSvg: friendArt(PARTS.zeromoya),
    color: PARTS.zeromoya.color,
  },
  nagasamoya: {
    name: "ながさもや",
    unit: "u07",
    note: "ながさくらべ。よこに ずんと 長い体、背中に ものさしの 目もりが きざまれている",
    svg: normalArt(PARTS.nagasamoya),
    friendSvg: friendArt(PARTS.nagasamoya),
    color: PARTS.nagasamoya.color,
  },
  shirabemoya: {
    name: "しらべもや",
    unit: "u08",
    note: "かずしらべ。高さの ちがう ぼう3本が 体になっている（ぼうグラフ）、左に 目もりの線",
    svg: normalArt(PARTS.shirabemoya),
    friendSvg: friendArt(PARTS.shirabemoya),
    color: PARTS.shirabemoya.color,
  },
  katachimoya: {
    name: "かたちもや",
    unit: "u09",
    note: "（新）かたちあそび。かどの まるい さんかくの体に、まると しかくの しるし",
    svg: normalArt(PARTS.katachimoya),
    friendSvg: friendArt(PARTS.katachimoya),
    color: PARTS.katachimoya.color,
  },
  tokeimoya: {
    name: "とけいもや",
    unit: "u10",
    note: "（新）なんじ なんじはん。かどの まるい しかくの体に ベルの耳2つ、おなかに とけいの はり",
    svg: normalArt(PARTS.tokeimoya),
    friendSvg: friendArt(PARTS.tokeimoya),
    color: PARTS.tokeimoya.color,
  },
  kasamoya: {
    name: "かさもや",
    unit: "u11",
    note: "（新）かさくらべ。コップの かたちの体に とっ手が付き、中に みずの 波線",
    svg: normalArt(PARTS.kasamoya),
    friendSvg: friendArt(PARTS.kasamoya),
    color: PARTS.kasamoya.color,
  },
  osaraimoya: {
    name: "おさらいもや",
    unit: "review",
    note: "（新）ふくしゅう番。よこに ひろい たまご体、頭に リボン、ぬい目と まるいチェックの あてぬの",
    svg: normalArt(PARTS.osaraimoya),
    friendSvg: friendArt(PARTS.osaraimoya),
    color: PARTS.osaraimoya.color,
  },
};

export const MOYA_ORDER = [
  "kazumoya",
  "narabimoya",
  "wakemoya",
  "tasumoya",
  "hikimoya",
  "zeromoya",
  "nagasamoya",
  "shirabemoya",
  "katachimoya",
  "tokeimoya",
  "kasamoya",
  "osaraimoya",
];

export const MOYA_NAMES_12 = Object.fromEntries(
  MOYA_ORDER.map((id) => [id, MOYA_ART[id].name]),
);

/* いまの icons.js の moya(id, mood, size) と そのまま 入れかえられる形 */
export function moyaArt(id, mood = "normal", size = 100) {
  const a = MOYA_ART[id] || MOYA_ART.kazumoya;
  const inner = mood === "friend" ? a.friendSvg : a.svg;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;
}

/* ============================================================
   【2】なかまになったときの姿（friend）の 見分けかた
   色は かえない（色で見分けると 色の にた子で まちがえる）。
   かたちで 4つ かえる：
     ① ふつう＝地面に つかず、下に もやの つぶが 3つ ふわふわ
        なかま＝かげの上に まるい あし2本で 立つ
     ② ふつう＝白目に 黒目（じっと 見ている）
        なかま＝目を とじて にこっ（白目が なくなる）
     ③ ふつう＝口が まっすぐの 1本線
        なかま＝口が にっこりの 弧
     ④ なかまだけ：頭に はっぱの めが 出る ＋ ほおが ぴんく ＋ きらきら3つ
   ①と④は 小さく 表示しても わかる（シルエットが 変わる）ので、
   図かんの 48px でも 区別できる。
   ============================================================ */

/* ============================================================
   【3】たてもの － 8つを ぜんぶ ちがう かたちに する
   いまの わりあて（content.js）は
     kazunoie=house / narabinomichi=gate / wakekkohouse=house(かぶり)
     tasizankoujou=barn / hikizansouko=barn(かぶり) / zeronoizumi=well
     hakarinotou=tower(かぶり) / shirabeyagura=tower
   足りない3つを 作って、こう わりあてる：
     wakekkohouse  → twinhouse （屋根が ふたつ。まん中が 点線で わかれている）
     tasizankoujou → factory   （ギザギザ屋根＋えんとつ＋けむり）
     hakarinotou   → lighthouse（ほそ長い とう＋目もりの帯＋上に あかり）
   これで house / gate / twinhouse / factory / barn / well / lighthouse / tower の8つ。
   ============================================================ */

/* 色を 受けとる 関数の形（既存の houseShape などと 同じ使い方） */
export const BUILDING_ART_FN = {
  twinhouse: (color) =>
    `<path d="M14 90V58l18-16 18 16v32z" fill="#F4EADA" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 90V58l18-16 18 16v32z" fill="#F4EADA" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M10 60 32 40l22 20z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M46 60 68 40l22 20z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="22" y="70" width="12" height="20" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="58" y="70" width="12" height="20" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M50 60v30" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="5 4"/>`,

  factory: (color) =>
    `<rect x="70" y="18" width="12" height="28" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="76" cy="12" r="6" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="88" cy="7" r="4" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="16" y="54" width="72" height="36" fill="#F4EADA" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M16 54 28 40l12 14 12-14 12 14 12-14 12 14z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="34" y="66" width="18" height="24" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="60" y="64" width="16" height="12" fill="#BFE3FB" stroke="${INK}" stroke-width="2.5"/>` +
    `<path d="M24 70h4" fill="none" stroke="${INK}" stroke-width="2.5"/>`,

  lighthouse: (color) =>
    `<path d="M38 14 50 4l12 10z" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="42" y="14" width="16" height="14" rx="4" fill="#BFE3FB" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="34" y="28" width="32" height="7" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M36 86 42 35h16l6 51z" fill="#F4EADA" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M41.5 46h17M40 60h20M38.5 74h23" fill="none" stroke="${color}" stroke-width="7"/>` +
    `<path d="M64 46h8M64 60h8M64 74h8" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
    `<rect x="44" y="70" width="12" height="16" rx="5" fill="${color}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="28" y="86" width="44" height="6" rx="3" fill="${color}" stroke="${INK}" stroke-width="3"/>`,
};

/* そのまま はりつけて 使える 文字列（色は わりあて先の 既定色） */
export const BUILDING_ART = {
  twinhouse: BUILDING_ART_FN.twinhouse("#5BBF6A"),
  factory: BUILDING_ART_FN.factory("#F2B23C"),
  lighthouse: BUILDING_ART_FN.lighthouse("#45B6A8"),
};

/* 8つの わりあて案（content.js の shape を これに 書きかえる） */
export const BUILDING_ASSIGN = {
  kazunoie: "house",
  narabinomichi: "gate",
  wakekkohouse: "twinhouse",
  tasizankoujou: "factory",
  hikizansouko: "barn",
  zeronoizumi: "well",
  hakarinotou: "lighthouse",
  shirabeyagura: "tower",
};

/* ============================================================
   【4】町の きせつの色（4〜7月）
   かえるのは --grass / --sky と、小さな かざりの色 1つだけ。
   --bg(#FDF6E8) と --ink(#2B2A28) は ぜったいに かえない（読みやすさを まもる）。
   明るさの 変える幅は どれも ±8% まで。ぱっと見では 気づかないくらいが ちょうどいい。
   ============================================================ */
export const SEASON = {
  4: {
    label: "4月 はるの はじめ",
    grass: "#8FD48F",
    sky: "#9AD6F5",
    accent: "#F6C6D8",
    note: "くさは まだ 黄みどり、空は うすい。かざりは さくらの はなびら",
    deco: `<path d="M50 44q10-10 16-2-6 10-16 2z" fill="#F6C6D8" stroke="${INK}" stroke-width="2"/>`,
  },
  5: {
    label: "5月 はれた みどり",
    grass: "#5BBF6A",
    sky: "#6FC0EE",
    accent: "#7FD4E8",
    note: "きほんの色（いまの :root と 同じ）。かざりは こいのぼりの ふきながし",
    deco: `<path d="M34 46h22q10 4 0 8H34q-6-4 0-8z" fill="#7FD4E8" stroke="${INK}" stroke-width="2"/>`,
  },
  6: {
    label: "6月 あめの ころ",
    grass: "#52AE63",
    sky: "#BFD3E8",
    accent: "#B49BE0",
    note: "空だけ 少し 灰みに する。くさは こく。かざりは あじさいの つぶ",
    deco:
      `<circle cx="46" cy="48" r="4" fill="#B49BE0" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="55" cy="52" r="4" fill="#9AA8E8" stroke="${INK}" stroke-width="2"/>`,
  },
  7: {
    label: "7月 なつの はじめ",
    grass: "#49AE57",
    sky: "#5BC2F2",
    accent: "#F2B23C",
    note: "空を いちばん こい 水色に。かざりは ひまわり（1つだけ）",
    deco:
      `<circle cx="50" cy="50" r="6" fill="#F2B23C" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M50 40v4M50 56v4M40 50h4M56 50h4" fill="none" stroke="${INK}" stroke-width="2"/>`,
  },
};

/* 町の画面の いちばん外の 要素に 付ける（CSS変数を 上書きする）だけ。
   例： Object.entries(seasonVars(month)).forEach(([k,v]) => el.style.setProperty(k,v)); */
export function seasonVars(month) {
  const s = SEASON[month] || SEASON[5];
  return { "--grass": s.grass, "--sky": s.sky, "--season-accent": s.accent };
}
